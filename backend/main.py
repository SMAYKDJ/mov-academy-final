"""
Microserviço FastAPI — API de Previsão de Churn.

Expõe previsões de modelos de ML via endpoints REST.
Fluxo: Supabase → Backend IA → Predição → Dashboard

Endpoints:
  POST /predict         — Previsão de aluno individual
  POST /predict/batch   — Previsão em lote para múltiplos alunos
  GET  /model/info      — Metadados e métricas do modelo
  GET  /health          — Verificação de saúde
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
from supabase import create_client, Client
from fastapi import FastAPI, HTTPException, UploadFile, File
from .data.utils import classificar_engajamento, calcular_risco
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import stripe
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()


# --- Configuração ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'churn_model.joblib')
ENCODER_PATH = os.path.join(BASE_DIR, 'models', 'label_encoder.joblib')
METRICS_PATH = os.path.join(BASE_DIR, 'models', 'metrics.json')

# --- Integração com Supabase ---
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://fbbcnazqmkgdrxbdeysr.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "") # Deve ser a Service Role Key para operações de deleção

# --- Configuração do Stripe ---
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY
    print("  ✅ Stripe inicializado")
else:
    print("  ⚠️ STRIPE_SECRET_KEY não encontrada no ambiente")


supabase_client: Optional[Client] = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("  ✅ Cliente Supabase inicializado")
    except Exception as e:
        print(f"  ❌ Erro ao inicializar cliente Supabase: {e}")

# --- Inicialização do App ---
app = FastAPI(
    title="Moviment Academy — Churn Prediction API",
    description="Microserviço de predição de churn com Machine Learning (Random Forest)",
    version="1.0.0",
    docs_url="/docs",
)

# CORS — Permitir acesso ao frontend Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Carregar Modelo na Inicialização ---
model = None
label_encoder = None
metrics = None
explainer = None


@app.on_event("startup")
async def load_model():
    """Carregar o modelo treinado e o codificador na memória."""
    global model, label_encoder, metrics, explainer

    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print(f"  ✅ Modelo carregado de {MODEL_PATH}")
    else:
        print(f"  ⚠️ Modelo não encontrado em {MODEL_PATH}. Execute train_model.py primeiro.")

    if os.path.exists(ENCODER_PATH):
        label_encoder = joblib.load(ENCODER_PATH)
        print(f"  ✅ Label encoder carregado de {ENCODER_PATH}")

    if os.path.exists(METRICS_PATH):
        with open(METRICS_PATH) as f:
            metrics = json.load(f)
        print(f"  ✅ Métricas carregadas: Acurácia={metrics.get('accuracy', 'N/A')}")

    if model:
        explainer = shap.TreeExplainer(model)
        print("  ✅ SHAP Explainer inicializado (TreeExplainer)")


# --- Modelos Pydantic ---
class StudentInput(BaseModel):
    """Esquema de entrada para uma previsão de aluno individual."""
    student_id: str = Field(..., description="Identificador único do aluno", examples=["MOV-0001"])
    name: str = Field(..., description="Nome do aluno", examples=["Carlos Silva"])
    weekly_frequency: int = Field(..., ge=0, le=7, description="Frequência de treinamento semanal")
    days_since_last_visit: int = Field(..., ge=0, description="Dias desde a última visita à academia")
    overdue_payments: int = Field(..., ge=0, le=1, description="Tem pagamentos em atraso (0/1)")
    overdue_days: int = Field(0, ge=0, description="Número de dias que o pagamento está em atraso")
    enrollment_months: int = Field(..., ge=1, description="Meses desde a matrícula")
    age: int = Field(..., ge=16, le=100, description="Idade do aluno")
    plan: str = Field(..., description="Plano de assinatura", examples=["Platinum"])

class ChurnInput(BaseModel):
    """Esquema de entrada para previsão de risco de churn (baseado em características)."""
    nome: str = Field(..., description="Nome do aluno")
    freq_mensal: float = Field(..., ge=0, le=12, description="Frequência de treinamento mensal")
    dias_atraso: int = Field(..., ge=0, description="Dias de atraso no pagamento")
    valor_mensal: float = Field(..., gt=0, description="Valor do pagamento mensal")
    inadimplente: int = Field(..., ge=0, le=1, description="Flag de inadimplente (0/1)")


class PredictionResult(BaseModel):
    """Esquema de saída para uma previsão de churn."""
    student_id: str
    name: str
    probability: float = Field(..., description="Probabilidade de churn (0.0 a 1.0)")
    probability_percent: float = Field(..., description="Probabilidade de churn (0 a 100%)")
    risk_level: str = Field(..., description="alto / medio / baixo")
    impacts: Optional[dict] = None
    predicted_at: str


class ExplanationResult(BaseModel):
    """Esquema de saída para explicação SHAP."""
    student_id: str
    name: str
    risk_level: str
    probability: float
    impacts: dict = Field(..., description="Nomes das características e seus valores SHAP")
    summary: str = Field(..., description="Resumo legível por humanos dos principais fatores de churn")
    predicted_at: str


class BatchInput(BaseModel):
    """Entrada para previsões em lote."""
    students: list[StudentInput]


class BatchResult(BaseModel):
    """Saída para previsões em lote."""
    predictions: list[PredictionResult]
    summary: dict
    processed_at: str


class ModelInfo(BaseModel):
    """Resposta de metadados do modelo."""
    model_type: str
    framework: str
    accuracy: Optional[float]
    recall: Optional[float]
    roc_auc: Optional[float]
    features: list[str]
    risk_thresholds: dict
    last_trained: str
    status: str


class PaymentIntentInput(BaseModel):
    """Entrada para criar um Stripe Payment Intent."""
    amount: int = Field(..., gt=0, description="Valor em centavos (ex: 1000 para R$ 10,00)")
    currency: str = Field("brl", description="Código da moeda (ex: brl, usd)")
    description: Optional[str] = Field(None, description="Descrição da compra")
    metadata: Optional[dict] = Field(None, description="Metadados adicionais")



# --- Funções Auxiliares ---
def classify_risk(probability: float) -> str:
    """Classificar o nível de risco com base na probabilidade de churn."""
    if probability > 0.70:
        return 'alto'
    elif probability >= 0.40:
        return 'medio'
    return 'baixo'


def predict_student(student: StudentInput) -> PredictionResult:
    """Executar a previsão para um único aluno."""
    if model is None:
        raise HTTPException(status_code=503, detail="Modelo não carregado. Execute train_model.py primeiro.")

    # Codificar plano
    try:
        plan_encoded = label_encoder.transform([student.plan])[0]
    except ValueError:
        plan_encoded = 1  # Valor padrão intermediário

    # Construir vetor de características (mesma ordem do treinamento)
    features = np.array([[
        student.weekly_frequency,
        student.days_since_last_visit,
        student.overdue_payments,
        student.overdue_days,
        student.enrollment_months,
        student.age,
        plan_encoded,
    ]])

    # Prever probabilidade
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
    """Endpoint de verificação de saúde."""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "timestamp": datetime.now().isoformat(),
    }


@app.post("/predict", response_model=PredictionResult)
async def predict_churn(student: StudentInput):
    """
    Prever a probabilidade de churn para um único aluno.
    Retorna a probabilidade (0-100%), nível de risco (alto/medio/baixo),
    e o carimbo de data/hora da previsão.
    """
    return predict_student(student)

@app.post("/predict/churn", response_model=PredictionResult)
async def predict_churn_risk(data: ChurnInput):
    """Prever o risco de churn usando o modelo baseado em características."""
    # Usar o modelo de 7 características ou o cálculo de score manual
    if model is not None and getattr(model, "n_features_in_", 0) == 7:
        # Se o modelo espera 7 features, mas recebemos 4, precisamos de valores padrão para as outras 3
        # features: weekly_freq, days_since_last, overdue_payments, overdue_days, enrollment_months, age, plan_encoded
        features = np.array([[
            data.freq_mensal / 4, # Estimativa semanal
            data.dias_atraso,
            data.inadimplente,
            data.dias_atraso if data.inadimplente else 0,
            12, # valor padrão para meses
            30, # valor padrão para idade
            1   # valor padrão para plano
        ]])
    else:
        # Fallback para o modelo de 4 features se ele for o carregado
        features = np.array([[
            data.freq_mensal,
            data.dias_atraso,
            data.valor_mensal,
            data.inadimplente,
        ]])
    
    # Calcular pontuação personalizada
    score = calcular_risco({
        "freq_mensal": data.freq_mensal,
        "dias_atraso": data.dias_atraso,
        "valor_mensal": data.valor_mensal,
        "inadimplente": data.inadimplente,
    })

    try:
        proba = model.predict_proba(features)[0][1]
    except Exception as e:
        print(f"  ⚠️ Erro na predição: {e}")
        proba = score / 100 # Fallback baseado no score manual
    
    # Determinar o nível de risco com base nos limites de pontuação
    if score > 30 or proba > 0.7:
        risk = "alto"
    elif score > 15 or proba > 0.4:
        risk = "medio"
    else:
        risk = "baixo"
    # Calcular impactos SHAP
    impacts = {}
    if explainer is not None:
        try:
            shap_values = explainer.shap_values(features)
            # Para Classificação Binária no TreeExplainer, shap_values é uma lista de [neg, pos] ou apenas um array pos
            # Queremos a classe 1 (churn)
            if isinstance(shap_values, list):
                sv = shap_values[1][0]
            else:
                sv = shap_values[0] # Algumas versões retornam (N, M)
            
            feature_names = ["freq_mensal", "dias_atraso", "valor_mensal", "inadimplente"]
            impacts = {name: round(float(val), 4) for name, val in zip(feature_names, sv)}
        except Exception as e:
            print(f"  ⚠️ Erro no cálculo SHAP: {e}")

    return PredictionResult(
        student_id="N/A",
        name=data.nome,
        probability=round(float(proba), 4),
        probability_percent=round(float(proba) * 100, 1),
        risk_level=risk,
        impacts=impacts,
        predicted_at=datetime.now().isoformat(),
    )



@app.post("/predict/batch", response_model=BatchResult)
async def predict_batch(batch: BatchInput):
    """
    Prever churn para múltiplos alunos de uma só vez.
    
    Retorna previsões individuais mais um resumo com
    contagens de distribuição de risco.
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
    Obter metadados do modelo, métricas de desempenho e configuração.
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
    Prever churn E fornecer uma explicação SHAP sobre o PORQUÊ.
    Retorna impactos de características e um resumo em texto.
    """
    if model is None or explainer is None:
        raise HTTPException(status_code=503, detail="Modelo ou Explainer não carregado.")

    # Preparar características (mesmo que predict_student)
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

    # Calcular valores SHAP
    shap_values = explainer.shap_values(features_df)
    
    # Lidar com diferentes formatos de saída SHAP (TreeExplainer vs KernelExplainer, versões antigas vs novas)
    # Objetivo: Obter o impacto para a classe 1 (churn)
    if isinstance(shap_values, list):
        # Formato: [impactos_classe0, impactos_classe1]
        sv = shap_values[1][0] if len(shap_values) > 1 else shap_values[0][0]
    elif len(shap_values.shape) == 3:
        # Formato: (amostras, características, classes) -> (0, :, 1)
        sv = shap_values[0, :, 1]
    elif len(shap_values.shape) == 2:
        # Formato: (amostras, características)
        sv = shap_values[0]
    else:
        sv = shap_values

    impacts = {name: round(float(sv[i]), 4) for i, name in enumerate(feature_names)}
    
    # Ordenar impactos pelo valor absoluto para encontrar os principais impulsionadores
    sorted_impacts = sorted(impacts.items(), key=lambda x: abs(x[1]), reverse=True)
    top_factor, top_val = sorted_impacts[0]
    
    # Criar um resumo simples
    direction = "aumentando" if top_val > 0 else "diminuindo"
    summary = f"O fator principal é '{top_factor}', que está {direction} o risco de churn."

    # Obter probabilidade para o resultado
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
    """Encontra o índice de uma coluna que corresponde a qualquer uma das palavras-chave fornecidas."""
    for i, h in enumerate(headers):
        h_lower = str(h).lower()
        if any(k.lower() in h_lower for k in keywords):
            return i
    return -1

@app.post("/upload/report")
async def upload_report(files: list[UploadFile] = File(...)):
    """
    Faz o upload de múltiplos relatórios PDF, extrai dados de alunos de todos e executa previsões em lote.
    Usa mapeamento inteligente de colunas para lidar com variações nos cabeçalhos dos PDFs.
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
                    # Mapeamento inteligente
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
                            
                            student = StudentInput(
                                student_id=sid,
                                name=name,
                                weekly_frequency=freq if freq < 10 else round(freq/52, 2), # Lidar com presenças anuais
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
            print(f"  Erro ao processar {file.filename}: {e}")

    if not all_pdf_data:
        raise HTTPException(status_code=422, detail="Não foi possível encontrar dados de alunos em nenhum dos PDFs enviados.")

    try:
        # Executar previsões com explicações SHAP
        predictions = []
        for s in all_pdf_data:
            res = await explain_churn(s)
            predictions.append(res)
            
        summary = {
            "total": len(predictions),
            "alto": sum(1 for p in predictions if p.risk_level == 'alto'),
            "medio": sum(1 for p in predictions if p.risk_level == 'medio'),
            "baixo": sum(1 for p in predictions if p.risk_level == 'baixo'),
            "avg_probability": round(sum(p.probability for p in predictions) / len(predictions), 4) if predictions else 0,
        }

        # --- LÓGICA DE SUBSTITUIÇÃO DE DADOS ---
        if supabase_client:
            try:
                supabase_client.table("alunos").delete().neq("id", -1).execute()
                insert_data = []
                for s in all_pdf_data:
                    insert_data.append({
                        "nome": s.name,
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
                    print(f"  ✅ Dados do Supabase substituídos por {len(insert_data)} alunos.")
            except Exception as se:
                print(f"  ⚠️ Erro ao sincronizar com o Supabase: {se}")
        
        return {
            "processed_files": processed_files,
            "students_found": len(all_pdf_data),
            "predictions": predictions,
            "summary": summary,
            "processed_at": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar predições: {str(e)}")


@app.post("/payments/create-intent")
async def create_payment_intent(payment_data: PaymentIntentInput):
    """
    Cria um Stripe Payment Intent para uma transação.
    Retorna o client_secret necessário pelo frontend.
    """
    if not stripe.api_key:
        raise HTTPException(status_code=503, detail="Serviço Stripe não configurado.")

    try:
        # Criar um PaymentIntent com o valor e a moeda especificados
        intent = stripe.PaymentIntent.create(
            amount=payment_data.amount,
            currency=payment_data.currency,
            description=payment_data.description,
            metadata=payment_data.metadata or {},
            automatic_payment_methods={"enabled": True},
        )
        
        return {
            "clientSecret": intent.client_secret,
            "id": intent.id,
            "amount": intent.amount,
            "currency": intent.currency
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


