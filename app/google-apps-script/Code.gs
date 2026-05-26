// ============================================================
// DecaShift — Google Apps Script Web App  (v2)
// ============================================================
// SETUP:
//  1. script.google.com → New Project → paste this file
//  2. Deploy → New Deployment → Web App
//     Execute as: Me  |  Who has access: Anyone
//  3. Copy the Web App URL
//  4. Paste into APPS_SCRIPT_URL in app/ui/storage.js
//
// Drive folder structure created automatically:
//   <FOLDER_ID>/
//   ├── users/
//   │   └── user_{userId}.json        ← one file per user
//   ├── sessions/
//   │   └── {userId}/
//   │       └── sess_{sessionId}.json ← one file per session
//   └── logs/
//       └── log_{timestamp}.json      ← one file per event
// ============================================================

const FOLDER_ID = '1EENu6cQzED2mjSdWCuXRLYYQ_BBxbPTp';

// ── Entry Points ──────────────────────────────────────────────────────────────

function doGet() {
  return _json({ status: 'DecaShift API running', version: '2.0' });
}

function doPost(e) {
  try {
    const body   = JSON.parse(e.postData.contents);
    const action = body.action;
    const data   = body.payload;

    if (action === 'saveUser')    return _json(saveUser(data));
    if (action === 'saveSession') return _json(saveSession(data));

    return _json({ success: false, error: 'Unknown action: ' + action });
  } catch (err) {
    _writeLog({ event: 'error', error: err.message, timestamp: new Date().toISOString() });
    return _json({ success: false, error: err.message });
  }
}

// ── User — one file per user ──────────────────────────────────────────────────

function saveUser(user) {
  const usersFolder = _subFolder(_rootFolder(), 'users');
  const filename    = 'user_' + user.userId + '.json';
  const content     = JSON.stringify(user, null, 2);

  const iter = usersFolder.getFilesByName(filename);
  if (iter.hasNext()) {
    iter.next().setContent(content);           // update existing user file
  } else {
    usersFolder.createFile(filename, content, MimeType.PLAIN_TEXT);
  }

  _writeLog({ event: 'user_saved', userId: user.userId });
  return { success: true };
}

// ── Session — one file per session, write-once ────────────────────────────────

function saveSession(session) {
  const root           = _rootFolder();
  const sessionsFolder = _subFolder(root, 'sessions');
  const userFolder     = _subFolder(sessionsFolder, session.userId);
  const filename       = 'sess_' + session.sessionId + '.json';

  userFolder.createFile(filename, JSON.stringify(session, null, 2), MimeType.PLAIN_TEXT);

  _writeLog({ event: 'session_saved', sessionId: session.sessionId, userId: session.userId, score: session.score + '/' + session.total });
  return { success: true };
}

// ── Logs — one file per event, silent ────────────────────────────────────────

function _writeLog(data) {
  try {
    const logsFolder = _subFolder(_rootFolder(), 'logs');
    const ts         = new Date().toISOString().replace(/[:.]/g, '-');
    const content    = JSON.stringify({ ...data, timestamp: new Date().toISOString() }, null, 2);
    logsFolder.createFile('log_' + ts + '.json', content, MimeType.PLAIN_TEXT);
  } catch (_) {
    // never let log writing break the main response
  }
}

// ── Drive helpers ─────────────────────────────────────────────────────────────

function _rootFolder() {
  return DriveApp.getFolderById(FOLDER_ID);
}

function _subFolder(parent, name) {
  const iter = parent.getFoldersByName(name);
  return iter.hasNext() ? iter.next() : parent.createFolder(name);
}

function _json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
