# 🔧 Setup Instructions - IT Expense Dashboard

## Overview

This guide covers deploying the Google Apps Script backend and configuring the dashboard.

---

## Step 1: Setup Google Sheets

1. Create a new **Google Sheets** document
2. Name the first sheet: `Expenses`
3. Add headers in row 1:
   ```
   ID | Date | Type | GivenFrom | Description | Amount
   ```

---

## Step 2: Deploy Google Apps Script

1. Open your Google Sheet
2. Go to **Extensions → Apps Script**
3. Delete any existing code
4. Copy contents from `GoogleAppsScript_Backend.gs`
5. Paste into the script editor
6. Click **Save** (💾)

### Deploy as Web App

1. Click **Deploy → New deployment**
2. Click ⚙️ → Select **Web app**
3. Settings:
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. **Copy the Web app URL**

---

## Step 3: Configure Dashboard

1. Open `dashboard.html` in a text editor
2. Find the API constant (~line 1862):
   ```javascript
   const API = "https://script.google.com/macros/s/...";
   ```
3. Replace with your Web app URL
4. Save the file

---

## Step 4: Test Login

Clear browser localStorage first:
1. Press F12 → Application → Local Storage
2. Clear all entries
3. Refresh the page

### Login Credentials

| Role | Password | Access |
|------|----------|--------|
| **Admin** | `ABC!123` | Full access |
| **Viewer** | `password123` | Read-only |

---

## New Features (v2.0)

### Role-Based Authentication
- **Admin**: Full CRUD access, backup/restore, settings
- **Viewer**: View, filter, search, export only

### Session Expiration
- Sessions expire after **1 hour**
- Auto-logout on page reload after expiration

### Modern UI
- Dark navy sidebar navigation
- Glassmorphism stat cards with icons
- Financial summary dashboard
- Color-coded type/source badges

---

## Troubleshooting

### "Authorization required" error
- Click the authorization link
- Grant permissions to your Google account
- Re-deploy if needed

### Login not working
- Clear localStorage completely
- Passwords are case-sensitive:
  - Admin: `ABC!123` (uppercase ABC)
  - Viewer: `password123` (all lowercase)

### Data not syncing
- Check API URL is correct
- Verify Google Apps Script deployment is active
- Check browser console for errors (F12)

### Session expires immediately
- Clear localStorage
- Login again to set fresh session timestamp

---

## Password Change

To change passwords, edit `dashboard.html` (~line 1754):

```javascript
const adminHash = await hashPassword('NewAdminPassword');
const viewerHash = await hashPassword('NewViewerPassword');
```

---

**Prepared by:** Faizan  
**Version:** 2.0  
**Last Updated:** January 2026
