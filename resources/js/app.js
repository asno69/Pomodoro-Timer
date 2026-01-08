import { dom } from "./ui/dom.js";
import { loadStateFromStorage, saveStateToStorage } from "./core/storage.js";
import { createInitialState, hydrateStateFromStorage } from "./core/state.js";
import { wireUI } from "./ui/render.js";

(function bootstrap() {
  const state = createInitialState();

  // load
  const stored = loadStateFromStorage();
  if (stored) hydrateStateFromStorage(state, stored, dom);

  // wire ui + render
  wireUI(state, dom, saveStateToStorage);

  // initial render
  dom.renderAll(state);
  saveStateToStorage(state, dom);
})();
