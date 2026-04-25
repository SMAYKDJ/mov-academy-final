import pdfplumber
import pandas as pd
import os
import re
from datetime import datetime

REPORTS_DIR = "/Users/smaykdornellesuchoacavalcante/Desktop/trabalho do professor andre/RELATORIOS"

def extract_id_name(text):
    # Matches "CODE Name..."
    match = re.match(r'^(\d+)\s+(.*?)\s+(?:\(|-|$)', text)
    if match:
        return match.group(1), match.group(2).strip()
    return None, None

def consolidate():
    students = {} # id -> data

    # 1. Process Alunos (Base)
    print("Processing Listagem de Alunos...")
    with pdfplumber.open(os.path.join(REPORTS_DIR, "Listagem de Alunos.pdf")) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            lines = text.split('\n')
            for line in lines:
                # Basic regex for "CODE Name (PHONE)"
                match = re.search(r'^(\d+)\s+(.*?)\s+\(\d+\)', line)
                if match:
                    sid, name = match.group(1), match.group(2).strip()
                    students[sid] = {'id': sid, 'name': name, 'status': 'ativo'}

    # 2. Process Matrículas (Plans, Dates, Actual Churn Status)
    print("Processing Listagem de Matrículas...")
    with pdfplumber.open(os.path.join(REPORTS_DIR, "Listagem de Matrículas.pdf")) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            lines = text.split('\n')
            for line in lines:
                match = re.search(r'^(\d+)\s+(.*?)\s+(Plano\s+\w+.*?)\s+(\d{2}/\d{2}/\d{4})', line)
                if match:
                    sid = match.group(1)
                    # Normalize Plan
                    raw_plan = match.group(3).strip()
                    plan = 'Mensal'
                    if 'Anual' in raw_plan: plan = 'Anual'
                    elif 'Semestral' in raw_plan: plan = 'Semestral'
                    elif 'Trimestral' in raw_plan: plan = 'Trimestral'
                    elif 'Black' in raw_plan or 'VIP' in raw_plan: plan = 'Black VIP'
                    
                    start_date_str = match.group(4)
                    
                    # Detect status (Inativa/Vencida/Cancelada means Churn)
                    status = 'churn' if any(x in line for x in ['Inativa', 'Vencida', 'Cancelada', 'Pendente']) else 'active'
                    
                    if sid in students:
                        students[sid]['plan'] = plan
                        students[sid]['start_date'] = start_date_str
                        students[sid]['status'] = status
                        
                        # Calculate enrollment months
                        try:
                            start_date = datetime.strptime(start_date_str, "%d/%m/%Y")
                            months = (datetime.now() - start_date).days // 30
                            students[sid]['enrollment_months'] = max(1, months)
                        except:
                            students[sid]['enrollment_months'] = 1

    # 3. Process Devedores (Debts)
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

    # 4. Process Frequency
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
                        # We don't have "days since last visit" directly, so we estimate
                        # If frequency is high, days since last visit is low
                        students[sid]['days_since_last_visit'] = max(1, 30 - int(visits/4)) if visits > 0 else 30

    # Default values for missing data
    for sid in students:
        s = students[sid]
        if 'weekly_frequency' not in s: s['weekly_frequency'] = 0.0
        if 'days_since_last_visit' not in s: s['days_since_last_visit'] = 30
        if 'overdue_payments' not in s: s['overdue_payments'] = 0
        if 'overdue_days' not in s: s['overdue_days'] = 0
        if 'enrollment_months' not in s: s['enrollment_months'] = 1
        if 'age' not in s: s['age'] = 30 # Default
        if 'plan' not in s: s['plan'] = 'Mensal'
        
    df = pd.DataFrame(list(students.values()))
    
    # --- RISK SIMULATION TECHNIQUE ---
    # Since we don't have a 'cancelados' report, we simulate the churn label (target 1)
    # for students who exhibit 'latent churn' behaviors:
    def simulate_target(row):
        # 1. Obvious Churn (Status Vencida/Pendente)
        if row['status'] == 'churn':
            return 1
        
        # 2. Latent Churn: Zero frequency AND Has Debts
        if row['weekly_frequency'] == 0 and row['overdue_payments'] > 0:
            return 1
            
        # 3. High Risk: Very low frequency (< 0.5 visit/week) AND Overdue Days > 30
        if row['weekly_frequency'] < 0.5 and row['overdue_days'] > 30:
            return 1
            
        return 0

    df['target'] = df.apply(simulate_target, axis=1)
    
    # Ensure we have at least some variety (if still all 0, force top 5% risk as 1 for training)
    if df['target'].sum() < 5:
        print("⚠️ Not enough simulated churn samples. Forcing high-risk outliers as churn for training variety.")
        # Sort by (debt days - frequency)
        df = df.sort_values(by=['overdue_days', 'weekly_frequency'], ascending=[False, True])
        df.iloc[:20, df.columns.get_loc('target')] = 1
    
    output_path = os.path.join(REPORTS_DIR, "consolidated_client_data.csv")
    df.to_csv(output_path, index=False)
    print(f"✅ Consolidation with Simulation complete: {len(df)} students.")
    print(f"📊 Target distribution (Simulated): {df['target'].value_counts().to_dict()}")
    return df

if __name__ == "__main__":
    consolidate()
