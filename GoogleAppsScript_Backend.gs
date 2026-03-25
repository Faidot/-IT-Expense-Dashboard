/**
 * IT Expense Dashboard - Google Apps Script Backend
 * Version 3.0 - Added Bill Attachments (Google Drive upload)
 *
 * IMPORTANT: After updating this script, you must:
 * 1. Click "Deploy" > "New deployment"
 * 2. Select "Web app"
 * 3. Set "Execute as" to "Me"
 * 4. Set "Who has access" to "Anyone"
 * 5. Click "Deploy" and copy the new URL
 * 6. Update the API URL in index.html
 *
 * GOOGLE DRIVE SETUP:
 * - A folder named "Bills" will be auto-created in your Drive root.
 * - Uploaded files are set to anyone-with-link readable so URLs work publicly.
 */

const EXPENSES_SHEET = "Expenses";
const SETTINGS_SHEET  = "Settings";
const BILLS_FOLDER_NAME = "Bills";

// ─── Helper: get or create the Bills folder ───────────────────────────────────
function getBillsFolder() {
  const folders = DriveApp.getFoldersByName(BILLS_FOLDER_NAME);
  if (folders.hasNext()) return folders.next();
  const folder = DriveApp.createFolder(BILLS_FOLDER_NAME);
  return folder;
}

// ─── Helper: return JSON response ────────────────────────────────────────────
function json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle GET requests - return all expenses data
 */
function doGet(e) {
  try {
    const action = e && e.parameter ? e.parameter.action : null;

    if (action === "getSettings") {
      return getSettings();
    }

    // Default: return expenses data
    const sheet = SpreadsheetApp.getActive().getSheetByName(EXPENSES_SHEET);
    if (!sheet) {
      return json({ error: "Expenses sheet not found" });
    }

    // Get raw values for IDs (need numbers) and display values for everything else
    const rawData     = sheet.getDataRange().getValues();
    const displayData = sheet.getDataRange().getDisplayValues();

    const data = displayData.map((row, rowIndex) => {
      if (rowIndex === 0) return row; // Header row as-is

      return row.map((cell, colIndex) => {
        if (colIndex === 0) {
          // Column A (ID) - use raw value to keep as number
          return rawData[rowIndex][colIndex];
        }
        return cell;
      });
    });

    Logger.log("Returning data rows: " + data.length);
    return json(data);

  } catch(error) {
    Logger.log("GET Error: " + error.toString());
    return json({ error: error.toString() });
  }
}

/**
 * Handle POST requests - add, edit, delete, uploadBill, saveSettings, restore
 */
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    Logger.log("Action: " + body.action);

    // ── SAVE SETTINGS ──────────────────────────────────────────────────────────
    if (body.action === "saveSettings") {
      return saveSettings(body.settings);
    }

    // ── UPLOAD BILL(S) ─────────────────────────────────────────────────────────
    if (body.action === "uploadBill") {
      return uploadBill(body);
    }

    const sheet = SpreadsheetApp.getActive().getSheetByName(EXPENSES_SHEET);
    if (!sheet) {
      return json({ status: "error", message: "Expenses sheet not found" });
    }

    // ── ADD new expense ────────────────────────────────────────────────────────
    if (body.action === "add") {
      const dateStr  = String(body.date);
      const billUrls = body.billUrls ? body.billUrls.join(",") : "";

      sheet.appendRow([
        Date.now(),          // A: ID (timestamp)
        dateStr,             // B: Date
        body.type,           // C: Type
        body.givenFrom || "",// D: Source
        body.desc || "",     // E: Description
        Number(body.amount) || 0, // F: Amount
        billUrls             // G: Bill URLs (comma-separated)
      ]);

      const lastRow = sheet.getLastRow();
      sheet.getRange(lastRow, 2).setNumberFormat("@");
      sheet.getRange(lastRow, 7).setNumberFormat("@");

      Logger.log("Row added with date: " + dateStr + " | bills: " + billUrls);
      return json({ status: "success", message: "Entry added" });
    }

    // ── DELETE expense ────────────────────────────────────────────────────────
    if (body.action === "delete") {
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(body.id)) {
          sheet.deleteRow(i + 1);
          Logger.log("Deleted row with ID: " + body.id);
          return json({ status: "success", message: "Entry deleted" });
        }
      }
      return json({ status: "error", message: "Entry not found" });
    }

    // ── EDIT expense ──────────────────────────────────────────────────────────
    if (body.action === "edit") {
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(body.id)) {
          const dateStr  = String(body.date);
          const billUrls = body.billUrls ? body.billUrls.join(",") : (data[i][6] || "");

          sheet.getRange(i + 1, 2, 1, 6).setValues([[
            dateStr,
            body.type,
            body.givenFrom || "",
            body.desc || "",
            Number(body.amount) || 0,
            billUrls
          ]]);

          sheet.getRange(i + 1, 2).setNumberFormat("@");
          sheet.getRange(i + 1, 7).setNumberFormat("@");

          Logger.log("Edited row ID: " + body.id);
          return json({ status: "success", message: "Entry updated" });
        }
      }
      return json({ status: "error", message: "Entry not found" });
    }

    // ── RESTORE from backup ───────────────────────────────────────────────────
    if (body.action === "restore") {
      Logger.log("Restore started, rows: " + (body.data ? body.data.length : 0));

      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.deleteRows(2, lastRow - 1);
      }

      if (body.data && body.data.length > 1) {
        const dataToInsert = body.data.slice(1);
        if (dataToInsert.length > 0) {
          sheet.getRange(2, 1, dataToInsert.length, dataToInsert[0].length).setValues(dataToInsert);
          sheet.getRange(2, 2, dataToInsert.length, 1).setNumberFormat("@");
        }
      }

      Logger.log("Restore completed");
      return json({ status: "success", message: "Data restored" });
    }

    return json({ status: "error", message: "Unknown action" });

  } catch(error) {
    Logger.log("POST Error: " + error.toString());
    return json({ status: "error", message: error.toString() });
  }
}

/**
 * Upload one or more bill files to the Bills folder in Google Drive.
 * Expects body.files = [{ name, mimeType, base64 }, ...]
 * Returns { status, urls: [...] }
 */
function uploadBill(body) {
  try {
    const folder = getBillsFolder();
    const urls   = [];

    const files = body.files || [];
    files.forEach(function(fileObj) {
      const bytes    = Utilities.base64Decode(fileObj.base64);
      const blob     = Utilities.newBlob(bytes, fileObj.mimeType, fileObj.name);
      const driveFile = folder.createFile(blob);

      // Make file accessible to anyone with the link
      driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

      // Build a direct-view URL for images; use Drive viewer for PDFs
      const fileId = driveFile.getId();
      const mimeType = fileObj.mimeType || "";

      let viewUrl;
      if (mimeType.startsWith("image/")) {
        // Direct image - renders inline
        viewUrl = "https://drive.google.com/uc?export=view&id=" + fileId;
      } else {
        // PDF / other - Drive viewer
        viewUrl = "https://drive.google.com/file/d/" + fileId + "/view";
      }

      urls.push(viewUrl);
      Logger.log("Uploaded: " + fileObj.name + " → " + viewUrl);
    });

    return json({ status: "success", urls: urls });

  } catch(error) {
    Logger.log("uploadBill Error: " + error.toString());
    return json({ status: "error", message: error.toString() });
  }
}

/**
 * Ensure the Expenses sheet has a header row with the Bills column.
 * Call this once manually from the Apps Script editor if needed.
 */
function setupExpensesHeader() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(EXPENSES_SHEET);
  if (!sheet) {
    SpreadsheetApp.getActive().insertSheet(EXPENSES_SHEET);
  }
  const headers = sheet.getRange(1, 1, 1, 7).getValues()[0];
  if (!headers[6] || headers[6] === "") {
    sheet.getRange(1, 7).setValue("Bill URLs");
  }
}

/**
 * Get settings from Settings sheet
 */
function getSettings() {
  try {
    let sheet = SpreadsheetApp.getActive().getSheetByName(SETTINGS_SHEET);

    if (!sheet) {
      sheet = SpreadsheetApp.getActive().insertSheet(SETTINGS_SHEET);
      sheet.appendRow(["Key", "Value"]);
      sheet.appendRow(["givenFromOptions", JSON.stringify(["Accounts", "Department", "Personal", "Other"])]);
      sheet.appendRow(["darkMode", "false"]);
    }

    const data     = sheet.getDataRange().getValues();
    const settings = {};

    for (let i = 1; i < data.length; i++) {
      const key = data[i][0];
      let value  = data[i][1];
      try { value = JSON.parse(value); } catch(e) {}
      settings[key] = value;
    }

    return json({ status: "success", settings: settings });
  } catch(error) {
    Logger.log("getSettings Error: " + error.toString());
    return json({ status: "error", message: error.toString() });
  }
}

/**
 * Save settings to Settings sheet
 */
function saveSettings(settings) {
  try {
    let sheet = SpreadsheetApp.getActive().getSheetByName(SETTINGS_SHEET);

    if (!sheet) {
      sheet = SpreadsheetApp.getActive().insertSheet(SETTINGS_SHEET);
      sheet.appendRow(["Key", "Value"]);
    }

    const data = sheet.getDataRange().getValues();

    for (const [key, value] of Object.entries(settings)) {
      let found = false;
      const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);

      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === key) {
          sheet.getRange(i + 1, 2).setValue(valueStr);
          found = true;
          break;
        }
      }

      if (!found) {
        sheet.appendRow([key, valueStr]);
      }
    }

    Logger.log("Settings saved: " + JSON.stringify(settings));
    return json({ status: "success", message: "Settings saved" });
  } catch(error) {
    Logger.log("saveSettings Error: " + error.toString());
    return json({ status: "error", message: error.toString() });
  }
}
