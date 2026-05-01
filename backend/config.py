"""
Configuração do Backend — Microserviço de Previsão de Churn.

Carrega variáveis de ambiente e define padrões.
"""

import os
from dotenv import load_dotenv

load_dotenv()

# Supabase (integração futura)
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

# Servidor
HOST = os.getenv("API_HOST", "0.0.0.0")
PORT = int(os.getenv("API_PORT", "8000"))

# Modelo
MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
