@echo off
REM ============================================
REM HulamKo - Automated Setup & Launch Script
REM ============================================
REM This script sets up the environment and starts both the frontend and backend servers
REM Usage: setup.bat [production]

setlocal enabledelayedexpansion

REM Parse command line arguments
set MODE=development
if not "%1"=="" (
    if /i "%1"=="production" set MODE=production
    if /i "%1"=="clean" (
        echo Cleaning up...
        rmdir /s /q .venv 2>nul
        rmdir /s /q frontend\__pycache__ 2>nul
        rmdir /s /q backend\__pycache__ 2>nul
        echo Clean complete. Run setup.bat again to reinstall.
        pause
        exit /b 0
    )
)

echo.
echo ===================================
echo    HulamKo Setup ^& Launch
echo    Mode: %MODE%
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

echo [1/5] Python found. Version:
python --version
echo.

REM Create virtual environment if it doesn't exist
if not exist ".venv" (
    echo [2/5] Creating virtual environment...
    python -m venv .venv
    if %errorlevel% neq 0 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
    echo Virtual environment created successfully
) else (
    echo [2/5] Virtual environment already exists, skipping creation
)
echo.

REM Activate virtual environment
echo [3/5] Activating virtual environment...
call .venv\Scripts\activate.bat
echo.

REM Install dependencies
if exist "backend\requirements.txt" (
    echo [4/5] Installing dependencies...
    pip install -r backend\requirements.txt --quiet
    if %errorlevel% neq 0 (
        echo WARNING: Some dependencies failed to install
        echo Continuing anyway...
    )
) else (
    echo WARNING: requirements.txt not found, skipping dependency installation
)

REM Set environment variables based on mode
if /i "%MODE%"=="production" (
    set FLASK_ENV=production
    set FLASK_DEBUG=False
    set DEBUG=False
    echo [5/5] Configuring for Production mode...
) else (
    set FLASK_ENV=development
    set FLASK_DEBUG=True
    set DEBUG=True
    echo [5/5] Configuring for Development mode...
)
echo.

REM Start servers
echo.
echo ===================================
echo       Starting Servers (%MODE%)
echo ===================================
echo.
echo Starting Frontend Server (Port 8080)...
echo Starting Backend Server (Port 5000)...
echo.
echo Servers are starting. Please wait...
echo.

REM Start frontend HTTP server in a new window
start "HulamKo Frontend Server (%MODE%)" cmd /k cd /d "%SCRIPT_DIR%frontend" ^& python -m http.server 8080

REM Wait a moment for frontend to start
timeout /t 2 /nobreak

REM Start backend server in a new window if requirements were met
if exist "backend\app-simple.py" (
    start "HulamKo Backend Server (%mode%)" cmd /k cd /d "%SCRIPT_DIR%backend" ^& python app-simple.py
)

REM Give servers time to start
timeout /t 3 /nobreak

REM Open the application in default browser
echo.
echo Launching application in your browser...
echo Default Credentials:
echo   Email: admin@hulamko.com
echo   Password: password123
echo.
timeout /t 1 /nobreak

REM Try to open in default browser
start http://localhost:8080/index.html

echo.
echo ===================================
echo       Setup Complete!
echo ===================================
echo.
echo Mode: %MODE%
echo Frontend: http://localhost:8080
echo Backend: http://localhost:5000 (if running)
echo.
echo Press Ctrl+C in any server window to stop
echo.
pause
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
