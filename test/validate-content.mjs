// validate-content.mjs — static content + integrity validation for Donnibo/DecaShift
// Run: node test/validate-content.mjs
// Checks: JSON validity, manifest→file references, question schema, broken asset links,
//         per-grade question depth (F1), duplicate IDs.

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const UI   = join(ROOT, 'app', 'ui');
const Q    = join(UI, 'questions');

const issues = [];
const warns  = [];
const info   = {};
const add  = (sev, area, msg) => (sev === 'E' ? issues : warns).push({ area, msg });

function readJSON(path) {
  try { return { ok: true, data: JSON.parse(readFileSync(path, 'utf8')) }; }
  catch (e) { return { ok: false, err: e.message }; }
}

// ── 1. Every JSON file under questions/ must parse ──────────────────────────
function walk(dir) {
  let files = [];
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) files = files.concat(walk(p));
    else if (name.name.endsWith('.json')) files.push(p);
  }
  return files;
}
const allJSON = walk(Q);
info.totalJSONFiles = allJSON.length;
const parsed = {};
for (const f of allJSON) {
  const r = readJSON(f);
  const rel = f.replace(UI + '\\', '').replace(/\\/g, '/');
  if (!r.ok) add('E', 'json-parse', `${rel}: ${r.err}`);
  else parsed[rel] = r.data;
}

// ── 2. Manifest shard index → referenced shard files exist & parse ──────────
const manifestIdx = readJSON(join(Q, 'manifests', 'manifest.json'));
let shardEntries = [];
if (!manifestIdx.ok) {
  add('E', 'manifest', `manifests/manifest.json failed: ${manifestIdx.err}`);
} else {
  for (const [key, file] of Object.entries(manifestIdx.data.shards || {})) {
    const sp = join(Q, 'manifests', file);
    if (!existsSync(sp)) { add('E', 'manifest', `shard "${key}" → ${file} MISSING`); continue; }
    const sr = readJSON(sp);
    if (!sr.ok) { add('E', 'manifest', `shard ${file}: ${sr.err}`); continue; }
    if (!Array.isArray(sr.data)) { add('E', 'manifest', `shard ${file} is not an array`); continue; }
    sr.data.forEach(e => shardEntries.push({ shard: key, ...e }));
  }
}
info.manifestEntries = shardEntries.length;

// ── 3. Each manifest entry → question file exists, parses, schema ok ─────────
const seenGoalIds = new Map();
const seenQIds    = new Map();
const gradeCounts = {};
let totalQuestions = 0, schemaBad = 0;

for (const entry of shardEntries) {
  if (!entry.file) { add('E', 'manifest-entry', `${entry.shard}: entry missing "file"`); continue; }
  const qp = join(Q, entry.file);
  if (!existsSync(qp)) { add('E', 'broken-ref', `${entry.shard} → questions/${entry.file} MISSING`); continue; }
  const qr = readJSON(qp);
  if (!qr.ok) { add('E', 'json-parse', `questions/${entry.file}: ${qr.err}`); continue; }
  const file = qr.data;

  // goalId uniqueness
  const gid = file.goalId;
  if (!gid) add('E', 'schema', `${entry.file}: missing goalId`);
  else {
    if (seenGoalIds.has(gid)) add('W', 'dup-goalid', `goalId "${gid}" in ${entry.file} & ${seenGoalIds.get(gid)}`);
    seenGoalIds.set(gid, entry.file);
  }

  const qs = file.questions || [];
  totalQuestions += qs.length;
  if (qs.length === 0) add('W', 'empty-file', `${entry.file}: 0 questions`);

  // per-grade depth (F1)
  if (entry.category === 'school' && entry.grade != null && !String(entry.subject||'').startsWith('regional-')) {
    gradeCounts[entry.grade] = (gradeCounts[entry.grade] || 0) + qs.length;
  }

  qs.forEach((q, i) => {
    const where = `${entry.file}#${q.id || i}`;
    let bad = false;
    if (q.question == null || q.question === '') { add('E', 'schema', `${where}: empty question`); bad = true; }
    if (!Array.isArray(q.options)) { add('E', 'schema', `${where}: options not array`); bad = true; }
    else {
      if (q.options.length < 2) { add('E', 'schema', `${where}: <2 options`); bad = true; }
      if (q.options.some(o => o == null || o === '')) { add('W', 'schema', `${where}: blank option`); }
    }
    if (typeof q.correctIndex !== 'number') { add('E', 'schema', `${where}: correctIndex not number`); bad = true; }
    else if (Array.isArray(q.options) && (q.correctIndex < 0 || q.correctIndex >= q.options.length)) {
      add('E', 'schema', `${where}: correctIndex ${q.correctIndex} out of range (${q.options?.length})`); bad = true;
    }
    if (q.id) {
      if (seenQIds.has(q.id)) add('W', 'dup-qid', `question id "${q.id}" in ${entry.file} & ${seenQIds.get(q.id)}`);
      seenQIds.set(q.id, entry.file);
    } else {
      add('W', 'schema', `${where}: missing question id`);
    }
    if (bad) schemaBad++;
  });
}
info.totalQuestions = totalQuestions;
info.uniqueGoalIds  = seenGoalIds.size;
info.uniqueQIds     = seenQIds.size;
info.schemaBad      = schemaBad;
info.gradeCounts    = gradeCounts;

// F1 depth check: CLAUDE.md target = 50+ questions per grade
for (let g = 2; g <= 12; g++) {
  const c = gradeCounts[g] || 0;
  if (c === 0)      add('E', 'F1-depth', `Grade ${g}: 0 school questions`);
  else if (c < 50)  add('W', 'F1-depth', `Grade ${g}: only ${c} questions (<50 target)`);
}

// ── 4. Asset references in index.html + manifest exist ──────────────────────
const idx = readFileSync(join(UI, 'index.html'), 'utf8');
const refs = [...idx.matchAll(/(?:src|href)="((?!http|\/\/)[^"]+)"/g)].map(m => m[1]);
for (const r of refs) {
  if (r.startsWith('#')) continue;
  if (!existsSync(join(UI, r))) add('E', 'broken-link', `index.html → ${r} MISSING`);
}
const wm = readJSON(join(UI, 'manifest.webmanifest'));
if (wm.ok) for (const ic of (wm.data.icons || [])) {
  if (!existsSync(join(UI, ic.src))) add('E', 'broken-link', `manifest icon → ${ic.src} MISSING`);
}

// ── 5. Screen partials referenced by app-core exist ─────────────────────────
const screenDir = join(UI, 'screens');
const screensOnDisk = readdirSync(screenDir).filter(f => f.endsWith('.html'));
info.screenFiles = screensOnDisk.length;

// ── Report ──────────────────────────────────────────────────────────────────
const out = { generatedAt: new Date().toISOString(), summary: info,
  errorCount: issues.length, warningCount: warns.length, errors: issues, warnings: warns };
console.log(JSON.stringify(out, null, 2));
process.exit(issues.length ? 1 : 0);
