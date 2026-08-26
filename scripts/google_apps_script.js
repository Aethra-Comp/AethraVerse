/**
 * AethraVerse Google Sheets Submission Endpoint
 * 
 * Instructions:
 * 1. Open your target Google Sheet.
 * 2. Click Extensions -> Apps Script.
 * 3. Delete any code in Code.gs and paste this script.
 * 4. Save and click "Deploy" -> "New deployment".
 * 5. Select type "Web app".
 * 6. Set Description: "AethraVerse Web App Submission Endpoint".
 * 7. Set Execute as: "Me" (your-email).
 * 8. Set Who has access: "Anyone".
 * 9. Click Deploy, authorize permissions, and copy the Web App URL.
 * 10. Paste this URL into your environment variable: VITE_REGISTRATION_ENDPOINT_URL
 */

function doPost(e) {
  try {
    // 1. Handle CORS Preflight and parse payload
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);

    // 2. Open active sheet or fallback sheet name
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // 3. Define headers exactly matching frontend configuration
    // This allows columns to map dynamically in any sheet layout
    var headers = [
      'Timestamp',
      'Team Name',
      'Department',
      'Leader Name',
      'Leader Email',
      'Leader Phone',
      'Member 2 Name',
      'Member 2 Email',
      'Member 2 Phone'
    ];

    // If sheet is empty, write headers first
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    }

    // 4. Map values from JSON payload
    // Handles dynamic keys set up in eventData.ts
    var row = [
      data['Timestamp'] || new Date().toISOString(),
      data['Team Name'] || '',
      data['College / Department'] || '',
      data['Leader Name'] || '',
      data['Leader Email'] || '',
      data['Leader Phone'] || '',
      data['Member 2 Name'] || '',
      data['Member 2 Email'] || '',
      data['Member 2 Phone'] || ''
    ];

    // 5. Append row to target sheet
    sheet.appendRow(row);

    // 6. Return successful JSON output with CORS
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'success', 
      message: 'Registration registered successfully' 
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*');

  } catch (error) {
    // 7. Return error trace output with CORS
    return ContentService.createTextOutput(JSON.stringify({ 
      status: 'error', 
      message: error.toString() 
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*');
  }
}

// Handle CORS OPTIONS preflight request
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}
