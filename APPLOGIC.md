# APPLOGIC.md — DecaShift App Logic Guide

> **Purpose:** Feed this to AI when generating `app.js`. Covers state management, screen transitions, quiz engine, timer, and result calculation.

---

## Complete State Object

```js
const state = {
  // Navigation
  currentScreen: "home",       // "home" | "quiz" | "result"

  // Data (loaded from JSON files)
  allGoals: [],                // from goals.json + custom goals
  allQuestions: [],            // from questions.json + custom questions

  // Current session
  selectedGoal: null,          // Goal object
  sessionQuestions: [],        // Questions for selected goal (shuffled or ordered)
  currentIndex: 0,             // Current question index
  selectedOptionIndex: null,   // User's current selection (before submit)
  responses: [],               // Array of response objects

  // Timing
  sessionStart: null,          // Date object — when quiz began
  questionStart: null,         // Date object — when current question displayed
  timerInterval: null,         // setInterval reference

  // Identity
  userId: null,                // from storage.js getOrCreateUserId()
  sessionId: null              // crypto.randomUUID() per session
};
```

---

## Initialization Flow

```js
async function init() {
  // 1. Get or create user ID
  state.userId = getOrCreateUserId();

  // 2. Load goals.json and questions.json via fetch
  const [goalsRes, questionsRes] = await Promise.all([
    fetch("./goals.json"),
    fetch("./questions.json")
  ]);
  const staticGoals = await goalsRes.json();
  const staticQuestions = await questionsRes.json();

  // 3. Merge with custom goals/questions from localStorage
  state.allGoals = [...staticGoals, ...loadCustomGoals()];
  state.allQuestions = [...staticQuestions, ...loadCustomQuestions()];

  // 4. Render home screen
  renderHome();
  showScreen("home");
}

// Call on page load
document.addEventListener("DOMContentLoaded", init);
```

---

## Screen Switcher

```js
function showScreen(name) {
  // Hide all screens
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  // Show target
  document.getElementById(`screen-${name}`).classList.add("active");
  state.currentScreen = name;
}
```

---

## Screen 1: Home Render

```js
function renderHome() {
  const container = document.getElementById("goals-list");
  container.innerHTML = "";

  state.allGoals.forEach(goal => {
    const qCount = state.allQuestions.filter(q => q.goalId === goal.id).length;
    const lastSession = getLastSessionForGoal(goal.id);
    const lastScore = lastSession
      ? `Last: ${Math.round(lastSession.accuracy * 100)}%`
      : "Not started";

    const card = document.createElement("div");
    card.className = "goal-card card";
    card.innerHTML = `
      <div class="goal-card-body">
        <div class="goal-name">${goal.name}</div>
        <div class="goal-meta">${qCount} questions · ${lastScore}</div>
        <div class="goal-tags">${(goal.tags || []).map(t => `<span class="tag">${t}</span>`).join("")}</div>
      </div>
      <div class="goal-card-actions">
        <button class="btn btn-primary btn-sm" onclick="startGoal('${goal.id}')">Start</button>
        <button class="btn btn-danger btn-sm" onclick="confirmResetGoal('${goal.id}')">Reset</button>
      </div>
    `;
    container.appendChild(card);
  });
}
```

---

## Goal Selection & Quiz Start

```js
function startGoal(goalId) {
  // Set selected goal
  state.selectedGoal = state.allGoals.find(g => g.id === goalId);

  // Filter questions for this goal
  state.sessionQuestions = state.allQuestions
    .filter(q => q.goalId === goalId);
    // Optional: shuffle → .sort(() => Math.random() - 0.5)

  if (!state.sessionQuestions.length) {
    alert("No questions found for this goal.");
    return;
  }

  // Reset session state
  state.currentIndex = 0;
  state.responses = [];
  state.sessionStart = new Date();
  state.sessionId = crypto.randomUUID();
  state.selectedOptionIndex = null;

  // Update quiz topbar
  document.getElementById("quiz-goal-name").textContent = state.selectedGoal.name;

  // Show quiz screen and load first question
  showScreen("quiz");
  loadQuestion();
}
```

---

## Quiz Engine: Load Question

```js
function loadQuestion() {
  const q = state.sessionQuestions[state.currentIndex];
  state.questionStart = new Date();
  state.selectedOptionIndex = null;

  // Update progress
  const total = state.sessionQuestions.length;
  const current = state.currentIndex + 1;
  document.getElementById("progress-label").textContent = `Question ${current} of ${total}`;
  document.getElementById("progress-fill").style.width = `${((current - 1) / total) * 100}%`;

  // Render question
  document.getElementById("question-text").textContent = q.question;

  // Render options
  const optList = document.getElementById("options-list");
  optList.innerHTML = "";
  const labels = ["A", "B", "C", "D"];
  q.options.forEach((opt, i) => {
    const div = document.createElement("div");
    div.className = "option-card";
    div.dataset.index = i;
    div.innerHTML = `<span class="option-label">${labels[i]}</span><span class="option-text">${opt}</span>`;
    div.addEventListener("click", () => selectOption(i));
    optList.appendChild(div);
  });

  // Reset submit button and feedback
  document.getElementById("btn-submit").disabled = true;
  document.getElementById("feedback-panel").style.display = "none";

  // Start timer
  startTimer();
}
```

---

## Option Selection

```js
function selectOption(index) {
  // Prevent re-selection after submit
  if (document.getElementById("feedback-panel").style.display !== "none") return;

  state.selectedOptionIndex = index;

  // Update visual selection
  document.querySelectorAll(".option-card").forEach((card, i) => {
    card.classList.toggle("selected", i === index);
  });

  document.getElementById("btn-submit").disabled = false;
}
```

---

## Answer Submit & Feedback

```js
function submitAnswer() {
  const q = state.sessionQuestions[state.currentIndex];
  const questionEnd = new Date();
  stopTimer();

  const isCorrect = state.selectedOptionIndex === q.correctIndex;
  const durationSeconds = Math.round((questionEnd - state.questionStart) / 1000);

  // Store response
  state.responses.push({
    questionId: q.id,
    questionText: q.question,
    selectedIndex: state.selectedOptionIndex,
    selectedText: q.options[state.selectedOptionIndex],
    correctIndex: q.correctIndex,
    correctText: q.options[q.correctIndex],
    isCorrect,
    startTime: state.questionStart.toISOString(),
    endTime: questionEnd.toISOString(),
    durationSeconds
  });

  // Show correct/incorrect on cards
  document.querySelectorAll(".option-card").forEach((card, i) => {
    card.classList.add("disabled");
    if (i === q.correctIndex) card.classList.add("correct");
    else if (i === state.selectedOptionIndex && !isCorrect) card.classList.add("incorrect");
  });

  // Show feedback panel
  const feedbackPanel = document.getElementById("feedback-panel");
  document.getElementById("feedback-result").textContent = isCorrect ? "✅ Correct!" : "❌ Incorrect";
  document.getElementById("feedback-explanation").textContent = q.explanation || "";
  feedbackPanel.style.display = "block";

  // Update submit button
  document.getElementById("btn-submit").style.display = "none";

  // Check if last question
  const isLast = state.currentIndex === state.sessionQuestions.length - 1;
  document.getElementById("btn-next").textContent = isLast ? "See Results" : "Next Question →";
}
```

---

## Next Question / End Session

```js
function nextQuestion() {
  document.getElementById("btn-submit").style.display = "";

  if (state.currentIndex < state.sessionQuestions.length - 1) {
    state.currentIndex++;
    loadQuestion();
  } else {
    endSession();
  }
}

async function endSession() {
  const sessionEnd = new Date();
  const totalSeconds = Math.round((sessionEnd - state.sessionStart) / 1000);
  const score = state.responses.filter(r => r.isCorrect).length;
  const total = state.responses.length;
  const accuracy = total > 0 ? score / total : 0;

  const sessionData = {
    sessionId: state.sessionId,
    userId: state.userId,
    goalId: state.selectedGoal.id,
    goalName: state.selectedGoal.name,
    sessionStart: state.sessionStart.toISOString(),
    sessionEnd: sessionEnd.toISOString(),
    totalDurationSeconds: totalSeconds,
    score,
    total,
    accuracy,
    responses: state.responses
  };

  // Save (localStorage + optional remote)
  await saveSession(sessionData);

  // Render results
  renderResult(sessionData);
  showScreen("result");
}
```

---

## Result Screen Render

```js
function renderResult(session) {
  const pct = Math.round(session.accuracy * 100);
  document.getElementById("result-score").textContent = `${session.score} / ${session.total}`;
  document.getElementById("result-accuracy").textContent = `${pct}% Accuracy`;

  // Badge logic
  let badge = pct >= 80 ? "🔥 Excellent" : pct >= 60 ? "✅ Good" : "⚠️ Needs Work";
  document.getElementById("result-badge").textContent = badge;

  // Total time
  const mins = Math.floor(session.totalDurationSeconds / 60);
  const secs = session.totalDurationSeconds % 60;
  document.getElementById("result-time").textContent = `Total Time: ${mins}m ${secs}s`;

  // Breakdown table
  const tbody = document.getElementById("breakdown-body");
  tbody.innerHTML = "";
  session.responses.forEach((r, i) => {
    const tr = document.createElement("tr");
    const mins2 = Math.floor(r.durationSeconds / 60);
    const secs2 = r.durationSeconds % 60;
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td class="q-preview">${r.questionText.substring(0, 40)}...</td>
      <td>${mins2}:${String(secs2).padStart(2, "0")}</td>
      <td>${r.isCorrect ? "✅" : "❌"}</td>
    `;
    tbody.appendChild(tr);
  });

  // Wire export buttons
  document.getElementById("btn-export-json").onclick = () => exportAsJSON([session]);
  document.getElementById("btn-export-csv").onclick = () => exportAsCSV([session]);
  document.getElementById("btn-retry").onclick = () => startGoal(session.goalId);
  document.getElementById("btn-home").onclick = () => { renderHome(); showScreen("home"); };
}
```

---

## Timer Functions

```js
function startTimer() {
  clearInterval(state.timerInterval);
  const timerEl = document.getElementById("quiz-timer");
  let elapsed = 0;
  timerEl.textContent = "0:00";
  state.timerInterval = setInterval(() => {
    elapsed++;
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    timerEl.textContent = `${m}:${String(s).padStart(2, "0")}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(state.timerInterval);
  state.timerInterval = null;
}
```

---

## Reset Goal

```js
function confirmResetGoal(goalId) {
  const goal = state.allGoals.find(g => g.id === goalId);
  if (confirm(`Reset all progress for "${goal.name}"? This cannot be undone.`)) {
    clearSessionsForGoal(goalId);
    renderHome(); // Refresh cards to show "Not started"
  }
}
```

---

## Event Listener Wiring (bottom of app.js)

```js
document.getElementById("btn-submit").addEventListener("click", submitAnswer);
document.getElementById("btn-next").addEventListener("click", nextQuestion);
document.getElementById("btn-back-home").addEventListener("click", () => {
  stopTimer();
  renderHome();
  showScreen("home");
});
document.getElementById("btn-new-goal").addEventListener("click", () => {
  document.getElementById("modal-new-goal").style.display = "flex";
});
document.getElementById("btn-modal-cancel").addEventListener("click", () => {
  document.getElementById("modal-new-goal").style.display = "none";
});
document.getElementById("btn-modal-save").addEventListener("click", saveCustomGoalFromModal);
```

---

*Feed this file to AI alongside CLAUDE.md when generating `app.js`.*
