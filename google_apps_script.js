/**
 * AethraVerse Google Apps Script Web App Bridge
 * Connects the hackathon frontend form directly to the official spreadsheet.
 * 
 * Target Google Sheet:
 * https://docs.google.com/spreadsheets/d/1hgwklTceLhTpVcDXOTKF-Lf69hp4TQs7yDaFMsBbpZE/edit
 */

function doPost(e) {
  try {
    // Official Sheet ID
    var sheetId = "1hgwklTceLhTpVcDXOTKF-Lf69hp4TQs7yDaFMsBbpZE";
    var ss = SpreadsheetApp.openById(sheetId);
    var sheet = ss.getSheets()[0];
    
    // Parse the payload body
    var payloadText = e.postData.contents;
    var data = JSON.parse(payloadText);
    
    // Required fields verification
    var required = [
      'emailAddress',
      'teamName',
      'leaderName',
      'leaderEmail',
      'leaderPhone',
      'memberName',
      'memberEmail',
      'memberPhone'
    ];
    
    for (var i = 0; i < required.length; i++) {
      var key = required[i];
      if (!data[key] || data[key].toString().trim() === '') {
        return ContentService.createTextOutput(JSON.stringify({
          status: 'error',
          message: 'Required field is empty: ' + key
        }))
        .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Generate the official registration timestamp automatically
    var timestamp = new Date();
    
    // Construct the row values matching the exact column order:
    // 1. Timestamp
    // 2. Email Address
    // 3. Team Name
    // 4. Team Leader Name
    // 5. Team Leader Email ID
    // 6. Team Leader Contact
    // 7. Team Member (Name)
    // 8. Team Member (Email ID)
    // 9. Team Member (Contact)
    var row = [
      timestamp,
      data.emailAddress.trim(),
      data.teamName.trim(),
      data.leaderName.trim(),
      data.leaderEmail.trim(),
      data.leaderPhone.trim(),
      data.memberName.trim(),
      data.memberEmail.trim(),
      data.memberPhone.trim()
    ];
    
    // Append a new row to the sheet
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Squad registration authorized.'
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Server error: ' + error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}
