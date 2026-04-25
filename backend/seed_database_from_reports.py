import os
import re
import uuid
from datetime import datetime
import pdfplumber
from supabase import create_client
from dotenv import load_dotenv

# Load env variables
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")  # Requires service role key to delete/insert safely

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Erro: SUPABASE_URL e SUPABASE_KEY não configuradas no .env")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

REPORTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "RELATORIOS")

def delete_existing_data():
    print("🗑️  Deletando dados existentes (transacoes, treinos, alunos)...")
    try:
        # Tentar deletar tudo (requer Service Role Key ou RLS permissivo)
        supabase.table('transacoes').delete().neq('id', '0').execute()
        supabase.table('treinos').delete().neq('id', '0').execute()
        supabase.table('alunos').delete().neq('id', -1).execute()
        print("✅ Dados antigos apagados.")
    except Exception as e:
        print(f"⚠️ Aviso ao tentar apagar dados. Certifique-se de que a RLS permite deleção. Erro: {e}")

def seed_database():
    students = {} # map to hold student data
    transactions = []

    print("\n📄 Extraindo alunos de 'Listagem de Matrículas.pdf'...")
    try:
        with pdfplumber.open(os.path.join(REPORTS_DIR, "Listagem de Matrículas.pdf")) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                lines = text.split('\n')
                for line in lines:
                    # Match pattern: ID Nome do Aluno... Plano... Data
                    match = re.search(r'^(\d+)\s+(.*?)\s+(Plano\s+\w+.*?)\s+(\d{2}/\d{2}/\d{4})', line)
                    if match:
                        sid = match.group(1)
                        name = match.group(2).strip()
                        # Normalize Plan
                        raw_plan = match.group(3).strip()
                        plan = 'Mensal'
                        if 'Anual' in raw_plan: plan = 'Anual'
                        elif 'Semestral' in raw_plan: plan = 'Semestral'
                        elif 'Trimestral' in raw_plan: plan = 'Trimestral'
                        elif 'Black' in raw_plan or 'VIP' in raw_plan: plan = 'Black VIP'
                        
                        start_date = match.group(4)
                        
                        # Normalize Status
                        status = 'ativo'
                        if any(x in line for x in ['Inativa', 'Vencida', 'Cancelada']):
                            status = 'inativo'
                        elif 'Pendente' in line:
                            status = 'pendente'
                        
                        # Fix email logic: use names to make dummy emails
                        email_base = re.sub(r'[^a-zA-Z0-9]', '', name.split()[0].lower())
                        email = f"{email_base}_{sid}@moviment.com"
                        
                        students[sid] = {
                            "nome": name,
                            "email": email,
                            "telefone": "(11) 99999-9999",
                            "plano": plan,
                            "status": status,
                            "data_matricula": start_date,
                            "ultimo_pagamento": start_date,
                            "data_nascimento": "01/01/1990",
                            "endereco": "Rua Exemplo, 123",
                            "objetivo": "Condicionamento Físico",
                            "frequencia": 0,
                            "risco": 0,
                            "_original_id": sid # to link transactions
                        }
        print(f"   Encontrados {len(students)} alunos na listagem de matrículas.")
    except Exception as e:
        print(f"   Erro ao ler arquivo de matrículas: {e}")

    print("\n📄 Adicionando frequências de 'Alunos Mais Frequentes.pdf'...")
    try:
        with pdfplumber.open(os.path.join(REPORTS_DIR, "Alunos Mais Frequentes.pdf")) as pdf:
            for page in pdf.pages:
                lines = page.extract_text().split('\n')
                for line in lines:
                    match = re.search(r'\s+(\d+)\s+(.*?)\s+.*?(\d+)$', line)
                    if match:
                        sid = match.group(1)
                        visits = int(match.group(3))
                        if sid in students:
                            students[sid]['frequencia'] = visits
    except Exception as e:
        print(f"   Erro ao ler arquivo de frequências: {e}")

    # Inserir Alunos para obter os IDs Reais (Serial) do Banco
    print("\n💾 Inserindo alunos no Supabase...")
    student_records = list(students.values())
    real_student_mapping = {} # _original_id -> Supabase ID
    
    # Supabase allows inserting arrays of objects
    batch_size = 50
    inserted_count = 0
    for i in range(0, len(student_records), batch_size):
        batch = student_records[i:i+batch_size]
        # Remove the temp key before inserting
        insert_batch = [{k:v for k,v in s.items() if k != '_original_id'} for s in batch]
        
        try:
            res = supabase.table('alunos').insert(insert_batch).execute()
            if res.data:
                inserted_count += len(res.data)
                # Map back the names/emails to get the IDs for transactions
                for s_inserted in res.data:
                    for sid, s_orig in students.items():
                        if s_orig['email'] == s_inserted['email']:
                            real_student_mapping[sid] = s_inserted['id']
                            break
        except Exception as e:
             print(f"   Erro na inserção do lote {i}: {e}")
    print(f"✅ {inserted_count} Alunos cadastrados.")

    print("\n📄 Extraindo Recebimentos (Transações pagas)...")
    try:
         with pdfplumber.open(os.path.join(REPORTS_DIR, "Listagem de Recebimentos.pdf")) as pdf:
            for page in pdf.pages:
                lines = page.extract_text().split('\n')
                for line in lines:
                    # Expected format: ID Date Desc... Value Method
                    # E.g.: "123 15/04/2026 Mensalidade... R$ 149,90 Cartão"
                    # Using a very permissive regex to catch names and values
                    match = re.search(r'(\d{2}/\d{2}/\d{4})\s+(.*?)R\$\s*([\d,.]+)\s+(\w+)$', line)
                    if match:
                        date_str = match.group(1)
                        desc_and_name = match.group(2).strip()
                        val_str = match.group(3).replace('.', '').replace(',', '.')
                        method = match.group(4)
                        
                        transactions.append({
                            "id": str(uuid.uuid4()),
                            "tipo": "receita",
                            "descricao": f"Pagamento - {desc_and_name[:20]}",
                            "valor": float(val_str),
                            "data": date_str,
                            "status": "pago",
                            "metodo": method.lower(),
                            "aluno_nome": desc_and_name[:30] # Just keep part of the string
                        })
    except Exception as e:
        print(f"   Erro ao ler arquivo de Recebimentos: {e}")

    print("\n📄 Extraindo Devedores (Transações pendentes)...")
    try:
         with pdfplumber.open(os.path.join(REPORTS_DIR, "Relação de Devedores.pdf")) as pdf:
            for page in pdf.pages:
                lines = page.extract_text().split('\n')
                for line in lines:
                    # Extract date and value near the end of the line
                    match = re.search(r'(\d{2}/\d{2}/\d{4})\s+([\d,.]+)\s*$', line)
                    if match:
                        date_str = match.group(1)
                        val_str = match.group(2).replace('.', '').replace(',', '.')
                        
                        transactions.append({
                            "id": str(uuid.uuid4()),
                            "tipo": "receita",
                            "descricao": "Mensalidade Atrasada",
                            "valor": float(val_str),
                            "data": date_str,
                            "status": "atrasado",
                            "metodo": "pendente",
                            "aluno_nome": "Devedor Não Identificado" # Simplify mapping for debts
                        })
    except Exception as e:
        print(f"   Erro ao ler arquivo de Devedores: {e}")

    print(f"\n💾 Inserindo {len(transactions)} transações no Supabase...")
    inserted_tx = 0
    for i in range(0, len(transactions), batch_size):
        batch = transactions[i:i+batch_size]
        try:
            res = supabase.table('transacoes').insert(batch).execute()
            if res.data:
                inserted_tx += len(res.data)
        except Exception as e:
             print(f"   Erro na inserção de transações do lote {i}: {e}")
    print(f"✅ {inserted_tx} Transações financeiras cadastradas.")

    print("\n🎉 Seeding Concluído com Sucesso!")


if __name__ == "__main__":
    delete_existing_data()
    seed_database()
