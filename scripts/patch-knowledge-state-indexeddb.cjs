const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'core', 'curriculum', 'learnerKnowledgeState.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add import at the top
const importStatement = `import {
  saveKnowledgeStateToIndexedDb,
  loadKnowledgeStateFromIndexedDb,
  flushSyncQueueToServer
} from '../../lib/offline/indexedDbLedger';\n\n`;

if (!content.includes('saveKnowledgeStateToIndexedDb')) {
  content = importStatement + content;
}

// 2. Enhance syncKnowledgeStateToServer
const oldSync = `        await fetch('/api/progress/knowledge-state', {`;
const newSync = `        await flushSyncQueueToServer(token, state).catch(() => {});\n        await fetch('/api/progress/knowledge-state', {`;

if (content.includes(oldSync) && !content.includes('flushSyncQueueToServer(token, state)')) {
  content = content.replace(oldSync, newSync);
}

// 3. Enhance saveLearnerKnowledgeState with IndexedDB async write
const oldSave = `    window.dispatchEvent(new CustomEvent('nihomi:knowledge-state-updated', { detail: state }));`;
const newSave = `    // Durable IndexedDB persistence
    saveKnowledgeStateToIndexedDb(state, userId).catch(() => {});
    window.dispatchEvent(new CustomEvent('nihomi:knowledge-state-updated', { detail: state }));`;

if (content.includes(oldSave) && !content.includes('saveKnowledgeStateToIndexedDb(state, userId)')) {
  content = content.replace(oldSave, newSave);
}

// 4. Add loadLearnerKnowledgeStateAsync at the bottom
const asyncLoadFn = `
export async function loadLearnerKnowledgeStateAsync(userId?: string): Promise<LearnerKnowledgeState> {
  const local = loadLearnerKnowledgeState(userId);
  try {
    const idbState = await loadKnowledgeStateFromIndexedDb(userId);
    if (idbState) {
      const merged: LearnerKnowledgeState = {
        ...local,
        ...idbState,
        knownHiragana: Array.from(new Set([...(local.knownHiragana || []), ...(idbState.knownHiragana || [])])),
        knownKatakana: Array.from(new Set([...(local.knownKatakana || []), ...(idbState.knownKatakana || [])])),
        knownVocabulary: Array.from(new Set([...(local.knownVocabulary || []), ...(idbState.knownVocabulary || [])])),
        knownKanji: Array.from(new Set([...(local.knownKanji || []), ...(idbState.knownKanji || [])])),
        masteredSkills: Array.from(new Set([...(local.masteredSkills || []), ...(idbState.masteredSkills || [])])),
        totalXp: Math.max(local.totalXp || 0, idbState.totalXp || 0),
        streakDays: Math.max(local.streakDays || 0, idbState.streakDays || 0)
      };
      return merged;
    }
  } catch (e) {
    console.warn('[KnowledgeState] Async IDB load fallback:', e);
  }
  return local;
}
`;

if (!content.includes('loadLearnerKnowledgeStateAsync')) {
  content = content + asyncLoadFn;
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched learnerKnowledgeState.ts with IndexedDB integration!');
