# HulamKo - Inventory & Lending Management System

A modern, professional web-based system for managing inventory and tracking tool loans. Perfect for schools, organizations, and institutions.

---

## 🔑 Quick Access

**Default Login Credentials:**
```
Email: admin@hulamko.com
Password: password123
```

**Quick Start:**
```bash
setup.bat              # Start the system
setup.bat production   # Production mode
```

---

## 📖 How to Use This System

### Getting Started (5 minutes)

1. **Open the Application**
   - Run `setup.bat` (Windows)
   - Or run `python setup.py` (Mac/Linux)
   - Browser opens automatically to `http://localhost:8080`

2. **Login**
   - Email: `admin@hulamko.com`
   - Password: `password123`
   - **Password Visibility:** Click the eye icon (👁️) next to password field to show/hide text
   - Click "Sign In"

3. **Explore Dashboard**
   - See statistics at top (Total Tools, Active Borrowings, Overdue Items, Total Users)
   - View Recent Activity below
   - Click menu items in sidebar to navigate

---

## ✨ New Features (Latest Version)

### Barcode Export & Printing
- **Export barcodes as images** (CODE128 format)
- Download high-quality PNG files
- Print and stick on tools for fast scanning
- Includes tool name, ID, and details

### Password Visibility Toggle
- **Eye icon** (👁️) inside password field on login
- Toggle to show/hide password text
- Positioned inside the input for easy access

### Student Information Fields
- **Course:** Add student's academic program (BS CS, BS Engineering, etc.)
- **Year/Grade:** Track academic level (1st-4th Year, Grade 11-12)
- Searchable and filterable by course/year
- Perfect for school and educational institutions

### Advanced Category Filtering
- **Filter tools by category** in the Tools tab
- Shows only tools in selected category
- Options: Hand Tools, Power Tools, Electronics, Safety Equipment, Other
- Speeds up tool location

---

## 🔨 Adding Tools (Inventory)

### Add Your First Tool

1. **Go to Tools Tab**
   - Click "Tools" in the left sidebar
   - See all existing tools listed

2. **Click "+ Add New Tool" Button**
   - Blue button at the top right
   - Modal dialog opens

3. **Fill in Tool Details**
   - **Tool Name** ⭐ Required: "Screwdriver Set"
   - **Brand** (Optional): "Stanley"
   - **Quantity** ⭐ Required: "5"
   - **Category** (Optional): "Hand Tools"
   - **Description** (Optional): "Various sizes, well maintained"

4. **Click "Save Tool"**
   - ✅ Green notification confirms
   - Tool appears in the list immediately

### Filter Tools by Category

1. **Go to Tools Tab**
2. **Select category from dropdown** at top of list
   - **Hand Tools** - Hammers, screwdrivers, wrenches
   - **Power Tools** - Drills, saws, grinders
   - **Electronics** - Multimeters, test equipment
   - **Safety Equipment** - Goggles, gloves, harnesses
   - **Other** - Miscellaneous items
3. **List updates instantly** showing only selected category
4. **All tools** appears by default in dropdown

### Edit an Existing Tool

1. Find the tool in the list
2. Click the **pencil icon** (Edit)
3. Change any field
4. Click "Update Tool"

### Delete a Tool

1. Find the tool in the list
2. Click the **trash icon** (Delete)
3. Confirm deletion
4. Tool is removed

### Search for Tools

1. Go to Tools tab
2. Type in search box at top
3. Results filter automatically

### Generate Barcode (Export as Image)

1. Find tool in list
2. Click **barcode icon** (right side of tool row)
3. **PNG barcode image downloads**
4. Contains:
   - CODE128 barcode (tool ID)
   - Tool name and details
   - Ready to print and stick on tool
5. High quality 600x400px image

### Legacy QR Code (Alternative)

1. Find tool in list
2. Click **QR code icon** (if available)
3. QR code appears in popup
4. Print or save the image
5. Stick on physical tool for camera scanning

**Note:** Barcode (CODE128) is faster than QR codes for manual scanning with barcode scanners.

---

## 👥 Recording Borrowings (Loans)

### Quick Scan to Borrow (New Feature)

The fastest way to record a borrowing is using the barcode scanner!

1. **Go to Borrowers Tab**
   - Click "Borrowers" in sidebar

2. **Click "Scan to Save" Button**
   - Blue button at top right
   - Scanner section opens inline

3. **Scan or Enter Tool Barcode**
   - Use a barcode scanner device, OR
   - Type the tool ID/barcode and press Enter
   - System finds the tool automatically

4. **Tool Details Appear**
   - Tool name, brand, category, and quantity shown
   - Inline form pre-fills with:
     - Tool selected ✓
     - Borrow date (today) ✓
     - Return date (7 days from today) ✓

5. **Enter Borrower Details**
   - **Borrower Name** ⭐ Required: Borrower's full name
   - **Course** (Optional): Academic program they're enrolled in
     - Options: BS Computer Science, BS Engineering, Senior High, etc.
   - **Year/Grade** (Optional): Academic year
     - Options: 1st Year, 2nd Year, 3rd Year, 4th Year, Grade 11, Grade 12
   - Tool, date, and reason auto-filled from scan
   - Can edit dates if needed (change from 7-day default)

6. **Click "Record Borrowing"**
   - ✅ Loan recorded instantly
   - Tool quantity decreases automatically
   - Scanning ready for next loan!

### Manual Recording (Traditional Method)

If you don't have a barcode scanner:

1. **Go to Borrowers Tab**
   - Click "Borrowers" in sidebar

2. **Click "+ Record Borrowing"** Button
   - Opens borrowing form

3. **Fill in Borrowing Details**
   - **Borrower Name** ⭐ Required: "John Smith"
   - **Course** (Optional): Select academic program
   - **Year/Grade** (Optional): Select academic year/grade
   - **Tool** ⭐ Required: Select from dropdown
   - **Borrow Date** ⭐ Required: Today's date (auto-filled)
   - **Return Date** ⭐ Required: When to return
   - **Reason** (Optional): Why they need it

4. **Click "Record Borrowing"**
   - ✅ Green notification confirms
   - Appears in Active Borrowings list
   - Tool quantity decreases automatically

### When Tool is Returned

1. **Go to Borrowers Tab**
2. **Find the Active Borrowing**
3. **Click "Mark as Returned"**
4. ✅ Moves to Returned Items section
5. Tool quantity increases automatically

### Check for Overdue Items

1. **Go to Borrowers Tab**
2. **Look for red "OVERDUE" badge**
3. **Contact borrower to return**
4. **When returned, mark as returned**

---

## 👤 Managing Users

### Add a New User

1. **Go to Users Tab**
   - Click "Users" in sidebar

2. **Click "+ Add New User"**
   - Blue button at top right

3. **Fill in User Details**
   - **Full Name** ⭐ Required: "Jane Doe"
   - **Email** ⭐ Required: "jane@example.com"
   - **Role** ⭐ Required: Select role

4. **Click "Save User"**
   - ✅ User created
   - User can now login

### User Roles

**Admin** - Full access
- Access all features
- Manage users
- System settings

**Teacher** - Limited access
- View tools
- Record borrowings
- View reports

**Assistant** - View only
- View tools and borrowings
- Cannot edit or delete

### Edit or Delete User

1. Find user in list
2. Click edit icon (pencil) or delete icon (trash)
3. Confirm changes

---

## ⚙️ Settings & Data

### Export Your Data (Backup)

1. **Go to Settings Tab**
2. **Click "Export Data"**
3. **Select what to export:**
   - All Tools
   - All Borrowings
   - All Users
4. **Click Download**
5. Save CSV file to safe location

### Import Data (Restore)

1. **Go to Settings Tab**
2. **Click "Import Data"**
3. **Select CSV file** from your computer
4. **Click Upload**
5. ✅ Data restored to system

### Change Password

1. **Go to Settings Tab**
2. **Click "Change Password"**
3. Enter current password
4. Enter new password
5. **Click "Update"**

### Logout

1. **Click "Logout"** in sidebar footer
2. You're logged out
3. Login page appears

---

## 📊 Dashboard Overview

### Top Statistics Cards

| Card | Shows | What it Means |
|------|-------|---------------|
| **Total Tools** | 12 | 12 tools in inventory |
| **Active Borrowings** | 5 | 5 tools currently loaned out |
| **Overdue Items** | 2 | 2 tools past due date (needs action) |
| **Total Users** | 3 | 3 users in system |

### Recent Activity

Shows latest actions in the system:
- Tools added
- Tools deleted
- Items borrowed
- Items returned
- Users created

---

## 📱 Mobile Usage

The system works great on phones and tablets!

**Mobile Tips:**
- ✅ All features work on mobile
- ✅ Tap buttons are large enough
- ✅ Forms adapt to screen size
- ✅ QR codes easy to scan with phone camera
- ✅ Works offline, syncs online

**Smartphone:**
- Use landscape mode for forms
- Easier to read and type

**Tablet:**
- Better layout for larger screen
- More comfortable for extended use

---

## 🎯 Common Tasks

### Find a Tool Quickly

```
1. Go to Tools tab
2. Use search box (type "screwdriver")
3. List filters immediately
4. Results show only matches
```

### Track Who Has Your Tools

```
1. Go to Borrowers tab
2. See Active Borrowings section
3. Shows who has what
4. See due dates
```

### Prepare for Inventory Check

```
1. Go to Tools tab
2. See all tools with quantities
3. Print list (Ctrl+P)
4. Check off what you find
5. Update quantities in system
```

### Monitor Overdue Items

```
1. Go to Borrowers tab
2. Look for red "OVERDUE" badge
3. Click to contact borrower
4. Mark as returned when back
```

---

## 💾 Data Storage

### How Data is Stored

- **Default:** Stored in your browser (localStorage)
- **With Backend:** Stored in database for multi-device access
- **Backups:** Use Export function to backup

### Keep Regular Backups

1. **Monthly backups:**
   - Go to Settings
   - Click Export Data
   - Save file to external drive

2. **Before major changes:**
   - Always backup first
   - Keep 3 months of history

3. **To restore:**
   - Go to Settings
   - Click Import Data
   - Select backup file

---

## 🆘 Troubleshooting

### Can't Login?

**Problem:** Wrong email or password
- **Solution:** Use exactly: `admin@hulamko.com` / `password123`
- **Check:** No extra spaces in email or password

**Problem:** Forgot your custom password
- **Solution:** Click "Forgot Password?" on login page
- **Receive:** Reset link via email (if configured)

### Tools Not Saving?

**Problem:** Page was closed or refreshed
- **Solution:** Your data is in browser cache - still there
- **Check:** Hard refresh page (Ctrl+Shift+R)

**Problem:** Browser cache cleared
- **Solution:** Restore from backup file using Import Data

### Can't Add Tool?

**Problem:** "Tool Name" field is empty
- **Solution:** Required fields have ⭐ mark
- **Remember:** Tool Name and Quantity are required

**Problem:** Getting error message
- **Solution:** Check browser console (Press F12)
- **Share:** Error message with support

### Slow Performance?

**Problem:** Too many records in system
- **Solution:** Archive old borrowings
- **Solution:** Export and clear past data
- **Solution:** Use backend database for better performance

---

## 🔐 Security Notes

### Development Mode (Current)
- ✅ Uses demo credentials
- ✅ Data in browser
- ✅ Good for testing
- ✅ Not for production data

### For Production Use
- ❌ Change default credentials immediately
- ✅ Use HTTPS/SSL encryption
- ✅ Set up proper database
- ✅ Use strong passwords
- ✅ Regular security updates
- ✅ Backup critical data

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Save (in forms) |
| `Ctrl+F` | Find on page |
| `Ctrl+P` | Print current view |
| `Esc` | Close dialog/modal |
| `Enter` | Submit form |
| `Tab` | Next field |
| `Shift+Tab` | Previous field |

---

## 💡 Pro Tips

### Tip 1: Use QR Codes
- Generate QR for each tool
- Stick on physical tool
- Faster borrowing process
- Easy phone scanning

### Tip 2: Regular Backups
- Export data monthly
- Save to external drive
- Keep 3-month history
- Test restoration

### Tip 3: Organize Categories
- Create meaningful categories
- Keep names consistent
- Makes searching easier
- Better for reports

### Tip 4: Track Tool Condition
- Use Description field
- Note maintenance needed
- Record damages
- Log repairs

### Tip 5: Monitor Due Dates
- Check daily for overdue
- Follow up immediately
- Update status quickly
- Keep records

### Tip 6: Use Mobile for Borrowing
- Phone has camera
- Scan QR codes
- Quick entry of info
- Works offline

### Tip 7: Set Up Users by Role
- Admin: Full control
- Teacher: Manage borrowings
- Assistant: View only
- Clear responsibilities

### Tip 8: Archive Old Data
- Keep system fast
- Archive old borrowings
- Keep recent data only
- Improves performance

---

## 📞 Need Help?

### Check These First:
1. **This file** - How to use guide
2. **INSTALLATION_REQUIREMENTS.md** - Setup and requirements
3. **Browser Console** - Press F12, click Console tab
4. **Error Messages** - Tell you exactly what's wrong

### Still Need Help?
- Check browser console for error details (F12)
- Look at error messages carefully
- Try the troubleshooting section above

---

## 🎉 Checklist - You're Ready!

- [ ] Logged in successfully
- [ ] Can see Dashboard
- [ ] Added a test tool
- [ ] Recorded a test borrowing
- [ ] Marked borrowing returned
- [ ] Generated a QR code
- [ ] Added a new user
- [ ] Exported data backup
- [ ] Read this guide

---

## 🚀 Next Steps

### 1. Setup Your System
- Add your actual tools
- Create user accounts for your team
- Set up categories that match your needs

### 2. Start Using
- Record your first real borrowing
- Generate QR codes for tools
- Train others to use the system

### 3. Backup Data
- Export data regularly
- Save to safe location
- Test restoration

### 4. Customize
- Change user passwords
- Add more categories
- Set up additional users

---

## � Production Deployment

### Build Standalone .exe Executable

You can build HulamKo as a standalone Windows executable (.exe) for easy distribution and installation on any Windows machine - no Python installation required!

**Requirements:**
- Python 3.7+ on your build machine (not needed for end users)
- PyInstaller package

**Build Steps:**

1. **Install build dependencies:**
   ```bash
   pip install pyinstaller flask flask-cors
   ```

2. **Run the build script:**
   ```bash
   python build_exe.py
   ```

3. **Executable created at:** `release/HulamKo.exe`

4. **For end users:** Simply run the .exe file
   - No Python needed
   - No command line needed
   - Just double-click to launch!

**See [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md) for detailed build guide.**

---

## �📋 Summary

**What This System Does:**
✅ Manage tool inventory  
✅ Track tool loans  
✅ Monitor due dates  
✅ Manage users  
✅ Keep activity log  
✅ Generate reports  
✅ Support QR codes  
✅ Works on mobile  

**How to Start:**
1. Run `setup.bat`
2. Login: `admin@hulamko.com` / `password123`
3. Add your first tool
4. Record a borrowing
5. Monitor your inventory

---

**Version 1.0 - January 25, 2026**

For setup and system requirements, see **INSTALLATION_REQUIREMENTS.md**
