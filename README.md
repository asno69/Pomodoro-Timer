# Pomodoro-Timer 🍅⏱️

Ein moderner, taskbasierter Pomodoro-Timer für fokussiertes Arbeiten.  
Die Anwendung kombiniert klassische Pomodoro-Technik mit einer flexiblen Task-Liste, konfigurierbaren Zeiten (Minuten & Sekunden), akustischen Signalen und einer klaren, modernen Benutzeroberfläche.

---

## 🚀 Starten der Anwendung

### Voraussetzungen
- **VS Code**
- **Python 3** (nur für den lokalen Server)
- Ein moderner Browser (Chrome, Firefox, Edge)

### Lokaler Start (empfohlen)
Da die Anwendung **ES Modules (`import/export`)** verwendet, muss sie über einen lokalen Server laufen.

Im Projektordner im VS Code Terminal:

```bash
python -m http.server 5500
```

Danach im Browser öffnen:
http://localhost:5500/index.html

---

### Projektstruktur
```bash
index.html
resources/
  css/
    style.css
  js/
    app.js
    core/
      state.js
      storage.js
      timer.js
      sound.js
    ui/
      dom.js
      modal.js
      tasks.js
      render.js
  images/
    favicon.ico
```

### Idee der Struktur:

- core/ → Logik (State, Timer, Sound, Storage)
- ui/ → DOM, Rendering, Modals, Tasks
- app.js → Einstiegspunkt (Bootstrap)
- saubere Trennung von Logik & UI

---

## ✨ Features
### ⏲️ Timer & Phasen

- Klassischer Pomodoro-Workflow (Work → Break)
- Arbeits- und Pausenzeiten frei einstellbar
- Minuten und Sekunden (ideal zum Testen)
- Fortschrittsbalken mit Live-Countdown
- Automatischer Phasenwechsel

### 📝 Tasks

- Beliebig viele Tasks anlegen
- Pro Task eigene Arbeitszeit
- Tasks laufen nacheinander automatisch
- Task wird sofort nach Ende der Work-Phase als erledigt markiert
- Nach der letzten Task keine Pause mehr
- Aktiver Task visuell hervorgehoben
- Alle Tasks auf einmal löschbar

### 🔔 Feedback & UX

- Akustisches Signal (bewusst deutlich) bei Phasenwechsel
- Popup-Modals bei:
    - Ende der Work-Zeit
    - Ende der Pause
    - Abschluss aller Tasks
- Moderne Hover-, Fokus- und Klick-Animationen
- Eingabefelder verhalten sich natürlich (kein Fokusverlust beim Löschen)

### 💾 Persistenz

- Zustand wird automatisch im LocalStorage gespeichert:
    - Tasks
    - aktuelle Phase
    - verbleibende Zeit
    - Pauseneinstellungen
- Nach Reload kann der Timer nahtlos fortgesetzt werden

### 🎨 Design

- Modernes Glassmorphism-UI
- Eigenständige Farbpalette (Indigo / Teal)
- Responsive Layout (Desktop & Mobile)
- Klare visuelle Trennung zwischen Timer & Task-Liste

### 🧠 Arbeitsweise & Architektur

- Die Anwendung folgt bewusst einfachen, aber sauberen Prinzipien:
    - Single Source of Truth
    → zentraler state (kein DOM-getriebener Zustand)
    - Unidirektionaler Flow
    → User-Input → State-Änderung → Render

- Explizite Zustände
    - work / break
    - isRunning
    - currentTaskIndex

- Keine Frameworks
    - Reines HTML, CSS, JavaScript
    - Maximale Transparenz & Lernbarkeit

---

### 🤖 Zusammenarbeit mit AI (Entstehung der Lösung)

Diese Anwendung wurde iterativ gemeinsam mit einer AI entwickelt.
- **Vorgehensweise**:
1. Grundfunktionalität (Timer, Start/Pause)

2. Erweiterung um Tasks & Sequenzen

3. UX-Verbesserungen:
    - natürliche Inputs
    - Animationen
    - visuelles Feedback

4. Edge-Case-Fixes
    - Task sofort als erledigt markieren
    - keine Pause nach letzter Task

5. Refactoring zu einer sauberen Modul-Struktur

6. Trennung von:
    - Logik
    - UI
    - Persistenz
    - Sound

7. Finalisierung von Design & Dokumentation

- Mehrwert der AI-Zusammenarbeit:
    - Schnelles Prototyping
    - Sofortiges Feedback auf UX-Probleme
    - Strukturierte Refactorings
    - Fokus auf Lesbarkeit & Wartbarkeit
    - Gemeinsame Entscheidungen statt Blackbox-Code
- Die AI wurde dabei nicht als „Code-Generator“, sondern als technischer Sparringspartner genutzt.

---

### 🏁 Fazit

- Diese Pomodoro-App ist:
    - leichtgewichtig
    - erweiterbar
    - verständlich aufgebaut
    - praxisnah für echtes fokussiertes Arbeiten
- Perfekt als:
    - Lernprojekt
    - Produktivitäts-Tool
    - Basis für weitere Features (Statistiken, Sync, Accounts, etc.)