import os
import json
import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, recall_score, roc_auc_score
import joblib

DATA_PATH = Path('backend/data/df_churn.csv')
MODEL_DIR = Path('backend/models')
MODEL_PATH = MODEL_DIR / 'churn_model.joblib'
METRICS_PATH = MODEL_DIR / 'metrics.json'

def train():
    if not DATA_PATH.is_file():
        raise FileNotFoundError(f'Dataset not found at {DATA_PATH}')
    df = pd.read_csv(DATA_PATH)
    X = df[["freq_mensal", "dias_atraso", "valor_mensal", "inadimplente"]]
    y = df["churn"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    model = RandomForestClassifier(n_estimators=200, random_state=42)
    model.fit(X_train, y_train)
    # Metrics
    y_pred = model.predict(X_test)
    
    try:
        auc = roc_auc_score(y_test, model.predict_proba(X_test)[:, 1])
    except ValueError:
        auc = 0.0 # Occurs if only one class is present in y_test
    except IndexError:
        auc = 0.0

    metrics = {
        "accuracy": accuracy_score(y_test, y_pred),
        "recall": recall_score(y_test, y_pred, zero_division=0),
        "roc_auc": auc
    }
    # Ensure directory exists
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    with open(METRICS_PATH, "w") as f:
        json.dump(metrics, f, indent=2)
    print(f"Model saved to {MODEL_PATH}\nMetrics saved to {METRICS_PATH}")

if __name__ == "__main__":
    train()
