"""
Synthetic Data Generator — PlayFitness Churn Prediction.

Generates high-fidelity synthetic member data (5,000 profiles)
following the KDD methodology for churn model development.

Statistical Correlations:
- Inactivity > 10 days → +75% churn probability
- Age > 45 → 20% more retention (loyal profile)
- Low frequency (< 2x/week) → significantly increases churn risk
- Overdue payments → strong churn signal

Output: playfitness_synthetic_prime.csv
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta

np.random.seed(42)

N_MEMBERS = 5000

# --- Name generation ---
first_names = [
    'Carlos', 'Ana', 'Bruno', 'Daniela', 'Eduardo', 'Fernanda', 'Gabriel',
    'Helena', 'Igor', 'Juliana', 'Lucas', 'Mariana', 'Pedro', 'Rafaela',
    'Thiago', 'Vanessa', 'William', 'Yasmin', 'Diego', 'Camila', 'João',
    'Letícia', 'Ricardo', 'Isabela', 'Felipe', 'Larissa', 'Mateus',
    'Bianca', 'André', 'Natália'
]

last_names = [
    'Silva', 'Oliveira', 'Santos', 'Costa', 'Lima', 'Souza', 'Rocha',
    'Martins', 'Ferreira', 'Alencar', 'Pereira', 'Almeida', 'Nascimento',
    'Ribeiro', 'Carvalho', 'Mendes', 'Araújo', 'Barbosa', 'Gomes', 'Dias'
]

plans = ['Black VIP', 'Platinum', 'Basic Fit']
plan_prices = {'Black VIP': 189.90, 'Platinum': 129.90, 'Basic Fit': 79.90}

# --- Generate base data ---
data = {
    'student_id': [f'MOV-{str(i+1).zfill(4)}' for i in range(N_MEMBERS)],
    'name': [
        f'{np.random.choice(first_names)} {np.random.choice(last_names)}'
        for _ in range(N_MEMBERS)
    ],
    'age': np.random.normal(32, 10, N_MEMBERS).astype(int).clip(16, 70),
    'plan': np.random.choice(plans, N_MEMBERS, p=[0.15, 0.45, 0.40]),
    'enrollment_months': np.random.exponential(12, N_MEMBERS).astype(int).clip(1, 60),
    'weekly_frequency': np.random.poisson(3, N_MEMBERS).clip(0, 7),
    'days_since_last_visit': np.random.exponential(5, N_MEMBERS).astype(int).clip(0, 60),
    'overdue_payments': np.random.binomial(1, 0.18, N_MEMBERS),
    'overdue_days': np.zeros(N_MEMBERS, dtype=int),
}

# Overdue days only for those with overdue payments
overdue_mask = data['overdue_payments'] == 1
data['overdue_days'][overdue_mask] = np.random.exponential(15, overdue_mask.sum()).astype(int).clip(1, 90)

df = pd.DataFrame(data)

# --- Feature Engineering ---
# Monthly revenue per student
df['plan_price'] = df['plan'].map(plan_prices)

# Last visit date
today = datetime(2026, 4, 14)
df['last_visit'] = df['days_since_last_visit'].apply(
    lambda d: (today - timedelta(days=int(d))).strftime('%d/%m/%Y')
)

# Enrollment date
df['enrollment_date'] = df['enrollment_months'].apply(
    lambda m: (today - timedelta(days=int(m) * 30)).strftime('%d/%m/%Y')
)

# --- Churn Target Generation (Realistic Correlations) ---
def calculate_churn_probability(row):
    """
    KDD-inspired churn probability calculation.
    Base probability + risk factors - retention factors.
    """
    prob = 0.30  # Baseline

    # Risk factors
    if row['days_since_last_visit'] > 10:
        prob += 0.45
    elif row['days_since_last_visit'] > 5:
        prob += 0.15

    if row['weekly_frequency'] < 2:
        prob += 0.20
    elif row['weekly_frequency'] < 3:
        prob += 0.08

    if row['overdue_payments'] == 1:
        prob += 0.15
        if row['overdue_days'] > 30:
            prob += 0.10

    # Retention factors
    if row['age'] > 45:
        prob -= 0.15

    if row['enrollment_months'] > 24:
        prob -= 0.10

    if row['plan'] == 'Black VIP':
        prob -= 0.08

    # Add noise
    noise = np.random.normal(0, 0.05)
    prob += noise

    return max(0.05, min(0.95, prob))


df['churn_probability'] = df.apply(calculate_churn_probability, axis=1)
df['churn'] = (df['churn_probability'] > 0.5).astype(int)

# Risk level classification
def classify_risk(prob):
    if prob > 0.70:
        return 'alto'
    elif prob >= 0.40:
        return 'medio'
    return 'baixo'

df['risk_level'] = df['churn_probability'].apply(classify_risk)

# --- Summary Statistics ---
print("=" * 60)
print("  PLAYFITNESS — Synthetic Data Generation Report")
print("=" * 60)
print(f"\n  Total Members: {len(df):,}")
print(f"  Churn Rate:    {df['churn'].mean() * 100:.1f}%")
print(f"\n  Risk Distribution:")
for level in ['alto', 'medio', 'baixo']:
    count = (df['risk_level'] == level).sum()
    print(f"    {level.capitalize():>6}: {count:>5} ({count/len(df)*100:.1f}%)")

print(f"\n  Plan Distribution:")
for plan in plans:
    count = (df['plan'] == plan).sum()
    print(f"    {plan:>12}: {count:>5} ({count/len(df)*100:.1f}%)")

print(f"\n  Avg Weekly Frequency: {df['weekly_frequency'].mean():.1f}")
print(f"  Avg Days Since Visit: {df['days_since_last_visit'].mean():.1f}")
print(f"  Payment Default Rate: {df['overdue_payments'].mean() * 100:.1f}%")

# --- Save ---
output_path = 'playfitness_synthetic_prime.csv'
df.to_csv(output_path, index=False)
print(f"\n  ✅ Saved to: {output_path}")
print("=" * 60)
