const SHEET = "Expenses";

function doGet() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET);
  const data = sheet.getDataRange().getValues();
  return json(data);
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET);
    const body = JSON.parse(e.postData.contents);
    
    Logger.log("Action received: " + body.action);
    Logger.log("Body: " + JSON.stringify(body));

    if (body.action === "add") {
      sheet.appendRow([
        Date.now(),
        body.date,
        body.type,
        body.desc,
        body.amount
      ]);
      Logger.log("Row added successfully");
    }

    if (body.action === "delete") {
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] == body.id) {
          sheet.deleteRow(i + 1);
          Logger.log("Row deleted: " + body.id);
          break;
        }
      }
    }

    if (body.action === "edit") {
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] == body.id) {
          sheet.getRange(i + 1, 2, 1, 4).setValues([[
            body.date,
            body.type,
            body.desc,
            body.amount
          ]]);
          Logger.log("Row edited: " + body.id);
          break;
        }
      }
    }

    if (body.action === "restore") {
      Logger.log("Restore action started");
      Logger.log("Data length: " + (body.data ? body.data.length : "null"));
      
      // Clear all existing data except header
      const data = sheet.getDataRange().getValues();
      Logger.log("Current sheet rows: " + data.length);
      
      // Delete all rows except header (row 1)
      if (data.length > 1) {
        const rowsToDelete = data.length - 1;
        sheet.deleteRows(2, rowsToDelete);
        Logger.log("Deleted " + rowsToDelete + " rows");
      }
      
      // Insert all restored data
      if (body.data && body.data.length > 1) {
        // Skip the header row (index 0) and add all data rows
        const dataToInsert = body.data.slice(1);
        Logger.log("Rows to insert: " + dataToInsert.length);
        
        if (dataToInsert.length > 0) {
          sheet.getRange(2, 1, dataToInsert.length, dataToInsert[0].length).setValues(dataToInsert);
          Logger.log("Data inserted successfully");
        }
      }
      
      Logger.log("Restore completed");
      return json({ status: "success", message: "Data restored successfully" });
    }

    return json({ status: "success" });
  } catch(error) {
    Logger.log("Error: " + error.toString());
    return json({ status: "error", message: error.toString() });
  }
}

function json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
