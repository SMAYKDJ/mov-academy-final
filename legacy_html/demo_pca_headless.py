import numpy as np
import time
from supabase import create_client, Client

# PLAYFITNESS | SIMULADOR DE ACESSO PCA (DEMONSTRAÇÃO)
# Este script simula o processamento matemático do PCA sem precisar de câmera.

SUPABASE_URL = 'https://hnrrwynukzerysxgsvvl.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhucnJ3eW51a3plcnlzeGdzdnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NzIyOTcsImV4cCI6MjA4ODE0ODI5N30.xRt68ccB0QvgzNFIvaefMOExBMhb9GDOEd5MmC7vBHg'

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def simulate_pca_auth():
    print("🚀 INICIANDO SIMULAÇÃO DE MOTOR BIOMÉTRICO (PCA/Eigenfaces)")
    print("----------------------------------------------------------")
    
    # 1. Simular Captura
    print("📸 [1/4] Capturando frame do sensor biométrico...")
    time.sleep(1)
    
    # 2. Simular Pré-processamento
    print("🌓 [2/4] Aplicando Protocolo UFC: Grayscale (100x100) + Equalização Histograma")
    time.sleep(1)
    
    # 3. Simular Projeção no Face Space
    print("🧠 [3/4] Projetando vetor de imagem nos Eigenfaces treinados...")
    fake_weights = np.random.rand(50) # Simula 50 componentes principais
    print(f"📊 Vetor de Pesos (Weights) gerado: {fake_weights[:3]}... (Total 50)")
    time.sleep(1)
    
    # 4. Simular Match no Supabase
    print("🔍 [4/4] Buscando menor Distância Euclidiana no Banco de Dados...")
    
    try:
        # Busca o primeiro aluno com biometria para simular um match bem-sucedido
        res = supabase.table('alunos').select('id, nome_completo').not_.is_('biometria_facial', 'null').limit(1).execute()
        
        if res.data:
            aluno = res.data[0]
            distancia = np.random.uniform(200, 3000)
            print(f"✅ MATCH ENCONTRADO: {aluno['nome_completo']} (ID: {aluno['id']})")
            print(f"📏 Distância Euclidiana: {distancia:.2f} (Threshold: 4500)")
            
            # Registrar Log
            print("📤 Enviando log de acesso ao Dashboard...")
            supabase.table('logs_acesso').insert({
                "aluno_id": aluno['id'],
                "status_acesso": "liberado",
                "metodo": "PYTHON_PCA_SIMULATED",
                "motivo_bloqueio": "Demonstração de Sistema"
            }).execute()
            print("\n✨ ACESSO LIBERADO! Verifique o Dashboard ou a página de Logs Biométricos.")
        else:
            print("❌ Nenhum aluno com biometria facial encontrada no Supabase para demonstrar.")
            
    except Exception as e:
        print(f"❌ Erro na integração: {e}")

if __name__ == "__main__":
    simulate_pca_auth()
