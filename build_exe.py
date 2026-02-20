#!/usr/bin/env python3
"""
SMC-Borrow Production Build Script
Builds a standalone .exe file using PyInstaller
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def print_header(text):
    """Print a formatted header"""
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60 + "\n")

def check_pyinstaller():
    """Check if PyInstaller is installed, install if not"""
    print_header("Checking PyInstaller Installation")
    try:
        import PyInstaller
        print("✓ PyInstaller is already installed")
        return True
    except ImportError:
        print("Installing PyInstaller...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "pyinstaller"])
            print("✓ PyInstaller installed successfully")
            return True
        except subprocess.CalledProcessError:
            print("✗ Failed to install PyInstaller")
            return False

def build_exe():
    """Build the .exe file"""
    print_header("Building Executable")
    
    script_dir = Path(__file__).parent.absolute()
    launcher_path = script_dir / "launcher.py"
    dist_dir = script_dir / "dist"
    
    if not launcher_path.exists():
        print(f"✗ Launcher file not found: {launcher_path}")
        return False
    
    # Build the executable
    print("Building executable with PyInstaller...")
    try:
        # Create the PyInstaller command
        cmd = [
            sys.executable,
            "-m",
            "PyInstaller",
            "--onefile",  # Single executable file
            "--windowed",  # No console window
            "--name",
            "SMC-Borrow",
            "--add-data",
            f"{script_dir / 'frontend'}{os.pathsep}frontend",  # Include frontend files
            "--add-data",
            f"{script_dir / 'database'}{os.pathsep}database",  # Include database files
            "--hidden-import=flask",
            "--hidden-import=flask_cors",
            "--hidden-import=werkzeug",
            "--hidden-import=jinja2",
            "--hidden-import=click",
            "--hidden-import=itsdangerous",
            "--hidden-import=markupsafe",
            "--collect-all=flask",
            str(launcher_path)
        ]
        
        # Remove None values
        cmd = [x for x in cmd if x is not None]
        
        subprocess.check_call(cmd, cwd=str(script_dir))
        print("✓ Executable built successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Failed to build executable: {e}")
        return False

def package_distribution():
    """Package the distribution"""
    print_header("Packaging Distribution")
    
    script_dir = Path(__file__).parent.absolute()
    dist_dir = script_dir / "dist"
    release_dir = script_dir / "release"
    
    if not dist_dir.exists():
        print("✗ Distribution directory not found")
        return False
    
    # Create release directory
    if release_dir.exists():
        shutil.rmtree(release_dir)
    release_dir.mkdir(parents=True, exist_ok=True)
    
    # Copy the executable
    exe_file = dist_dir / "SMC-Borrow.exe"
    if exe_file.exists():
        shutil.copy(exe_file, release_dir / "SMC-Borrow.exe")
        print(f"✓ Executable copied to: {release_dir / 'SMC-Borrow.exe'}")
    else:
        print("✗ Executable not found in dist directory")
        return False
    
    # Copy README and installation guide
    for readme_file in ["README.md", "INSTALLATION.md"]:
        readme_path = script_dir / readme_file
        if readme_path.exists():
            shutil.copy(readme_path, release_dir / readme_file)
            print(f"✓ Copied {readme_file}")
    
    return True

def cleanup_build_files():
    """Clean up PyInstaller build files"""
    print_header("Cleaning Up Build Files")
    
    script_dir = Path(__file__).parent.absolute()
    
    # Remove build directory
    build_dir = script_dir / "build"
    if build_dir.exists():
        shutil.rmtree(build_dir)
        print("✓ Removed build directory")
    
    # Remove .spec file (we can keep it if we want)
    spec_file = script_dir / "SMC-Borrow.spec"
    if spec_file.exists():
        spec_file.unlink()
        print("✓ Removed spec file")

def main():
    """Main build process"""
    print("\n" + "=" * 60)
    print("  SMC-Borrow Production Build")
    print("=" * 60)
    
    # Step 1: Check PyInstaller
    if not check_pyinstaller():
        print("\n✗ Failed to install PyInstaller. Please install it manually:")
        print("  pip install pyinstaller")
        return False
    
    # Step 2: Build executable
    if not build_exe():
        print("\n✗ Failed to build executable")
        return False
    
    # Step 3: Package distribution
    if not package_distribution():
        print("\n✗ Failed to package distribution")
        return False
    
    # Step 4: Cleanup
    cleanup_build_files()
    
    print("\n" + "=" * 60)
    print("  BUILD COMPLETE!")
    print("=" * 60)
    print("\nYour executable is ready at: release/SMC-Borrow.exe")
    print("\nTo run the application:")
    print("  1. Navigate to the 'release' folder")
    print("  2. Double-click 'SMC-Borrow.exe'")
    print("  3. Your browser will open with the SMC-Borrow application")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
