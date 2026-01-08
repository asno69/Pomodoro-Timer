import { DEFAULT_TASK_MINUTES, DEFAULT_TASK_SECONDS, clampMinutesAllowZero, clampSeconds, parseOptionalInt, toTotalSeconds } from "../core/state.js";

export function addTask(state, name) {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return;

  state.tasks.push({
    id: crypto.randomUUID(),
    name: trimmed,
    workMinutes: DEFAULT_TASK_MINUTES,
    workSeconds: DEFAULT_TASK_SECONDS,
    done: false,
  });

  if (state.tasks.length === 1) {
    state.currentTaskIndex = 0;
    state.phase = "work";
    state.totalSeconds = DEFAULT_TASK_MINUTES * 60 + DEFAULT_TASK_SECONDS;
    state.remainingSeconds = state.totalSeconds;
  }
}

export function removeTask(state, id) {
  const idx = state.tasks.findIndex(t => t.id === id);
  if (idx === -1) return;

  state.tasks.splice(idx, 1);
  if (state.tasks.length === 0) {
    state.currentTaskIndex = 0;
    return;
  }

  if (state.currentTaskIndex >= state.tasks.length) state.currentTaskIndex = state.tasks.length - 1;
}

export function selectTask(state, idx) {
  if (idx < 0 || idx >= state.tasks.length) return;
  state.currentTaskIndex = idx;
}

export function commitTaskTime(state, taskId, minutesStr, secondsStr) {
  const t = state.tasks.find(x => x.id === taskId);
  if (!t) return;

  const mRaw = parseOptionalInt(minutesStr);
  const sRaw = parseOptionalInt(secondsStr);

  const m = mRaw === null ? DEFAULT_TASK_MINUTES : clampMinutesAllowZero(mRaw, DEFAULT_TASK_MINUTES);
  const s = sRaw === null ? DEFAULT_TASK_SECONDS : clampSeconds(sRaw);

  t.workMinutes = m;
  t.workSeconds = s;

  const current = state.tasks[state.currentTaskIndex];
  if (current && current.id === taskId && state.phase === "work") {
    const sec = toTotalSeconds(t.workMinutes, t.workSeconds);
    state.totalSeconds = sec;
    state.remainingSeconds = sec;
  }
}
