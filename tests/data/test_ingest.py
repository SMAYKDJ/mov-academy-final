import pytest
import pandas as pd
from backend.data.ingest_churn import ingest_data
from pathlib import Path

def test_ingest_creates_dataframe(tmp_path: Path):
    # Use placeholder CSVs placed in repository root
    df = ingest_data(
        recep_path='backend/data/recebimentos.csv',
        devedores_path='backend/data/devedores.csv',
        freq_path='backend/data/frequencia_treino.csv'
    )
    # Expected columns after feature engineering
    expected_cols = {
        'nome', 'freq_mensal', 'dias_atraso', 'valor_mensal', 'inadimplente',
        'churn_flag', 'engajamento'
    }
    assert set(df.columns).issuperset(expected_cols)
    # No NaNs in critical columns
    assert df[['freq_mensal', 'dias_atraso', 'valor_mensal']].isnull().sum().sum() == 0
    # Verify churn flag logic for a known sample (first row)
    first = df.iloc[0]
    # If overdue days > 30 or low frequency -> churn_flag should be 1
    if first['dias_atraso'] > 30 or first['freq_mensal'] < 2:
        assert first['churn_flag'] == 1
    else:
        assert first['churn_flag'] == 0
