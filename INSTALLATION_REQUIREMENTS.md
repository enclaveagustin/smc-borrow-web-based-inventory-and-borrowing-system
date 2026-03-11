# 📋 SMC-Borrow — Installation Requirements & Setup Guide

> **SMCTI Equipment & Tools Web-Based Inventory and Borrowing System**  
> **Version 3.0 — March 2026**

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
| ----------- | ------------- |
| OS | Windows 10/11, macOS 10.15+, or Ubuntu 20.04+ |
| RAM | 4 GB |
| Storage | 500 MB free space |
| Display | 1280×720 minimum |
| Network | Required on first load (CDN libraries); works offline after caching |

### Browser Compatibility

| Browser | Minimum Version |
| --------- | ---------------- |
| Google Chrome | 90+ (Recommended) |
| Mozilla Firefox | 88+ |
| Microsoft Edge | 90+ |
| Safari | 14+ |

> **Note:** Google Chrome is recommended for the best experience with barcode scanning, QR code generation, and Word/Excel document export.

---

## 📦 Software Dependencies

### Required Software

| Software | Version | Purpose |
| ---------- | --------- | --------- |
| **Python** | 3.7 or higher | Backend runtime |
| **pip** | (bundled with Python) | Package manager |

### Python Packages

These are installed automatically by `setup.bat` or manually via `pip install -r backend/requirements.txt`:

| Package | Version | Purpose |
| --------- | --------- | --------- |
| `flask` | 2.3.3 | Web server framework |
| `flask-cors` | 4.0.0 | Cross-Origin Resource Sharing support |
| `flask-mysql` | 1.5.2 | MySQL integration (reference) |
| `mysql-connector-python` | 8.0.33 | MySQL database connector (reference) |
| `PyJWT` | 2.8.0 | JSON Web Token support |
| `python-dotenv` | 1.0.0 | Environment variable loading from `.env` |
| `Werkzeug` | 2.3.7 | WSGI toolkit (Flask dependency) |

> All Python dependencies are listed in `backend/requirements.txt`.

### Frontend Libraries (Loaded via CDN — No Installation Needed)

| Library | Version | Purpose |
| --------- | --------- | --------- |
| Bootstrap CSS & JS | 5.3.0 | UI framework, responsive layout, modals, tabs |
| Font Awesome | 6.4.0 | Icons throughout the interface |
| Google Fonts (Poppins, Playfair Display) | latest | Typography |
| JsBarcode | 3.11.5 | Barcode generation (CODE128) |
| Quagga2 | 1.7.13 | Barcode scanning via camera |
| QRCode.js | 1.0.0 | QR code generation for borrowing transactions |
| SheetJS (xlsx) | 0.18.5 | Excel file reading for import & export |
| Chart.js | 4.4.0 | Dashboard charts (bar charts) |

> An internet connection is needed on **first load** to fetch CDN libraries. After browser caching, the app works offline.

---

## 🛠 Installation Steps

### Windows (Recommended)

#### Option A — Standalone Executable (Easiest)

1. Download `SMC-Borrow.exe` from the `release/` folder
2. (Optional) Copy `.env.example` to `.env` and configure email settings
3. Double-click `SMC-Borrow.exe` — the app opens automatically in your browser

> No Python installation required for the standalone executable.

#### Option B — Automated Setup

1. **Install Python 3.7+**
   - Download from [python.org](https://www.python.org/downloads/)
   - **Check** ✅ "Add Python to PATH" during installation

2. **Download or Clone SMC-Borrow**

   ```bash
   git clone https://github.com/enclaveagustin/smc-borrow-web-based-inventory-and-borrowing-system.git
   ```

   Or download and extract the ZIP file.

3. **Run the Setup Script**
   - Double-click `setup.bat` in the project folder
   - It will:
     - Create a Python virtual environment (`.venv`)
     - Install all required Python packages
     - Launch the Flask backend on port 5000

4. **Open in Browser**
   - Navigate to: **<http://localhost:5000>**

#### Option C — Manual Setup

1. **Open Command Prompt** in the project folder

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
   - The app auto-opens at **<http://localhost:5000>**

### macOS

```bash
# 1. Install Python (if not installed)
brew install python3

# 2. Clone the repository
git clone https://github.com/enclaveagustin/smc-borrow-web-based-inventory-and-borrowing-system.git
cd smc-borrow-web-based-inventory-and-borrowing-system

# 3. Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# 4. Install dependencies
pip install -r backend/requirements.txt

# 5. Run the application
python launcher.py
```

The app auto-opens at **<http://localhost:5000>** in your browser.

### Linux (Ubuntu/Debian)

```bash
# 1. Install Python and pip
sudo apt update
sudo apt install python3 python3-pip python3-venv

# 2. Clone the repository
git clone https://github.com/enclaveagustin/smc-borrow-web-based-inventory-and-borrowing-system.git
cd smc-borrow-web-based-inventory-and-borrowing-system

# 3. Create virtual environment
python3 -m venv .venv
source .venv/bin/activate

# 4. Install dependencies
pip install -r backend/requirements.txt

# 5. Run the application
python launcher.py
```

The app auto-opens at **<http://localhost:5000>** in your browser.

---

## ▶ Running the Application

### Starting the Server

```bash
# With virtual environment activated:
python launcher.py
```

The server starts on **port 5000** and auto-opens your default browser to:

**<http://localhost:5000>**

> The application serves both the frontend and backend from a single Flask server on port 5000. `launcher.py` is the recommended entry point.

### Using the Standalone Executable

Double-click `release/SMC-Borrow.exe` — no Python or terminal needed. The app bundles everything and auto-opens in your browser.

### Stopping the Server

- Press `Ctrl+C` in the terminal/command prompt window
- Or close the terminal window

---

## 🔐 Default Credentials

### Demo Account (Login Page)

| Field | Value |
| ------- | ------- |
| Email | `admin@smcborrow.com` |
| Password | `password123` |

### Pre-seeded Users (Backend)

| Email | Role |
| ------- | ------ |
| `admin@smcborrow.com` | Admin |
| `teacher1@smcborrow.com` | Teacher |

> **Important:** Change default passwords after first login via **Settings → Password**.

---

## 📁 Project Structure

```text
smc-borrow-web-based-inventory-and-borrowing-system/
├── .env                          # Environment configuration
├── .env.example                  # Template for .env
├── launcher.py                   # Main application entry point (Flask server, port 5000)
├── setup.bat                     # Automated Windows setup & launch script
├── setup.py                      # Python package setup
├── build_exe.py                  # PyInstaller build script for standalone .exe
├── create-shortcuts.ps1          # PowerShell shortcut creator
├── README.md                     # Usage guide & feature documentation
├── INSTALLATION_REQUIREMENTS.md  # This file
├── BUILD_INSTRUCTIONS.md         # Build/packaging instructions
├── sample_import.xlsx            # Sample Excel file for bulk import (20 items)
├── Inventory Form.jpg            # Reference photo of SMCTI inventory form
├── SMCTI Logo.png                # School logo
│
├── backend/
│   ├── app-simple.py             # Simplified standalone backend
│   └── requirements.txt          # Python package dependencies
│
├── frontend/
│   ├── index.html                # Main single-page application
│   ├── SMCTI Logo.png            # School logo (frontend copy)
│   ├── css/
│   │   └── style.css             # All application styles
│   └── js/
│       ├── app.js                # Main application logic (~3150 lines)
│       └── db.js                 # Database/localStorage utilities
│
├── database/
│   └── schema.sql                # MySQL reference schema
│
└── release/
    ├── .env.example              # Environment template for release
    ├── README.md                 # Release usage guide
    └── SMC-Borrow.exe            # Standalone Windows executable
```

---

## ⚙ Configuration & Customization

### Port Configuration

The application runs on **port 5000** by default. To change it, edit the `.env` file:

```ini
FLASK_PORT=5000
```

Or edit `launcher.py` directly:

```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

### Environment Variables (.env)

| Variable | Default | Purpose |
| ---------- | --------- | --------- |
| `FLASK_PORT` | `5000` | Server port |
| `FLASK_HOST` | `0.0.0.0` | Server host |
| `FLASK_ENV` | `development` | Environment mode |
| `SECRET_KEY` | *(set in .env)* | Flask secret key |
| `EMAIL_SENDER` | *(optional)* | Gmail address for overdue notifications |
| `EMAIL_APP_PASSWORD` | *(optional)* | Gmail App Password for SMTP |
| `EMAIL_SMTP_HOST` | `smtp.gmail.com` | SMTP server |
| `EMAIL_SMTP_PORT` | `587` | SMTP port (TLS) |

> Copy `.env.example` to `.env` and fill in your values. Email settings are optional — the system works without them.

### Tool Categories

The system uses these SMCTI-specific categories:

| Category |
| ---------- |
| Computer Equipments |
| Equipments |
| Furniture and Fixture |
| Sacred Images and Chapel |

To modify categories, update the `<select>` options in `frontend/index.html` and the category arrays in `frontend/js/app.js`.

### Tool Conditions

| Condition | Description |
| ----------- | ------------- |
| Good Condition | Tool is fully operational |
| Needs Repair | Tool requires maintenance |
| Lost | Tool is missing/lost |
| Damaged | Tool is broken/damaged |

### Damage Report Types & Statuses

**Types:**

- Damaged
- For Repair
- Lost

**Severity Levels:** Minor, Moderate, Severe

**Statuses:** Pending, Under Review, Repaired, Replaced, Removed, Disposed, Transferred

### Inventory Report — Status & Actions

**STATUS columns** (checkmark-based):

- Serviceable
- Unserviceable

**ACTIONS columns** (checkmark-based):

- Newly Acquired
- Removed
- Transferred
- Disposed

### Data Storage

- **Primary storage:** Browser `localStorage` (data persists per browser)
- **Backend storage:** In-memory (pre-seeded with sample data on start)
- **Database schema:** `database/schema.sql` is a MySQL reference schema for future database integration

> **Tip:** Use the **Export** features (Word/Excel documents) to save permanent copies of your inventory reports. Use **Backup/Export Data** in Settings to save full JSON backups.

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
2. Ensure your Excel file has headers in Row 1
3. Required columns: `Name` (or `ARTICLE`) and `Quantity` (or `QTY`)
4. Optional columns: `Brand`, `Description`, `Category`, `Location`, `Condition`, `Year Acquired`, `Asset Code`, `Previous Qty`, `Action`
5. File must be `.xlsx` format (not `.xls` or `.csv`)

### Word/Excel Export Issues

**Problem:** Document doesn't download or format is wrong

**Solution:**

1. Ensure pop-up blocker is not blocking the download
2. Try a different browser (Chrome recommended)
3. Check that the report has been generated before clicking Export
4. Word export creates an HTML-based `.doc` file — open with Microsoft Word for best formatting

### Can't Connect to Server

**Problem:** "Cannot reach localhost:5000"

**Solution:**

1. Check that `launcher.py` is running in a terminal
2. Make sure the terminal window is still open
3. Try: **<http://localhost:5000>**
4. Check that your firewall isn't blocking port 5000
5. Restart: press `Ctrl+C` and run `python launcher.py` again

---

## ✅ Installation Checklist

Use this checklist to verify your installation:

- [ ] Python 3.7+ installed (`python --version`)
- [ ] Project folder downloaded/cloned
- [ ] Virtual environment created (`.venv` folder exists)
- [ ] Dependencies installed (`pip install -r backend/requirements.txt`)
- [ ] `python launcher.py` runs without errors
- [ ] Browser opens to **<http://localhost:5000>**
- [ ] Login page appears with demo credentials shown
- [ ] Can login with `admin@smcborrow.com` / `password123`
- [ ] Dashboard shows live date/time, stat cards, and charts
- [ ] Can add a tool in the Tools tab
- [ ] Can import tools from Excel via the Import button
- [ ] Can record a borrowing in the Borrowers tab
- [ ] Can scan barcodes / student ID for fast lending
- [ ] Can file a Damage Report
- [ ] Can generate an Inventory Report with SMCTI form format
- [ ] Can export report to Word (.doc) and Excel (.xlsx)
- [ ] User Management section works (Admin only)
- [ ] Settings section loads (profile, backup, about)

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

### SMC-Borrow v3.0 — SMCTI Web-Based Inventory and Borrowing System

For usage instructions and feature documentation, see **README.md**.  
For building the standalone executable, see **BUILD_INSTRUCTIONS.md**.
