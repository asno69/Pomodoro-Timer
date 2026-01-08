const STORAGE_KEY = "pomo_v2";

export function saveStateToStorage(state, dom) {
  const payload = {
    tasks: state.tasks,
    currentTaskIndex: state.currentTaskIndex,
    phase: state.phase,
    totalSeconds: state.totalSeconds,
    remainingSeconds: state.remainingSeconds,
    isRunning: state.isRunning,

    breakMin: dom.breakMinInput.value,
    breakSec: dom.breakSecInput.value,

    savedAt: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function loadStateFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
