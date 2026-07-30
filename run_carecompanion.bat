@echo off
TITLE CareCompanion Application Launcher
COLOR 0A
echo ===================================================
echo     CareCompanion Healthcare System Launcher
echo ===================================================
echo.

set BASE_DIR=%~dp0
set BACKEND_DIR=%BASE_DIR%carecompanion\backend
set FRONTEND_DIR=%BASE_DIR%carecompanion\frontend

echo [1/3] Checking Python backend environment...
if not exist "%BACKEND_DIR%\venv\Scripts\python.exe" (
    echo Virtual environment not found. Creating Python venv...
    python -m venv "%BACKEND_DIR%\venv"
    "%BACKEND_DIR%\venv\Scripts\python.exe" -m pip install -r "%BACKEND_DIR%\requirements.txt"
)

echo [2/3] Starting CareCompanion FastAPI Backend Server (Port 8000)...
start "CareCompanion Backend Server" cmd /k "cd /d "%BACKEND_DIR%" && ".\venv\Scripts\python.exe" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 >nul

echo [3/3] Starting CareCompanion Frontend Web Interface (Port 8081)...
start "CareCompanion Frontend Web App" cmd /k "cd /d "%FRONTEND_DIR%" && cmd /c npx expo start --web"

timeout /t 4 >nul

echo.
echo ===================================================
echo CareCompanion is running!
echo Backend API: http://127.0.0.1:8000/docs
echo Frontend Web Interface: http://localhost:8081
echo ===================================================
echo.
start http://localhost:8081

pause
