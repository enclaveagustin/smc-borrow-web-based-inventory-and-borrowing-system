# Installation & System Requirements

Complete guide for installing HulamKo and understanding system requirements.

---

## 📋 System Requirements

### Minimum Requirements
- **Operating System:** Windows 7+, macOS 10.12+, Linux (any recent distribution)
- **Python:** 3.7 or higher (3.9+ recommended)
- **Browser:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **RAM:** 512 MB minimum
- **Disk Space:** 100 MB
- **Internet:** Optional (works offline)

### Recommended
- **Python:** 3.9 or higher
- **Browser:** Latest version of Chrome or Firefox
- **RAM:** 2 GB or more
- **SSD:** For faster startup
- **Broadband Internet:** Optional for backend features

### Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full Support |
| Firefox | 88+ | ✅ Full Support |
| Safari | 14+ | ✅ Full Support |
| Edge | 90+ | ✅ Full Support |
| Internet Explorer | Any | ❌ Not Supported |

---

## 📦 Software Dependencies

### Frontend (Automatic - CDN)
- **Bootstrap 5.3.0** - UI Framework
- **Font Awesome 6.4.0** - Icons
- **Poppins Font** - Typography (Google Fonts)
- **QRCode.js** - QR Code generation
- **JsBarcode 3.11.5** - Barcode generation (CODE128 format)
- **Quagga2 1.7.13** - Barcode scanning camera support
- **HTML5** - Page structure
- **CSS3** - Styling
- **JavaScript (ES6+)** - Interactivity

### Backend (Optional - for multi-device access)
- **Flask** - Web framework (2.3.3)
- **Flask-CORS** - Cross-origin request handling (4.0.0)
- **SQLAlchemy** - Database ORM (optional)
- **Flask-MySQL** - MySQL database connector (1.5.2)
- **MySQL Connector** - MySQL client library (8.0.33)
- **PyJWT** - JWT token authentication (2.8.0)
- **Python-dotenv** - Environment variables (1.0.0)

### Development Tools
- **localStorage API** - Browser data storage
- **HTTP Server** - Python built-in

---

## 🚀 Installation

### Windows Quick Start (Easiest)

**Step 1: Check Python Installation**
```
Open Command Prompt and type:
python --version
```

If Python is not found, download from https://www.python.org/downloads/
- Download Python 3.9 or higher
- ✅ Check "Add Python to PATH" during installation
- Click Install

**Step 2: Run Setup Script**
```
1. Navigate to HulamKo folder
2. Double-click "setup.bat"
3. Wait 3-5 seconds
4. Browser opens automatically
```

That's it! The system is running.

### Windows Manual Setup

If `setup.bat` doesn't work, follow these steps:

```batch
REM Open Command Prompt in HulamKo folder

REM Create virtual environment
python -m venv venv

REM Activate virtual environment
venv\Scripts\activate.bat

REM Install dependencies (if using backend)
pip install -r backend\requirements.txt

REM Start frontend server
cd frontend
python -m http.server 8080

REM In another Command Prompt window:
cd backend
python app-simple.py
```

Then open: http://localhost:8080

### macOS Installation

```bash
# Download Python 3.9+
brew install python@3.9

# Create virtual environment
python3 -m venv venv

# Activate
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Create data directory
mkdir -p data

# Run setup
python setup.py
```

### Linux Installation

```bash
# Ubuntu/Debian
sudo apt-get install python3-pip python3-venv

# Create virtual environment
python3 -m venv venv

# Activate
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Create data directory
mkdir -p data

# Run setup
python setup.py
```

---

## ⚙️ Setup Options

### Development Mode (Default)

```
setup.bat
```

**Features:**
- ✅ Auto-reload on code changes
- ✅ Debug mode enabled
- ✅ Console output visible
- ✅ Perfect for development
- ✅ Not for production

### Production Mode

```
setup.bat production
```

**Features:**
- ✅ Optimized settings
- ✅ Debug disabled
- ✅ Secure configuration
- ✅ Better performance
- ✅ Ready to deploy

### Clean Installation

```
setup.bat clean
```

**What it does:**
- Removes virtual environment
- Clears cache directories
- Fresh install on next run

---

## 🔑 Default Credentials

After installation, login with:

```
Email: admin@hulamko.com
Password: password123
```

**⚠️ Important:** Change these in production!

---

## 🌐 Access Points

### Frontend
- **Local Development:** http://localhost:8080
- **Production:** https://your-domain.com

### Backend API (Optional)
- **Local:** http://localhost:5000
- **Production:** https://api.your-domain.com

---

## 📁 Project Structure

```
HulamKo/
├── frontend/
│   ├── index.html           Main interface
│   ├── css/
│   │   └── style.css        Complete styling
│   └── js/
│       ├── app.js           Main application
│       └── db.js            Database utilities
│
├── backend/
│   ├── app-simple.py        Flask server
│   ├── requirements.txt      Python packages
│   └── database/
│       └── schema.sql        Database schema
│
├── database/
│   └── schema.sql           SQL structure
│
├── setup.bat                Windows setup
├── setup.py                 Cross-platform setup
├── requirements.txt         Backend dependencies
├── README.md                How to use
└── INSTALLATION_REQUIREMENTS.md  This file
```

---

## 🔧 Configuration

### Environment Variables

Create `.env` file in root directory:

```env
# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=False
SECRET_KEY=your-secret-key-here

# Database
DATABASE_URL=sqlite:///hulamko.db

# Server
HOST=0.0.0.0
PORT=5000

# Frontend
FRONTEND_URL=http://localhost:8080
```

### Change Default Credentials

Edit `frontend/js/app.js`:

Find these lines (around line 75):
```javascript
const validEmail = 'admin@hulamko.com';
const validPassword = 'password123';
```

Change to your credentials.

---

## 🎨 Customization

### Change Colors

Edit `frontend/css/style.css` (first 20 lines):

```css
:root {
    --primary: #2563eb;      /* Main blue */
    --secondary: #1e40af;    /* Dark blue */
    --success: #10b981;      /* Green */
    --danger: #ef4444;       /* Red */
}
```

### Add New Categories

Edit tool categories in `frontend/index.html`:

Find the select dropdown with:
```html
<option value="Hand Tools">Hand Tools</option>
<option value="Power Tools">Power Tools</option>
```

Add your own:
```html
<option value="Your Category">Your Category</option>
```

### Change Application Name

1. In `frontend/index.html` - Change `<title>` tag
2. In `frontend/js/app.js` - Update any references
3. In CSS - Update logo and styling

---

## 🔒 Security Checklist

### Development (Current)
- ✅ Default credentials provided
- ✅ Works offline
- ✅ Good for testing

### Before Production

- [ ] Change default credentials
- [ ] Set strong SECRET_KEY in `.env`
- [ ] Enable HTTPS/SSL
- [ ] Set up proper database (PostgreSQL recommended)
- [ ] Configure CORS properly
- [ ] Enable authentication API
- [ ] Use environment variables
- [ ] Set debug=False
- [ ] Regular backups
- [ ] Security updates
- [ ] Rate limiting
- [ ] Password hashing

---

## 🐛 Troubleshooting

### Python Not Found

**Error:** "python is not recognized"

**Solution:**
1. Install Python from https://www.python.org
2. ✅ Check "Add Python to PATH"
3. Restart Command Prompt
4. Try again

### Port Already in Use

**Error:** "Address already in use"

**Windows:**
```batch
REM Find what's using port 8080
netstat -ano | findstr :8080

REM Kill the process (replace PID)
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Find what's using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>
```

### Module Not Found

**Error:** "ModuleNotFoundError: No module named 'flask'"

**Solution:**
```bash
# Make sure virtual environment is activated
# Windows: venv\Scripts\activate.bat
# macOS/Linux: source venv/bin/activate

# Reinstall dependencies
pip install -r backend/requirements.txt
```

### Browser Cache Issues

**Problem:** Old version of website showing

**Solution:**
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux)
- Or: `Cmd+Shift+R` (macOS)
- Or clear browser cache manually

### Can't Connect to Server

**Problem:** "Cannot reach localhost:8080"

**Solution:**
1. Check if `setup.bat` is still running
2. Check Command Prompt windows are open
3. Try: http://localhost:8080/index.html
4. Check firewall isn't blocking ports

---

## 📊 Ports Used

| Service | Port | What to Do if Conflict |
|---------|------|------------------------|
| Frontend | 8080 | Edit `setup.bat` -change port |
| Backend | 5000 | Edit backend config |

---

## 💾 Data Backup

### Automatic Backups

In the application:
1. Go to Settings
2. Click Export Data
3. Save CSV file

### Manual Backup

```bash
# Linux/macOS
cp -r frontend backend .

# Windows
xcopy frontend backend . /E
```

### Restore Backup

1. Use Import Data in Settings
2. Select backup CSV file
3. Click Upload
4. Data restored

---

## 🚀 Deployment

### Heroku Deployment

```bash
# Create Heroku app
heroku create your-app-name

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### AWS Deployment

1. Create EC2 instance
2. Install Python and dependencies
3. Upload files
4. Run application
5. Set up RDS database
6. Configure security groups

### Docker Deployment

```dockerfile
FROM python:3.9
WORKDIR /app
COPY . .
RUN pip install -r backend/requirements.txt
CMD ["python", "backend/app-simple.py"]
```

Build and run:
```bash
docker build -t hulamko .
docker run -p 8080:8080 -p 5000:5000 hulamko
```

---

## 📞 Support

### If Something Goes Wrong

1. **Check browser console:** Press F12, click Console tab
2. **Check error messages:** They tell you what's wrong
3. **Check port conflicts:** Maybe another app is using the port
4. **Try restarting:** Close everything and run `setup.bat` again
5. **Try clean installation:** Run `setup.bat clean`

### Check Version

```bash
python --version
```

---

## ✅ Installation Checklist

- [ ] Python 3.7+ installed
- [ ] HulamKo folder extracted
- [ ] `setup.bat` ran successfully
- [ ] Browser opened to http://localhost:8080
- [ ] Can login with credentials
- [ ] Can add a test tool
- [ ] Can record a borrowing
- [ ] Green save notifications appear
- [ ] Forms look properly spaced

---

## 🎉 You're Ready!

If you completed all steps:
1. ✅ System is installed
2. ✅ Ready to use
3. ✅ See README.md for how-to guide

---

**Version 1.0 - January 25, 2026**

For usage instructions, see **README.md**
