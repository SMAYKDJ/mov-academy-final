@echo off
TITLE Instalador Agente Local - Moviment Academy
echo ====================================================
echo    INSTALADOR AGENTE LOCAL MOVIMENT ACADEMY
echo ====================================================
echo.

:: Verificar se Python existe
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [AVISO] Python nao encontrado!
    echo [INFO] Baixando instalador do Python 3.11 automaticamente...
    :: Usar curl (nativo no Win10+) para baixar o instalador
    curl -L -o python_installer.exe https://www.python.org/ftp/python/3.11.0/python-3.11.0-amd64.exe
    
    echo [INFO] Iniciando instalacao silenciosa... Por favor, aguarde uns instantes.
    start /wait python_installer.exe /quiet InstallAllUsers=1 PrependPath=1 Include_test=0
    
    echo [OK] Python instalado com sucesso!
    del python_installer.exe
    
    :: Atualizar o PATH para a sessao atual
    set "PATH=%PATH%;%ProgramFiles%\Python311\;%ProgramFiles%\Python311\Scripts\"
)

echo [1/3] Criando ambiente virtual (venv)...
python -m venv venv

echo [2/3] Instalando dependencias...
call venv\Scripts\activate
python -m pip install --upgrade pip
pip install requests

echo [3/3] Criando atalho de execucao...
(
echo @echo off
echo cd /d "%%~dp0"
echo call venv\Scripts\activate
echo python agent.py
echo pause
) > Iniciar_Agente.bat

echo.
echo ====================================================
echo    INSTALACAO CONCLUIDA COM SUCESSO!
echo ====================================================
echo.
echo Use o arquivo 'Iniciar_Agente.bat' para rodar o sistema.
echo Certifique-se de configurar o arquivo 'config.json'.
echo.
pause
