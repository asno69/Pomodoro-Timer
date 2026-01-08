import { ensureAudio } from "./sound.js";

export function stopInterval(state, save) {
  if (state.intervalId) clearInterval(state.intervalId);
  state.intervalId = null;
  state.isRunning = false;
  save();
}

export function startInterval(state, render, onFinished, save) {
  if (state.isRunning) return;
  if (!state.tasks.length) return;

  ensureAudio();

  state.isRunning = true;
  save();

  state.intervalId = setInterval(() => {
    state.remainingSeconds--;
    if (state.remainingSeconds < 0) state.remainingSeconds = 0;

    render();
    save();

    if (state.remainingSeconds === 0) {
      stopInterval(state, save);
      onFinished();
    }
  }, 1000);
}
