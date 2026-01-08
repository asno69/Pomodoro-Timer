import { toTotalSeconds, clampSeconds, clampMinutesAllowZero, parseOptionalInt } from "../core/state.js";
import { startInterval, stopInterval } from "../core/timer.js";
import { playAlertSound } from "../core/sound.js";
import { wireModal, openModal } from "./modal.js";
import { addTask, removeTask, selectTask, commitTaskTime } from "./tasks.js";

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

function getCurrentTask(state) {
  return state.tasks[state.currentTaskIndex] ?? null;
}

function countRemainingTasks(state) {
  return state.tasks.filter(t => !t.done).length;
}

function getBreakTotalSeconds(dom) {
  const m = clampMinutesAllowZero(dom.breakMinInput.value, 0);
  const s = clampSeconds(dom.breakSecInput.value);
  return Math.max(1, m * 60 + s);
}

function setPhaseSeconds(state, seconds) {
  state.totalSeconds = Math.max(1, seconds);
  state.remainingSeconds = state.totalSeconds;
}

function loadWorkForCurrentTask(state) {
  const task = getCurrentTask(state);
  if (!task) return;
  state.phase = "work";
  setPhaseSeconds(state, toTotalSeconds(task.workMinutes, task.workSeconds));
}

function loadBreak(state, dom) {
  state.phase = "break";
  setPhaseSeconds(state, getBreakTotalSeconds(dom));
}

function markCurrentDone(state) {
  const t = getCurrentTask(state);
  if (!t) return;
  t.done = true;
}

function goToNextUndoneTask(state) {
  const nextIndex = state.tasks.findIndex(t => !t.done);
  if (nextIndex === -1) return false;
  state.currentTaskIndex = nextIndex;
  return true;
}

export function wireUI(state, dom, save) {
  const renderAll = () => {
    // timer
    dom.timerText.textContent = formatTime(state.remainingSeconds);
    const ratio = state.totalSeconds > 0 ? state.remainingSeconds / state.totalSeconds : 0;
    dom.progressBar.style.width = (ratio * 100).toFixed(2) + "%";

    // header info
    if (!state.tasks.length) {
      dom.sequenceInfo.textContent = "No tasks yet";
      dom.currentTaskName.textContent = "—";
      dom.modeLabel.textContent = state.phase === "work" ? "Work" : "Break";
      dom.subLabel.textContent = "Add tasks to start a sequence";
    } else {
      const done = state.tasks.filter(t => t.done).length;
      dom.sequenceInfo.textContent = `Tasks: ${done}/${state.tasks.length} done`;
      dom.currentTaskName.textContent = getCurrentTask(state)?.name ?? "—";

      const current = getCurrentTask(state);
      if (state.phase === "work") {
        dom.modeLabel.textContent = "Work";
        dom.subLabel.textContent = current ? "" : "Add tasks to start a sequence";
      } else {
        dom.modeLabel.textContent = "Short Break";
        const next = state.tasks.find(t => !t.done);
        dom.subLabel.textContent = next ? `Next: "${next.name}"` : "";
      }
    }

    // break text labels
    const breakTotal = getBreakTotalSeconds(dom);
    dom.breakMinutesText.textContent = String(Math.floor(breakTotal / 60));
    dom.breakSecondsText.textContent = String(breakTotal % 60);

    // buttons
    dom.startBtn.disabled = state.isRunning || !state.tasks.length;

    // task list
    dom.taskList.innerHTML = "";
    state.tasks.forEach((t, idx) => {
      const el = document.createElement("div");
      el.className = "task" + (idx === state.currentTaskIndex ? " active" : "");

      const left = document.createElement("div");
      left.className = "task-left";

      const name = document.createElement("div");
      name.className = "task-name";
      name.textContent = t.done ? `✓ ${t.name}` : t.name;

      const sub = document.createElement("div");
      sub.className = "task-sub";
      const total = toTotalSeconds(t.workMinutes, t.workSeconds);
      sub.textContent = `Work: ${Math.floor(total/60)}m ${total%60}s`;

      left.appendChild(name);
      left.appendChild(sub);

      const right = document.createElement("div");
      right.className = "task-right";

      const timeWrap = document.createElement("div");
      timeWrap.className = "task-time";

      const minInput = document.createElement("input");
      minInput.className = "task-min";
      minInput.type = "number";
      minInput.min = "0";
      minInput.value = String(t.workMinutes);
      minInput.inputMode = "numeric";
      minInput.pattern = "[0-9]*";

      const secInput = document.createElement("input");
      secInput.className = "task-sec";
      secInput.type = "number";
      secInput.min = "0";
      secInput.max = "59";
      secInput.value = String(t.workSeconds);
      secInput.inputMode = "numeric";
      secInput.pattern = "[0-9]*";

      minInput.addEventListener("click", (e) => e.stopPropagation());
      secInput.addEventListener("click", (e) => e.stopPropagation());

      minInput.addEventListener("input", (e) => {
        minInput.value = minInput.value.replace(/[^\d]/g, "");
        e.stopPropagation();
      });
      secInput.addEventListener("input", (e) => {
        secInput.value = secInput.value.replace(/[^\d]/g, "");
        e.stopPropagation();
      });

      minInput.addEventListener("blur", () => { commitTaskTime(state, t.id, minInput.value, secInput.value); renderAll(); save(state, dom); });
      secInput.addEventListener("blur", () => { commitTaskTime(state, t.id, minInput.value, secInput.value); renderAll(); save(state, dom); });

      minInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); minInput.blur(); } });
      secInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); secInput.blur(); } });

      timeWrap.appendChild(minInput);
      timeWrap.appendChild(secInput);

      const delBtn = document.createElement("button");
      delBtn.className = "icon-btn";
      delBtn.textContent = "×";
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        removeTask(state, t.id);
        renderAll();
        save(state, dom);
      });

      right.appendChild(timeWrap);
      right.appendChild(delBtn);

      el.appendChild(left);
      el.appendChild(right);

      el.addEventListener("click", () => {
        selectTask(state, idx);
        if (state.phase === "work") loadWorkForCurrentTask(state);
        renderAll();
        save(state, dom);
      });

      dom.taskList.appendChild(el);
    });
  };

  dom.renderAll = renderAll;

  // modal
  wireModal(dom, state, () => save(state, dom));

  const onPhaseFinished = () => {
    const task = getCurrentTask(state);
    if (!task) return;

    playAlertSound();

    if (state.phase === "work") {
      // mark done immediately
      markCurrentDone(state);

      renderAll();
      save(state, dom);

      if (countRemainingTasks(state) === 0) {
        openModal(dom, state, "All tasks completed!", `You finished the last task: "${task.name}". No more breaks 🎉`, "Nice!", () => {
          stopInterval(state, () => save(state, dom));
          renderAll();
          save(state, dom);
        }, () => save(state, dom));
        return;
      }

      openModal(dom, state, "Work finished!", `Time is up for: "${task.name}". Click OK to start your break.`, "Start break", () => {
        loadBreak(state, dom);
        renderAll();
        save(state, dom);
        startInterval(state, () => { renderAll(); }, onPhaseFinished, () => save(state, dom));
      }, () => save(state, dom));

      return;
    }

    openModal(dom, state, "Break finished!", "Break is over. Click OK to start the next task.", "Start next", () => {
      const hasNext = goToNextUndoneTask(state);
      if (!hasNext) {
        renderAll();
        save(state, dom);
        return;
      }
      state.phase = "work";
      loadWorkForCurrentTask(state);
      renderAll();
      save(state, dom);
      startInterval(state, () => { renderAll(); }, onPhaseFinished, () => save(state, dom));
    }, () => save(state, dom));
  };

  // Buttons
  dom.startBtn.addEventListener("click", () => {
    if (!state.tasks.length) {
      openModal(dom, state, "No tasks", "Please add at least one task to start.", "OK", () => {}, () => save(state, dom));
      return;
    }
    startInterval(state, () => renderAll(), onPhaseFinished, () => save(state, dom));
    renderAll();
    save(state, dom);
  });

  dom.pauseBtn.addEventListener("click", () => {
    stopInterval(state, () => save(state, dom));
    renderAll();
    save(state, dom);
  });

  dom.resetBtn.addEventListener("click", () => {
    stopInterval(state, () => save(state, dom));
    state.tasks.forEach(t => t.done = false);
    state.currentTaskIndex = 0;
    state.phase = "work";
    if (state.tasks.length) loadWorkForCurrentTask(state);
    renderAll();
    save(state, dom);
  });

  dom.addTaskBtn.addEventListener("click", () => {
    addTask(state, dom.taskNameInput.value);
    dom.taskNameInput.value = "";
    if (state.tasks.length === 1) loadWorkForCurrentTask(state);
    renderAll();
    save(state, dom);
  });

  dom.taskNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") dom.addTaskBtn.click();
  });

  dom.clearAllBtn.addEventListener("click", () => {
    openModal(dom, state, "Clear all tasks?", "This will delete all tasks and stop the timer.", "Clear all", () => {
      stopInterval(state, () => save(state, dom));
      state.tasks = [];
      state.currentTaskIndex = 0;
      state.phase = "work";
      setPhaseSeconds(state, 25 * 60);
      renderAll();
      save(state, dom);
    }, () => save(state, dom));
  });

  // break inputs (type freely; commit on blur/enter)
  const sanitizeNumericInput = (el) => { el.value = el.value.replace(/[^\d]/g, ""); };

  const commitBreakTime = () => {
    const mRaw = parseOptionalInt(dom.breakMinInput.value);
    const sRaw = parseOptionalInt(dom.breakSecInput.value);

    const m = mRaw === null ? 0 : clampMinutesAllowZero(mRaw, 0);
    const s = sRaw === null ? 0 : clampSeconds(sRaw);

    dom.breakMinInput.value = String(m);
    dom.breakSecInput.value = String(s);

    if (state.phase === "break") {
      setPhaseSeconds(state, getBreakTotalSeconds(dom));
    }
    renderAll();
    save(state, dom);
  };

  dom.breakMinInput.addEventListener("input", () => sanitizeNumericInput(dom.breakMinInput));
  dom.breakSecInput.addEventListener("input", () => sanitizeNumericInput(dom.breakSecInput));
  dom.breakMinInput.addEventListener("blur", commitBreakTime);
  dom.breakSecInput.addEventListener("blur", commitBreakTime);
  dom.breakMinInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); dom.breakMinInput.blur(); } });
  dom.breakSecInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); dom.breakSecInput.blur(); } });
}
