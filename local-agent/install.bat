@echo off
TITLE Instalador Agente Local - Moviment Academy
echo ====================================================
echo    INSTALADOR AGENTE LOCAL MOVIMENT ACADEMY
echo ====================================================
echo.

:: Verificar se Python existe
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Python nao encontrado! 
    echo Por favor, instale o Python 3.9+ em: https://www.python.org/
    pause
    exit /b
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
