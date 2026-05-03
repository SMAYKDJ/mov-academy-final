import requests
import time
import json
import socket
import sys

# Configurações Iniciais (Carregadas do config.json)
try:
    with open('config.json', 'r') as f:
        config = json.load(f)
except:
    config = {
        "api_url": "https://academiamoviment.vercel.app/api/access/validate",
        "catraca_ip": "192.168.1.100",
        "catraca_port": 4000,
        "token": "mvmt_local_agent_key_123"
    }

def validate_with_cloud(tag_id):
    """Envia o ID lido para a nuvem validar."""
    try:
        print(f"🔍 Validando TAG: {tag_id}...")
        response = requests.post(
            config["api_url"], 
            json={"tag": tag_id},
            headers={"Authorization": f"Bearer {config['token']}"},
            timeout=5
        )
        if response.status_code == 200:
            return response.json()
        return None
    except Exception as e:
        print(f"❌ Erro de conexão com a nuvem: {e}")
        return None

def send_unlock_command():
    """Envia o comando físico de liberação para a catraca via TCP."""
    try:
        # Comando padrão hexadecimal para liberar giro (exemplo Toletus)
        # \x02 = STX, \x01 = Liberar, \x03 = ETX
        cmd = b'\x02\x01\x03' 
        
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.connect((config["catraca_ip"], config["catraca_port"]))
            s.sendall(cmd)
            print("🔓 Comando de liberação enviado!")
            return True
    except Exception as e:
        print(f"⚠️ Erro ao falar com o hardware da catraca: {e}")
        return False

def start_agent():
    print("========================================")
    print("   MOVIMENT ACADEMY - AGENTE LOCAL v1.0 ")
    print("========================================")
    print(f"Conectando em: {config['api_url']}")
    print(f"Hardware em: {config['catraca_ip']}:{config['catraca_port']}")
    
    # Simulação de Loop de Escuta (Em produção, o hardware enviaria dados ativamente)
    print("\n🟢 Agente em execução. Aguardando leituras...")
    
    try:
        while True:
            # Aqui entraria a lógica de 'listen' do socket da catraca
            # Para este exemplo, simularemos uma leitura via input para teste
            tag = input("\n[DEBUG] Simular leitura de TAG/Biometria: ").strip()
            
            if not tag: continue
            
            resultado = validate_with_cloud(tag)
            
            if resultado and resultado.get("status") == "ativo":
                print(f"✅ ACESSO LIBERADO: {resultado.get('aluno', {}).get('nome', 'Aluno')}")
                send_unlock_command()
            else:
                msg = resultado.get("mensagem", "Acesso Negado") if resultado else "Servidor Offline"
                print(f"🛑 BLOQUEADO: {msg}")
                
    except KeyboardInterrupt:
        print("\n👋 Agente finalizado pelo usuário.")
        sys.exit()

if __name__ == "__main__":
    start_agent()
