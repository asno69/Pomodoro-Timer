export const DEFAULT_TASK_MINUTES = 25;
export const DEFAULT_TASK_SECONDS = 0;
export const DEFAULT_BREAK_MINUTES = 5;
export const DEFAULT_BREAK_SECONDS = 0;

export function createInitialState() {
  return {
    phase: "work", // "work" | "break"
    tasks: [],
    currentTaskIndex: 0,

    totalSeconds: DEFAULT_TASK_MINUTES * 60 + DEFAULT_TASK_SECONDS,
    remainingSeconds: DEFAULT_TASK_MINUTES * 60 + DEFAULT_TASK_SECONDS,

    isRunning: false,
    intervalId: null,

    pendingNextAction: null,
  };
}

export function hydrateStateFromStorage(state, stored, dom) {
  state.tasks = Array.isArray(stored.tasks) ? stored.tasks : [];
  state.currentTaskIndex = Number.isInteger(stored.currentTaskIndex) ? stored.currentTaskIndex : 0;
  state.phase = stored.phase === "break" ? "break" : "work";

  state.totalSeconds = Number.isFinite(stored.totalSeconds) ? Math.max(1, stored.totalSeconds) : state.totalSeconds;
  state.remainingSeconds = Number.isFinite(stored.remainingSeconds) ? Math.max(0, stored.remainingSeconds) : state.remainingSeconds;

  state.isRunning = !!stored.isRunning;

  // restore break inputs
  if (typeof stored.breakMin === "string") dom.breakMinInput.value = stored.breakMin;
  if (typeof stored.breakSec === "string") dom.breakSecInput.value = stored.breakSec;

  // clamp
  dom.breakMinInput.value = String(clampMinutesAllowZero(dom.breakMinInput.value, 0));
  dom.breakSecInput.value = String(clampSeconds(dom.breakSecInput.value));

  // fix index range
  if (state.tasks.length === 0) state.currentTaskIndex = 0;
  if (state.currentTaskIndex < 0) state.currentTaskIndex = 0;
  if (state.currentTaskIndex >= state.tasks.length) state.currentTaskIndex = Math.max(0, state.tasks.length - 1);
}

export function clampInt(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

export function clampSeconds(value) {
  const n = clampInt(value, 0);
  if (n < 0) return 0;
  if (n > 59) return 59;
  return n;
}

export function clampMinutesAllowZero(value, fallback) {
  const n = clampInt(value, fallback);
  return n < 0 ? 0 : n;
}

export function toTotalSeconds(minutes, seconds) {
  const m = clampMinutesAllowZero(minutes, 0);
  const s = clampSeconds(seconds);
  return Math.max(1, (m * 60) + s);
}

export function parseOptionalInt(str) {
  if (str === null || str === undefined) return null;
  const trimmed = String(str).trim();
  if (trimmed === "") return null;
  if (!/^\d+$/.test(trimmed)) return null;
  return parseInt(trimmed, 10);
}
