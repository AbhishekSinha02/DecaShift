// ============================================================
// DecaShift — Google Apps Script Web App  (v3 — per-user folder)
// ============================================================
// SETUP:
//  1. script.google.com → New Project → paste this file
//  2. Deploy → New Deployment → Web App
//     Execute as: Me  |  Who has access: Anyone
//  3. Copy the Web App URL
//  4. Paste into APPS_SCRIPT_URL in app/ui/js/storage.js
//
// ⚠️ This file is NOT auto-deployed. After editing it here you MUST paste it
//    into the Apps Script project and create a NEW deployment for changes to
//    take effect on the live endpoint.
//
// Drive folder structure (v3 — FEAT-005: every student's data in one folder):
//   <FOLDER_ID>/
//   ├── accounts/
//   │   └── acc_{loginIdHash}.json     ← cross-device login lookup (keyed by User ID hash)
//   ├── users/
//   │   └── {userId}/                  ← one FOLDER per student (source of truth)
//   │       ├── profile.json           ← identity + learning profile
//   │       ├── entitlement.json       ← trial clock / plan (FEAT-005 item 2)
//   │       ├── journey.json           ← XP/avatar/streak/badges/mastery (filled by P2-T046)
//   │       └── sessions/
//   │           └── sess_{sessionId}.json
//   └── logs/
//       └── log_{timestamp}.json
// ============================================================

const FOLDER_ID = '1EENu6cQzED2mjSdWCuXRLYYQ_BBxbPTp';

// ── Entry Points ──────────────────────────────────────────────────────────────

function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'getAccount') {
    // client sends loginIdHash (User ID hash); keep emailHash as legacy fallback
    return _json(getAccount(e.parameter.loginIdHash || e.parameter.emailHash));
  }
  return _json({ status: 'DecaShift API running', version: '3.0' });
}

function doPost(e) {
  try {
    const body   = JSON.parse(e.postData.contents);
    const action = body.action;
    const data   = body.payload;

    if (action === 'saveUser')    return _json(saveUser(data));
    if (action === 'saveSession') return _json(saveSession(data));
    if (action === 'saveJourney') return _json(saveJourney(data));
    if (action === 'saveAccount') return _json(saveAccount(data));

    return _json({ success: false, error: 'Unknown action: ' + action });
  } catch (err) {
    _writeLog({ event: 'error', error: err.message, timestamp: new Date().toISOString() });
    return _json({ success: false, error: err.message });
  }
}

// ── Account — cross-device login ──────────────────────────────────────────────

function saveAccount(account) {
  const folder   = _subFolder(_rootFolder(), 'accounts');
  // client (storage.js) sends loginIdHash; tolerate legacy emailHash records
  const hash     = account.loginIdHash || account.emailHash;
  const filename = 'acc_' + hash + '.json';
  _writeFile(folder, filename, JSON.stringify(account, null, 2));
  _writeLog({ event: 'account_saved', loginIdHash: hash });
  return { success: true };
}

function getAccount(loginIdHash) {
  const folder   = _subFolder(_rootFolder(), 'accounts');
  const filename = 'acc_' + loginIdHash + '.json';
  const iter     = folder.getFilesByName(filename);
  if (!iter.hasNext()) return { found: false };
  const account = JSON.parse(iter.next().getBlob().getDataAsString());
  return { found: true, account };
}

// ── User — one FOLDER per user; profile + entitlement split into files ─────────

function saveUser(user) {
  const folder = _userFolder(user.userId);
  // entitlement is persisted as its own file; everything else is the profile
  const entitlement = user.entitlement || null;
  const profile     = Object.assign({}, user);
  delete profile.entitlement;

  _writeFile(folder, 'profile.json', JSON.stringify(profile, null, 2));
  if (entitlement) {
    _writeFile(folder, 'entitlement.json',
      JSON.stringify(Object.assign({ userId: user.userId }, entitlement), null, 2));
  }

  _writeLog({ event: 'user_saved', userId: user.userId });
  return { success: true };
}

// ── Journey — full growth state (XP/avatar/streak/badges/mastery) ──────────────
// Ready for P2-T046 cross-device sync; safe no-op shape until the client sends it.

function saveJourney(payload) {
  const folder = _userFolder(payload.userId);
  _writeFile(folder, 'journey.json', JSON.stringify(payload, null, 2));
  _writeLog({ event: 'journey_saved', userId: payload.userId });
  return { success: true };
}

// ── Session — one file per session, write-once, inside the user's folder ───────

function saveSession(session) {
  const sessionsFolder = _subFolder(_userFolder(session.userId), 'sessions');
  const filename       = 'sess_' + session.sessionId + '.json';
  sessionsFolder.createFile(filename, JSON.stringify(session, null, 2), MimeType.PLAIN_TEXT);

  _writeLog({ event: 'session_saved', sessionId: session.sessionId, userId: session.userId, score: session.score + '/' + session.total });
  return { success: true };
}

// ── Logs — one file per event, silent ────────────────────────────────────────

function _writeLog(data) {
  try {
    const logsFolder = _subFolder(_rootFolder(), 'logs');
    const ts         = new Date().toISOString().replace(/[:.]/g, '-');
    const content    = JSON.stringify(Object.assign({}, data, { timestamp: new Date().toISOString() }), null, 2);
    logsFolder.createFile('log_' + ts + '.json', content, MimeType.PLAIN_TEXT);
  } catch (_) {}
}

// ── Drive helpers ─────────────────────────────────────────────────────────────

function _rootFolder() {
  return DriveApp.getFolderById(FOLDER_ID);
}

function _subFolder(parent, name) {
  const iter = parent.getFoldersByName(name);
  return iter.hasNext() ? iter.next() : parent.createFolder(name);
}

// the per-student folder: users/{userId}/
function _userFolder(userId) {
  return _subFolder(_subFolder(_rootFolder(), 'users'), userId);
}

// create-or-overwrite a file by name in a folder
function _writeFile(folder, filename, content) {
  const iter = folder.getFilesByName(filename);
  if (iter.hasNext()) {
    iter.next().setContent(content);
  } else {
    folder.createFile(filename, content, MimeType.PLAIN_TEXT);
  }
}

function _json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
