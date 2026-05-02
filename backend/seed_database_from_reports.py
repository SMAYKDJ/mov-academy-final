import os
import re
import uuid
import random
from datetime import datetime, timedelta
import pdfplumber
from supabase import create_client
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Erro: SUPABASE_URL e SUPABASE_KEY não configuradas no .env")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
REPORTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "RELATORIOS")

def to_iso_date(date_str):
    """Converte DD/MM/YYYY para YYYY-MM-DD"""
    try:
        return datetime.strptime(date_str, "%d/%m/%Y").strftime("%Y-%m-%d")
    except:
        return None

def delete_existing_data():
    print("🗑️  Deletando dados existentes...")
    try:
        supabase.table('transacoes').delete().neq('id', '0').execute()
        supabase.table('treinos').delete().neq('id', '0').execute()
        supabase.table('alunos').delete().neq('id', -1).execute()
        print("✅ Dados antigos apagados.")
    except Exception as e:
        print(f"⚠️ Erro ao apagar dados: {e}")

def seed_database():
    students = {}
    transactions = []

    # 1. Extrair Alunos
    print("\n📄 Extraindo alunos de 'Listagem de Matrículas.pdf'...")
    try:
        with pdfplumber.open(os.path.join(REPORTS_DIR, "Listagem de Matrículas.pdf")) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                for line in text.split('\n'):
                    match = re.search(r'^(\d+)\s+(.*?)\s+(Plano\s+\w+.*?)\s+(\d{2}/\d{2}/\d{4})', line)
                    if match:
                        sid = match.group(1)
                        name = match.group(2).strip()
                        raw_plan = match.group(3).strip()
                        start_date = match.group(4)
                        
                        plan = 'Mensal'
                        if 'Anual' in raw_plan: plan = 'Anual'
                        elif 'Semestral' in raw_plan: plan = 'Semestral'
                        
                        year = random.randint(1975, 2005)
                        birth_date = f"{year}-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}"

                        students[sid] = {
                            "nome": name,
                            "email": f"{re.sub(r'[^a-z]', '', name.lower().split()[0])}_{sid}@moviment.com",
                            "telefone": f"(91) 9{random.randint(8000, 9999)}-{random.randint(1000, 9999)}",
                            "plano": plan,
                            "status": 'ativo' if 'Ativa' in line else 'inativo',
                            "data_matricula": to_iso_date(start_date),
                            "data_nascimento": birth_date,
                            "frequencia": 0,
                            "risco": 0,
                            "_original_id": sid
                        }
    except Exception as e:
        print(f"❌ Erro em Matrículas: {e}")

    # 2. Extrair Frequências
    print("\n📄 Extraindo frequências...")
    try:
        with pdfplumber.open(os.path.join(REPORTS_DIR, "Alunos Mais Frequentes.pdf")) as pdf:
            for page in pdf.pages:
                for line in page.extract_text().split('\n'):
                    match = re.search(r'\s+(\d+)\s+(.*?)\s+.*?(\d+)$', line)
                    if match:
                        sid, visits = match.group(1), int(match.group(3))
                        if sid in students:
                            # Calcular frequência semanal (total / semanas desde início)
                            start_dt = datetime.strptime(students[sid]['data_matricula'], "%Y-%m-%d")
                            weeks = max((datetime.now() - start_dt).days / 7, 1)
                            students[sid]['frequencia'] = int(visits / weeks)
    except Exception as e:
        print(f"❌ Erro em Frequências: {e}")

    # 3. Adicionar Ryquelme e Smayk manualmente se faltarem
    if not any("Ryquelme" in s['nome'] for s in students.values()):
        students["9999"] = {
            "nome": "Antonio Ryquelme",
            "email": "ryquelme@moviment.com",
            "telefone": "(91) 98888-7777",
            "plano": "Black VIP",
            "status": "ativo",
            "data_matricula": "2024-01-10",
            "data_nascimento": "2002-05-15",
            "frequencia": 4,
            "risco": 5,
            "_original_id": "9999"
        }
    
    if not any("Smayk" in s['nome'] for s in students.values()):
        students["9998"] = {
            "nome": "Smayk Dornelles",
            "email": "smayk@moviment.com",
            "telefone": "(91) 91234-5678",
            "plano": "Platinum",
            "status": "ativo",
            "data_matricula": "2024-02-15",
            "data_nascimento": "2000-08-20",
            "frequencia": 3,
            "risco": 12,
            "_original_id": "9998"
        }

    # 4. Inserir Alunos
    print(f"\n💾 Inserindo {len(students)} alunos...")
    student_records = list(students.values())
    real_mapping = {}
    for i in range(0, len(student_records), 50):
        batch = [{k:v for k,v in s.items() if k != '_original_id'} for s in student_records[i:i+50]]
        res = supabase.table('alunos').insert(batch).execute()
        if res.data:
            for s_ins, s_orig in zip(res.data, student_records[i:i+50]):
                real_mapping[s_orig['_original_id']] = s_ins['id']

    # 5. Extrair Recebimentos (PAGOS)
    print("\n📄 Extraindo Recebimentos...")
    try:
        with pdfplumber.open(os.path.join(REPORTS_DIR, "Listagem de Recebimentos.pdf")) as pdf:
            for page in pdf.pages:
                for line in page.extract_text().split('\n'):
                    # Regex corrigido: Código ID Nome ... DataVenc DataPag Valor ValorPago
                    # Ex: 132939801 983 José Lucas ... 08/04/2026 08/04/2026 1,00 1,00
                    match = re.search(r'(\d+)\s+(\d+)\s+(.*?)\s+.*?(\d{2}/\d{2}/\d{4})\s+(\d{2}/\d{2}/\d{4})\s+([\d,.]+)\s+([\d,.]+)$', line)
                    if match:
                        sid, name, date_str, val_str = match.group(2), match.group(3), match.group(5), match.group(7)
                        transactions.append({
                            "id": str(uuid.uuid4()),
                            "tipo": "receita",
                            "descricao": f"Mensalidade - {name[:20]}",
                            "valor": float(val_str.replace('.', '').replace(',', '.')),
                            "data": to_iso_date(date_str),
                            "status": "pago",
                            "metodo": random.choice(["cartao", "pix", "dinheiro"]),
                            "aluno_id": real_mapping.get(sid),
                            "aluno_nome": name
                        })
    except Exception as e:
        print(f"❌ Erro em Recebimentos: {e}")

    # 6. Extrair Devedores (ATRASADOS)
    print("\n📄 Extraindo Devedores...")
    try:
        with pdfplumber.open(os.path.join(REPORTS_DIR, "Relação de Devedores.pdf")) as pdf:
            for page in pdf.pages:
                for line in page.extract_text().split('\n'):
                    # Código Nome ... Data Valor
                    match = re.search(r'^(\d+)\s+(.*?)\s+.*?(\d{2}/\d{2}/\d{4})\s+([\d,.]+)$', line)
                    if match:
                        sid, name, date_str, val_str = match.group(1), match.group(2), match.group(3), match.group(4)
                        transactions.append({
                            "id": str(uuid.uuid4()),
                            "tipo": "receita",
                            "descricao": "Mensalidade em Atraso",
                            "valor": float(val_str.replace('.', '').replace(',', '.')),
                            "data": to_iso_date(date_str),
                            "status": "atrasado",
                            "metodo": "pendente",
                            "aluno_id": real_mapping.get(sid),
                            "aluno_nome": name
                        })
    except Exception as e:
        print(f"❌ Erro em Devedores: {e}")

    # 7. Inserir Transações
    print(f"\n💾 Inserindo {len(transactions)} transações...")
    for i in range(0, len(transactions), 50):
        supabase.table('transacoes').insert(transactions[i:i+50]).execute()

    print("\n🎉 Processo concluído! Banco de dados consistente.")

if __name__ == "__main__":
    delete_existing_data()
    seed_database()
