# STORAGE.md — DecaShift Storage & Sync Architecture

> **Purpose:** Feed this to AI when generating `storage.js`. Covers localStorage schema, remote sync, export functions.

---

## Storage Strategy

```
User answers a question
        │
        ▼
  Accumulate in memory (state.responses[])
        │
        ▼
  Session ends (result screen shown)
        │
        ├─── Try remote sync (fetch POST) ──► Success: log it
        │           │
        │           └─► Fail / no endpoint: silently continue
        │
        └─── Always save to localStorage
```

**Rule:** localStorage is always written. Remote sync is always attempted but never blocks the UI.

---

## localStorage Key Schema

```
decashift_userid          → string (persists forever — user's identity)
decashift_sessions        → JSON array of SessionRecord objects
decashift_goals_custom    → JSON array of user-created Goal objects
decashift_questions_custom → JSON array of user-created Question objects
```

---

## Session Record Schema (what gets stored)

```js
// Full session record — one per completed quiz
{
  sessionId: "sess_abc123",           // crypto.randomUUID()
  userId: "user_xyz789",              // from localStorage or generated once
  goalId: "azure-aks",               // selected goal
  goalName: "Azure AKS Deep Dive",   // denormalized for easy export
  sessionStart: "2024-05-25T10:00:00.000Z",
  sessionEnd: "2024-05-25T10:15:32.000Z",
  totalDurationSeconds: 932,
  score: 7,
  total: 10,
  accuracy: 0.7,
  responses: [
    {
      questionId: "aks-001",
      questionText: "What is the purpose...",   // denormalized
      selectedIndex: 0,
      selectedText: "Federate pod identity...", // denormalized
      correctIndex: 0,
      correctText: "Federate pod identity...", // denormalized
      isCorrect: true,
      startTime: "2024-05-25T10:00:05.000Z",
      endTime: "2024-05-25T10:00:42.000Z",
      durationSeconds: 37
    }
  ]
}
```

---

## storage.js — All Functions to Implement

```js
// ─── CONFIG ───────────────────────────────────────────────────────────────────
const STORAGE_CONFIG = {
  remoteEndpoint: "",  // Google Apps Script URL — leave empty to disable
  localKey: "decashift_sessions",
  userIdKey: "decashift_userid",
  customGoalsKey: "decashift_goals_custom",
  customQuestionsKey: "decashift_questions_custom"
};

// ─── USER ID ──────────────────────────────────────────────────────────────────
function getOrCreateUserId() {
  let id = localStorage.getItem(STORAGE_CONFIG.userIdKey);
  if (!id) {
    id = "user_" + crypto.randomUUID().split("-")[0];
    localStorage.setItem(STORAGE_CONFIG.userIdKey, id);
  }
  return id;
}

// ─── SAVE SESSION ─────────────────────────────────────────────────────────────
async function saveSession(sessionData) {
  // 1. Always save to localStorage first
  const existing = loadAllSessions();
  existing.push(sessionData);
  localStorage.setItem(STORAGE_CONFIG.localKey, JSON.stringify(existing));

  // 2. Try remote sync (non-blocking)
  if (STORAGE_CONFIG.remoteEndpoint) {
    try {
      await fetch(STORAGE_CONFIG.remoteEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData)
      });
    } catch (e) {
      console.warn("Remote sync failed, local save succeeded:", e.message);
    }
  }
}

// ─── LOAD ─────────────────────────────────────────────────────────────────────
function loadAllSessions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_CONFIG.localKey) || "[]");
  } catch {
    return [];
  }
}

function getLastSessionForGoal(goalId) {
  const all = loadAllSessions().filter(s => s.goalId === goalId);
  return all.length ? all[all.length - 1] : null;
}

function getBestScoreForGoal(goalId) {
  const all = loadAllSessions().filter(s => s.goalId === goalId);
  if (!all.length) return null;
  return Math.max(...all.map(s => s.accuracy));
}

// ─── RESET ────────────────────────────────────────────────────────────────────
function clearSessionsForGoal(goalId) {
  const remaining = loadAllSessions().filter(s => s.goalId !== goalId);
  localStorage.setItem(STORAGE_CONFIG.localKey, JSON.stringify(remaining));
}

// ─── CUSTOM GOALS ─────────────────────────────────────────────────────────────
function saveCustomGoal(goal) {
  const existing = loadCustomGoals();
  existing.push(goal);
  localStorage.setItem(STORAGE_CONFIG.customGoalsKey, JSON.stringify(existing));
}

function loadCustomGoals() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_CONFIG.customGoalsKey) || "[]");
  } catch {
    return [];
  }
}

function saveCustomQuestions(questions) {
  const existing = loadCustomQuestions();
  const merged = [...existing, ...questions];
  localStorage.setItem(STORAGE_CONFIG.customQuestionsKey, JSON.stringify(merged));
}

function loadCustomQuestions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_CONFIG.customQuestionsKey) || "[]");
  } catch {
    return [];
  }
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────
function exportAsJSON(sessions) {
  const blob = new Blob([JSON.stringify(sessions, null, 2)], { type: "application/json" });
  triggerDownload(blob, `decashift_export_${Date.now()}.json`);
}

function exportAsCSV(sessions) {
  const rows = [];
  const headers = [
    "sessionId", "userId", "goalId", "goalName", "sessionStart", "sessionEnd",
    "totalDurationSeconds", "score", "total", "accuracy",
    "questionId", "questionText", "selectedIndex", "selectedText",
    "correctIndex", "correctText", "isCorrect", "durationSeconds"
  ];
  rows.push(headers.join(","));

  for (const session of sessions) {
    for (const r of session.responses) {
      const row = [
        session.sessionId, session.userId, session.goalId, `"${session.goalName}"`,
        session.sessionStart, session.sessionEnd,
        session.totalDurationSeconds, session.score, session.total, session.accuracy,
        r.questionId, `"${r.questionText?.replace(/"/g, '""')}"`,
        r.selectedIndex, `"${r.selectedText?.replace(/"/g, '""')}"`,
        r.correctIndex, `"${r.correctText?.replace(/"/g, '""')}"`,
        r.isCorrect, r.durationSeconds
      ];
      rows.push(row.join(","));
    }
  }

  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  triggerDownload(blob, `decashift_export_${Date.now()}.csv`);
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── EXPORTS ──────────────────────────────────────────────────────────────────
export {
  getOrCreateUserId,
  saveSession,
  loadAllSessions,
  getLastSessionForGoal,
  getBestScoreForGoal,
  clearSessionsForGoal,
  saveCustomGoal,
  loadCustomGoals,
  saveCustomQuestions,
  loadCustomQuestions,
  exportAsJSON,
  exportAsCSV
};
```

---

## Remote Sync: Google Apps Script Setup (Optional)

If you want free cloud sync without a backend:

1. Go to [script.google.com](https://script.google.com)
2. Create a new project, paste this:

```js
function doPost(e) {
  const sheet = SpreadsheetApp.openById("YOUR_SHEET_ID").getSheetByName("Sessions");
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.sessionId, data.userId, data.goalId,
    data.sessionStart, data.sessionEnd,
    data.score, data.total, data.accuracy,
    JSON.stringify(data.responses)
  ]);
  return ContentService.createTextOutput("OK");
}
```

3. Deploy → **Web App** → Execute as: Me, Access: Anyone
4. Copy the web app URL
5. Paste it into `STORAGE_CONFIG.remoteEndpoint` in `storage.js`

---

*Feed this file to AI alongside CLAUDE.md when generating `storage.js`.*
