let audioCtx = null;

export function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
}

export function playAlertSound() {
  ensureAudio();

  const pattern = [
    { freq: 1200, dur: 0.14 },
    { freq: 1200, dur: 0.14 },
    { freq: 1400, dur: 0.20 },
  ];

  let t = audioCtx.currentTime;

  for (const step of pattern) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "square";
    osc.frequency.value = step.freq;

    gain.gain.value = 0.0001;

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.35, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + step.dur);

    osc.start(t);
    osc.stop(t + step.dur);

    t += step.dur + 0.06;
  }
}
