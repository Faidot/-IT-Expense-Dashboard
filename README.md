# 💰 IT Expense Dashboard

A modern, professional expense tracking application with real-time synchronization, offline support, and advanced data management features.

---

## 📋 Overview

The **IT Expense Dashboard** is a web-based expense management system designed to help track income and expenses efficiently. It features secure authentication, real-time cloud synchronization, dark mode, professional reporting, and full mobile responsiveness.

**Built by:** Faizan

---

## ✨ Features

### Core Functionality
- ✅ **Add/Edit/Delete Expenses** - Simple form to manage transactions
- ✅ **Real-time Filtering** - Filter by date range, type, and description search
- ✅ **Instant Calculations** - Auto-calculate income, expenses, and balance
- ✅ **Chart Visualizations** - Bar charts and doughnut charts for data analysis

### Data Management
- ✅ **CSV Export** - Download filtered data as Excel-compatible CSV
- ✅ **JSON Backup** - Complete data backup and restore functionality
- ✅ **Cloud Synchronization** - Auto-sync with Google Sheets every 5 seconds
- ✅ **Browser Caching** - Offline-first architecture using localStorage

### User Interface
- ✅ **Professional Design** - Modern gradient UI with smooth animations
- ✅ **Dark Mode** - Eye-friendly dark theme with persistent preference
- ✅ **Responsive Layout** - Perfect on desktop, tablet, and mobile devices
- ✅ **Pagination** - Display 20, 50, 100, or all entries per page
- ✅ **Column Sorting** - Sort by Date, Type, or Amount with visual indicators

### Reporting
- ✅ **Professional Print Reports** - Beautiful, printable expense reports
- ✅ **Print to PDF** - Export reports as PDF for records
- ✅ **Custom Footer** - Reports include preparer name (Faizan)

### Security
- ✅ **Password Protection** - Secure login with SHA-256 hashing
- ✅ **Session Management** - Persistent sessions per browser
- ✅ **Data Privacy** - Secure backend synchronization

---

## 🚀 Getting Started

### 1. **Open the App**
Simply open `dashboard.html` in any modern web browser:
- Chrome
- Firefox
- Safari
- Edge

### 2. **Login**
Use the following credentials:
- **Password:** `Abc!123`

> ⚠️ Change this password in the Google Apps Script backend for production use.

### 3. **Start Tracking**
Click **"➕ Add Entry"** to add your first expense or income record.

---

## 📱 Device Support

| Device | Support | Features |
|--------|---------|----------|
| **Desktop** | ✅ Full | All features, optimal display |
| **Tablet** | ✅ Full | All features, optimized layout |
| **Mobile** | ✅ Full | Icon-only navbar, stacked controls |

### Mobile Features
- Icon-only navigation buttons for compact display
- Full-width forms and inputs
- Optimized chart heights for readability
- Horizontal scrolling tables
- Touch-friendly buttons (44px minimum)

---

## 📖 How to Use

### Adding an Entry
1. Click **"➕ Add Entry"** button
2. Select a date
3. Choose type: "Amount Given" (income) or "Expense"
4. Add description
5. Enter amount
6. Click **"Save Entry"** or **"Save & Add More"** for bulk entry

### Filtering Data
- **Date Range:** Select from and to dates
- **Type Filter:** Choose "Amount Given" or "Expense"
- **Search:** Type description keywords
- **Apply Filter:** Click "🔍 Apply Filter" button

### Viewing Data
- **Toggle Views:** Switch between:
  - Total Income 💰
  - Total Expenses 💸
  - Net Balance 📊
  - Total Entries 📋

- **Charts:** 
  - Bar chart shows breakdown by type
  - Doughnut chart shows income vs expenses ratio

### Pagination
- Change entries per page: 20, 50, 100, or All
- Navigate with Previous/Next buttons
- See current page number and entry count

### Sorting Data
Click on table headers to sort:
- **Date** - Sort by transaction date
- **Type** - Sort by expense/income
- **Amount** - Sort by value
- Visual indicators show sort direction (↑↓)

### Exporting Data
1. **CSV Export** - Download as Excel file
   - Click "📥 Export CSV"
   - Opens in Excel/Sheets for analysis

2. **Backup** - Save complete data as JSON
   - Click "💾 Backup"
   - Stores all transactions with metadata

3. **Restore** - Restore from backup file
   - Click "📂 Restore"
   - Select JSON backup file
   - Data restored to both app and cloud

### Printing Reports
1. Click "🖨️ Print" button
2. Review the professional report
3. Click Print in browser dialog
4. Save as PDF or print to paper

**Report includes:**
- Header with date range and summary
- 3-card summary (Income, Expenses, Balance)
- Full transaction table
- Footer with preparer name (Faizan)

### Dark Mode
- Click "🌙 Dark" button to toggle dark mode
- Preference is saved automatically
- Works on all pages and modals

### Theme Features
**Light Mode (Default):**
- Blue gradient background
- White cards with shadows
- High contrast for readability

**Dark Mode:**
- Deep blue-to-navy gradient
- Gradient cards for depth
- Eye-friendly colors

---

## 🔐 Security & Data

### Password
- **Default Password:** `Abc!123`
- Uses SHA-256 hashing for security
- Change in Google Apps Script backend:
  ```javascript
  const correctHash = await hashPassword('YourNewPassword');
  ```

### Data Storage
1. **Local Storage** - Browser cache for offline access
2. **Google Sheets** - Cloud backup for data persistence
3. **Auto-sync** - Every 5 seconds to backend

### Session Management
- Login is persistent per browser
- Different browsers require separate login
- Logout clears session and returns to login screen

---

## 🔧 Technical Details

### Technology Stack
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Google Apps Script
- **Database:** Google Sheets
- **Charts:** Chart.js 3.9.1
- **Authentication:** SHA-256 Web Crypto API

### File Structure
```
Expenses/
├── dashboard.html              # Main application file (~2300 lines)
├── GoogleAppsScript_Backend.gs # Backend script for Google Sheets
└── README.md                   # This file
```

### Key Functions
- `load()` - Fetch and display data
- `save()` - Add/edit transactions
- `del()` - Delete transaction
- `processData()` - Filter and calculate totals
- `exportToCSV()` - Export to CSV format
- `downloadBackup()` - Create JSON backup
- `restoreBackup()` - Restore from JSON
- `printReport()` - Generate print report
- `toggleDarkMode()` - Switch theme

### API Integration
- **Endpoint:** Google Apps Script deployment URL
- **Methods:** GET (fetch) and POST (add/edit/delete/restore)
- **Data Format:** JSON
- **Response:** Array of transaction rows

---

## 🚨 Troubleshooting

### Problem: App won't load
**Solution:** 
- Clear browser cache (Ctrl+Shift+Delete)
- Close all tabs and reopen
- Try a different browser

### Problem: Data not saving
**Solution:**
- Check internet connection
- Verify API endpoint in console
- Check Google Apps Script deployment is active

### Problem: Can't login
**Solution:**
- Password is case-sensitive
- Default: `Abc!123`
- Check Caps Lock is off
- Clear localStorage and try again

### Problem: Charts not showing on mobile
**Solution:**
- Refresh the page
- Try in landscape mode
- Rotate device and rotate back

### Problem: Dark mode not persisting
**Solution:**
- Check if localStorage is enabled
- Clear cookies and cache
- Try incognito/private mode

---

## 📊 Data Format

### Transaction Structure (Google Sheets)
| Column | Format | Example |
|--------|--------|---------|
| ID | Timestamp | 1736627400000 |
| Date | YYYY-MM-DD | 2026-01-12 |
| Type | Text | "Expense" or "Amount Given" |
| Description | Text | "Laptop Purchase" |
| Amount | Number | -50000 or 100000 |

**Note:** Expenses are stored as negative numbers, Income as positive.

### CSV Export Format
```
Date,Type,Description,Amount
2026-01-12,Expense,Office Supplies,-5000
2026-01-11,Amount Given,Monthly Allowance,100000
```

### JSON Backup Format
```json
{
  "exported": "2026-01-12T10:30:00.000Z",
  "data": [
    ["Header row..."],
    ["Data row 1..."],
    ["Data row 2..."]
  ]
}
```

---

## 💡 Tips & Best Practices

### Workflow Tips
1. **Use Date Range Filter** - Quickly find transactions by period
2. **Bulk Entry Mode** - Click "Save & Add More" for multiple entries
3. **Export before Backup** - CSV for analysis, JSON for safety
4. **Regular Backups** - Download monthly backups for records

### Data Entry Tips
- Use consistent descriptions for better filtering
- Prefix descriptions with category (e.g., "OFFICE: Supplies")
- Keep amounts positive, app handles expense sign
- Always fill all fields for better reporting

### Report Generation
- Print monthly for tax records
- Use date filters before printing for specific periods
- Save PDFs in folder structure by month/year
- Include in expense reports and audits

---

## 🎯 Use Cases

### Personal Finance
- Track daily expenses and income
- Monitor spending patterns
- Plan budgets with monthly reports

### Business Expenses
- IT department expense tracking
- Project-based expense management
- Generate reports for management review

### Tax Compliance
- Maintain organized expense records
- Monthly PDF exports for tax filing
- Year-end summary reports

### Department Management
- Team expense tracking
- Category-based analysis
- Departmental expense reports

---

## 🔄 Updates & Maintenance

### Regular Tasks
- **Weekly:** Review expenses and update categories
- **Monthly:** Generate and save PDF report
- **Quarterly:** Review spending trends
- **Yearly:** Archive data and backup

### Performance
- App handles 1000+ transactions efficiently
- Pagination prevents slow loading
- Charts update instantly with filters
- Auto-sync is non-blocking

---

## 📞 Support & Contact

For issues or feature requests:
- Check this README first
- Review browser console for errors
- Verify Google Apps Script deployment is active
- Contact: Faizan (preparer)

---

## 📄 License

This application is proprietary and designed for IT Expense Management.

---

## 🎉 Enjoy Tracking Your Expenses!

Made with ❤️ for efficient expense management  
**Dashboard Version 1.0** | January 2026

---

### Quick Reference

| Action | Shortcut |
|--------|----------|
| Add Entry | `➕ Add Entry` button |
| Apply Filter | `🔍 Apply Filter` button |
| Export CSV | `📥 Export CSV` button |
| Backup Data | `💾 Backup` button |
| Restore Data | `📂 Restore` button |
| Dark Mode | `🌙 Dark` button |
| Print Report | `🖨️ Print` button |
| Logout | `🚪 Logout` button |

**Password:** `Abc!123`

---

**Last Updated:** January 12, 2026  
**Prepared by:** Faizan
