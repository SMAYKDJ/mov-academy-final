import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score
import joblib
import json
import os

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.join(BACKEND_DIR, "..")
DATA_PATH = os.path.join(PROJECT_ROOT, "RELATORIOS", "consolidated_client_data.csv")
MODELS_DIR = os.path.join(BACKEND_DIR, "models")

def train():
    print("Carregando dados consolidados...")
    df = pd.read_csv(DATA_PATH)
    
    # Feature Engineering
    le = LabelEncoder()
    df['plan_encoded'] = le.fit_transform(df['plan'].astype(str))
    
    features = [
        'weekly_frequency', 'days_since_last_visit', 'overdue_payments',
        'overdue_days', 'enrollment_months', 'age', 'plan_encoded'
    ]
    
    X = df[features]
    y = df['target']
    
    print(f"Treinando em {len(df)} amostras...")
    print(f"Distribuição de alvo:\n{y.value_counts(normalize=True)}")
    
    # Simple split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Random Forest
    model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
    model.fit(X_train, y_train)
    
    # Metrics
    score = model.score(X_test, y_test)
    cv_scores = cross_val_score(model, X, y, cv=5)
    
    print(f"✅ Acurácia do Modelo Real: {score:.4f}")
    print(f"✅ Média Cross-val: {cv_scores.mean():.4f}")
    
    # Save Model
    os.makedirs(MODELS_DIR, exist_ok=True)
    joblib.dump(model, os.path.join(MODELS_DIR, "churn_model.joblib"))
    joblib.dump(le, os.path.join(MODELS_DIR, "label_encoder.joblib"))
    
    metrics = {
        "accuracy": score,
        "cv_mean": cv_scores.mean(),
        "cv_std": cv_scores.std(),
        "trained_at": pd.Timestamp.now().isoformat(),
        "samples": len(df)
    }
    
    with open(os.path.join(MODELS_DIR, "metrics.json"), "w") as f:
        json.dump(metrics, f, indent=2)
        
    print("🚀 Modelo Real implantado em backend/models/")

if __name__ == "__main__":
    train()
