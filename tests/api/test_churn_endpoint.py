import pytest
from fastapi.testclient import TestClient
from backend.main import app
from pydantic import BaseModel
from typing import Any

class ValidPayload(BaseModel):
    nome: str
    freq_mensal: float
    dias_atraso: int
    valor_mensal: float
    inadimplente: int

def test_predict_churn_success():
    with TestClient(app) as client:
        payload = {
            "nome": "Aluno Test",
            "freq_mensal": 5.0,
            "dias_atraso": 2,
            "valor_mensal": 150.0,
            "inadimplente": 0,
        }
        response = client.post("/predict/churn", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "probability" in data
        assert "risk_level" in data
        assert data["risk_level"] in ["alto", "medio", "baixo"]

def test_predict_churn_missing_field():
    with TestClient(app) as client:
        # omit 'nome'
        payload = {
            "freq_mensal": 5.0,
            "dias_atraso": 2,
            "valor_mensal": 150.0,
            "inadimplente": 0,
        }
        response = client.post("/predict/churn", json=payload)
        assert response.status_code == 422

def test_predict_churn_model_not_loaded(monkeypatch):
    with TestClient(app) as client:
        # Simulate model not loaded AFTER startup
        monkeypatch.setattr('backend.main.model', None)
        payload = {
            "nome": "Aluno Test",
            "freq_mensal": 5.0,
            "dias_atraso": 2,
            "valor_mensal": 150.0,
            "inadimplente": 0,
        }
        response = client.post("/predict/churn", json=payload)
        assert response.status_code == 503
