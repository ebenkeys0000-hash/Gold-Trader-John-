/**
 * ==============================================================================
 * GOLD TRADER JOHN TRADING WORLD - GOOGLE APPS SCRIPT DATABASE BACKEND
 * ==============================================================================
 * 
 * This script acts as the secure intermediary between the Gold Trader John
 * website backend and your Google Spreadsheet.
 * 
 * Required Sheets (Auto-created if missing):
 * 1. SITE_CONTENT
 * 2. PROGRAMS
 * 3. CONTACTS
 * 4. APPLICATIONS
 * 5. SETTINGS
 * 6. FAQ
 * 7. AUDIT_LOG
 * ==============================================================================
 */

// OPTIONAL: Define your specific SPREADSHEET_ID here if this script is not bound to the Sheet.
// If this script is created via Tools > Script Editor inside the Spreadsheet, it uses getActiveSpreadsheet().
var SPREADSHEET_ID = ""; // Leave blank if container-bound, or paste Google Sheet ID

// Optional security token to prevent unauthorized external access.
var API_SECRET = ""; // Set your secret token here if desired (match GOOGLE_APPS_SCRIPT_SECRET)

function getDb() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Handle GET Requests
 * Endpoints:
 * - ?action=status
 * - ?action=get_content
 * - ?action=get_programs
 * - ?action=get_contacts
 * - ?action=get_faq
 * - ?action=get_settings
 * - ?action=get_applications (requires secret if configured)
 * - ?action=get_audit_log (requires secret if configured)
 * - ?action=get_all
 * - ?action=init_sheets (creates sheets & seed data)
 */
function doGet(e) {
  try {
    var params = e ? e.parameter : {};
    var action = params.action || "status";
    var secret = params.secret || "";

    if (API_SECRET && API_SECRET.trim() !== "" && secret !== API_SECRET) {
      if (action === "get_applications" || action === "get_audit_log" || action === "init_sheets") {
        return jsonResponse({ success: false, error: "Unauthorized access" }, 401);
      }
    }

    var db = getDb();
    if (!db) {
      return jsonResponse({ success: false, error: "Cannot connect to Spreadsheet. Check SPREADSHEET_ID." });
    }

    if (action === "status") {
      return jsonResponse({
        success: true,
        status: "online",
        timestamp: new Date().toISOString(),
        spreadsheetName: db.getName(),
        sheets: db.getSheets().map(function(s) { return s.getName(); })
      });
    }

    if (action === "init_sheets") {
      return jsonResponse(initializeSpreadsheet(db));
    }

    if (action === "get_content") {
      return jsonResponse({ success: true, data: getSheetRecords(db, "SITE_CONTENT") });
    }

    if (action === "get_programs") {
      return jsonResponse({ success: true, data: getSheetRecords(db, "PROGRAMS") });
    }

    if (action === "get_contacts") {
      return jsonResponse({ success: true, data: getSheetRecords(db, "CONTACTS") });
    }

    if (action === "get_faq") {
      return jsonResponse({ success: true, data: getSheetRecords(db, "FAQ") });
    }

    if (action === "get_settings") {
      return jsonResponse({ success: true, data: getSettingsRecord(db) });
    }

    if (action === "get_applications") {
      return jsonResponse({ success: true, data: getSheetRecords(db, "APPLICATIONS") });
    }

    if (action === "get_audit_log") {
      return jsonResponse({ success: true, data: getSheetRecords(db, "AUDIT_LOG") });
    }

    if (action === "get_all") {
      return jsonResponse({
        success: true,
        content: getSheetRecords(db, "SITE_CONTENT"),
        programs: getSheetRecords(db, "PROGRAMS"),
        contacts: getSheetRecords(db, "CONTACTS"),
        faq: getSheetRecords(db, "FAQ"),
        settings: getSettingsRecord(db),
        timestamp: new Date().toISOString()
      });
    }

    return jsonResponse({ success: false, error: "Unknown action: " + action });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * Handle POST Requests
 * Endpoints:
 * - action: "submit_application"
 * - action: "update_content"
 * - action: "update_program"
 * - action: "update_application"
 * - action: "delete_application"
 * - action: "update_contact"
 * - action: "update_faq"
 * - action: "delete_faq"
 * - action: "update_settings"
 * - action: "sync_all"
 * - action: "init_sheets"
 */
function doPost(e) {
  try {
    var rawData = e && e.postData ? e.postData.contents : null;
    if (!rawData) {
      return jsonResponse({ success: false, error: "Empty request payload" });
    }

    var payload = JSON.parse(rawData);
    var action = payload.action;
    var secret = payload.secret || "";

    if (API_SECRET && API_SECRET.trim() !== "" && secret !== API_SECRET) {
      if (action !== "submit_application") {
        return jsonResponse({ success: false, error: "Unauthorized admin request" }, 401);
      }
    }

    var db = getDb();
    if (!db) {
      return jsonResponse({ success: false, error: "Cannot access Spreadsheet" });
    }

    if (action === "init_sheets") {
      return jsonResponse(initializeSpreadsheet(db));
    }

    // 1. Submit Application from Website
    if (action === "submit_application") {
      return jsonResponse(recordApplication(db, payload.data));
    }

    // 2. Update Content Field
    if (action === "update_content") {
      return jsonResponse(updateContentField(db, payload.data, payload.adminUser));
    }

    // 3. Update Program
    if (action === "update_program") {
      return jsonResponse(updateProgramRecord(db, payload.data, payload.adminUser));
    }

    // 4. Update Application Status & Notes
    if (action === "update_application") {
      return jsonResponse(updateApplicationRecord(db, payload.data, payload.adminUser));
    }

    // 5. Delete Application
    if (action === "delete_application") {
      return jsonResponse(deleteApplicationRecord(db, payload.applicationId, payload.adminUser));
    }

    // 6. Update Contact
    if (action === "update_contact") {
      return jsonResponse(updateContactRecord(db, payload.data, payload.adminUser));
    }

    // 7. Update or Create FAQ
    if (action === "update_faq") {
      return jsonResponse(updateFaqRecord(db, payload.data, payload.adminUser));
    }

    // 8. Delete FAQ
    if (action === "delete_faq") {
      return jsonResponse(deleteFaqRecord(db, payload.faqId, payload.adminUser));
    }

    // 9. Update Settings
    if (action === "update_settings") {
      return jsonResponse(updateSettingsRecord(db, payload.data, payload.adminUser));
    }

    // 10. Sync All (Batch Update)
    if (action === "sync_all") {
      return jsonResponse(syncAllData(db, payload.data, payload.adminUser));
    }

    return jsonResponse({ success: false, error: "Unknown POST action: " + action });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

// ==============================================================================
// RECORD HANDLERS
// ==============================================================================

function recordApplication(db, app) {
  if (!app || !app.full_name || !app.email) {
    return { success: false, error: "Full name and email are required" };
  }

  var sheet = getOrCreateSheet(db, "APPLICATIONS", [
    "application_id", "created_at", "full_name", "email", "phone", "country", 
    "age", "program", "trading_experience", "investment_amount", "risk_tolerance", 
    "maximum_acceptable_loss", "contact_preference", "application_status", "admin_notes", "updated_at"
  ]);

  var id = app.application_id || ("APP-" + Utilities.formatDate(new Date(), "GMT", "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 900 + 100));
  var now = new Date().toISOString();

  sheet.appendRow([
    id,
    app.created_at || now,
    app.full_name,
    app.email,
    app.phone || "",
    app.country || "",
    app.age || "",
    app.program || "student",
    app.trading_experience || "Beginner",
    app.investment_amount || "",
    app.risk_tolerance || "",
    app.maximum_acceptable_loss || "",
    app.contact_preference || "WhatsApp / Telegram",
    app.application_status || "New",
    app.admin_notes || "",
    now
  ]);

  // Log in AUDIT_LOG
  appendAuditLog(db, "System", "CREATE", "APPLICATIONS", id, "None", "New application submitted for " + app.program);

  return { success: true, application_id: id, timestamp: now };
}

function updateContentField(db, item, adminUser) {
  var sheet = db.getSheetByName("SITE_CONTENT");
  if (!sheet) return { success: false, error: "SITE_CONTENT sheet not found" };

  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return { success: false, error: "No records found" };

  var headers = data[0];
  var idCol = headers.indexOf("id");
  var fieldKeyCol = headers.indexOf("field_key");
  var contentCol = headers.indexOf("content");
  var updatedCol = headers.indexOf("updated_at");
  var byCol = headers.indexOf("updated_by");

  var now = new Date().toISOString();
  var user = adminUser || "Admin";

  for (var r = 1; r < data.length; r++) {
    if ((item.id && data[r][idCol] === item.id) || (item.field_key && data[r][fieldKeyCol] === item.field_key)) {
      var oldValue = data[r][contentCol];
      sheet.getRange(r + 1, contentCol + 1).setValue(item.content);
      if (updatedCol !== -1) sheet.getRange(r + 1, updatedCol + 1).setValue(now);
      if (byCol !== -1) sheet.getRange(r + 1, byCol + 1).setValue(user);

      appendAuditLog(db, user, "UPDATE", "SITE_CONTENT", item.field_key || item.id, oldValue, item.content);
      return { success: true, updated: item.field_key || item.id, timestamp: now };
    }
  }

  // If not found, append it
  sheet.appendRow([
    item.id || "content-" + Date.now(),
    item.section || "home",
    item.field_key,
    item.field_label || item.field_key,
    item.content,
    item.content_type || "text",
    item.status || "active",
    now,
    user
  ]);

  appendAuditLog(db, user, "CREATE", "SITE_CONTENT", item.field_key, "", item.content);
  return { success: true, created: item.field_key, timestamp: now };
}

function updateProgramRecord(db, prog, adminUser) {
  var sheet = db.getSheetByName("PROGRAMS");
  if (!sheet) return { success: false, error: "PROGRAMS sheet not found" };

  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var keyCol = headers.indexOf("program_key");
  var user = adminUser || "Admin";
  var now = new Date().toISOString();

  for (var r = 1; r < data.length; r++) {
    if (data[r][keyCol] === prog.program_key) {
      var oldStatus = data[r][headers.indexOf("status")];
      // Update values
      if (headers.indexOf("program_name") !== -1 && prog.program_name !== undefined) {
        sheet.getRange(r + 1, headers.indexOf("program_name") + 1).setValue(prog.program_name);
      }
      if (headers.indexOf("minimum_amount") !== -1 && prog.minimum_amount !== undefined) {
        sheet.getRange(r + 1, headers.indexOf("minimum_amount") + 1).setValue(prog.minimum_amount);
      }
      if (headers.indexOf("short_description") !== -1 && prog.short_description !== undefined) {
        sheet.getRange(r + 1, headers.indexOf("short_description") + 1).setValue(prog.short_description);
      }
      if (headers.indexOf("requirements") !== -1 && prog.requirements !== undefined) {
        sheet.getRange(r + 1, headers.indexOf("requirements") + 1).setValue(prog.requirements);
      }
      if (headers.indexOf("bonus_text") !== -1 && prog.bonus_text !== undefined) {
        sheet.getRange(r + 1, headers.indexOf("bonus_text") + 1).setValue(prog.bonus_text);
      }
      if (headers.indexOf("profit_sharing_text") !== -1 && prog.profit_sharing_text !== undefined) {
        sheet.getRange(r + 1, headers.indexOf("profit_sharing_text") + 1).setValue(prog.profit_sharing_text);
      }
      if (headers.indexOf("disclaimer") !== -1 && prog.disclaimer !== undefined) {
        sheet.getRange(r + 1, headers.indexOf("disclaimer") + 1).setValue(prog.disclaimer);
      }
      if (headers.indexOf("status") !== -1 && prog.status !== undefined) {
        sheet.getRange(r + 1, headers.indexOf("status") + 1).setValue(prog.status);
      }
      if (headers.indexOf("updated_at") !== -1) {
        sheet.getRange(r + 1, headers.indexOf("updated_at") + 1).setValue(now);
      }
      if (headers.indexOf("updated_by") !== -1) {
        sheet.getRange(r + 1, headers.indexOf("updated_by") + 1).setValue(user);
      }

      appendAuditLog(db, user, "UPDATE", "PROGRAMS", prog.program_key, "Status: " + oldStatus, "Status: " + prog.status);
      return { success: true, updated: prog.program_key, timestamp: now };
    }
  }

  return { success: false, error: "Program not found: " + prog.program_key };
}

function updateApplicationRecord(db, app, adminUser) {
  var sheet = db.getSheetByName("APPLICATIONS");
  if (!sheet) return { success: false, error: "APPLICATIONS sheet not found" };

  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf("application_id");
  var statusCol = headers.indexOf("application_status");
  var notesCol = headers.indexOf("admin_notes");
  var updatedCol = headers.indexOf("updated_at");

  var user = adminUser || "Admin";
  var now = new Date().toISOString();

  for (var r = 1; r < data.length; r++) {
    if (data[r][idCol] === app.application_id) {
      var oldStatus = data[r][statusCol];
      if (statusCol !== -1 && app.application_status) {
        sheet.getRange(r + 1, statusCol + 1).setValue(app.application_status);
      }
      if (notesCol !== -1 && app.admin_notes !== undefined) {
        sheet.getRange(r + 1, notesCol + 1).setValue(app.admin_notes);
      }
      if (updatedCol !== -1) {
        sheet.getRange(r + 1, updatedCol + 1).setValue(now);
      }

      appendAuditLog(db, user, "STATUS_CHANGE", "APPLICATIONS", app.application_id, oldStatus, app.application_status);
      return { success: true, updated: app.application_id };
    }
  }

  return { success: false, error: "Application not found: " + app.application_id };
}

function deleteApplicationRecord(db, applicationId, adminUser) {
  var sheet = db.getSheetByName("APPLICATIONS");
  if (!sheet) return { success: false, error: "APPLICATIONS sheet not found" };

  var data = sheet.getDataRange().getValues();
  var idCol = data[0].indexOf("application_id");
  var user = adminUser || "Admin";

  for (var r = 1; r < data.length; r++) {
    if (data[r][idCol] === applicationId) {
      sheet.deleteRow(r + 1);
      appendAuditLog(db, user, "DELETE", "APPLICATIONS", applicationId, "Existing application", "DELETED");
      return { success: true, deleted: applicationId };
    }
  }

  return { success: false, error: "Application not found" };
}

function updateContactRecord(db, contact, adminUser) {
  var sheet = db.getSheetByName("CONTACTS");
  if (!sheet) return { success: false, error: "CONTACTS sheet not found" };

  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var typeCol = headers.indexOf("contact_type");
  var labelCol = headers.indexOf("label");
  var valCol = headers.indexOf("value");
  var urlCol = headers.indexOf("url");
  var statusCol = headers.indexOf("status");
  var updatedCol = headers.indexOf("updated_at");

  var user = adminUser || "Admin";
  var now = new Date().toISOString();
  var targetType = String(contact.contact_type || "").toLowerCase();

  for (var r = 1; r < data.length; r++) {
    if (String(data[r][typeCol] || "").toLowerCase() === targetType) {
      var oldVal = data[r][valCol];
      if (labelCol !== -1 && contact.label !== undefined) sheet.getRange(r + 1, labelCol + 1).setValue(contact.label);
      if (valCol !== -1 && contact.value !== undefined) sheet.getRange(r + 1, valCol + 1).setValue(contact.value);
      if (urlCol !== -1 && contact.url !== undefined) sheet.getRange(r + 1, urlCol + 1).setValue(contact.url);
      if (statusCol !== -1 && contact.status !== undefined) sheet.getRange(r + 1, statusCol + 1).setValue(contact.status);
      if (updatedCol !== -1) sheet.getRange(r + 1, updatedCol + 1).setValue(now);

      appendAuditLog(db, user, "UPDATE", "CONTACTS", contact.contact_type, oldVal, contact.value || contact.url);
      return { success: true, updated: contact.contact_type };
    }
  }

  // If not found, append as new row
  var newRow = [];
  for (var h = 0; h < headers.length; h++) {
    var header = headers[h];
    if (header === "id") newRow.push("ct-" + Date.now());
    else if (header === "contact_type") newRow.push(contact.contact_type || "TikTok");
    else if (header === "label") newRow.push(contact.label || "TikTok Profile");
    else if (header === "value") newRow.push(contact.value || "@gold.trader.john");
    else if (header === "url") newRow.push(contact.url || "");
    else if (header === "status") newRow.push(contact.status || "active");
    else if (header === "updated_at") newRow.push(now);
    else newRow.push("");
  }
  sheet.appendRow(newRow);
  appendAuditLog(db, user, "CREATE", "CONTACTS", contact.contact_type, "None", contact.value || contact.url);
  return { success: true, created: contact.contact_type };
}

function updateFaqRecord(db, faq, adminUser) {
  var sheet = getOrCreateSheet(db, "FAQ", ["id", "question", "answer", "category", "display_order", "status", "updated_at"]);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idCol = headers.indexOf("id");
  var user = adminUser || "Admin";
  var now = new Date().toISOString();

  var faqId = faq.id || ("faq-" + Date.now());

  for (var r = 1; r < data.length; r++) {
    if (data[r][idCol] === faqId) {
      sheet.getRange(r + 1, headers.indexOf("question") + 1).setValue(faq.question);
      sheet.getRange(r + 1, headers.indexOf("answer") + 1).setValue(faq.answer);
      sheet.getRange(r + 1, headers.indexOf("category") + 1).setValue(faq.category || "General");
      sheet.getRange(r + 1, headers.indexOf("display_order") + 1).setValue(faq.display_order || 1);
      sheet.getRange(r + 1, headers.indexOf("status") + 1).setValue(faq.status || "active");
      sheet.getRange(r + 1, headers.indexOf("updated_at") + 1).setValue(now);

      appendAuditLog(db, user, "UPDATE", "FAQ", faqId, "Old FAQ", faq.question);
      return { success: true, updated: faqId };
    }
  }

  sheet.appendRow([
    faqId,
    faq.question,
    faq.answer,
    faq.category || "General",
    faq.display_order || 1,
    faq.status || "active",
    now
  ]);

  appendAuditLog(db, user, "CREATE", "FAQ", faqId, "", faq.question);
  return { success: true, created: faqId };
}

function deleteFaqRecord(db, faqId, adminUser) {
  var sheet = db.getSheetByName("FAQ");
  if (!sheet) return { success: false, error: "FAQ sheet not found" };

  var data = sheet.getDataRange().getValues();
  var idCol = data[0].indexOf("id");
  var user = adminUser || "Admin";

  for (var r = 1; r < data.length; r++) {
    if (data[r][idCol] === faqId) {
      sheet.deleteRow(r + 1);
      appendAuditLog(db, user, "DELETE", "FAQ", faqId, "FAQ", "DELETED");
      return { success: true, deleted: faqId };
    }
  }

  return { success: false, error: "FAQ not found" };
}

function updateSettingsRecord(db, settings, adminUser) {
  var sheet = getOrCreateSheet(db, "SETTINGS", [
    "website_name", "logo", "favicon", "primary_color", "secondary_color", 
    "support_email", "phone", "maintenance_mode", "registration_enabled", 
    "student_program_enabled", "mentee_program_enabled", "investor_program_enabled"
  ]);

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var rowValues = [];

  headers.forEach(function(h) {
    rowValues.push(settings[h] !== undefined ? settings[h] : "");
  });

  if (sheet.getLastRow() >= 2) {
    sheet.getRange(2, 1, 1, rowValues.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }

  var user = adminUser || "Admin";
  appendAuditLog(db, user, "UPDATE", "SETTINGS", "GLOBAL", "Previous Settings", JSON.stringify(settings));
  return { success: true, settings: settings };
}

function syncAllData(db, allData, adminUser) {
  // Batch update of content, programs, contacts
  if (allData.content && Array.isArray(allData.content)) {
    allData.content.forEach(function(item) {
      updateContentField(db, item, adminUser);
    });
  }
  if (allData.programs && Array.isArray(allData.programs)) {
    allData.programs.forEach(function(prog) {
      updateProgramRecord(db, prog, adminUser);
    });
  }
  if (allData.contacts && Array.isArray(allData.contacts)) {
    allData.contacts.forEach(function(cont) {
      updateContactRecord(db, cont, adminUser);
    });
  }
  if (allData.settings) {
    updateSettingsRecord(db, allData.settings, adminUser);
  }

  return { success: true, syncedAt: new Date().toISOString() };
}

// ==============================================================================
// HELPERS & INITIALIZATION
// ==============================================================================

function appendAuditLog(db, admin, action, section, recordId, oldValue, newValue) {
  try {
    var sheet = getOrCreateSheet(db, "AUDIT_LOG", [
      "log_id", "timestamp", "admin", "action", "section", "record_id", "old_value", "new_value"
    ]);

    var id = "LOG-" + Utilities.formatDate(new Date(), "GMT", "yyyyMMdd-HHmmss") + "-" + Math.floor(Math.random() * 900 + 100);
    sheet.appendRow([
      id,
      new Date().toISOString(),
      admin || "Admin",
      action || "UPDATE",
      section || "General",
      String(recordId || ""),
      String(oldValue || "").substring(0, 500),
      String(newValue || "").substring(0, 500)
    ]);
  } catch (e) {
    Logger.log("Failed to write audit log: " + e);
  }
}

function getSheetRecords(db, sheetName) {
  var sheet = db.getSheetByName(sheetName);
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  var headers = data[0];
  var records = [];

  for (var r = 1; r < data.length; r++) {
    var row = data[r];
    var item = {};
    for (var c = 0; c < headers.length; c++) {
      item[headers[c]] = row[c];
    }
    records.push(item);
  }

  return records;
}

function getSettingsRecord(db) {
  var sheet = db.getSheetByName("SETTINGS");
  if (!sheet) return {};

  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return {};

  var headers = data[0];
  var values = data[1];
  var settings = {};

  for (var c = 0; c < headers.length; c++) {
    var val = values[c];
    if (val === "TRUE" || val === true) val = true;
    if (val === "FALSE" || val === false) val = false;
    settings[headers[c]] = val;
  }

  return settings;
}

function getOrCreateSheet(db, name, headers) {
  var sheet = db.getSheetByName(name);
  if (!sheet) {
    sheet = db.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#1e293b").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function initializeSpreadsheet(db) {
  // 1. SITE_CONTENT
  var contentSheet = getOrCreateSheet(db, "SITE_CONTENT", [
    "id", "section", "field_key", "field_label", "content", "content_type", "status", "updated_at", "updated_by"
  ]);
  if (contentSheet.getLastRow() <= 1) {
    var defaultContent = [
      ["cnt-1", "home", "hero_title", "Hero Title", "Helping and teaching everyone to make more from less.", "text", "active", new Date().toISOString(), "System"],
      ["cnt-2", "home", "hero_subtitle", "Hero Subtitle", "Structured Commodities & Gold Mentorship, Institutional Signals, and Capital Management Partnerships.", "text", "active", new Date().toISOString(), "System"],
      ["cnt-3", "home", "hero_description", "Hero Description", "Master disciplined technical analysis, high-probability execution, and capital preservation with Gold Trader John.", "textarea", "active", new Date().toISOString(), "System"],
      ["cnt-4", "home", "hero_cta_primary", "Primary CTA Text", "Start Your Journey", "text", "active", new Date().toISOString(), "System"],
      ["cnt-5", "about", "about_title", "About Title", "Disciplined Trading. Proven Risk Controls.", "text", "active", new Date().toISOString(), "System"],
      ["cnt-6", "about", "about_description", "About Description", "Gold Trader John is a seasoned commodities and currency analyst dedicated to helping traders achieve consistent execution through structured rules, risk management, and strategic market patience.", "textarea", "active", new Date().toISOString(), "System"],
      ["cnt-7", "student", "student_min_deposit", "Student Min Amount", "$50", "text", "active", new Date().toISOString(), "System"],
      ["cnt-8", "mentee", "mentee_min_deposit", "Mentee Min Amount", "$200", "text", "active", new Date().toISOString(), "System"],
      ["cnt-9", "partner", "partner_min_deposit", "Partner Min Broker Deposit", "$300", "text", "active", new Date().toISOString(), "System"],
      ["cnt-10", "contact", "broker_url", "Broker Registration URL", "https://track.account.xellion.com/?t=8fw9LoxmvtMQ", "url", "active", new Date().toISOString(), "System"]
    ];
    defaultContent.forEach(function(row) { contentSheet.appendRow(row); });
  }

  // 2. PROGRAMS
  var progSheet = getOrCreateSheet(db, "PROGRAMS", [
    "id", "program_key", "program_name", "short_description", "minimum_amount", 
    "requirements", "bonus_text", "profit_sharing_text", "disclaimer", "status", "updated_at", "updated_by"
  ]);
  if (progSheet.getLastRow() <= 1) {
    var defaultProgs = [
      ["prg-1", "student", "Trading Student", "General & VIP Signals Access with structured guidance", "$50", "Minimum $50 broker account balance. Registration via recommended broker.", "120% first-deposit broker promotion subject to terms.", "Weekly profit-sharing terms while following signals or developing under mentorship.", "Trading financial markets involves risk. Profits are not guaranteed.", "active", new Date().toISOString(), "System"],
      ["prg-2", "mentee", "Trading Mentee", "1-on-1 Structured 5-Stage Trader Development", "$200", "Minimum $200 account capital. Dedication to structured technical and fundamental study.", "Promotional 120% broker bonus subject to broker eligibility requirements.", "Profit-sharing disclaimers apply. Educational mentoring with practical setup guidance.", "Past performance is not indicative of future results.", "active", new Date().toISOString(), "System"],
      ["prg-3", "investor", "Investment Partnership", "50/50 Capital Trading Management Partnership", "$300", "Minimum $300 broker deposit on authorized platform. No trading interference.", "Promotional 120% deposit bonus available subject to broker terms.", "50/50 profit sharing on withdrawals. Zero upfront management fees.", "Capital at risk. Never commit funds you cannot afford to lose.", "active", new Date().toISOString(), "System"]
    ];
    defaultProgs.forEach(function(row) { progSheet.appendRow(row); });
  }

  // 3. CONTACTS
  var contactSheet = getOrCreateSheet(db, "CONTACTS", [
    "id", "contact_type", "label", "value", "url", "status", "updated_at"
  ]);
  if (contactSheet.getLastRow() <= 1) {
    var defaultContacts = [
      ["ct-1", "telegram_channel", "Telegram Channel", "@goldtraderjohn1", "https://t.me/goldtraderjohn1", "active", new Date().toISOString()],
      ["ct-4", "whatsapp_group", "WhatsApp Group", "Community Discussion Hub", "https://chat.whatsapp.com/KWnld9kAbBN0sn7npUnYeN", "active", new Date().toISOString()],
      ["ct-6", "TikTok", "TikTok Profile", "@gold.trader.john", "https://www.tiktok.com/@gold.trader.john?_r=1&_t=ZN-99aAz1s1cjW", "active", new Date().toISOString()],
      ["ct-2", "telegram_direct", "Telegram Direct Line", "@goldtraderjohn01", "https://t.me/goldtraderjohn01", "active", new Date().toISOString()],
      ["ct-3", "whatsapp_direct", "WhatsApp Direct Line", "+234 704 643 8161", "https://wa.me/2347046438161", "active", new Date().toISOString()],
      ["ct-5", "recommended_broker", "Recommended Broker", "Xellion Global Broker Portal", "https://track.account.xellion.com/?t=8fw9LoxmvtMQ", "active", new Date().toISOString()]
    ];
    defaultContacts.forEach(function(row) { contactSheet.appendRow(row); });
  }

  // 4. APPLICATIONS
  getOrCreateSheet(db, "APPLICATIONS", [
    "application_id", "created_at", "full_name", "email", "phone", "country", 
    "age", "program", "trading_experience", "investment_amount", "risk_tolerance", 
    "maximum_acceptable_loss", "contact_preference", "application_status", "admin_notes", "updated_at"
  ]);

  // 5. SETTINGS
  var settingsSheet = getOrCreateSheet(db, "SETTINGS", [
    "website_name", "logo", "favicon", "primary_color", "secondary_color", 
    "support_email", "phone", "maintenance_mode", "registration_enabled", 
    "student_program_enabled", "mentee_program_enabled", "investor_program_enabled"
  ]);
  if (settingsSheet.getLastRow() <= 1) {
    settingsSheet.appendRow([
      "Gold Trader John Trading World",
      "/logo.png",
      "/favicon.ico",
      "#2563eb",
      "#f59e0b",
      "support@goldtraderjohn.com",
      "+234 704 643 8161",
      false,
      true,
      true,
      true,
      true
    ]);
  }

  // 6. FAQ
  var faqSheet = getOrCreateSheet(db, "FAQ", [
    "id", "question", "answer", "category", "display_order", "status", "updated_at"
  ]);
  if (faqSheet.getLastRow() <= 1) {
    var defaultFaqs = [
      ["faq-1", "What is the minimum capital to start as a Trading Student?", "The minimum recommended account balance is $50. This gives you full access to both general analysis and high-probability VIP signals.", "Programs", 1, "active", new Date().toISOString()],
      ["faq-2", "How does the 120% First Deposit Bonus work?", "Eligible traders registering via the authorized broker portal can claim a promotional 120% first deposit bonus directly from the broker, subject to broker terms and trading turnover conditions.", "Broker & Bonuses", 2, "active", new Date().toISOString()],
      ["faq-3", "How is the 50/50 Investment Partnership structured?", "In the Investment Partnership, your funds remain in your personal registered broker account under agreed management terms. Profit splits of 50/50 occur only on realized net withdrawals.", "Partnership", 3, "active", new Date().toISOString()],
      ["faq-4", "Are profits guaranteed in any program?", "No. Financial market trading inherently carries substantial risk. Capital preservation and disciplined risk-to-reward management are our core focus, but profits are never guaranteed.", "Risk & Disclaimers", 4, "active", new Date().toISOString()]
    ];
    defaultFaqs.forEach(function(row) { faqSheet.appendRow(row); });
  }

  // 7. AUDIT_LOG
  getOrCreateSheet(db, "AUDIT_LOG", [
    "log_id", "timestamp", "admin", "action", "section", "record_id", "old_value", "new_value"
  ]);

  return { success: true, message: "All 7 Google Sheets tabs initialized with default schemas and content." };
}

function jsonResponse(data, statusCode) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
