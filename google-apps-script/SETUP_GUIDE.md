# Gold Trader John Trading World - Google Sheets CMS & Backend Setup Guide

This guide explains how to connect your **Gold Trader John Trading World** website to your personal Google Spreadsheet using Google Apps Script.

---

## Architecture Overview

```
[ Public Website ]
        ↓
[ Secure API Layer (Express Backend) ]
        ↓
[ Google Apps Script (Web App) ]
        ↓
[ Google Spreadsheet (Database) ]
```

- **Zero credential leaks**: Your spreadsheet ID, Apps Script URL, and admin tokens remain protected inside the server environment.
- **Bi-directional CMS**: Changes in your Google Sheet or Admin Dashboard sync seamlessly.
- **Fail-safe Caching**: If Google Sheets is temporarily slow, the website serves cached and verified content instantly.

---

## 11-Step Walkthrough

### 1. Create the Google Spreadsheet
1. Open [Google Sheets](https://sheets.new).
2. Name the spreadsheet: `Gold Trader John - Trading World CMS & Database`.
3. Copy the **Spreadsheet ID** from the browser address bar:
   `https://docs.google.com/spreadsheets/d/`**`1a2b3c4d5e6f7g8h9...`**`/edit`

### 2. Create the Required Tabs / Sheets
You can either create them manually or let the script auto-create them on first run:
- `SITE_CONTENT`
- `PROGRAMS`
- `CONTACTS`
- `APPLICATIONS`
- `SETTINGS`
- `FAQ`
- `AUDIT_LOG`

### 3. Open Google Apps Script
1. In your Google Sheet, click on **Extensions** in the top menu.
2. Select **Apps Script**. A new script editor tab will open.
3. Rename the project in the top left to: `Gold Trader John API Backend`.

### 4. Add the Backend Script Code
1. Delete any existing code inside `Code.gs`.
2. Copy the entire content of `/google-apps-script/Code.gs` and paste it into `Code.gs`.
3. Press **Ctrl + S** (or **Cmd + S**) to save the project.

### 5. Configure the Spreadsheet ID (Optional)
If you opened Apps Script directly from the sheet (**Extensions > Apps Script**), leave `SPREADSHEET_ID = ""` empty — it automatically binds to the active sheet.
If running standalone, paste your copied Spreadsheet ID into:
```javascript
var SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";
```

### 6. Authorize the Script
1. In the Apps Script toolbar, make sure the function dropdown is set to `doGet` or `initSheets`.
2. Click **Run**.
3. Google will prompt: **"Authorization Required"**.
4. Click **Review Permissions** > Choose your Google Account.
5. Click **Advanced** > **Go to Gold Trader John API Backend (unsafe)**.
6. Click **Allow**.
7. The script will execute and automatically format all 7 spreadsheet tabs with colors and sample data!

### 7. Deploy the Apps Script as a Web App
1. At the top right of the Apps Script editor, click **Deploy** > **New deployment**.
2. Click the gear icon ⚙️ next to "Select type" and choose **Web app**.
3. Fill in the deployment details:
   - **Description**: `Production CMS API v1`
   - **Execute as**: `Me (your-email@gmail.com)`
   - **Who has access**: `Anyone` *(Crucial so your secure backend server can send requests)*
4. Click **Deploy**.
5. Copy the **Web App URL** (starts with `https://script.google.com/macros/s/.../exec`).

### 8. Configure the API URL in the Website
You can configure the URL in two easy ways:
- **Option A (Admin Portal)**: Log in to `/admin` > Click **Settings** > Paste your Web App URL into the **Google Apps Script Web App URL** field and click **Save & Test Connection**.
- **Option B (Environment Variable)**: In `.env`, add:
  ```env
  GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
  ```

### 9. Test Reading Website Content
1. In the Admin Dashboard under **Settings**, click **Test Google Sheets Connection**.
2. A green checkmark will appear indicating that `SITE_CONTENT`, `PROGRAMS`, `CONTACTS`, and `FAQ` were loaded successfully.

### 10. Test Submitting an Application
1. On the public website, navigate to the **Application Form**.
2. Complete and submit a test application for *Trading Student* or *Trading Mentee*.
3. Check your Google Sheet tab `APPLICATIONS`. A new row will appear immediately with the reference ID, applicant information, and timestamp!

### 11. Test Editing Content from the Admin Dashboard
1. Go to `/admin` > **Website Content** or **Programs**.
2. Change the Hero Subtitle or a Minimum Amount.
3. Click **Save Changes**.
4. Notice the update appears in your Google Sheet under `SITE_CONTENT` or `PROGRAMS`, and an entry is logged in `AUDIT_LOG`.
5. Refresh the public website to verify the live text update.
