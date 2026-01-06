# HulamKo - Inventory & Lending Management System

A modern, clean, and professional web-based inventory and lending management system designed for schools and educational institutions.

## 🚀 Quick Start (Windows)

**Simply double-click `setup.bat` or `setup.exe`** - the system will automatically:
- ✅ Set up the environment
- ✅ Install dependencies
- ✅ Start all servers
- ✅ Open the app in your browser

**That's it!** Visit: http://localhost:8080

## 🐍 Quick Start (Linux/Mac)

```bash
python setup.py
```

Then open http://localhost:8080 in your browser

## ✨ Features

- **Beautiful Dashboard**: Clean blue theme with real-time statistics
- **Tools Management**: Add, edit, delete, track with QR codes
- **Borrowing Tracking**: Record borrowings, track status automatically
- **User Management**: Manage users with different roles
- **Activity Logging**: Automatic tracking of all actions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Offline Support**: Works without backend (data in browser)
- **Optional Backend**: Connect Flask API for database sync

## 📋 Requirements

- Python 3.7+ 
- Modern web browser (Chrome, Firefox, Edge, Safari)
- ~100 MB disk space

## 📁 Project Structure

```
HulamKo/
├── frontend/
│   └── index.html              ⭐ Main application
├── backend/
│   ├── app-simple.py           (Optional API)
│   └── requirements.txt
├── setup.bat                   ⭐ Windows setup (double-click!)
├── setup.py                    (Python setup)
├── .env                        (Configuration)
├── README.md                   (This file)
└── Installation.md             (Detailed guide)
```

## 🎨 Color Theme

Clean, professional **Blue Theme**:
- Primary: #2563eb
- Secondary: #1e40af

## 🔧 Configuration

Edit `.env` file to customize:
- Backend port: Default 5000
- Frontend port: Default 8080
- Database connection (optional)

## 🖥️ Default Users

The app comes with sample users:
- **Admin**: admin@hulam.ko
- **Teacher**: teacher1@hulam.ko

Add more users directly in the app!

## 🌐 Access Points

| Component | URL | Status |
|-----------|-----|--------|
| **Application** | http://localhost:8080 | Always working |
| **Backend API** | http://localhost:5000 | Optional |

## 📖 Using the App

1. **Dashboard**: See overview & recent activity
2. **Tools**: Manage inventory with QR codes
3. **Borrowers**: Track who borrowed what
4. **Users**: Manage system users

Use the **left sidebar** to navigate between sections!

## 🔌 Data Storage

- **Without Backend** (Default):
  - ✅ All features work
  - ✅ Data saved in browser automatically
  - ✅ No database needed

- **With Backend** (Optional):
  - Set `USE_BACKEND = true` in `frontend/index.html`
  - Requires database setup
  - Synchronizes to backend API

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port in use | Change in `setup.bat` or `.env` |
| Python not found | Install from python.org |
| Blank page | Clear browser cache |
| Lost data | Browser storage keeps data - don't clear! |

## 📱 Browser Support

✅ Chrome/Edge 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Mobile browsers

## 📝 Technology Stack

- **Frontend**: HTML5, CSS3, Bootstrap 5.3.0, JavaScript
- **Backend**: Python Flask 2.3.3 (optional)
- **Icons**: Font Awesome 6.4.0
- **QR Codes**: QRCode.js

## 📖 More Help

See `Installation.md` for detailed setup guide.

## 🎯 Version Info

- **Version**: 1.0.0
- **Updated**: January 6, 2026
- **Status**: Production Ready

---

**Happy Inventory Managing! 📦✨**

