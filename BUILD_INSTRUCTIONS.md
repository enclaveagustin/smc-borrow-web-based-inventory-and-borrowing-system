# HulamKo Production Build Guide

This guide explains how to build HulamKo as a standalone Windows executable (.exe) file for production deployment.

## Prerequisites

- Python 3.7 or higher installed on your Windows machine
- Visual C++ build tools (required by some Python packages)
- Internet connection (to download dependencies)

## Installation Steps

### Step 1: Install Python

If you haven't already:
1. Download Python from https://www.python.org/downloads/
2. Run the installer and check **"Add Python to PATH"**
3. Click **Install Now**

### Step 2: Prepare the Build Environment

1. Open Command Prompt or PowerShell
2. Navigate to the HulamKo project folder:
   ```
   cd C:\path\to\HulamKo
   ```

3. Install required dependencies:
   ```
   pip install flask flask-cors pyinstaller
   ```

## Building the Executable

### Option 1: Using the Build Script (Recommended)

Simply run the build script:

```
python build_exe.py
```

The script will:
- Check and install PyInstaller if needed
- Build the executable
- Package it in the `release` folder
- Clean up temporary build files

### Option 2: Manual Build with PyInstaller

If the script doesn't work, you can build manually:

```
pyinstaller --onefile --windowed --name HulamKo --add-data "frontend;frontend" --add-data "database;database" --hidden-import=flask --hidden-import=flask_cors --collect-all=flask launcher.py
```

After building, copy the `dist/HulamKo.exe` file to a folder with the other files:

```
copy dist\HulamKo.exe release\HulamKo.exe
copy README.md release\README.md
copy INSTALLATION.md release\INSTALLATION.md
```

## Running the Executable

### First Run
1. Navigate to the `release` folder
2. Double-click `HulamKo.exe`
3. Your default browser will automatically open with the HulamKo application

### Subsequent Runs
Simply double-click `HulamKo.exe` anytime you want to use the application.

## What's Included in the Executable

The `.exe` file includes:
- **Flask Web Server** - Backend API and static file serving
- **Frontend Application** - HTML, CSS, and JavaScript interface
- **All Frontend Libraries** - Bootstrap, Font Awesome, JsBarcode, Quagga2
- **All Dependencies** - Bundled Python packages (Flask, Flask-CORS, etc.)

## Features in Built Executable

✅ **Barcode Export** - Generate and download barcode images (CODE128)  
✅ **Barcode Scanning** - Built-in scanner support  
✅ **Password Toggle** - Show/hide password on login  
✅ **Course/Year Tracking** - Student information fields  
✅ **Category Filtering** - Filter tools by category  
✅ **Responsive Design** - Works on desktop, tablet, mobile  
✅ **Local Storage** - Data persists in browser  

## Troubleshooting

### "Python was not found"
- Make sure Python is installed and added to PATH
- Try restarting Command Prompt after installing Python

### Application runs on localhost (local network only)
- The built executable runs on `http://localhost:5000`
- Access from the same machine only by default
- To access from other machines, edit launcher.py: change `Host=0.0.0.0` in config

### Backend not accessible
- If you see "Cannot reach localhost:5000"
- Check that the executable is still running (check taskbar)
- The Flask server starts automatically inside the .exe
- Try manually opening browser to: `http://localhost:5000`
- Install PyInstaller: `pip install pyinstaller`
- Make sure you're in the HulamKo project directory

### Executable won't start
- Check that all frontend files are present in the build
- Try running from a folder without spaces in the path
- Check Windows Defender/Antivirus - they may block unsigned executables

### Browser doesn't open automatically
- Manually open your browser and visit `http://localhost:5000`
- Check Windows Firewall settings

## Distribution

To distribute the HulamKo application:

1. Navigate to the `release` folder
2. Copy all files (HulamKo.exe, README.md, INSTALLATION.md)
3. Distribute to end users

Users only need to:
1. Extract the files
2. Double-click `HulamKo.exe`
3. Use the application

## File Sizes

- Typical executable size: 50-60 MB (includes all dependencies)
- Total release package: ~55 MB

## Advanced Build Options

### Reduce File Size

To create a smaller executable, exclude unnecessary files:

```
pyinstaller --onefile --windowed --name HulamKo --optimize=2 launcher.py
```

### Add Application Icon

Create a custom `.ico` file and use:

```
pyinstaller --onefile --windowed --name HulamKo --icon=myicon.ico launcher.py
```

### Create an Installer

To create a professional Windows installer, use NSIS:

1. Download NSIS from http://nsis.sourceforge.net/
2. Create a `.nsi` script
3. Build the installer using NSIS

## Support

If you encounter issues:
1. Check the console output for error messages
2. Ensure all dependencies are installed: `pip list`
3. Try building in a clean directory
4. Check that frontend files are present in the source folder

## Version Information

- HulamKo Version: 2.0
- Build System: PyInstaller 5.x
- Target: Windows 7+
- Recommended: Windows 10 or later
