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
import asyncio
from datetime import datetime
from typing import Optional, List, Dict
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Body

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
    allow_origins=["*"], # Permitir todas as origens em produção para evitar bloqueios de domínio customizado
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Gerenciador de WebSockets (Monitoramento em Tempo Real) ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

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


# --- Modelos ERP ---

class CashOpenInput(BaseModel):
    user_id: str
    opening_balance: float = Field(..., ge=0)
    notes: Optional[str] = None

class CashTransactionInput(BaseModel):
    session_id: str
    type: str = Field(..., pattern="^(entrada|saida|sangria|reforco)$")
    amount: float = Field(..., gt=0)
    description: str
    payment_method: str = Field("dinheiro", pattern="^(dinheiro|cartao|pix)$")

class CashCloseInput(BaseModel):
    session_id: str
    closing_balance: float = Field(..., ge=0)
    notes: Optional[str] = None

class CashTransferInput(BaseModel):
    session_id: str
    amount: float = Field(..., gt=0)
    destination: str = Field(..., pattern="^(financeiro|cofre|banco)$")
    description: Optional[str] = None

class AuditSearchInput(BaseModel):
    user_id: Optional[str] = None
    action: Optional[str] = None
    table_name: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class SupplierInput(BaseModel):
    name: str
    cnpj: Optional[str] = None
    contact: Optional[str] = None
    email: Optional[str] = None
    category: Optional[str] = None

class ProductInput(BaseModel):
    name: str
    sku: Optional[str] = None
    category: Optional[str] = None
    min_stock: int = 0
    unit_price: float = 0.0
    supplier_id: Optional[str] = None

class StockMovementInput(BaseModel):
    product_id: str
    type: str = Field(..., pattern="^(entrada|saida|ajuste)$")
    quantity: int = Field(..., gt=0)
    reason: Optional[str] = None


class PurchaseOrderInput(BaseModel):
    supplier_id: str
    items: list[dict] # list of {product_id, quantity, price}
    total_amount: float
    notes: Optional[str] = None

class InvoiceInput(BaseModel):
    order_id: Optional[str] = None
    invoice_number: str
    supplier_id: str
    items: list[dict]

class ExpenseInput(BaseModel):
    category_id: str
    amount: float = Field(..., gt=0)
    description: str
    due_date: Optional[str] = None
    status: str = "pago" # ou pendente



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
        return PredictionResult(
            student_id=student.student_id,
            name=student.name,
            probability=0.0,
            probability_percent=0.0,
            risk_level="erro (modelo não carregado)",
            predicted_at=datetime.now().isoformat(),
        )

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


# --- Endpoints de Gestão de Caixa (ERP) ---

@app.post("/cash/open")
async def open_cash_session(data: CashOpenInput):
    """Inicia uma nova sessão de caixa diária."""
    if not supabase_client:
        raise HTTPException(status_code=503, detail="Supabase não configurado.")
    
    try:
        # Verificar se já existe um caixa aberto para este usuário
        active = supabase_client.table("cash_sessions").select("*").eq("user_id", data.user_id).eq("status", "aberto").execute()
        if active.data:
            return {"status": "error", "message": "Já existe um caixa aberto para este usuário.", "session": active.data[0]}

        res = supabase_client.table("cash_sessions").insert({
            "user_id": data.user_id,
            "opening_balance": data.opening_balance,
            "notes": data.notes,
            "status": "aberto"
        }).execute()
        
        # Log de Auditoria
        await create_audit_log(data.user_id, "OPEN_CASH", "cash_sessions", res.data[0]["id"], None, res.data[0])
        
        return {"status": "success", "session": res.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/cash/transaction")
async def add_cash_transaction(data: CashTransactionInput):
    """Registra uma entrada, saída ou sangria no caixa ativo."""
    if not supabase_client:
        raise HTTPException(status_code=503, detail="Supabase não configurado.")
    
    try:
        # Validar se o caixa ainda está aberto
        session = supabase_client.table("cash_sessions").select("status").eq("id", data.session_id).single().execute()
        if not session.data or session.data["status"] != "aberto":
            raise HTTPException(status_code=400, detail="Não é possível registrar transações em um caixa fechado.")

        res = supabase_client.table("cash_transactions").insert({
            "session_id": data.session_id,
            "type": data.type,
            "amount": data.amount,
            "description": data.description,
            "payment_method": data.payment_method
        }).execute()
        
        return {"status": "success", "transaction": res.data[0]}
    except HTTPException as he: raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/cash/close")
async def close_cash_session(data: CashCloseInput):
    """Fecha a sessão de caixa ativa e calcula o balanço final."""
    if not supabase_client:
        raise HTTPException(status_code=503, detail="Supabase não configurado.")
    
    try:
        # 1. Buscar dados da sessão e transações para o resumo
        session_data = supabase_client.table("cash_sessions").select("*").eq("id", data.session_id).single().execute()
        transactions = supabase_client.table("cash_transactions").select("*").eq("session_id", data.session_id).execute()
        
        # 2. Calcular totais por modalidade e produtos
        totals = {"dinheiro": 0.0, "cartao": 0.0, "pix": 0.0}
        sangria_total = 0.0
        products_sold = 0
        
        for tx in transactions.data:
            val = float(tx["amount"])
            if tx["type"] == "entrada":
                totals[tx["payment_method"]] += val
                if "Venda" in (tx["description"] or ""): # Lógica simples para contar produtos
                    products_sold += 1
            elif tx["type"] == "sangria":
                sangria_total += val
                if tx["payment_method"] == "dinheiro":
                    totals["dinheiro"] -= val
            elif tx["type"] == "saida":
                if tx["payment_method"] == "dinheiro":
                    totals["dinheiro"] -= val

        expected_cash = float(session_data.data["opening_balance"]) + totals["dinheiro"]
        diff = data.closing_balance - expected_cash
        is_healthy = abs(diff) < 0.01 # Tolerância de 1 centavo

        # 3. Fechar Sessão
        res = supabase_client.table("cash_sessions").update({
            "closing_time": datetime.now().isoformat(),
            "closing_balance": data.closing_balance,
            "status": "fechado",
            "notes": data.notes
        }).eq("id", data.session_id).execute()
        
        res_data = {
            "status": "success", 
            "session": res.data[0],
            "report": {
                "opening_balance": session_data.data["opening_balance"],
                "closing_balance": data.closing_balance,
                "expected_balance": expected_cash,
                "difference": diff,
                "is_healthy": is_healthy,
                "sangria_total": sangria_total,
                "products_sold": products_sold,
                "totals_by_method": totals,
                "operator_id": session_data.data["user_id"],
                "closed_at": datetime.now().isoformat()
            }
        }
        
        # 4. Enviar Notificação Automática
        try:
            send_closure_notification(res_data["report"], "Operador do Sistema")
        except Exception as notify_err:
            print(f"Erro ao enviar notificação: {notify_err}")

        return res_data

@app.post("/finance/expense")
async def add_expense(data: ExpenseInput):
    """Registra uma despesa fixa ou variável no financeiro."""
    if not supabase_client: return {"status": "error"}
    try:
        res = supabase_client.table("finance_transactions").insert({
            "category_id": data.category_id,
            "type": "despesa",
            "amount": data.amount,
            "description": data.description,
            "payment_method": "caixa",
            "transaction_date": datetime.now().date().isoformat()
        }).execute()
        return {"status": "success", "data": res.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/finance/dre")
async def get_dre_summary(period: str = "month"):
    """Calcula o Demonstrativo de Resultados (DRE) para o período."""
    if not supabase_client: return {"status": "error"}
    try:
        # 1. Buscar transações financeiras (Receitas vs Despesas)
        txs = supabase_client.table("finance_transactions").select("*").execute()
        
        revenue = sum(float(t["amount"]) for t in txs.data if t["type"] == "receita")
        expenses = sum(float(t["amount"]) for t in txs.data if t["type"] == "despesa")
        
        # 2. Buscar compras de estoque (saídas de capital)
        # (Nesta versão simplificada estamos usando finance_transactions para tudo)
        
        net_profit = revenue - expenses
        margin = (net_profit / revenue * 100) if revenue > 0 else 0
        
        return {
            "period": period,
            "revenue": revenue,
            "expenses": expenses,
            "net_profit": net_profit,
            "margin": margin,
            "tx_count": len(txs.data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/cash/transfer")
async def transfer_cash_to_finance(data: CashTransferInput):
    """Transfere valor do caixa do dia para o caixa financeiro geral (Sangria Estruturada)."""
    if not supabase_client:
        raise HTTPException(status_code=503, detail="Supabase não configurado.")
    
    try:
        # 1. Registrar a Sangria no Caixa do Dia
        sangria = supabase_client.table("cash_transactions").insert({
            "session_id": data.session_id,
            "type": "sangria",
            "amount": data.amount,
            "description": f"Transferência para {data.destination}: {data.description or 'Sem descrição'}",
            "payment_method": "dinheiro"
        }).execute()

        # 2. Registrar a Entrada no Financeiro Geral
        finance = supabase_client.table("finance_transactions").insert({
            "type": "receita",
            "amount": data.amount,
            "description": f"Recebimento de Sangria (Caixa Dia): {data.description or 'Sem descrição'}",
            "payment_method": "dinheiro"
        }).execute()

        # 3. Log de Auditoria
        await create_audit_log("sistema", "CASH_TRANSFER", "cash_sessions", data.session_id, 
                               None, {"amount": data.amount, "dest": data.destination})

        return {
            "status": "success", 
            "message": f"R$ {data.amount} transferidos com sucesso para {data.destination}",
            "sangria_id": sangria.data[0]["id"],
            "finance_id": finance.data[0]["id"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- Endpoints de Auditoria ---

async def create_audit_log(user_id: str, action: str, table_name: str, record_id: str, old_data: Optional[dict], new_data: Optional[dict]):
    """Função interna para registrar logs no Supabase."""
    if not supabase_client: return
    try:
        supabase_client.table("audit_logs").insert({
            "user_id": user_id,
            "action": action,
            "table_name": table_name,
            "record_id": str(record_id),
            "old_data": old_data,
            "new_data": new_data
        }).execute()
    except Exception as e:
        print(f"⚠️ Erro ao gravar log: {e}")

@app.post("/audit/search")
async def search_audit_logs(filters: AuditSearchInput):
    """Busca detalhada nos logs de auditoria."""
    if not supabase_client:
        raise HTTPException(status_code=503, detail="Supabase não configurado.")
    
    query = supabase_client.table("audit_logs").select("*").order("created_at", desc=True)
    
    if filters.user_id: query = query.eq("user_id", filters.user_id)
    if filters.action: query = query.eq("action", filters.action)
    if filters.table_name: query = query.eq("table_name", filters.table_name)
    
    res = query.limit(100).execute()
    return res.data


# --- Endpoints de Estoque & Suprimentos ---

@app.get("/inventory/products")
async def list_products():
    """Lista todos os produtos no estoque."""
    if not supabase_client:
        raise HTTPException(status_code=503, detail="Supabase não configurado.")
    res = supabase_client.table("products").select("*, suppliers(name)").execute()
    return res.data

@app.post("/inventory/products")
async def create_product(data: ProductInput):
    """Cadastra um novo produto ou material de manutenção/limpeza."""
    if not supabase_client:
        raise HTTPException(status_code=503, detail="Supabase não configurado.")
    try:
        res = supabase_client.table("products").insert(data.dict()).execute()
        return {"status": "success", "product": res.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/inventory/suppliers")
async def list_suppliers():
    """Lista fornecedores cadastrados."""
    if not supabase_client:
        raise HTTPException(status_code=503, detail="Supabase não configurado.")
    res = supabase_client.table("suppliers").select("*").execute()
    return res.data

async def internal_record_stock_movement(data: StockMovementInput, user_id: str = "sistema"):
    """Lógica interna compartilhada para movimentação de estoque."""
    if not supabase_client: return None
    
    # Registrar movimento
    res = supabase_client.table("inventory_movements").insert(data.dict()).execute()
    
    # Atualizar saldo (Abstração simplificada, ideal usar RPC increment para atomicidade)
    prod = supabase_client.table("products").select("current_stock, name").eq("id", data.product_id).single().execute()
    current = prod.data["current_stock"] if prod.data else 0
    new_total = current + data.quantity if data.type == "entrada" else current - data.quantity
    
    supabase_client.table("products").update({"current_stock": new_total}).eq("id", data.product_id).execute()
    
    # Log de Auditoria
    await create_audit_log(user_id, f"STOCK_{data.type.upper()}", "products", data.product_id, 
                           {"old_stock": current}, {"new_stock": new_total, "reason": data.reason})
    
    return new_total

@app.post("/inventory/movement")
async def record_stock_movement(data: StockMovementInput):
    """Registra entrada ou saída de itens no estoque."""
    try:
        new_total = await internal_record_stock_movement(data)
        return {"status": "success", "new_total": new_total}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- Endpoints de Compras & Notas Fiscais ---

@app.post("/purchases/order")
async def create_purchase_order(data: PurchaseOrderInput):
    """Cria uma nova ordem de compra para fornecedores."""
    if not supabase_client:
        raise HTTPException(status_code=503, detail="Supabase não configurado.")
    try:
        res = supabase_client.table("purchase_orders").insert(data.dict()).execute()
        return {"status": "success", "order": res.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/purchases/invoice")
async def register_invoice(data: InvoiceInput):
    """Registra uma nota fiscal e atualiza automaticamente o estoque."""
    if not supabase_client:
        raise HTTPException(status_code=503, detail="Supabase não configurado.")
    
    try:
        # 1. Registrar a NF no sistema (tabela hipotética ou log)
        print(f"📄 Registrando NF {data.invoice_number} do fornecedor {data.supplier_id}")
        
        # 2. Atualizar estoque para cada item da NF
        for item in data.items:
            movement = StockMovementInput(
                product_id=item["product_id"],
                type="entrada",
                quantity=item["quantity"],
                reason=f"NF {data.invoice_number}"
            )
            await internal_record_stock_movement(movement)
            
        return {"status": "success", "message": f"Estoque atualizado via NF {data.invoice_number}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- Módulo IoT: Integração com Catraca Toletus Actuar ---

@app.websocket("/ws/catraca")
async def websocket_catraca(websocket: WebSocket):
    """Canal WebSocket para monitoramento de acessos em tempo real."""
    await manager.connect(websocket)
    try:
        while True:
            # Mantém a conexão viva esperando dados do cliente (opcional)
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.post("/access/validate")
async def validate_access(payload: dict = Body(...)):
    """
    Valida o acesso do aluno (Tag/Biometria) e notifica o dashboard.
    Este endpoint é chamado pelo 'Agente Local' da Catraca.
    """
    tag_id = payload.get("tag")
    if not tag_id:
        raise HTTPException(status_code=400, detail="Tag não informada")

    if not supabase_client:
        raise HTTPException(status_code=503, detail="Banco de dados offline")

    try:
        # 1. Buscar Aluno por Biometry ID ou Tag Principal
        res = supabase_client.table("alunos").select("*, planos(*)").or_(f"id.eq.{tag_id},biometry_id.eq.{tag_id}").execute()
        
        if not res.data:
            # Caso não encontre pelo ID principal, tenta buscar em um campo customizado se existir
            status = "vencido" # Tratamos desconhecido como bloqueado por segurança
            msg = "Usuário Desconhecido"
            aluno = None
        else:
            aluno = res.data[0]
            # 2. Lógica de Validação de Plano
            # Verificamos o status do aluno e se o plano está ativo
            if aluno.get("status") == "Ativo":
                status = "ativo"
                msg = "Acesso Liberado"
            else:
                status = "vencido"
                msg = "Acesso Bloqueado (Plano Vencido)"

        # 3. Notificar Dashboard via WebSocket (Broadcasting instantâneo)
        event = {
            "nome": aluno["nome"] if aluno else "Desconhecido",
            "foto": aluno.get("foto_url") if (aluno and aluno.get("foto_url")) else f"https://ui-avatars.com/api/?name={aluno['nome'] if aluno else '?'}&background=random",
            "status": status,
            "mensagem": msg,
            "timestamp": datetime.now().isoformat()
        }
        await manager.broadcast(event)

        # 4. Registrar no log de auditoria
        supabase_client.table("audit_logs").insert({
            "action": "access_attempt",
            "details": f"Tentativa de acesso: {tag_id} - Status: {status}",
            "operator_id": aluno["id"] if aluno else None
        }).execute()

        return {
            "status": status, 
            "liberar_giro": status == "ativo", 
            "aluno": aluno,
            "mensagem": msg
        }
    except Exception as e:
        print(f"❌ Erro na validação de acesso: {e}")
        return {"status": "erro", "liberar_giro": False, "mensagem": str(e)}
