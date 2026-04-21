"""
ML Pipeline — Churn Prediction Model Training.

Implements the complete KDD pipeline:
1. Data Collection (CSV / Supabase)
2. Data Cleaning (Pandas)
3. Feature Engineering
4. Model Training (Random Forest - Scikit-learn)
5. Evaluation (Accuracy, Recall, ROC-AUC)
6. Model Serialization (joblib)

Target: Binary churn classification (0 or 1)
Features: weekly_frequency, days_since_last_visit, overdue_payments,
          overdue_days, enrollment_months, age, plan (encoded)
"""

import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
    accuracy_score,
    recall_score,
    roc_auc_score,
    classification_report,
    confusion_matrix,
)

# Paths
DATA_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(DATA_DIR, 'playfitness_synthetic_prime.csv')
MODEL_DIR = os.path.join(os.path.dirname(DATA_DIR), 'models')
MODEL_PATH = os.path.join(MODEL_DIR, 'churn_model.joblib')
ENCODER_PATH = os.path.join(MODEL_DIR, 'label_encoder.joblib')


def load_and_clean_data(path: str) -> pd.DataFrame:
    """
    Step 1 & 2: Load data and perform cleaning.
    - Remove duplicates
    - Handle missing values
    - Type casting
    """
    df = pd.read_csv(path)
    
    # Remove duplicates
    df = df.drop_duplicates(subset=['student_id'])
    
    # Handle missing values
    df['weekly_frequency'] = df['weekly_frequency'].fillna(0)
    df['days_since_last_visit'] = df['days_since_last_visit'].fillna(
        df['days_since_last_visit'].median()
    )
    df['overdue_payments'] = df['overdue_payments'].fillna(0)
    df['overdue_days'] = df['overdue_days'].fillna(0)
    
    print(f"  ✅ Loaded {len(df)} records ({df.shape[1]} columns)")
    print(f"  📊 Churn distribution: {df['churn'].value_counts().to_dict()}")
    
    return df


def feature_engineering(df: pd.DataFrame) -> tuple:
    """
    Step 3: Feature Engineering.
    
    Features selected based on domain knowledge:
    - weekly_frequency: Training habits indicator
    - days_since_last_visit: Absence signal (strongest predictor)
    - overdue_payments: Financial risk flag
    - overdue_days: Payment delay severity
    - enrollment_months: Tenure / loyalty factor
    - age: Demographic retention factor
    - plan_encoded: Service tier
    """
    # Encode categorical: plan
    le = LabelEncoder()
    df['plan_encoded'] = le.fit_transform(df['plan'])
    
    feature_cols = [
        'weekly_frequency',
        'days_since_last_visit',
        'overdue_payments',
        'overdue_days',
        'enrollment_months',
        'age',
        'plan_encoded',
    ]
    
    X = df[feature_cols].copy()
    y = df['churn'].copy()
    
    print(f"  🧬 Features: {feature_cols}")
    print(f"  🎯 Target balance: {y.value_counts().to_dict()}")
    
    return X, y, le, feature_cols


def train_model(X, y):
    """
    Step 4 & 5: Train Random Forest and evaluate.
    
    Hyperparameters tuned for gym churn prediction:
    - n_estimators=200: Sufficient trees for generalization
    - max_depth=12: Prevents overfitting on synthetic data
    - min_samples_split=10: Reduces noise sensitivity
    - class_weight='balanced': Handles imbalanced classes
    """
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=12,
        min_samples_split=10,
        min_samples_leaf=5,
        class_weight='balanced',
        random_state=42,
        n_jobs=-1,
    )
    
    print("\n  🚀 Training Random Forest...")
    model.fit(X_train, y_train)
    
    # Predictions
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]
    
    # Metrics
    accuracy = accuracy_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    roc_auc = roc_auc_score(y_test, y_proba)
    
    # Cross-validation
    cv_scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
    
    print("\n" + "=" * 50)
    print("  📊 MODEL EVALUATION REPORT")
    print("=" * 50)
    print(f"  Accuracy:          {accuracy:.4f} ({accuracy*100:.1f}%)")
    print(f"  Recall:            {recall:.4f} ({recall*100:.1f}%)")
    print(f"  ROC-AUC:           {roc_auc:.4f}")
    print(f"  Cross-Val (5-fold): {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")
    print(f"\n  📋 Classification Report:")
    print(classification_report(y_test, y_pred, target_names=['Retained', 'Churned']))
    
    # Feature importance
    importances = model.feature_importances_
    feature_names = X.columns
    importance_df = pd.DataFrame({
        'feature': feature_names,
        'importance': importances
    }).sort_values('importance', ascending=False)
    
    print("  🔑 Feature Importance:")
    for _, row in importance_df.iterrows():
        bar = '█' * int(row['importance'] * 50)
        print(f"    {row['feature']:>25}: {row['importance']:.4f} {bar}")
    
    return model, {
        'accuracy': accuracy,
        'recall': recall,
        'roc_auc': roc_auc,
        'cv_mean': cv_scores.mean(),
        'cv_std': cv_scores.std(),
    }


def save_model(model, label_encoder, metrics: dict):
    """Step 6: Serialize model and encoder."""
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    joblib.dump(model, MODEL_PATH)
    joblib.dump(label_encoder, ENCODER_PATH)
    
    # Save metrics
    metrics_path = os.path.join(MODEL_DIR, 'metrics.json')
    import json
    with open(metrics_path, 'w') as f:
        json.dump(metrics, f, indent=2)
    
    print(f"\n  ✅ Model saved to: {MODEL_PATH}")
    print(f"  ✅ Encoder saved to: {ENCODER_PATH}")
    print(f"  ✅ Metrics saved to: {metrics_path}")


def main():
    print("=" * 60)
    print("  🧠 PLAYFITNESS — ML Pipeline (KDD)")
    print("  Model: Random Forest Classifier")
    print("  Framework: Scikit-learn")
    print("=" * 60)
    
    # 1-2: Load & Clean
    df = load_and_clean_data(DATA_PATH)
    
    # 3: Feature Engineering
    X, y, le, feature_cols = feature_engineering(df)
    
    # 4-5: Train & Evaluate
    model, metrics = train_model(X, y)
    
    # 6: Save
    save_model(model, le, metrics)
    
    print("\n" + "=" * 60)
    print("  ✅ Pipeline Complete!")
    print("=" * 60)


if __name__ == '__main__':
    main()
