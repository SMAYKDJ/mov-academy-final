import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  # Service role key

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("Criando usuário admin...")
try:
    user = supabase.auth.admin.create_user({
        "email": "smayklive@gmail.com",
        "password": "123456",
        "email_confirm": True,
        "user_metadata": {
            "nome": "Admin Smayk",
            "role": "admin"
        }
    })
    print("✅ Usuário admin criado com sucesso!")
except Exception as e:
    if "already exists" in str(e).lower() or "unique" in str(e).lower():
        print("✅ Usuário admin já existe.")
    else:
        print(f"❌ Erro ao criar usuário: {e}")
