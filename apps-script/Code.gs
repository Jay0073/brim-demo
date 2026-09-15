/**
 * BRIM website form automation.
 *
 * Deploy this file as a Web App from script.google.com. It receives the two
 * public website forms and writes every submission to the supplied spreadsheet.
 */
const SPREADSHEET_ID = "1lHfxqfODnGTQDF4FJYRgXtEQWWnNnI9I3RWmpdigp8s";

const FORMS = {
  franchisee: {
    sheetName: "Franchisee",
    headers: ["Submitted at (UTC)", "Name", "Email", "Phone", "Message", "Status"],
  },
  contact: {
    sheetName: "Contact Us",
    headers: ["Submitted at (UTC)", "Name", "Email", "Phone", "Message", "Status"],
  },
};

/** Run once manually after pasting this script to create both tabs and headers. */
function setup() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  Object.keys(FORMS).forEach((formType) => getSheet_(spreadsheet, FORMS[formType]));
}

function doPost(event) {
  try {
    const submission = JSON.parse(event.postData && event.postData.contents ? event.postData.contents : "{}");
    const definition = FORMS[submission.formType];
    if (!definition) throw new Error("Unknown form type.");

    const name = clean_(submission.name, 120);
    const email = clean_(submission.email, 254);
    const phone = clean_(submission.phone, 40);
    const message = clean_(submission.message, 5000);
    if (!name || !email || !phone || !message) throw new Error("Missing required fields.");

    const lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      const sheet = getSheet_(SpreadsheetApp.openById(SPREADSHEET_ID), definition);
      sheet.appendRow([new Date().toISOString(), name, email, phone, message, "New"]);
    } finally {
      lock.releaseLock();
    }
    return response_({ ok: true });
  } catch (error) {
    console.error(error);
    return response_({ ok: false, error: "Submission could not be recorded." });
  }
}

function getSheet_(spreadsheet, definition) {
  const sheet = spreadsheet.getSheetByName(definition.sheetName) || spreadsheet.insertSheet(definition.sheetName);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(definition.headers);
    sheet.getRange(1, 1, 1, definition.headers.length).setFontWeight("bold").setBackground("#111111").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, definition.headers.length);
  }
  return sheet;
}

function clean_(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function response_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
