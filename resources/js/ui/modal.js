export function openModal(dom, state, title, body, okText, onOk, save) {
  dom.modalTitle.textContent = title;
  dom.modalBody.textContent = body;
  dom.modalOkBtn.textContent = okText;

  state.pendingNextAction = onOk;
  dom.modalOverlay.classList.add("show");
  save();
}

export function closeModal(dom, state, save) {
  dom.modalOverlay.classList.remove("show");
  save();
}

export function wireModal(dom, state, save) {
  dom.modalOkBtn.addEventListener("click", () => {
    closeModal(dom, state, save);
    if (typeof state.pendingNextAction === "function") {
      const action = state.pendingNextAction;
      state.pendingNextAction = null;
      action();
    }
  });
}
