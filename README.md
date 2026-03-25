# 💰 IT Expense Dashboard (FINTRACK)

A modern, professional expense tracking application with role-based access, real-time synchronization, and a beautiful sidebar-based interface.

---

## ✨ Features

### 🎨 Modern UI/UX Design
- **Dark Navy Sidebar** - Fixed navigation with quick access menu
- **Glassmorphism Cards** - Modern stat cards with gradients and icons
- **Financial Summary** - 6 detailed metrics (avg income/expense, savings rate, etc.)
- **Type/Source Badges** - Color-coded transaction badges
- **Dark Mode** - Full dark theme support

### 👥 Role-Based Authentication
| Role | Password | Access |
|------|----------|--------|


### 🔐 Session Management
- **1-Hour Session Timeout** - Auto-logout after 60 minutes
- **Persistent Sessions** - Stay logged in until timeout or manual logout
- **SHA-256 Password Hashing** - Secure authentication

### 📊 Data Features
- Add/Edit/Delete transactions (Admin only)
- **Bill Attachments**: Upload receipts/bills (any file type) stored safely in your Google Drive
- Real-time filtering by date, type, and search
- CSV export (with Bill URLs) and JSON backup/restore
- Auto-sync with Google Sheets (every 30 seconds)
- Offline-first with localStorage caching

### 📈 Analytics
- 4 stat cards: Income, Expenses, Balance, Entries
- Financial Summary dashboard with averages
- Bar chart and doughnut chart visualizations
- Sortable & paginated data table

---

## 🚀 Quick Start

1. **Open** `dashboard.html` in any modern browser
2. **Login** with:
   - Viewer: `password123` (read-only)
3. **Start tracking** your expenses!

---

## 📁 File Structure

```
Expenses/
├── dashboard.html              # Main application
├── GoogleAppsScript_Backend.gs # Google Sheets backend
├── README.md                   # This file
├── SETUP_INSTRUCTIONS.md       # Backend setup guide
└── dashboard_old_backup.html   # Backup of previous design
```

---

## 🔧 Configuration

### Password Change
Edit `dashboard.html`, find the login function (~line 1754):
```javascript
const adminHash = await hashPassword('YOUR_NEW_ADMIN_PASSWORD');
const viewerHash = await hashPassword('YOUR_NEW_VIEWER_PASSWORD');
```

### Session Timeout
Change the timeout duration (~line 1843):
```javascript
const oneHour = 60 * 60 * 1000; // Change to desired ms value
```

### API Endpoint
Update the Google Apps Script URL (~line 1862):
```javascript
const API = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
```

---

## 📋 User Permissions

| Feature | Admin | Viewer |
|---------|-------|--------|
| View data | ✅ | ✅ |
| View Bills | ✅ | ✅ |
| Filter/Search | ✅ | ✅ |
| Export CSV | ✅ | ✅ |
| Dark mode | ✅ | ✅ |
| Add entry | ✅ | ❌ |
| Edit entry | ✅ | ❌ |
| Delete entry | ✅ | ❌ |
| Backup data | ✅ | ❌ |
| Restore data | ✅ | ❌ |
| Settings | ✅ | ❌ |

---

## 🎨 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `N` | Open Add Entry modal |
| `Esc` | Close modal |

---

## 📞 Support

**Prepared by:** Faizan  
**Version:** 2.0  
**Last Updated:** January 2026

---

Made with ❤️ for efficient expense management

