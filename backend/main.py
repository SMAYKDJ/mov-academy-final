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
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# --- Configuration ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'churn_model.joblib')
ENCODER_PATH = os.path.join(BASE_DIR, 'models', 'label_encoder.joblib')
METRICS_PATH = os.path.join(BASE_DIR, 'models', 'metrics.json')

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


@app.on_event("startup")
async def load_model():
    """Load the trained model and encoder into memory."""
    global model, label_encoder, metrics

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
