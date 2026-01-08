export const dom = {
  modeLabel: document.getElementById("modeLabel"),
  subLabel: document.getElementById("subLabel"),
  timerText: document.getElementById("timerText"),
  progressBar: document.getElementById("progressBar"),

  startBtn: document.getElementById("startBtn"),
  pauseBtn: document.getElementById("pauseBtn"),
  resetBtn: document.getElementById("resetBtn"),

  breakMinInput: document.getElementById("breakMinInput"),
  breakSecInput: document.getElementById("breakSecInput"),
  breakMinutesText: document.getElementById("breakMinutesText"),
  breakSecondsText: document.getElementById("breakSecondsText"),

  taskNameInput: document.getElementById("taskNameInput"),
  addTaskBtn: document.getElementById("addTaskBtn"),
  clearAllBtn: document.getElementById("clearAllBtn"),
  taskList: document.getElementById("taskList"),

  currentTaskName: document.getElementById("currentTaskName"),
  sequenceInfo: document.getElementById("sequenceInfo"),

  modalOverlay: document.getElementById("modalOverlay"),
  modalTitle: document.getElementById("modalTitle"),
  modalBody: document.getElementById("modalBody"),
  modalOkBtn: document.getElementById("modalOkBtn"),

  renderAll: null, // set by render.js
};
