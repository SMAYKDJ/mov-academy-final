import pdfplumber
import pandas as pd
import os
import re
from datetime import datetime

REPORTS_DIR = "/Users/smaykdornellesuchoacavalcante/Desktop/trabalho do professor andre/RELATORIOS"

def extract_id_name(text):
    # Corresponde a "CÓDIGO Nome..."
    match = re.match(r'^(\d+)\s+(.*?)\s+(?:\(|-|$)', text)
    if match:
        return match.group(1), match.group(2).strip()
    return None, None

def consolidate():
    students = {} # id -> dados

    # 1. Processar Alunos (Base)
    print("Processing Listagem de Alunos...")
    with pdfplumber.open(os.path.join(REPORTS_DIR, "Listagem de Alunos.pdf")) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            lines = text.split('\n')
            for line in lines:
                # Regex básico para "CÓDIGO Nome (TELEFONE)"
                match = re.search(r'^(\d+)\s+(.*?)\s+\(\d+\)', line)
                if match:
                    sid, name = match.group(1), match.group(2).strip()
                    students[sid] = {'id': sid, 'name': name, 'status': 'ativo'}

    # 2. Processar Matrículas (Planos, Datas, Status de Churn Atual)
    print("Processing Listagem de Matrículas...")
    with pdfplumber.open(os.path.join(REPORTS_DIR, "Listagem de Matrículas.pdf")) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            lines = text.split('\n')
            for line in lines:
                match = re.search(r'^(\d+)\s+(.*?)\s+(Plano\s+\w+.*?)\s+(\d{2}/\d{2}/\d{4})', line)
                if match:
                    sid = match.group(1)
                    # Normalizar Plano
                    raw_plan = match.group(3).strip()
                    plan = 'Mensal'
                    if 'Anual' in raw_plan: plan = 'Anual'
                    elif 'Semestral' in raw_plan: plan = 'Semestral'
                    elif 'Trimestral' in raw_plan: plan = 'Trimestral'
                    elif 'Black' in raw_plan or 'VIP' in raw_plan: plan = 'Black VIP'
                    
                    start_date_str = match.group(4)
                    
                    # Detectar status (Inativa/Vencida/Cancelada significa Churn)
                    status = 'churn' if any(x in line for x in ['Inativa', 'Vencida', 'Cancelada', 'Pendente']) else 'active'
                    
                    if sid in students:
                        students[sid]['plan'] = plan
                        students[sid]['start_date'] = start_date_str
                        students[sid]['status'] = status
                        
                        # Calcular meses de matrícula
                        try:
                            start_date = datetime.strptime(start_date_str, "%d/%m/%Y")
                            months = (datetime.now() - start_date).days // 30
                            students[sid]['enrollment_months'] = max(1, months)
                        except:
                            students[sid]['enrollment_months'] = 1

    # 3. Processar Devedores (Dívidas)
    print("Processing Relação de Devedores...")
    with pdfplumber.open(os.path.join(REPORTS_DIR, "Relação de Devedores.pdf")) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            lines = text.split('\n')
            for line in lines:
                match = re.search(r'^(\d+)\s+(.*?)\s+.*?\s+(\d{2}/\d{2}/\d{4})\s+([\d,.]+)', line)
                if match:
                    sid = match.group(1)
                    since_date_str = match.group(3)
                    if sid in students:
                        students[sid]['overdue_payments'] = 1
                        try:
                            since_date = datetime.strptime(since_date_str, "%d/%m/%Y")
                            days = (datetime.now() - since_date).days
                            students[sid]['overdue_days'] = max(0, days)
                        except:
                            students[sid]['overdue_days'] = 0

    # 4. Processar Frequência
    print("Processing Alunos Mais Frequentes...")
    with pdfplumber.open(os.path.join(REPORTS_DIR, "Alunos Mais Frequentes.pdf")) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            lines = text.split('\n')
            for line in lines:
                match = re.search(r'\s+(\d+)\s+(.*?)\s+.*?(\d+)$', line)
                if match:
                    sid = match.group(1)
                    visits = int(match.group(3))
                    if sid in students:
                        students[sid]['weekly_frequency'] = round(visits / 52, 2)
                        # Não temos "dias desde a última visita" diretamente, então estimamos
                        # Se a frequência for alta, os dias desde a última visita são baixos
                        students[sid]['days_since_last_visit'] = max(1, 30 - int(visits/4)) if visits > 0 else 30

    # Valores padrão para dados ausentes
    for sid in students:
        s = students[sid]
        if 'weekly_frequency' not in s: s['weekly_frequency'] = 0.0
        if 'days_since_last_visit' not in s: s['days_since_last_visit'] = 30
        if 'overdue_payments' not in s: s['overdue_payments'] = 0
        if 'overdue_days' not in s: s['overdue_days'] = 0
        if 'enrollment_months' not in s: s['enrollment_months'] = 1
        if 'age' not in s: s['age'] = 30 # Padrão
        if 'plan' not in s: s['plan'] = 'Mensal'
        
    df = pd.DataFrame(list(students.values()))
    
    # --- TÉCNICA DE SIMULAÇÃO DE RISCO ---
    # Como não temos um relatório de 'cancelados', simulamos o rótulo de churn (alvo 1)
    # para alunos que exibem comportamentos de 'churn latente':
    def simulate_target(row):
        # 1. Churn Óbvio (Status Vencida/Pendente)
        if row['status'] == 'churn':
            return 1
        
        # 2. Churn Latente: Frequência zero E tem dívidas
        if row['weekly_frequency'] == 0 and row['overdue_payments'] > 0:
            return 1
            
        # 3. Risco Alto: Frequência muito baixa (< 0,5 visita/semana) E dias de atraso > 30
        if row['weekly_frequency'] < 0.5 and row['overdue_days'] > 30:
            return 1
            
        return 0

    df['target'] = df.apply(simulate_target, axis=1)
    
    # Garantir que tenhamos pelo menos alguma variedade (se ainda tudo 0, forçar os 5% superiores de risco como 1 para o treinamento)
    if df['target'].sum() < 5:
        print("⚠️ Amostras de churn simuladas insuficientes. Forçando outliers de alto risco como churn para variedade de treinamento.")
        # Ordenar por (dias de dívida - frequência)
        df = df.sort_values(by=['overdue_days', 'weekly_frequency'], ascending=[False, True])
        df.iloc[:20, df.columns.get_loc('target')] = 1
    
    output_path = os.path.join(REPORTS_DIR, "consolidated_client_data.csv")
    df.to_csv(output_path, index=False)
    print(f"✅ Consolidação com Simulação concluída: {len(df)} alunos.")
    print(f"📊 Distribuição de alvo (Simulada): {df['target'].value_counts().to_dict()}")
    return df

if __name__ == "__main__":
    consolidate()
