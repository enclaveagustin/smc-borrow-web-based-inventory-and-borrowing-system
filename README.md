# HulamKo - Inventory & Lending Management System

A modern, professional web-based inventory and tool lending management system built for **ST. MARY'S COLLEGE OF TAGUM, INC. (SMCTI)**. Designed to manage equipment tracking, generate official SMCTI inventory reports, and export Word documents matching the school's official Inventory Form format.

---

## 🔑 Quick Access

**Default Login Credentials:**
```
Email: admin@hulamko.com
Password: password123
```

**Quick Start:**
```bash
# Windows
setup.bat

# Or run directly
python launcher.py
```

The application runs at **http://localhost:5000** and opens your browser automatically.

---

## ✨ Features Overview

### Dashboard
- **Live Date & Time** display at the top
- **5 Stat Cards:** Total Tools, Active Borrowings, Overdue Items, Total Users, Defective/Damaged Count
- **Needs Repair / Damaged / Lost Tools** section with quick view of problematic items
- **Recent Activity** log showing all system actions

### Tools Management
- Add, edit, delete tools with full details
- **Fields:** Name, Brand, Description, Quantity, Previous Qty, Category, Location, Condition, Year Acquired, Asset Code, Action Since Previous Inventory
- **Categories:** Computer Equipments, Equipments, Furniture and Fixture, Sacred Images and Chapel
- **Conditions:** Good Condition, Needs Repair, Lost, Damaged
- **Actions:** Newly Acquired, Removed, Transferred, Disposed
- **Search & Filter** by category or text
- **Barcode & QR Code** generation per tool
- **Excel Import** — bulk import tools from `.xlsx` files

### Borrower / Lending Management
- Record borrowings with borrower name, course, year/grade
- Auto-fill borrow date, 7-day default return
- **Scan to Save** — barcode scanner support for fast lending
- Track active borrowings and overdue items
- Mark items as returned (auto-restores quantity)
- **Overdue Adjustment** — extend return dates

### Inventory Reporting (SMCTI Form Format)
- Generate reports filtered by **Office/Unit Location**, Category, Report Period, and Year
- Official SMCTI form fields: SY, Division (Administration/Academic/Finance), Department Level (Higher Ed/Basic Ed), Department Name, Date
- Report table with dual-row header:
  - **STATUS columns:** Good Condition, Needs Repair, Lost, Damage (✓ checkmarks)
  - **ACTIONS columns:** Newly Acquired, Removed, Transferred, Disposed (✓ checkmarks)

### Word Export (.docx)
- Exports inventory report matching the **official SMCTI Inventory Form**
- School header: "ST. MARY'S COLLEGE OF TAGUM, INC." with seal and QTIME badge
- "Office of the Property Custodian" subtitle
- Division and Department Level checkmark fields
- Landscape layout with full inventory table
- Configurable **signatories** (Prepared by, Reviewed by, Noted by) with separate Name and Title fields

### User Management
- Full CRUD for users (Admin, Staff roles)
- Edit user details, change roles
- Delete users with confirmation

### Additional Features
- **XSS Protection** — all user inputs escaped
- **Enter-key login** support
- **Responsive design** — works on mobile, tablet, desktop
- **localStorage persistence** — data saved in browser
- **Activity logging** — all actions tracked

---

## 📁 Project Structure

```
HulamKo/
├── launcher.py              # Flask backend (port 5000)
├── setup.bat                # Windows quick start
├── setup.py                 # Python setup script
├── sample_import.xlsx       # Sample Excel file for import (20 items)
├── Inventory Form.jpg       # Reference: official SMCTI form photo
├── database/
│   └── schema.sql           # MySQL reference schema
├── frontend/
│   ├── index.html           # Main single-page application
│   ├── css/
│   │   └── style.css        # All application styles
│   └── js/
│       ├── app.js           # Application logic (~1300+ lines)
│       └── db.js            # Database utilities
├── backend/
│   ├── app-simple.py        # Alternative simple backend
│   └── requirements.txt     # Python dependencies
└── README.md                # This file
```

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | Python Flask, Flask-CORS |
| **Frontend** | HTML5, CSS3, JavaScript (Vanilla) |
| **UI Framework** | Bootstrap 5.3.0, Font Awesome 6.4.0 |
| **Fonts** | Poppins, Playfair Display (Google Fonts) |
| **Barcode** | JsBarcode 3.11.5 |
| **QR Code** | QRCode.js |
| **Scanner** | Quagga2 1.7.13 |
| **Excel** | SheetJS (xlsx 0.18.5) for import, openpyxl for export |
| **Data** | Browser localStorage (primary), MySQL schema (reference) |

---

## 🚀 Setup & Installation

### Prerequisites
- Python 3.7+ installed
- pip (Python package manager)

### Install & Run

```bash
# 1. Clone the repository
git clone https://github.com/enclaveagustin/HulamKo.git
cd HulamKo

# 2. Create virtual environment
python -m venv .venv

# 3. Activate virtual environment
# Windows:
.venv\Scripts\activate
# Mac/Linux:
source .venv/bin/activate

# 4. Install dependencies
pip install flask flask-cors openpyxl

# 5. Run the application
python launcher.py
```

The app will open at **http://localhost:5000** in your default browser.

### Or Use setup.bat (Windows)
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
|--------|----------|---------|
| Name | Yes | KEYBOARD |
| Brand | No | A4TECH |
| Description | No | USB Wired Keyboard |
| Quantity | Yes | 20 |
| Previous Qty | No | 18 |
| Category | No | Computer Equipments |
| Location | No | CALL LAB RM. 116 |
| Condition | No | Good Condition |
| Year Acquired | No | 2023 |
| Asset Code | No | HK-CE-001 |
| Action | No | Newly Acquired |

A **sample file** is included: `sample_import.xlsx` (20 items matching SMCTI CALL LABORATORY data).

---

## 📝 Inventory Report & Word Export

### Generating a Report

1. Go to the **Inventory Reporting** section
2. Fill in form fields:
   - **School Year (SY)**
   - **Division** — Administration, Academic, or Finance
   - **Department Level** — Higher Education or Basic Education
   - **Department** — Free text
   - **Office/Unit Location** — Filter tools by location
   - **Date, Report Period, Year**
3. Click **"Generate Report"**
4. View the formatted table with STATUS and ACTIONS checkmarks

### Exporting to Word (.docx)

1. After generating a report, fill in **Signatory** fields:
   - Prepared By (Name + Title)
   - Reviewed By (Name + Title)
   - Noted By (Name + Title)
2. Click **"Export to Word"**
3. Downloads a `.docx` file with:
   - SMCTI school header and seal
   - Division/Department checkmark indicators
   - Full inventory table in landscape layout
   - Signatories with names and titles at the bottom

---

## 👥 User Roles

| Role | Permissions |
|------|------------|
| **Admin** | Full access — manage tools, borrowings, users, reports, settings |
| **Staff** | View tools, record borrowings, view reports |

---

## 🔧 Tool Conditions & Actions

### Conditions
| Condition | Description |
|-----------|-------------|
| Good Condition | Fully functional |
| Needs Repair | Requires maintenance or fixing |
| Lost | Cannot be located |
| Damaged | Physically broken or non-functional |

### Actions (Since Previous Inventory)
| Action | Description |
|--------|-------------|
| Newly Acquired | Recently purchased or received |
| Removed | Taken out of inventory |
| Transferred | Moved to another department/location |
| Disposed | Written off or discarded |

---

## 🆘 Troubleshooting

### Can't Login?
- Use exactly: `admin@hulamko.com` / `password123`
- No extra spaces in email or password
- Press **Enter** after typing password to submit

### Tools Not Saving?
- Data is stored in browser localStorage — persists across refreshes
- If browser cache is cleared, data is lost — use Export to backup regularly

### Port 5000 Already in Use?
- Another application may be using port 5000
- Close any other Flask/Python servers
- Or change the port in `launcher.py`

### Excel Import Not Working?
- Ensure file is `.xlsx` format (not `.xls` or `.csv`)
- Headers must be in Row 1
- At minimum, "Name" and "Quantity" columns are required
- Check the `sample_import.xlsx` for reference

---

## 🔐 Security Notes

- **Development mode** — uses demo credentials, data in browser localStorage
- For production: change default credentials, use HTTPS, set up a proper database
- XSS protection via `escapeHtml()` on all user inputs
- Safe ID generation with `getNextId()` to prevent crashes on empty arrays

---

## 📞 Support

1. Check this README
2. See `INSTALLATION_REQUIREMENTS.md` for system requirements
3. See `BUILD_INSTRUCTIONS.md` for building standalone `.exe`
4. Open browser console (F12) for error details

---

**Version 2.0 — February 2026**  
Built for St. Mary's College of Tagum, Inc. (SMCTI)
