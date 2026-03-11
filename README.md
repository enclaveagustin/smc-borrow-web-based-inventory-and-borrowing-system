# SMC-Borrow: Web-Based Inventory and Borrowing System

A modern, professional web-based inventory and tool lending management system built for **ST. MARY'S COLLEGE OF TAGUM, INC. (SMCTI)**. Designed to manage equipment tracking, borrower lending, damage reporting, generate official SMCTI inventory reports, and export Word/Excel documents matching the school's official Inventory Form format.

---

## 🔑 Quick Access

**Default Login Credentials:**

```text
Email: admin@smcborrow.com
Password: password123
```

**Quick Start:**

```bash
# Windows — automated setup
setup.bat

# Or run directly with Python
python launcher.py

# Or use the standalone executable
release/SMC-Borrow.exe
```

The application runs at **<http://localhost:5000>** and opens your browser automatically.

---

## ✨ Features Overview

### Dashboard

- **Live Date & Time** display in the header bar
- **5 Stat Cards:** Total Tools, Active Borrowings, Overdue Items, Total Users, Defective/Damaged Count
- **Needs Repair / Damaged / Lost Tools** section with quick view of problematic items
- **Monthly Record Report** — select a month (YYYY-MM) to see counts of Added, Damaged, and Pulled-out tools with detailed breakdown table
- **Top Borrowers by Course** — horizontal bar chart (Chart.js)
- **Student Borrowers Activity** — grouped bar chart with Total Borrowed vs Currently Active, plus detailed table
- **Recent Activity** timeline log showing all system actions

### Tools Management

- Add, edit, delete tools with full details
- **Fields:** Name, Brand, Description, Quantity, Previous Qty, Category, Location, Condition, Year Acquired, Asset Code, Action Since Previous Inventory
- **Specifications:** Dynamic key-value fields (e.g., Processor, RAM, Storage, GPU, Operating System)
- **Tool Image:** Upload/preview images (Base64, 5MB max, JPG/PNG/GIF)
- **Categories:** Computer Equipments, Equipments, Furniture and Fixture, Sacred Images and Chapel
- **Conditions:** Good Condition, Needs Repair, Lost, Damaged
- **Actions:** Newly Acquired, Removed, Transferred, Disposed
- **Search & Filter** by category, location, or text
- **Barcode & QR Code** generation per tool (auto-generated asset codes: `SMC-{prefix}-{number}`)
- **Excel Import** — bulk import tools from `.xlsx` files with column mapping
- **Tool Deletion** — requires reason (Damaged/For Repair/Lost) and remarks; auto-creates damage report

### Borrower / Lending Management

- Record borrowings with borrower name, course, year/grade, student ID, email, reason
- Auto-fill borrow date, 7-day default return
- **Multi-tool support** — "Save & Add More Items" flow; edit existing borrowing to add items
- **Barcode Scanner** — scan tool barcodes via camera for fast lending
- **Student ID Scanner** — scan student ID to auto-detect if borrowing (new) or returning (active)
- **Registered Students** — auto-fill borrower info from previously scanned students
- **Student Barcode** — generate/download CODE128 barcodes for students
- Track active borrowings and overdue items
- Mark items as returned with **two-step return process**: fill condition/remarks, then scan QR to confirm
- **Return by Student ID Scan** — scan to find and return borrowings
- **QR Codes** per transaction — generate, download as PNG, print
- **Overdue Adjustment** — extend return dates for overdue items
- **Overdue Email Notifications** — automated emails via Gmail SMTP with styled HTML template

### Damage Reporting

- File damage reports with tool selection, reporter, type, severity, location, quantity, description
- **Types:** Damaged, For Repair, Lost
- **Severity Levels:** Minor, Moderate, Severe
- **Edit** existing damage reports (all fields)
- **Update Status:** Pending → Under Review → Repaired / Replaced / Removed / Disposed / Transferred
- **Replacement flow:** When status = "Replaced", choose same model (auto-add qty back) or different model (opens Add Tool form)
- **Filter** by search text, damage type, and status
- **Delete** damage reports with confirmation
- **Quantity protection** — prevents double quantity restoration when updating status

### Inventory Reporting (SMCTI Form Format)

- Generate reports filtered by **Office/Unit Location**, Category, Report Period, and Year
- Official SMCTI form fields: SY, Division (Administration/Academic/Finance), Department Level (Higher Ed/Basic Ed), Department Name, Date
- Report table with dual-row header:
  - **STATUS columns:** Good Condition, Needs Repair, Lost, Damage (✓ checkmarks)
  - **ACTIONS columns:** Newly Acquired, Removed, Transferred, Disposed (✓ checkmarks)

### Word Export (.doc)

- Exports inventory report matching the **official SMCTI Inventory Form**
- School header: "ST. MARY'S COLLEGE OF TAGUM, INC." with seal and QTIME badge
- "Office of the Property Custodian" subtitle
- Division and Department Level checkmark fields
- Landscape layout with full inventory table
- Configurable **signatories** (Prepared by, Verified by, Noted by) with separate Name and Title fields

### Excel Export (.xlsx)

- Exports inventory report as a real `.xlsx` file using SheetJS
- SMCTI form format with merged cells, styled headers
- Full inventory data table

### User Management

- Full CRUD for users (Admin, Staff, Teacher roles)
- Edit user details (name, email, username, role)
- Change roles and delete users with confirmation

### Settings

- **User Profile** — view and edit profile info
- **Change Password** — update login password
- **Backup Password** — set password for data export encryption
- **Recovery Email** — configure email for password recovery
- **Data Management** — export full app state as JSON backup, import data
- **About** — system version and information

### Additional Features

- **Forgot Password** — recovery email flow on login page
- **XSS Protection** — all user inputs escaped via `escapeHtml()`
- **Enter-key login** and password visibility toggle
- **Responsive design** — works on mobile, tablet, desktop
- **localStorage persistence** — all data saved in browser
- **Activity logging** — all actions timestamped and tracked
- **Autosave** — periodic save to localStorage
- **Safe ID generation** — `getNextId()` prevents crashes on empty arrays

---

## 📁 Project Structure

```text
smc-borrow-web-based-inventory-and-borrowing-system/
├── .env                          # Environment configuration
├── .env.example                  # Template for .env
├── launcher.py                   # Production Flask launcher (port 5000, auto-opens browser)
├── setup.bat                     # Automated Windows setup & launch script
├── setup.py                      # Python package setup
├── build_exe.py                  # PyInstaller build script for standalone .exe
├── create-shortcuts.ps1          # PowerShell shortcut creator
├── sample_import.xlsx            # Sample Excel file for import (20 items)
├── Inventory Form.jpg            # Reference: official SMCTI form photo
├── SMCTI Logo.png                # School logo
├── README.md                     # This file
├── INSTALLATION_REQUIREMENTS.md  # System requirements & setup guide
├── BUILD_INSTRUCTIONS.md         # Build/packaging instructions
│
├── backend/
│   ├── app-simple.py             # Simplified standalone backend
│   └── requirements.txt          # Python dependencies
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

## 🛠️ Tech Stack

| Component | Technology |
| ----------- | ----------- |
| **Backend** | Python Flask 2.3.3, Flask-CORS 4.0.0 |
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla) |
| **UI Framework** | Bootstrap 5.3.0, Font Awesome 6.4.0 |
| **Fonts** | Poppins, Playfair Display (Google Fonts) |
| **Charts** | Chart.js 4.4.0 |
| **Barcode** | JsBarcode 3.11.5 (CODE128) |
| **QR Code** | QRCode.js 1.0.0 |
| **Scanner** | Quagga2 1.7.13 (barcode + student ID) |
| **Excel** | SheetJS (xlsx 0.18.5) for import & export |
| **Word** | HTML-based .doc export (no external library) |
| **Email** | Gmail SMTP with TLS (overdue notifications) |
| **Data** | Browser localStorage (primary), MySQL schema (reference) |
| **Build** | PyInstaller (standalone .exe) |
| **Environment** | python-dotenv 1.0.0 (.env configuration) |

---

## 🚀 Setup & Installation

### Prerequisites

- Python 3.7+ installed
- pip (Python package manager)

### Option 1: Standalone Executable (No Python Needed)

1. Download `release/SMC-Borrow.exe`
2. Double-click to run — the app opens automatically

### Option 2: Install & Run from Source

```bash

# 1. Clone the repository

git clone https://github.com/enclaveagustin/smc-borrow-web-based-inventory-and-borrowing-system.git
cd smc-borrow-web-based-inventory-and-borrowing-system

# 2. Create virtual environment

python -m venv .venv

# 3. Activate virtual environment

# Windows:

.venv\Scripts\activate

# Mac/Linux:

source .venv/bin/activate

# 4. Install dependencies

pip install -r backend/requirements.txt

# 5. Run the application

python launcher.py
```

The app will open at **<http://localhost:5000>** in your default browser.

### Option 3: Windows Automated Setup

```bash
setup.bat
```

---

## 📊 Excel Import

### How to Import Tools from Excel

1. Go to the **Tools** tab
2. Click **"Import from Excel"** button
3. Select an `.xlsx` file

### Excel File Format

The file must have headers in Row 1. Supported columns:

| Column | Required | Example |
| -------- | ---------- | --------- |
| Name / ARTICLE | Yes | KEYBOARD |
| Brand | No | A4TECH |
| Description | No | USB Wired Keyboard |
| Quantity / QTY | Yes | 20 |
| Previous Qty | No | 18 |
| Category | No | Computer Equipments |
| Location | No | CALL LAB RM. 116 |
| Condition | No | Good Condition |
| Year Acquired | No | 2023 |
| Asset Code | No | SMC-CE-001 |
| Action | No | Newly Acquired |

A **sample file** is included: `sample_import.xlsx` (20 items matching SMCTI CALL LABORATORY data).

---

## 📝 Inventory Report & Export

### Generating a Report

1. Go to the **Settings** tab → **Inventory Report** section
2. Fill in form fields:
   - **School Year (SY)**
   - **Division** — Administration, Academic, or Finance
   - **Department Level** — Higher Education or Basic Education
   - **Department** — Free text
   - **Office/Unit Location** — Filter tools by location
   - **Date, Report Period, Year**
3. Click **"Generate Report"**
4. View the formatted table with STATUS and ACTIONS checkmarks

### Exporting to Word (.doc)

1. After generating a report, fill in **Signatory** fields:
   - Prepared By (Name + Title)
   - Verified By (Name + Title)
   - Noted By (Name + Title)
2. Click **"Export to Word"**
3. Downloads a `.doc` file with:
   - SMCTI school header and seal
   - Division/Department checkmark indicators
   - Full inventory table in landscape layout
   - Signatories with names and titles at the bottom

### Exporting to Excel (.xlsx)

1. After generating a report, click **"Export to Excel"**
2. Downloads a `.xlsx` file with:
   - SMCTI form header with merged cells
   - Styled inventory data table
   - Full report content

---

## 👥 User Roles

| Role | Permissions |
| ------ | ------------ |
| **Admin** | Full access — manage tools, borrowings, users, damage reports, settings, inventory reports |
| **Staff** | View tools, record borrowings, view reports |
| **Teacher** | View tools, record borrowings |

---

## 🔧 Tool Conditions & Actions

### Conditions

| Condition | Description |
| ----------- | ------------- |
| Good Condition | Fully functional |
| Needs Repair | Requires maintenance or fixing |
| Lost | Cannot be located |
| Damaged | Physically broken or non-functional |

### Actions (Since Previous Inventory)

| Action | Description |
| -------- | ------------- |
| Newly Acquired | Recently purchased or received |
| Removed | Taken out of inventory |
| Transferred | Moved to another department/location |
| Disposed | Written off or discarded |

---

## 🆘 Troubleshooting

### Can't Login?

- Use exactly: `admin@smcborrow.com` / `password123`
- No extra spaces in email or password
- Press **Enter** or click **Login** to submit

### Tools Not Saving?

- Data is stored in browser localStorage — persists across refreshes
- If browser cache is cleared, data is lost — use **Settings → Export Data** to backup regularly

### Port 5000 Already in Use?

- Another application may be using port 5000
- Close any other Flask/Python servers
- Or change the port in `.env` (`FLASK_PORT=5001`) or `launcher.py`

### Excel Import Not Working?

- Ensure file is `.xlsx` format (not `.xls` or `.csv`)
- Headers must be in Row 1
- At minimum, "Name" and "Quantity" columns are required
- Check the `sample_import.xlsx` for reference

### Word/Excel Export Not Working?

- Disable pop-up blockers for localhost
- Use Chrome for best compatibility
- Ensure report is generated before clicking Export

### Email Notifications Not Sending?

- Configure `EMAIL_SENDER` and `EMAIL_APP_PASSWORD` in `.env`
- Use a Gmail App Password (not your regular password)
- Check **Settings → Email Status** to verify SMTP connectivity

---

## 🔐 Security Notes

- **Development mode** — uses demo credentials, data in browser localStorage
- For production: change default credentials, use HTTPS, set up a proper database
- XSS protection via `escapeHtml()` on all user inputs
- Safe ID generation with `getNextId()` to prevent crashes on empty arrays
- Backup export is password-protected via configurable backup password
- `.env` file for sensitive configuration (email credentials, secret keys)

---

## 📞 Support

1. Check this README
2. See `INSTALLATION_REQUIREMENTS.md` for system requirements & detailed setup
3. See `BUILD_INSTRUCTIONS.md` for building the standalone `.exe`
4. Open browser console (F12) for error details
5. Check Flask terminal output for backend errors

---

**Version 3.0 — March 2026**  
Built for St. Mary's College of Tagum, Inc. (SMCTI)
