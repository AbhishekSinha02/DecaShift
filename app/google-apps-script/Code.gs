// ============================================================
// DecaShift — Google Apps Script Web App
// ============================================================
// SETUP:
//  1. Open script.google.com → New Project → paste this file
//  2. Deploy → New Deployment → Web App
//     Execute as: Me  |  Who has access: Anyone
//  3. Copy the Web App URL
//  4. Paste it into APPS_SCRIPT_URL in app/ui/storage.js
// ============================================================

const FOLDER_ID = '1EENu6cQzED2mjSdWCuXRLYYQ_BBxbPTp';

// ── Entry Points ──────────────────────────────────────────────────────────────

function doGet() {
  return _json({ status: 'DecaShift API running', version: '1.0' });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;
    const data = body.payload;

    if (action === 'saveUser')    return _json(saveUser(data));
    if (action === 'saveSession') return _json(saveSession(data));

    return _json({ success: false, error: 'Unknown action: ' + action });
  } catch (err) {
    return _json({ success: false, error: err.message });
  }
}

// ── User Storage ─────────────────────────────────────────────────────────────

function saveUser(user) {
  const usersFolder = _subFolder(_rootFolder(), 'users');
  const users = _readJSON(usersFolder, 'users.json', []);

  const idx = users.findIndex(u => u.email === user.email);
  const isNew = idx < 0;

  if (isNew) {
    user.savedAt = new Date().toISOString();
    users.push(user);
    _appendCSV(usersFolder, 'users.csv',
      ['userId','name','email','mobile','role','company','registeredAt','savedAt'],
      user
    );
  } else {
    users[idx] = Object.assign({}, users[idx], user, { updatedAt: new Date().toISOString() });
  }

  _writeJSON(usersFolder, 'users.json', users);
  return { success: true, action: isNew ? 'created' : 'updated' };
}

// ── Session Storage ───────────────────────────────────────────────────────────

function saveSession(session) {
  const sessionsFolder = _subFolder(_rootFolder(), 'sessions');
  const sessions = _readJSON(sessionsFolder, 'sessions.json', []);

  session.savedAt = new Date().toISOString();
  sessions.push(session);
  _writeJSON(sessionsFolder, 'sessions.json', sessions);

  _appendCSV(sessionsFolder, 'sessions.csv',
    ['sessionId','userId','goalId','sessionStart','sessionEnd',
     'totalDurationSeconds','score','total','accuracy','savedAt'],
    session
  );

  return { success: true };
}

// ── Drive Helpers ─────────────────────────────────────────────────────────────

function _rootFolder() {
  return DriveApp.getFolderById(FOLDER_ID);
}

function _subFolder(parent, name) {
  const iter = parent.getFoldersByName(name);
  return iter.hasNext() ? iter.next() : parent.createFolder(name);
}

function _readJSON(folder, filename, fallback) {
  const iter = folder.getFilesByName(filename);
  if (!iter.hasNext()) return fallback;
  try { return JSON.parse(iter.next().getBlob().getDataAsString()); }
  catch (_) { return fallback; }
}

function _writeJSON(folder, filename, data) {
  const content = JSON.stringify(data, null, 2);
  const iter = folder.getFilesByName(filename);
  if (iter.hasNext()) iter.next().setContent(content);
  else folder.createFile(filename, content, MimeType.PLAIN_TEXT);
}

function _appendCSV(folder, filename, headers, record) {
  const iter = folder.getFilesByName(filename);
  let csv = '';
  let file = null;

  if (iter.hasNext()) {
    file = iter.next();
    csv = file.getBlob().getDataAsString();
  } else {
    csv = headers.join(',') + '\n';
  }

  const row = headers
    .map(h => '"' + String(record[h] !== undefined ? record[h] : '').replace(/"/g, '""') + '"')
    .join(',');
  csv += row + '\n';

  if (file) file.setContent(csv);
  else folder.createFile(filename, csv, MimeType.PLAIN_TEXT);
}

function _json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
