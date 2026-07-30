"""
CareCompanion Executable Launcher.

Launches CareCompanion FastAPI backend and interface.
Can be compiled into CareCompanion.exe via PyInstaller.
"""

import sys
import os
import subprocess
import time
import webbrowser
import threading

def launch_backend():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, "carecompanion", "backend")
    
    python_exe = sys.executable
    venv_python = os.path.join(backend_dir, "venv", "Scripts", "python.exe")
    if os.path.exists(venv_python):
        python_exe = venv_python

    print("[CareCompanion Launcher] Starting FastAPI backend on http://127.0.0.1:8000 ...")
    cmd = [python_exe, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000"]
    subprocess.Popen(cmd, cwd=backend_dir, shell=True)

def launch_frontend():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(base_dir, "carecompanion", "frontend")
    
    print("[CareCompanion Launcher] Starting Frontend interface on http://localhost:8081 ...")
    cmd = ["cmd", "/c", "npx", "expo", "start", "--web"]
    subprocess.Popen(cmd, cwd=frontend_dir, shell=True)

def main():
    print("=" * 60)
    print("           CareCompanion Application Launcher")
    print("=" * 60)
    
    launch_backend()
    time.sleep(3)
    launch_frontend()
    time.sleep(4)
    
    print("\nCareCompanion is now running!")
    print("Backend API: http://127.0.0.1:8000/docs")
    print("Frontend Interface: http://localhost:8081\n")
    
    webbrowser.open("http://localhost:8081")

if __name__ == "__main__":
    main()
