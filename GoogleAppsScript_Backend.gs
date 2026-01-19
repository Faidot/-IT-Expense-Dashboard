/**
 * IT Expense Dashboard - Google Apps Script Backend
 * Version 2.0 - Fixed date handling & added settings storage
 * 
 * IMPORTANT: After updating this script, you must:
 * 1. Click "Deploy" > "New deployment" 
 * 2. Select "Web app"
 * 3. Set "Execute as" to "Me"
 * 4. Set "Who has access" to "Anyone"
 * 5. Click "Deploy" and copy the new URL
 * 6. Update the API URL in dashboard.html
 */

const EXPENSES_SHEET = "Expenses";
const SETTINGS_SHEET = "Settings";

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
    const rawData = sheet.getDataRange().getValues();
    const displayData = sheet.getDataRange().getDisplayValues();
    
    // Use display values (text as shown in sheet) but keep IDs as numbers
    const data = displayData.map((row, rowIndex) => {
      if (rowIndex === 0) return row; // Header row as-is
      
      // For data rows: use raw ID but display values for everything else
      return row.map((cell, colIndex) => {
        if (colIndex === 0) {
          // Column A (ID) - use raw value to keep as number
          return rawData[rowIndex][colIndex];
        }
        // All other columns - use display value (text as shown)
        return cell;
      });
    });
    
    Logger.log("Returning data rows: " + data.length);
    Logger.log("Sample date from row 1: " + (data[1] ? data[1][1] : "no data"));
    
    return json(data);
  } catch(error) {
    Logger.log("GET Error: " + error.toString());
    return json({ error: error.toString() });
  }
}

/**
 * Handle POST requests - add, edit, delete expenses
 */
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    
    Logger.log("Action: " + body.action);
    Logger.log("Body: " + JSON.stringify(body));
    
    if (body.action === "saveSettings") {
      return saveSettings(body.settings);
    }

    const sheet = SpreadsheetApp.getActive().getSheetByName(EXPENSES_SHEET);
    if (!sheet) {
      return json({ status: "error", message: "Expenses sheet not found" });
    }

    // ADD new expense
    if (body.action === "add") {
      // Store date as text string to prevent timezone issues
      const dateStr = String(body.date); // Keep as YYYY-MM-DD string
      
      sheet.appendRow([
        Date.now(), // ID (timestamp)
        dateStr,    // Date as text string
        body.type,
        body.givenFrom || "",
        body.desc || "",
        Number(body.amount) || 0
      ]);
      
      // Set date column format to text for the new row
      const lastRow = sheet.getLastRow();
      sheet.getRange(lastRow, 2).setNumberFormat("@"); // @ = text format
      
      Logger.log("Row added with date: " + dateStr);
      return json({ status: "success", message: "Entry added" });
    }

    // DELETE expense
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

    // EDIT expense
    if (body.action === "edit") {
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(body.id)) {
          const dateStr = String(body.date); // Keep as YYYY-MM-DD string
          
          sheet.getRange(i + 1, 2, 1, 5).setValues([[
            dateStr,
            body.type,
            body.givenFrom || "",
            body.desc || "",
            Number(body.amount) || 0
          ]]);
          
          // Ensure date column is text format
          sheet.getRange(i + 1, 2).setNumberFormat("@");
          
          Logger.log("Edited row with ID: " + body.id + ", date: " + dateStr);
          return json({ status: "success", message: "Entry updated" });
        }
      }
      return json({ status: "error", message: "Entry not found" });
    }

    // RESTORE from backup
    if (body.action === "restore") {
      Logger.log("Restore started, rows: " + (body.data ? body.data.length : 0));
      
      // Clear existing data (keep header)
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.deleteRows(2, lastRow - 1);
      }
      
      // Insert restored data
      if (body.data && body.data.length > 1) {
        const dataToInsert = body.data.slice(1); // Skip header
        if (dataToInsert.length > 0) {
          sheet.getRange(2, 1, dataToInsert.length, dataToInsert[0].length).setValues(dataToInsert);
          
          // Set date column to text format for all new rows
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
 * Get settings from Settings sheet
 */
function getSettings() {
  try {
    let sheet = SpreadsheetApp.getActive().getSheetByName(SETTINGS_SHEET);
    
    // Create Settings sheet if it doesn't exist
    if (!sheet) {
      sheet = SpreadsheetApp.getActive().insertSheet(SETTINGS_SHEET);
      sheet.appendRow(["Key", "Value"]);
      sheet.appendRow(["givenFromOptions", JSON.stringify(["Accounts", "Department", "Personal", "Other"])]);
      sheet.appendRow(["darkMode", "false"]);
    }
    
    const data = sheet.getDataRange().getValues();
    const settings = {};
    
    for (let i = 1; i < data.length; i++) {
      const key = data[i][0];
      let value = data[i][1];
      
      // Try to parse JSON values
      try {
        value = JSON.parse(value);
      } catch(e) {
        // Keep as string if not JSON
      }
      
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
    
    // Create Settings sheet if it doesn't exist
    if (!sheet) {
      sheet = SpreadsheetApp.getActive().insertSheet(SETTINGS_SHEET);
      sheet.appendRow(["Key", "Value"]);
    }
    
    const data = sheet.getDataRange().getValues();
    
    // Update or add each setting
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

/**
 * Helper function to return JSON response
 */
function json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
