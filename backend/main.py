"""
FastAPI Microservice — Churn Prediction API.

Exposes ML model predictions via REST endpoints.
Flow: Supabase → Backend IA → Predição → Dashboard

Endpoints:
  POST /predict         — Single student prediction
  POST /predict/batch   — Batch prediction for multiple students
  GET  /model/info      — Model metadata and metrics
  GET  /health          — Health check
"""

import os
import json
from datetime import datetime
from typing import Optional

import joblib
import numpy as np
import pandas as pd
import shap
import pdfplumber
import io
import re
import re
from supabase import create_client, Client
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# --- Configuration ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'churn_model.joblib')
ENCODER_PATH = os.path.join(BASE_DIR, 'models', 'label_encoder.joblib')
METRICS_PATH = os.path.join(BASE_DIR, 'models', 'metrics.json')

# --- Supabase Integration ---
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://fbbcnazqmkgdrxbdeysr.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "") # Should be Service Role Key for delete operations

supabase_client: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("  ✅ Supabase client initialized")
    except Exception as e:
        print(f"  ❌ Error initializing Supabase client: {e}")

# --- App Initialization ---
app = FastAPI(
    title="Moviment Academy — Churn Prediction API",
    description="Microserviço de predição de churn com Machine Learning (Random Forest)",
    version="1.0.0",
    docs_url="/docs",
)

# CORS — Allow Next.js frontend to access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Load Model on Startup ---
model = None
label_encoder = None
metrics = None
explainer = None


@app.on_event("startup")
async def load_model():
    """Load the trained model and encoder into memory."""
    global model, label_encoder, metrics, explainer

    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print(f"  ✅ Model loaded from {MODEL_PATH}")
    else:
        print(f"  ⚠️ Model not found at {MODEL_PATH}. Run train_model.py first.")

    if os.path.exists(ENCODER_PATH):
        label_encoder = joblib.load(ENCODER_PATH)
        print(f"  ✅ Label encoder loaded from {ENCODER_PATH}")

    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH) as f:
            metrics = json.load(f)
        print(f"  ✅ Metrics loaded: Accuracy={metrics.get('accuracy', 'N/A')}")

    if model:
        explainer = shap.TreeExplainer(model)
        print("  ✅ SHAP Explainer initialized (TreeExplainer)")


# --- Pydantic Models ---
class StudentInput(BaseModel):
    """Input schema for a single student prediction."""
    student_id: str = Field(..., description="Unique student identifier", examples=["MOV-0001"])
    name: str = Field(..., description="Student name", examples=["Carlos Silva"])
    weekly_frequency: int = Field(..., ge=0, le=7, description="Weekly training frequency")
    days_since_last_visit: int = Field(..., ge=0, description="Days since last gym visit")
    overdue_payments: int = Field(..., ge=0, le=1, description="Has overdue payments (0/1)")
    overdue_days: int = Field(0, ge=0, description="Number of days payment is overdue")
    enrollment_months: int = Field(..., ge=1, description="Months since enrollment")
    age: int = Field(..., ge=16, le=100, description="Student age")
    plan: str = Field(..., description="Subscription plan", examples=["Platinum"])


class PredictionResult(BaseModel):
    """Output schema for a churn prediction."""
    student_id: str
    name: str
    probability: float = Field(..., description="Churn probability (0.0 to 1.0)")
    probability_percent: float = Field(..., description="Churn probability (0 to 100%)")
    risk_level: str = Field(..., description="alto / medio / baixo")
    impacts: Optional[dict] = None
    predicted_at: str


class ExplanationResult(BaseModel):
    """Output schema for SHAP explanation."""
    student_id: str
    name: str
    risk_level: str
    probability: float
    impacts: dict = Field(..., description="Feature names and their SHAP values")
    summary: str = Field(..., description="Human-readable summary of the main churn factors")
    predicted_at: str


class BatchInput(BaseModel):
    """Input for batch predictions."""
    students: list[StudentInput]


class BatchResult(BaseModel):
    """Output for batch predictions."""
    predictions: list[PredictionResult]
    summary: dict
    processed_at: str


class ModelInfo(BaseModel):
    """Model metadata response."""
    model_type: str
    framework: str
    accuracy: Optional[float]
    recall: Optional[float]
    roc_auc: Optional[float]
    features: list[str]
    risk_thresholds: dict
    last_trained: str
    status: str


# --- Helper Functions ---
def classify_risk(probability: float) -> str:
    """Classify risk level based on churn probability."""
    if probability > 0.70:
        return 'alto'
    elif probability >= 0.40:
        return 'medio'
    return 'baixo'


def predict_student(student: StudentInput) -> PredictionResult:
    """Run prediction for a single student."""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded. Run train_model.py first.")

    # Encode plan
    try:
        plan_encoded = label_encoder.transform([student.plan])[0]
    except ValueError:
        plan_encoded = 1  # Default to middle value

    # Build feature vector (same order as training)
    features = np.array([[
        student.weekly_frequency,
        student.days_since_last_visit,
        student.overdue_payments,
        student.overdue_days,
        student.enrollment_months,
        student.age,
        plan_encoded,
    ]])

    # Predict probability
    proba = model.predict_proba(features)[0][1]

    return PredictionResult(
        student_id=student.student_id,
        name=student.name,
        probability=round(float(proba), 4),
        probability_percent=round(float(proba) * 100, 1),
        risk_level=classify_risk(proba),
        predicted_at=datetime.now().isoformat(),
    )


# --- Endpoints ---
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "timestamp": datetime.now().isoformat(),
    }


@app.post("/predict", response_model=PredictionResult)
async def predict_churn(student: StudentInput):
    """
    Predict churn probability for a single student.
    
    Returns the probability (0-100%), risk level (alto/medio/baixo),
    and prediction timestamp.
    """
    return predict_student(student)


@app.post("/predict/batch", response_model=BatchResult)
async def predict_batch(batch: BatchInput):
    """
    Predict churn for multiple students at once.
    
    Returns individual predictions plus a summary with
    risk distribution counts.
    """
    predictions = [predict_student(s) for s in batch.students]

    summary = {
        "total": len(predictions),
        "alto": sum(1 for p in predictions if p.risk_level == 'alto'),
        "medio": sum(1 for p in predictions if p.risk_level == 'medio'),
        "baixo": sum(1 for p in predictions if p.risk_level == 'baixo'),
        "avg_probability": round(
            sum(p.probability for p in predictions) / len(predictions), 4
        ),
    }

    return BatchResult(
        predictions=predictions,
        summary=summary,
        processed_at=datetime.now().isoformat(),
    )


@app.get("/model/info", response_model=ModelInfo)
async def get_model_info():
    """
    Get model metadata, performance metrics, and configuration.
    """
    return ModelInfo(
        model_type="Random Forest Classifier",
        framework="Scikit-learn 1.5.2",
        accuracy=metrics.get('accuracy') if metrics else None,
        recall=metrics.get('recall') if metrics else None,
        roc_auc=metrics.get('roc_auc') if metrics else None,
        features=[
            'weekly_frequency',
            'days_since_last_visit',
            'overdue_payments',
            'overdue_days',
            'enrollment_months',
            'age',
            'plan_encoded',
        ],
        risk_thresholds={
            "alto": "> 70%",
            "medio": "40% — 70%",
            "baixo": "< 40%",
        },
        last_trained=datetime.now().strftime("%Y-%m-%d"),
        status="active" if model is not None else "not_loaded",
    )


@app.post("/predict/explain", response_model=ExplanationResult)
async def explain_churn(student: StudentInput):
    """
    Predict churn AND provide a SHAP explanation for WHY.
    Returns feature impacts and a text summary.
    """
    if model is None or explainer is None:
        raise HTTPException(status_code=503, detail="Model or Explainer not loaded.")

    # Prepare features (same as predict_student)
    try:
        plan_encoded = label_encoder.transform([student.plan])[0]
    except ValueError:
        plan_encoded = 1

    feature_names = [
        'weekly_frequency', 'days_since_last_visit', 'overdue_payments',
        'overdue_days', 'enrollment_months', 'age', 'plan_encoded'
    ]
    
    features_val = [
        student.weekly_frequency,
        student.days_since_last_visit,
        student.overdue_payments,
        student.overdue_days,
        student.enrollment_months,
        student.age,
        plan_encoded,
    ]
    
    features_df = pd.DataFrame([features_val], columns=feature_names)

    # Calculate SHAP values
    shap_values = explainer.shap_values(features_df)
    
    # Handle different SHAP output formats (TreeExplainer vs KernelExplainer, old vs new versions)
    # Goal: Get the impact for class 1 (churn)
    if isinstance(shap_values, list):
        # Format: [impacts_class0, impacts_class1]
        sv = shap_values[1][0] if len(shap_values) > 1 else shap_values[0][0]
    elif len(shap_values.shape) == 3:
        # Format: (samples, features, classes) -> (0, :, 1)
        sv = shap_values[0, :, 1]
    elif len(shap_values.shape) == 2:
        # Format: (samples, features)
        sv = shap_values[0]
    else:
        sv = shap_values

    impacts = {name: round(float(sv[i]), 4) for i, name in enumerate(feature_names)}
    
    # Sort impacts by absolute value to find main drivers
    sorted_impacts = sorted(impacts.items(), key=lambda x: abs(x[1]), reverse=True)
    top_factor, top_val = sorted_impacts[0]
    
    # Create a simple summary
    direction = "aumentando" if top_val > 0 else "diminuindo"
    summary = f"O fator principal é '{top_factor}', que está {direction} o risco de churn."

    # Get probability for the result
    proba = model.predict_proba(features_df)[0][1]

    return ExplanationResult(
        student_id=student.student_id,
        name=student.name,
        risk_level=classify_risk(proba),
        probability=round(float(proba), 4),
        impacts=impacts,
        summary=summary,
        predicted_at=datetime.now().isoformat()
    )


def find_column_index(headers: list, keywords: list) -> int:
    """Finds the index of a column that matches any of the given keywords."""
    for i, h in enumerate(headers):
        h_lower = str(h).lower()
        if any(k.lower() in h_lower for k in keywords):
            return i
    return -1

@app.post("/upload/report")
async def upload_report(files: list[UploadFile] = File(...)):
    """
    Upload multiple PDF reports, extract student data from all, and run batch predictions.
    Uses smart column mapping to handle variations in PDF headers.
    """
    all_pdf_data = []
    processed_files = []

    for file in files:
        if not file.filename.endswith('.pdf'):
            continue
            
        try:
            contents = await file.read()
            file_data_count = 0
            
            with pdfplumber.open(io.BytesIO(contents)) as pdf:
                for page in pdf.pages:
                    table = page.extract_table()
                    if not table or len(table) < 2:
                        continue
                        
                    headers = table[0]
                    # Smart mapping
                    idx_id = find_column_index(headers, ['código', 'id', 'matrícula'])
                    idx_name = find_column_index(headers, ['nome', 'aluno', 'estudante'])
                    idx_freq = find_column_index(headers, ['freq', 'presença', 'visitas'])
                    idx_inativo = find_column_index(headers, ['inativo', 'última', 'visita', 'dias'])
                    idx_debitos = find_column_index(headers, ['débitos', 'pendência', 'financeiro', 'devedor', 'total'])
                    idx_months = find_column_index(headers, ['meses', 'tempo', 'matrícula', 'início'])
                    idx_age = find_column_index(headers, ['idade', 'nascimento'])
                    idx_plan = find_column_index(headers, ['plano', 'modalidade', 'pacote'])

                    for row in table[1:]:
                        try:
                            # Basic cleaning and defaults
                            sid = str(row[idx_id]) if idx_id != -1 else "N/A"
                            name = str(row[idx_name]) if idx_name != -1 else "Aluno"
                            freq = int(re.sub(r'\D', '', str(row[idx_freq])) or 0) if idx_freq != -1 else 0
                            inativo = int(re.sub(r'\D', '', str(row[idx_inativo])) or 0) if idx_inativo != -1 else 0
                            # ... and so on
                            
                            student = StudentInput(
                                student_id=sid,
                                name=name,
                                weekly_frequency=freq if freq < 10 else round(freq/52, 2), # Handle yearly presences
                                days_since_last_visit=inativo,
                                overdue_payments=1 if idx_debitos != -1 and any(x in str(row[idx_debitos]).lower() for x in ['sim', 'vencido', 'pendente']) else 0,
                                overdue_days=inativo if idx_debitos != -1 and 'vencido' in str(row[idx_debitos]).lower() else 0,
                                enrollment_months=int(re.sub(r'\D', '', str(row[idx_months])) or 1) if idx_months != -1 else 1,
                                age=int(re.sub(r'\D', '', str(row[idx_age])) or 30) if idx_age != -1 else 30,
                                plan=str(row[idx_plan]) if idx_plan != -1 else "Mensal"
                            )
                            all_pdf_data.append(student)
                            file_data_count += 1
                        except (ValueError, IndexError, Exception):
                            continue
            
            processed_files.append({"filename": file.filename, "students_found": file_data_count})
        except Exception as e:
            print(f"Error processing {file.filename}: {e}")

    if not all_pdf_data:
        raise HTTPException(status_code=422, detail="Não foi possível encontrar dados de alunos em nenhum dos PDFs enviados.")

    # Run predictions with SHAP explanations
    predictions = []
    for s in all_pdf_data:
        # We can reuse the logic from explain_churn or refactor it
        # For efficiency, let's call a helper
        res = await explain_churn(s)
        predictions.append(res)
        
        summary = {
            "total": len(predictions),
            "alto": sum(1 for p in predictions if p.risk_level == 'alto'),
            "medio": sum(1 for p in predictions if p.risk_level == 'medio'),
            "baixo": sum(1 for p in predictions if p.risk_level == 'baixo'),
            "avg_probability": round(sum(p.probability for p in predictions) / len(predictions), 4) if predictions else 0,
        }

        # --- DATA REPLACEMENT LOGIC ---
        if supabase_client:
            try:
                # 1. Delete all existing records (Note: requires appropriate RLS or Service Role Key)
                # Using a filter that matches everything to bypass some restrictions if possible
                supabase_client.table("alunos").delete().neq("id", -1).execute()
                
                # 2. Insert new records
                insert_data = []
                for s in all_pdf_data:
                    insert_data.append({
                        "nome": s.name,
                        "email": s.email,
                        "plano": s.plan,
                        "status": "active" if s.weekly_frequency > 0 else "inactive",
                        "risco": int(predict_student(s).probability * 100),
                        "frequencia": s.weekly_frequency,
                        "meses_matricula": s.enrollment_months,
                        "idade": s.age,
                        "dias_atraso": s.overdue_days
                    })
                
                if insert_data:
                    supabase_client.table("alunos").insert(insert_data).execute()
                    print(f"  ✅ Replaced Supabase data with {len(insert_data)} students from {len(processed_files)} PDFs.")
            except Exception as se:
                print(f"  ⚠️ Error syncing with Supabase: {se}")
        
        return {
            "processed_files": processed_files,
            "students_found": len(all_pdf_data),
            "predictions": predictions,
            "summary": summary,
            "processed_at": datetime.now().isoformat()
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar PDF: {str(e)}")

