# 📋 HulamKo — Installation Requirements & Setup Guide

> **SMCTI Equipment & Tools Inventory and Lending Management System**

---

## 📌 Table of Contents

1. [System Requirements](#-system-requirements)
2. [Software Dependencies](#-software-dependencies)
3. [Installation Steps](#-installation-steps)
4. [Running the Application](#-running-the-application)
5. [Default Credentials](#-default-credentials)
6. [Project Structure](#-project-structure)
7. [Configuration & Customization](#-configuration--customization)
8. [Troubleshooting](#-troubleshooting)
9. [Installation Checklist](#-installation-checklist)
10. [Support](#-support)

---

## 💻 System Requirements

### Minimum Hardware

| Component | Requirement |
|-----------|-------------|
| OS | Windows 10/11, macOS 10.15+, or Ubuntu 20.04+ |
| RAM | 4 GB |
| Storage | 500 MB free space |
| Display | 1280×720 minimum |
| Network | Not required (runs locally) |

### Browser Compatibility

| Browser | Minimum Version |
|---------|----------------|
| Google Chrome | 90+ (Recommended) |
| Mozilla Firefox | 88+ |
| Microsoft Edge | 90+ |
| Safari | 14+ |

> **Note:** Google Chrome is recommended for the best experience with barcode scanning and Word document export.

---

## 📦 Software Dependencies

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| **Python** | 3.7 or higher | Backend runtime |
| **pip** | (bundled with Python) | Package manager |

### Python Packages

These are installed automatically by `setup.bat` or manually via `pip install`:

| Package | Purpose |
|---------|---------|
| `flask` | Web server framework |
| `flask-cors` | Cross-Origin Resource Sharing support |
| `openpyxl` | Excel file import/export (.xlsx) |

> All Python dependencies are listed in `backend/requirements.txt`.

### Frontend Libraries (Loaded via CDN — No Installation Needed)

| Library | Version | Purpose |
|---------|---------|---------|
| Bootstrap | 5.3.0 | UI framework & responsive layout |
| Bootstrap Icons | 1.10.5 | Icon library for the interface |
| Font Awesome | 6.4.0 | Additional icons |
| Google Fonts (Poppins, Playfair Display) | — | Typography |
| JsBarcode | 3.11.5 | Barcode generation |
| Quagga2 | 1.7.13 | Barcode scanning via camera |
| QRCode.js | — | QR code generation |
| SheetJS (xlsx) | 0.18.5 | Excel file reading for import |

> An internet connection is needed on **first load** to fetch CDN libraries. After caching, the app works offline.

---

## 🛠 Installation Steps

### Windows (Recommended)

#### Option A — Automated Setup (Easiest)

1. **Install Python 3.7+**
   - Download from [python.org](https://www.python.org/downloads/)
   - **Check** ✅ "Add Python to PATH" during installation

2. **Download or Clone HulamKo**
   ```
   git clone https://github.com/enclaveagustin/HulamKo.git
   ```
   Or download and extract the ZIP file.

3. **Run the Setup Script**
   - Double-click `setup.bat` in the HulamKo folder
   - It will:
     - Create a Python virtual environment (`.venv`)
     - Install all required Python packages
     - Launch the application

4. **Open in Browser**
   - Navigate to: **http://localhost:5000**

#### Option B — Manual Setup

1. **Open Command Prompt** in the HulamKo folder

2. **Create Virtual Environment:**
   ```cmd
   python -m venv .venv
   .venv\Scripts\activate
   ```

3. **Install Dependencies:**
   ```cmd
   pip install -r backend/requirements.txt
   ```

4. **Start the Application:**
   ```cmd
   python launcher.py
   ```

5. **Open in Browser:**
   - Go to **http://localhost:5000**

### macOS

```bash
# 1. Install Python (if not installed)
brew install python3

# 2. Clone the repository
git clone https://github.com/enclaveagustin/HulamKo.git
cd HulamKo

# 3. Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# 4. Install dependencies
pip install -r backend/requirements.txt

# 5. Run the application
python launcher.py
```

Open **http://localhost:5000** in your browser.

### Linux (Ubuntu/Debian)

```bash
# 1. Install Python and pip
sudo apt update
sudo apt install python3 python3-pip python3-venv

# 2. Clone the repository
git clone https://github.com/enclaveagustin/HulamKo.git
cd HulamKo

# 3. Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# 4. Install dependencies
pip install -r backend/requirements.txt

# 5. Run the application
python launcher.py
```

Open **http://localhost:5000** in your browser.

---

## ▶ Running the Application

### Starting the Server

```bash
# With virtual environment activated:
python launcher.py
```

The server starts on **port 5000**. Open your browser to:

**http://localhost:5000**

> The application serves both the frontend and backend from a single Flask server on port 5000.

### Stopping the Server

- Press `Ctrl+C` in the terminal/command prompt window
- Or close the terminal window

---

## 🔐 Default Credentials

### Admin Account

| Field | Value |
|-------|-------|
| Username | `admin` |
| Password | `admin123` |

### Staff Account

| Field | Value |
|-------|-------|
| Username | `staff` |
| Password | `staff123` |

> **Important:** Change default passwords after first login via **User Management** (Admin only).

---

## 📁 Project Structure

```
HulamKo/
├── launcher.py                  # Main application entry point (Flask server)
├── setup.bat                    # Automated Windows setup script
├── setup.py                     # Python package setup
├── build_exe.py                 # Executable builder script
├── create-shortcuts.ps1         # PowerShell shortcut creator
├── README.md                    # Usage guide & feature documentation
├── INSTALLATION_REQUIREMENTS.md # This file
├── BUILD_INSTRUCTIONS.md        # Build/packaging instructions
├── sample_import.xlsx           # Sample Excel file for bulk import (20 items)
├── Inventory Form.jpg           # Reference photo of SMCTI inventory form
│
├── backend/
│   ├── app-simple.py            # Simplified backend (alternative)
│   └── requirements.txt         # Python package dependencies
│
├── frontend/
│   ├── index.html               # Main single-page application
│   ├── css/
│   │   └── style.css            # All application styles
│   └── js/
│       ├── app.js               # Main application logic (~1300 lines)
│       └── db.js                # Database/localStorage utilities
│
└── database/
    └── schema.sql               # MySQL reference schema
```

---

## ⚙ Configuration & Customization

### Port Configuration

The application runs on **port 5000** by default. To change it, edit `launcher.py`:

```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

Change `5000` to your desired port number.

### Tool Categories

The system uses these SMCTI-specific categories:

| Category |
|----------|
| Computer Equipments |
| Equipments |
| Furniture and Fixture |
| Sacred Images and Chapel |

To modify categories, update the `<select>` options in `frontend/index.html` and the category arrays in `frontend/js/app.js`.

### Tool Conditions

| Condition | Description |
|-----------|-------------|
| Good Condition | Tool is fully operational |
| Needs Repair | Tool requires maintenance |
| Lost | Tool is missing/lost |
| Damaged | Tool is broken/damaged |

### Status & Actions (Inventory Report)

**STATUS columns** (checkmark-based):
- Serviceable
- Unserviceable

**ACTIONS columns** (checkmark-based):
- Newly Acquired
- Removed
- Transferred
- Disposed

### Locations

| Location |
|----------|
| Computer Laboratory |
| TLE Room |
| Office |
| Chapel |
| Storage |

### Data Storage

- **Primary storage:** Browser `localStorage` (data persists per browser)
- **Backend storage:** In-memory (resets on server restart; provides sample data on start)
- **Database schema:** `database/schema.sql` is a MySQL reference schema for future database integration

> **Tip:** Use the **Export** features (Word document) to save permanent copies of your inventory reports.

---

## 🔧 Troubleshooting

### Python Not Found

**Problem:** `'python' is not recognized` or `command not found`

**Solution:**
1. Ensure Python 3.7+ is installed
2. Ensure Python is added to your system PATH
3. Try `python3` instead of `python`
4. Reinstall Python and check ✅ "Add Python to PATH"

### Port 5000 Already in Use

**Problem:** `Address already in use` or `Port 5000 is already in use`

**Solution:**
```bash
# Windows — find and kill the process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

Or change the port in `launcher.py`.

### Module Not Found Errors

**Problem:** `ModuleNotFoundError: No module named 'flask'`

**Solution:**
```bash
# Make sure virtual environment is activated
# Windows:
.venv\Scripts\activate

# macOS/Linux:
source .venv/bin/activate

# Then reinstall dependencies
pip install -r backend/requirements.txt
```

### Browser Cache Issues

**Problem:** Old version of the website showing

**Solution:**
- Hard refresh: `Ctrl + Shift + R` (Windows/Linux)
- Or: `Cmd + Shift + R` (macOS)
- Or clear browser cache manually

### Excel Import Fails

**Problem:** Importing an Excel file shows errors or no data

**Solution:**
1. Use the `sample_import.xlsx` file as a template
2. Ensure your Excel file has these columns: `ARTICLE`, `DESCRIPTION`, `QTY`, `UNIT`, `UNIT COST`
3. Optional columns: `PROPERTY NO.`, `LOCATION`, `CONDITION`, `YEAR ACQUIRED`
4. File must be `.xlsx` format (not `.xls` or `.csv`)

### Word Export Issues

**Problem:** Word document doesn't download or format is wrong

**Solution:**
1. Ensure pop-up blocker is not blocking the download
2. Try a different browser (Chrome recommended)
3. Check that report data loaded before clicking Export

### Can't Connect to Server

**Problem:** "Cannot reach localhost:5000"

**Solution:**
1. Check that `launcher.py` is running in a terminal
2. Make sure the terminal window is still open
3. Try: **http://localhost:5000**
4. Check that your firewall isn't blocking port 5000
5. Restart: press `Ctrl+C` and run `python launcher.py` again

---

## ✅ Installation Checklist

Use this checklist to verify your installation:

- [ ] Python 3.7+ installed (`python --version`)
- [ ] HulamKo folder downloaded/cloned
- [ ] Virtual environment created (`.venv` folder exists)
- [ ] Dependencies installed (`pip install -r backend/requirements.txt`)
- [ ] `python launcher.py` runs without errors
- [ ] Browser opens to **http://localhost:5000**
- [ ] Login page appears
- [ ] Can login with `admin` / `admin123`
- [ ] Dashboard shows date/time bar and defective tools section
- [ ] Can add a tool in the Tools section
- [ ] Can import tools from Excel via the Import button
- [ ] Can record a borrowing in the Lending section
- [ ] Can generate an Inventory Report with SMCTI form format
- [ ] Can export report to Word (.docx)
- [ ] User Management section works (Admin only)

---

## 📞 Support

### If Something Goes Wrong

1. **Check browser console:** Press `F12` → click **Console** tab
2. **Read error messages:** They usually indicate the exact problem
3. **Check the terminal:** Look for Python error tracebacks
4. **Verify port:** Make sure nothing else is using port 5000
5. **Restart:** Close everything and run `python launcher.py` again
6. **Clean reinstall:** Delete `.venv`, then run `setup.bat` again

### Useful Commands

```bash
# Check Python version
python --version

# Check installed packages
pip list

# Check if Flask is installed
pip show flask

# Check if port 5000 is in use (Windows)
netstat -ano | findstr :5000
```

---

**HulamKo v2.0 — SMCTI Inventory & Lending Management System**

For usage instructions and feature documentation, see **README.md**.
