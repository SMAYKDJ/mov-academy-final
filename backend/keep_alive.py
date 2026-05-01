import os
import sys
from supabase import create_client
from dotenv import load_dotenv

# Carrega variáveis localmente (.env) ou do ambiente (GitHub Actions)
load_dotenv()

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL") or os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY") or os.getenv("SUPABASE_ANON_KEY")

def keep_alive():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Erro: SUPABASE_URL ou SUPABASE_KEY não configurados.")
        sys.exit(1)

    try:
        print(f"📡 Conectando ao Supabase em: {SUPABASE_URL}")
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # Realiza uma consulta simples para manter o banco ativo
        # Buscamos apenas 1 registro da tabela profiles para minimizar banda
        response = supabase.table("profiles").select("id").limit(1).execute()
        
        print("✅ Heartbeat enviado com sucesso!")
        print(f"📊 Resposta: {len(response.data)} registro(s) encontrado(s).")
        
    except Exception as e:
        print(f"❌ Falha no Heartbeat: {e}")
        sys.exit(1)

if __name__ == "__main__":
    keep_alive()
