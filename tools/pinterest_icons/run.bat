@echo off
chcp 65001 >nul
cd /d "%~dp0"

set VENV_PYTHON=..\parser_app\venv\Scripts\python.exe

if not exist "%VENV_PYTHON%" (
    echo [ERROR] Python not found at %VENV_PYTHON%
    echo Please make sure parser_app\venv exists.
    pause
    exit /b
)

echo Starting Pinterest Icon Parser...
"%VENV_PYTHON%" parser_icons.py

echo.
echo Processing finished. Please check parser.log for details.
echo Press 'Y' to close this window.
choice /C Y /N /M "Exit? [Y] "
