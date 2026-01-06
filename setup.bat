@echo off
REM ============================================
REM HulamKo - Automated Setup & Launch Script
REM ============================================
REM This script sets up the environment and starts both the frontend and backend servers

setlocal enabledelayedexpansion

echo.
echo ===================================
echo    HulamKo Setup & Launch
echo ===================================
echo.

REM Get the directory where this script is located
set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.7 or higher from https://www.python.org
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

echo [1/4] Python found. Version:
python --version
echo.

REM Create virtual environment if it doesn't exist
if not exist ".venv" (
    echo [2/4] Creating virtual environment...
    python -m venv .venv
    if %errorlevel% neq 0 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
    echo Virtual environment created successfully
) else (
    echo [2/4] Virtual environment already exists, skipping creation
)
echo.

REM Activate virtual environment
echo [3/4] Activating virtual environment...
call .venv\Scripts\activate.bat

REM Install dependencies
if exist "backend\requirements.txt" (
    echo.
    echo [4/4] Installing dependencies...
    pip install -r backend\requirements.txt --quiet
    if %errorlevel% neq 0 (
        echo WARNING: Some dependencies failed to install
        echo Continuing anyway...
    )
) else (
    echo WARNING: requirements.txt not found, skipping dependency installation
)

REM Start servers
echo.
echo ===================================
echo       Starting Servers
echo ===================================
echo.
echo Starting Frontend Server (Port 8080)...
echo Starting Backend Server (Port 5000)...
echo.
echo Servers are starting. Please wait...
echo.

REM Start frontend HTTP server in a new window
start "HulamKo Frontend Server" cmd /k cd /d "%SCRIPT_DIR%frontend" ^& python -m http.server 8080

REM Wait a moment for frontend to start
timeout /t 2 /nobreak

REM Start backend server in a new window if requirements were met
if exist "backend\app-simple.py" (
    start "HulamKo Backend Server" cmd /k cd /d "%SCRIPT_DIR%backend" ^& python app-simple.py
)

REM Give servers time to start
timeout /t 3 /nobreak

REM Open the application in default browser
echo.
echo Launching application in your browser...
timeout /t 1 /nobreak

REM Try to open in default browser
start http://localhost:8080/index.html

echo.
echo ===================================
echo       Setup Complete!
echo ===================================
echo.
echo Frontend: http://localhost:8080
echo Backend:  http://localhost:5000 (optional)
echo.
echo If the browser doesn't open automatically:
echo  1. Open http://localhost:8080 in your browser
echo  2. Use the left sidebar to navigate
echo.
echo To stop the servers:
echo  1. Close the "Frontend Server" window
echo  2. Close the "Backend Server" window (if running)
echo.
pause
