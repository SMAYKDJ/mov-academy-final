import pandas as pd

def classificar_engajamento(freq_mensal: float) -> str:
    """Classifica o nível de engajamento baseado na frequência mensal."""
    if freq_mensal >= 12:
        return "alto"
    elif freq_mensal >= 6:
        return "medio"
    else:
        return "baixo"

def calcular_dias_atraso(data_pagamento: str, data_vencimento: str) -> int:
    """Retorna o número de dias de atraso (não negativo)."""
    dp = pd.to_datetime(data_pagamento)
    dv = pd.to_datetime(data_vencimento)
    dias = (dp - dv).days
    return max(dias, 0)

def calcular_risco(row) -> float:
    """Calcula o score de risco baseado na fórmula descrita no plano."""
    risco = 0
    risco += (10 - row["freq_mensal"]) * 2
    risco += row["dias_atraso"] * 1.5
    risco += row["inadimplente"] * 20
    return risco
