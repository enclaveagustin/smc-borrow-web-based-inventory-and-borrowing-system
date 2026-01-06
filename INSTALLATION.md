# HulamKo Installation Guide

## 🚀 Windows (Easiest)

### Method 1: Automatic Setup (Recommended)

1. **Download** HulamKo and extract it
2. **Double-click** `setup.bat`
3. **Wait** for servers to start (2-3 seconds)
4. **Browser** opens automatically to http://localhost:8080

✅ **Done!** Your system is running.

### Method 2: Create Desktop Shortcut

1. **Right-click** `setup.bat`
2. **Select** "Create shortcut"
3. **Move** shortcut to Desktop
4. **Double-click** anytime to start HulamKo

### Method 3: Create Start Menu Shortcut

Open PowerShell in the HulamKo folder and run:

```powershell
powershell -ExecutionPolicy Bypass -File create-shortcuts.ps1
```

Results:
- ✅ Desktop shortcut created
- ✅ Start Menu entry created

---

## 🐍 Linux / Mac

### Step 1: Check Python

```bash
python3 --version
```

Need Python 3.7+? Install from https://www.python.org

### Step 2: Run Setup

```bash
python3 setup.py
```

### Step 3: Open Browser

Visit: http://localhost:8080

---

## 🔧 Manual Setup (All Platforms)

If automatic setup fails:

### 1. Create Virtual Environment

```bash
python -m venv .venv
```

### 2. Activate Virtual Environment

**Windows:**
```bash
.venv\Scripts\activate
```

**Linux/Mac:**
```bash
source .venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r backend/requirements.txt
```

### 4. Start Frontend Server (Terminal 1)

```bash
cd frontend
python -m http.server 8080
```

Expected output:
```
Serving HTTP on 0.0.0.0 port 8080 (http://0.0.0.0:8080/) ...
```

### 5. Start Backend Server (Terminal 2, Optional)

```bash
cd backend
python app-simple.py
```

Expected output:
```
Running on http://0.0.0.0:5000
```

### 6. Open Browser

Navigate to: **http://localhost:8080**

---

## ⚙️ Configuration

All settings in `.env`:

```ini
# Frontend Port
HTTP_SERVER_PORT=8080

# Backend Port
FLASK_PORT=5000

# Application
APP_NAME=HulamKo
```

### Changing Ports

If port 8080 is in use:

1. **Edit** `.env`
2. **Change** `HTTP_SERVER_PORT=8081`
3. **Restart** servers
4. **Visit** http://localhost:8081

---

## 🐛 Troubleshooting

### "Port Already in Use"

```bash
# Windows - Find what's using port 8080
netstat -ano | findstr :8080

# Linux/Mac
lsof -i :8080
```

**Solution**: Use different port in `.env` or stop the other app

### "Python Not Found"

**Solution**:
1. Install Python from https://www.python.org
2. **Important**: Check "Add Python to PATH"
3. Restart terminal/command prompt

### "Module Not Found" Error

**Solution**:
```bash
# Make sure virtual environment is activated
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r backend/requirements.txt
```

### "Virtual Environment Corrupted"

**Solution**:
```bash
# Delete virtual environment
rmdir /s .venv  # Windows
rm -rf .venv    # Linux/Mac

# Run setup again
python setup.py
```

### Browser Shows Blank Page

**Solution**:
1. Clear browser cache: `Ctrl+Shift+Delete`
2. Hard refresh: `Ctrl+F5`
3. Try different browser
4. Check console for errors: Press `F12`

### Can't Connect to Backend

**Solution**:
1. App works without backend (default)
2. If you need backend, ensure it's running on port 5000
3. Edit `frontend/index.html` to enable: `USE_BACKEND = true`

---

## ✅ First Run

When HulamKo opens:

- ✅ Sample tools are loaded
- ✅ Sample users are available
- ✅ No login required
- ✅ Start using immediately
- ✅ Data auto-saved to browser

---

## 💾 Data Storage

**Without Backend** (Default):
- Data saved in browser (automatic)
- Survives browser restart
- Lost only if browser cache is cleared

**With Backend** (Optional):
- Data stored in database
- More secure and scalable
- Enable in `frontend/index.html`

---

## 🔐 Security

### Default Users

The app comes with sample users. To change:

1. Go to **Users** tab
2. Delete default users
3. Add your own users

### Protecting Your Data

- **Without Backend**: Don't clear browser storage!
- **With Backend**: Uses database, more secure

---

## 🚀 Creating Application Shortcut

### Windows Desktop

1. Right-click `setup.bat`
2. Click "Create shortcut"
3. Move to Desktop
4. Now you can double-click Desktop icon to start!

### Windows Start Menu

Run in PowerShell:
```powershell
powershell -ExecutionPolicy Bypass -File create-shortcuts.ps1
```

Then search for "HulamKo" in Start Menu

### Linux/Mac

Add to applications menu by creating `.desktop` file:

```ini
[Desktop Entry]
Name=HulamKo
Exec=python3 /path/to/HulamKo/setup.py
Type=Application
```

---

## ✅ Verify Installation

Test your installation:

```bash
# Python version
python --version

# Can create virtual environment
python -m venv test_venv

# Can access application
# http://localhost:8080 in browser
```

---

## 📱 What Works Without Backend

- ✅ Add/edit/delete tools
- ✅ Record borrowings
- ✅ Track returns
- ✅ Manage users
- ✅ View activity
- ✅ Generate QR codes
- ✅ Search and filter
- ✅ All features!

Backend is **optional** - everything works offline!

---

## 🎯 Next Steps

1. **See Features**: Read `README.md`
2. **Start App**: Double-click `setup.bat` (Windows)
3. **Create Shortcut**: Run `create-shortcuts.ps1` (Windows)
4. **Have Fun**: Start managing inventory!

---

**Installation Complete! Happy managing! 📦**
