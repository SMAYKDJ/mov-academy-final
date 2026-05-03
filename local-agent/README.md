# 🚪 Moviment Academy - Agente Local v1.0

Este agente é responsável por conectar a catraca física (Toletus Actuar) ao sistema de gestão na nuvem.

## 📋 Requisitos
* Windows 10 ou superior.
* Python 3.9 ou superior instalado (Marque a opção "Add Python to PATH" na instalação).

## 🚀 Instalação Rápida
1. Copie esta pasta para o computador da recepção.
2. Clique duas vezes no arquivo `install.bat`. 
   - Isso criará o ambiente virtual e baixará as dependências.
3. Ao finalizar, será criado o arquivo `Iniciar_Agente.bat`.

## ⚙️ Configuração
Abra o arquivo `config.json` com um editor de texto (Bloco de Notas) e ajuste os campos:
* `api_url`: Link da sua API de validação (Ex: `https://seu-projeto.vercel.app/api/access/validate`).
* `catraca_ip`: O endereço IP fixo da sua catraca na rede local.
* `catraca_port`: A porta de comunicação (Geralmente 4000).

## 🏃 Como Rodar
Basta executar o arquivo `Iniciar_Agente.bat`. Uma tela preta (terminal) abrirá e mostrará as leituras em tempo real.

---
**Suporte:** Smayk Dornelles / Moviment Academy
