import socket
import requests
import time

# --- CONFIGURAÇÃO DA CATRACA TOLETUS ---
# --- CONFIGURAÇÃO DA CONEXÃO ---
CATRACA_IP = "192.168.1.100"  # IP da Catraca na rede local
CATRACA_PORTA = 4000          # Porta padrão Toletus
# Use o IP do seu servidor backend (Ex: Render, Railway ou Local)
SERVIDOR_API = "http://localhost:8000/access/validate" 

# Buffer de comando Toletus Actuar (Liberação de giro 1 sentido)
# Nota: Este buffer varia conforme a versão do firmware SDK Toletus
COMANDO_LIBERAR = b'\x02\x00\x01\x03' 

def escutar_catraca():
    """
    Simula a escuta de eventos da catraca.
    Na prática, você deve configurar a catraca para enviar o ID da Tag/Biometria 
    para o IP deste computador na porta 5000.
    """
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(('0.0.0.0', 5000))
            s.listen()
            print("🚀 Agente Moviment Academy rodando...")
            print("📡 Aguardando interações na catraca Toletus (Porta 5000)...")
            
            while True:
                conn, addr = s.accept()
                with conn:
                    data = conn.recv(1024)
                    if data:
                        tag_id = data.decode('utf-8').strip()
                        print(f"🆔 Tag detectada: {tag_id}")
                        
                        # 1. Validar com a nuvem
                        try:
                            res = requests.post(SERVIDOR_API, json={"tag": tag_id})
                            result = res.json()
                            
                            if result.get("liberar_giro"):
                                print(f"✅ Acesso Liberado para: {result['aluno']['nome']}")
                                # 2. Enviar comando de giro para o hardware
                                with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as cat:
                                    cat.connect((CATRACA_IP, CATRACA_PORTA))
                                    cat.sendall(COMANDO_LIBERAR)
                                    print("⚙️ Comando de giro enviado!")
                            else:
                                print(f"❌ Acesso Negado: {result.get('mensagem')}")
                        
                        except Exception as e:
                            print(f"⚠️ Erro de comunicação com servidor: {e}")
                            # Lógica de contingência (opcional): Liberar acesso se offline?
        
        except KeyboardInterrupt:
            print("\n🛑 Encerrando agente...")
        except Exception as e:
            print(f"🚨 Erro crítico no agente: {e}")
            time.sleep(5)
            escutar_catraca()

if __name__ == "__main__":
    escutar_catraca()
