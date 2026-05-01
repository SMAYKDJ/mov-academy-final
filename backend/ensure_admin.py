import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  # Service role key

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

email = "smayklive@gmail.com"
password = "123456"

print(f"Garantindo usuário {email}...")
try:
    # Listar usuários e buscar pelo e‑mail
    users_response = supabase.auth.admin.list_users()
    target_user = None
    for user in users_response:
        if user.email == email:
            target_user = user
            break

    if target_user:
        print(f"Usuário encontrado (ID: {target_user.id}). Atualizando senha...")
        supabase.auth.admin.update_user_by_id(
            target_user.id,
            {
                "password": password,
                "email_confirm": True,
                "user_metadata": {
                    "nome": "Admin Smayk",
                    "role": "admin"
                }
            }
        )
        # Garantir registro na tabela profiles
        supabase.from_("profiles").upsert({
            "id": target_user.id,
            "email": email,
            "nome": "Admin Smayk",
            "role": "admin"
        }).execute()
        print("✅ Senha e Perfil atualizados com sucesso!")
    else:
        print("Usuário não encontrado na lista. Criando novo...")
        supabase.auth.admin.create_user({
            "email": email,
            "password": password,
            "email_confirm": True,
            "user_metadata": {
                "nome": "Admin Smayk",
                "role": "admin"
            }
        })
        print("✅ Novo usuário admin criado!")
except Exception as e:
    print(f"❌ Erro: {e}")
