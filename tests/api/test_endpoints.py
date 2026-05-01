import requests
import pytest

BASE_URL = "http://localhost:8000"

def test_health_check():
    response = requests.get(f"{BASE_URL}/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_model_info():
    response = requests.get(f"{BASE_URL}/model/info")
    assert response.status_code == 200
    assert "model_type" in response.json()

def test_predict_churn_positive():
    payload = {
        "student_id": "MOV-001",
        "name": "Test Student",
        "weekly_frequency": 5,
        "days_since_last_visit": 1,
        "overdue_payments": 0,
        "overdue_days": 0,
        "enrollment_months": 12,
        "age": 25,
        "plan": "Platinum"
    }
    response = requests.post(f"{BASE_URL}/predict", json=payload)
    assert response.status_code == 200
    assert "probability" in response.json()
    assert response.json()["risk_level"] in ["baixo", "medio", "alto"]

def test_predict_churn_negative_invalid_data():
    payload = {
        "student_id": "MOV-001",
        "name": "Test Student",
        "weekly_frequency": -1, # Frequência inválida
        "days_since_last_visit": 0,
        "overdue_payments": 0,
        "overdue_days": 0,
        "enrollment_months": 0, # Meses inválidos
        "age": 10, # Abaixo da idade mínima de 16
        "plan": "Platinum"
    }
    response = requests.post(f"{BASE_URL}/predict", json=payload)
    assert response.status_code == 422 # Erro de validação
