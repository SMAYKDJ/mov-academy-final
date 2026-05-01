import os
import pandas as pd
from pathlib import Path

# Paths – adjust via env vars if needed
RECEBIMENTOS_PATH = os.getenv('RECEBIMENTOS_PATH', 'backend/data/recebimentos.csv')
DEVEDORES_PATH = os.getenv('DEVEDORES_PATH', 'backend/data/devedores.csv')
FREQ_TREINO_PATH = os.getenv('FREQ_TREINO_PATH', 'backend/data/frequencia_treino.csv')

OUTPUT_PATH = Path('backend/data/df_churn.csv')

def ler_recebimentos():
    df = pd.read_csv(RECEBIMENTOS_PATH)
    # Expected columns: nome, data_vencimento, data_pagamento, valor
    df['dias_atraso'] = (
        pd.to_datetime(df['data_pagamento']) - pd.to_datetime(df['data_vencimento'])
    ).dt.days
    df['dias_atraso'] = df['dias_atraso'].clip(lower=0)
    return df[['nome', 'valor', 'dias_atraso']]

def ler_devedores():
    df = pd.read_csv(DEVEDORES_PATH)
    # Expected columns: nome, data_inicio, valor
    df['inadimplente'] = 1
    return df[['nome', 'inadimplente']]

def ler_frequencia():
    df = pd.read_csv(FREQ_TREINO_PATH)
    # Expected columns: nome, presencas (últimos 12 meses)
    df['freq_mensal'] = df['presencas'] / 12.0
    return df[['nome', 'freq_mensal']]

def ingest_data(recep_path=None, devedores_path=None, freq_path=None):
    # Usar caminhos fornecidos ou padrões do ambiente/global
    r_path = recep_path or RECEBIMENTOS_PATH
    d_path = devedores_path or DEVEDORES_PATH
    f_path = freq_path or FREQ_TREINO_PATH

    # Inner functions modified to use local paths
    def _ler_recebimentos(path):
        df = pd.read_csv(path)
        df['dias_atraso'] = (pd.to_datetime(df['data_pagamento']) - pd.to_datetime(df['data_vencimento'])).dt.days
        df['dias_atraso'] = df['dias_atraso'].clip(lower=0)
        return df[['nome', 'valor', 'dias_atraso']]

    def _ler_devedores(path):
        df = pd.read_csv(path)
        # Apenas alunos com saldo > 0 são realmente inadimplentes
        df['inadimplente'] = (df['valor'] > 0).astype(int)
        return df[['nome', 'inadimplente']]

    def _ler_frequencia(path):
        df = pd.read_csv(path)
        df['freq_mensal'] = df['presencas'] / 12.0
        return df[['nome', 'freq_mensal']]

    receb = _ler_recebimentos(r_path)
    dev = _ler_devedores(d_path)
    freq = _ler_frequencia(f_path)
    
    df = pd.merge(receb, freq, on='nome', how='left')
    df = pd.merge(df, dev, on='nome', how='left')
    df['inadimplente'] = df['inadimplente'].fillna(0).astype(int)
    df['freq_mensal'] = df['freq_mensal'].fillna(0)
    df['valor_mensal'] = df['valor'].fillna(0)
    df['dias_atraso'] = df['dias_atraso'].fillna(0)
    # Adding 'churn_flag' for test compatibility
    df['churn_flag'] = ((df['freq_mensal'] < 4) | (df['inadimplente'] == 1)).astype(int)
    df['churn'] = df['churn_flag']
    # Adding 'engajamento' for test compatibility
    try:
        from .utils import classificar_engajamento
    except (ImportError, ValueError):
        import sys
        sys.path.append(os.path.dirname(__file__))
        from utils import classificar_engajamento
    df['engajamento'] = df['freq_mensal'].apply(classificar_engajamento)
    
    return df[['nome', 'freq_mensal', 'dias_atraso', 'valor_mensal', 'inadimplente', 'churn', 'churn_flag', 'engajamento']]

def main():
    df = ingest_data()
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(OUTPUT_PATH, index=False)
    print(f'Dataset churn salvo em {OUTPUT_PATH}')

if __name__ == '__main__':
    main()
