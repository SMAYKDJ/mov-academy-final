import pandas as pd # Biblioteca para manipulação de tabelas (DataFrames) e análise de dados
import numpy as np # Biblioteca para cálculos matemáticos e operações com matrizes
from sklearn.ensemble import RandomForestClassifier # O modelo de IA: Floresta Aleatória para classificação
from sklearn.preprocessing import LabelEncoder # Ferramenta para converter categorias em texto para números
from sklearn.model_selection import train_test_split, cross_val_score # Ferramentas para dividir dados e validar o modelo
import joblib # Biblioteca para salvar e carregar objetos Python (o modelo treinado)
import json # Biblioteca para manipular arquivos no formato JSON (métricas)
import os # Biblioteca para interagir com o sistema operacional (pastas e arquivos)

# --- DEFINIÇÃO DE PASTAS E CAMINHOS ---
# Pega o diretório onde este script está localizado (pasta 'backend')
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__)) 
# Define a raiz do projeto (uma pasta acima da 'backend')
PROJECT_ROOT = os.path.join(BACKEND_DIR, "..") 
# Caminho completo para o arquivo CSV com os dados reais dos alunos
DATA_PATH = os.path.join(PROJECT_ROOT, "RELATORIOS", "consolidated_client_data.csv")
# Pasta onde salvaremos o cérebro da IA (modelo) após o treino
MODELS_DIR = os.path.join(BACKEND_DIR, "models")

def train():
    """
    Função principal que executa todo o processo de treinamento da Inteligência Artificial.
    """
    print("🚀 Iniciando carregamento dos dados consolidados...")
    
    # Verifica se o arquivo de dados existe. Se não existir, avisa o usuário e para o processo.
    if not os.path.exists(DATA_PATH):
        print(f"❌ Erro Crítico: Arquivo de dados não encontrado em {DATA_PATH}")
        print("Certifique-se de que o arquivo 'consolidated_client_data.csv' está na pasta RELATORIOS.")
        return

    # Lê o arquivo CSV e carrega na memória como um DataFrame (tabela) do Pandas
    df = pd.read_csv(DATA_PATH)
    
    # --- ENGENHARIA DE ATRIBUTOS (FEATURE ENGINEERING) ---
    # Modelos matemáticos não entendem palavras como "Mensal" ou "Anual". 
    # O LabelEncoder transforma cada tipo de plano em um número único (ex: Mensal=0, Anual=1).
    le = LabelEncoder()
    df['plan_encoded'] = le.fit_transform(df['plan'].astype(str))
    
    # Lista de colunas (características) que a IA vai usar para aprender o padrão de desistência
    features = [
        'weekly_frequency',      # Quantas vezes por semana o aluno treina
        'days_since_last_visit', # Há quantos dias ele não aparece na academia
        'overdue_payments',      # Quantas mensalidades ele tem em atraso agora
        'overdue_days',          # Somatória de dias em atraso de todos os pagamentos
        'enrollment_months',     # Há quantos meses ele é aluno da academia
        'age',                   # A idade do aluno
        'plan_encoded'           # O código numérico do plano dele
    ]
    
    # X contém as "perguntas": os dados de comportamento dos alunos
    X = df[features] 
    # y contém as "respostas": 1 se o aluno saiu (churn), 0 se ele continuou ativo
    y = df['target'] 
    
    print(f"📊 Analisando {len(df)} registros de alunos para treinamento...")
    print(f"⚖️ Distribuição de Alvos (0=Ficou, 1=Saiu):\n{y.value_counts(normalize=True)}")
    
    # --- DIVISÃO PARA TESTE ---
    # Separamos 20% dos dados para teste. A IA vai treinar com os outros 80%.
    # O 'random_state=42' garante que o sorteio seja sempre igual se rodarmos de novo.
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # --- CONFIGURAÇÃO E TREINO DO MODELO ---
    # Criamos a 'Floresta Aleatória'. 
    # n_estimators=100: criamos 100 árvores de decisão que votam no resultado final.
    # class_weight='balanced': Ajuste crucial para dar peso aos alunos que saem (minoria nos dados).
    model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
    
    print("🧠 A Inteligência Artificial está estudando os padrões de evasão...")
    # O comando .fit faz a IA aprender a relação entre as Features (X) e o Alvo (y)
    model.fit(X_train, y_train)
    
    # --- AVALIAÇÃO DE PERFORMANCE ---
    # Testa a IA com os 20% que ela não viu no treino e gera uma nota de acerto (Acurácia)
    score = model.score(X_test, y_test)
    
    # Validação Cruzada: Divide os dados em 5 partes e testa o modelo 5 vezes.
    # Isso garante que o modelo funciona bem para qualquer grupo de alunos, não foi sorte.
    cv_scores = cross_val_score(model, X, y, cv=5)
    
    print(f"✅ Nota de Acerto Final (Acurácia): {score:.4f}")
    print(f"✅ Consistência da IA (Média Cross-val): {cv_scores.mean():.4f}")
    
    # --- SALVAMENTO E IMPLANTAÇÃO ---
    # Cria a pasta de modelos se ela não existir no sistema
    os.makedirs(MODELS_DIR, exist_ok=True)
    
    # Salva o modelo treinado (o cérebro) em um arquivo binário durável
    joblib.dump(model, os.path.join(MODELS_DIR, "churn_model.joblib"))
    # Salva o LabelEncoder para podermos converter planos no futuro da mesma forma
    joblib.dump(le, os.path.join(MODELS_DIR, "label_encoder.joblib"))
    
    # Cria um dicionário com os resultados e a data do treinamento
    metrics = {
        "accuracy": score,                   # Nota de acerto
        "cv_mean": cv_scores.mean(),         # Média da consistência
        "cv_std": cv_scores.std(),           # Variação da consistência
        "trained_at": pd.Timestamp.now().isoformat(), # Data e hora exata do treino
        "samples_analyzed": len(df)          # Quantidade de alunos analisados
    }
    
    # Grava as métricas em um arquivo JSON para que o Dashboard possa exibir na tela
    with open(os.path.join(MODELS_DIR, "metrics.json"), "w") as f:
        json.dump(metrics, f, indent=2)
        
    print(f"🚀 Missão Cumprida! O Modelo Real foi implantado em: {MODELS_DIR}")

# Se este arquivo for executado diretamente, chama a função de treino
if __name__ == "__main__":
    train()
