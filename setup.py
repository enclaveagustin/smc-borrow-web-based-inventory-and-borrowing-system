#!/usr/bin/env python3
"""
SMC-Borrow - Automated Setup & Launch Script
Sets up the environment and starts both frontend and backend servers
"""

import os
import sys
import subprocess
import time
import platform
import webbrowser
from pathlib import Path

def print_header(text):
    """Print a formatted header"""
    print("\n" + "=" * 40)
    print(f"  {text}")
    print("=" * 40 + "\n")

def check_python():
    """Check if Python is installed"""
    print_header("Checking Python Installation")
    version = sys.version_info
    print(f"✓ Python {version.major}.{version.minor}.{version.micro} found")
    return True

def get_script_dir():
    """Get the directory where this script is located"""
    return str(Path(__file__).parent.absolute())

def create_venv(venv_path):
    """Create virtual environment if it doesn't exist"""
    print_header("Setting Up Virtual Environment")
    
    if os.path.exists(venv_path):
        print("✓ Virtual environment already exists")
        return True
    
    print("Creating virtual environment...")
    try:
        subprocess.check_call([sys.executable, "-m", "venv", venv_path])
        print("✓ Virtual environment created successfully")
        return True
    except subprocess.CalledProcessError:
        print("✗ Failed to create virtual environment")
        return False

def get_pip_executable(venv_path):
    """Get the pip executable for the virtual environment"""
    if platform.system() == "Windows":
        return os.path.join(venv_path, "Scripts", "pip.exe")
    else:
        return os.path.join(venv_path, "bin", "pip")

def install_dependencies(venv_path, req_file):
    """Install Python dependencies"""
    print_header("Installing Dependencies")
    
    if not os.path.exists(req_file):
        print("⚠ requirements.txt not found, skipping...")
        return True
    
    pip_exe = get_pip_executable(venv_path)
    print("Installing backend dependencies...")
    
    try:
        subprocess.check_call([pip_exe, "install", "-r", req_file, "--quiet"])
        print("✓ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError:
        print("⚠ Some dependencies failed (continuing anyway)")
        return True

def get_python_executable(venv_path):
    """Get the Python executable for the virtual environment"""
    if platform.system() == "Windows":
        return os.path.join(venv_path, "Scripts", "python.exe")
    else:
        return os.path.join(venv_path, "bin", "python")

def start_servers(script_dir, venv_path):
    """Start both frontend and backend servers"""
    print_header("Starting Servers")
    
    python_exe = get_python_executable(venv_path)
    frontend_dir = os.path.join(script_dir, "frontend")
    backend_dir = os.path.join(script_dir, "backend")
    
    # Start frontend server
    print("Starting Frontend Server (Port 8080)...")
    frontend_cmd = [python_exe, "-m", "http.server", "8080"]
    
    if platform.system() == "Windows":
        frontend_proc = subprocess.Popen(
            frontend_cmd,
            cwd=frontend_dir,
            creationflags=subprocess.CREATE_NEW_CONSOLE
        )
    else:
        frontend_proc = subprocess.Popen(
            frontend_cmd,
            cwd=frontend_dir,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
    
    time.sleep(2)  # Give frontend time to start
    
    # Start backend server if available
    backend_app = os.path.join(backend_dir, "app-simple.py")
    if os.path.exists(backend_app):
        print("Starting Backend Server (Port 5000)...")
        backend_cmd = [python_exe, "app-simple.py"]
        
        if platform.system() == "Windows":
            backend_proc = subprocess.Popen(
                backend_cmd,
                cwd=backend_dir,
                creationflags=subprocess.CREATE_NEW_CONSOLE
            )
        else:
            backend_proc = subprocess.Popen(
                backend_cmd,
                cwd=backend_dir,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
    
    return True

def open_browser():
    """Open the application in the default browser"""
    print("\nLaunching application in browser...")
    time.sleep(1)
    try:
        webbrowser.open("http://localhost:8080/index.html")
        print("✓ Browser opened")
    except:
        print("⚠ Could not open browser automatically")

def print_completion():
    """Print completion message"""
    print_header("Setup Complete!")
    print("Frontend: http://localhost:8080")
    print("Backend:  http://localhost:5000 (optional)")
    print("\nIf browser didn't open, visit: http://localhost:8080")
    print("\nTo stop servers, close the terminal windows.")

def main():
    """Main setup function"""
    try:
        # Check Python
        check_python()
        
        # Get directories
        script_dir = get_script_dir()
        venv_path = os.path.join(script_dir, ".venv")
        
        # Create virtual environment
        if not create_venv(venv_path):
            sys.exit(1)
        
        # Install dependencies
        req_file = os.path.join(script_dir, "backend", "requirements.txt")
        install_dependencies(venv_path, req_file)
        
        # Start servers
        if not start_servers(script_dir, venv_path):
            sys.exit(1)
        
        # Open browser
        open_browser()
        
        # Print completion
        print_completion()
        
    except KeyboardInterrupt:
        print("\n\nSetup cancelled by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n✗ Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()
