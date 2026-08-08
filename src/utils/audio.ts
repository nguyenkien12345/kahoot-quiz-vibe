/**
 * Factory function tạo ra SoundEngine với closure encapsulation.
 * Giúp đóng gói hoàn toàn state nội bộ (ctx, isMuted, bgOscillator,...)
 * không bị rò rỉ ra ngoài module scope dưới dạng biến 'let' toàn cục.
 */
const createSoundEngine = () => {
  let ctx: AudioContext | null = null;
  let isMuted: boolean = false;
  let bgOscillator: OscillatorNode | null = null;
  let bgGain: GainNode | null = null;
  let isBgPlaying: boolean = false;

  const initCtx = (): AudioContext | null => {
    if (!ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AudioCtx();
    }
    if (ctx && ctx.state === "suspended") {
      ctx.resume();
    }
    return ctx;
  };

  const stopBgMusic = () => {
    if (bgOscillator) {
      try {
        bgOscillator.stop();
        bgOscillator.disconnect();
      } catch { }
      bgOscillator = null;
    }
    isBgPlaying = false;
  };

  return {
    setMuted: (muted: boolean) => {
      isMuted = muted;
      if (muted && isBgPlaying) {
        stopBgMusic();
      }
    },

    playTick: () => {
      if (isMuted) return;
      try {
        const audioCtx = initCtx();
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
      } catch {
        // Audio context policy blocked or not supported
      }
    },

    playWarningTick: () => {
      if (isMuted) return;
      try {
        const audioCtx = initCtx();
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "square";
        osc.frequency.setValueAtTime(1000, audioCtx.currentTime);

        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } catch { }
    },

    playCorrect: () => {
      if (isMuted) return;
      try {
        const audioCtx = initCtx();
        if (!audioCtx) return;

        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.08);

          gain.gain.setValueAtTime(0.25, audioCtx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.08 + 0.3);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start(audioCtx.currentTime + idx * 0.08);
          osc.stop(audioCtx.currentTime + idx * 0.08 + 0.3);
        });
      } catch { }
    },

    playWrong: () => {
      if (isMuted) return;
      try {
        const audioCtx = initCtx();
        if (!audioCtx) return;

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(110, audioCtx.currentTime + 0.35);

        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } catch { }
    },

    playFanfare: () => {
      if (isMuted) return;
      try {
        const audioCtx = initCtx();
        if (!audioCtx) return;

        const arpeggiated = [
          { f: 523.25, t: 0 },
          { f: 659.25, t: 0.12 },
          { f: 783.99, t: 0.24 },
          { f: 1046.5, t: 0.36 },
          { f: 880.0, t: 0.5 },
          { f: 1046.5, t: 0.65 }
        ];

        arpeggiated.forEach((note) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc.type = "triangle";
          osc.frequency.setValueAtTime(note.f, audioCtx.currentTime + note.t);

          gain.gain.setValueAtTime(0.2, audioCtx.currentTime + note.t);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + note.t + 0.4);

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start(audioCtx.currentTime + note.t);
          osc.stop(audioCtx.currentTime + note.t + 0.4);
        });
      } catch { }
    },

    startBgMusic: () => {
      if (isMuted || isBgPlaying) return;
      try {
        const audioCtx = initCtx();
        if (!audioCtx) return;

        bgOscillator = audioCtx.createOscillator();
        bgGain = audioCtx.createGain();

        bgOscillator.type = "sine";
        bgOscillator.frequency.setValueAtTime(220, audioCtx.currentTime);

        bgGain.gain.setValueAtTime(0.03, audioCtx.currentTime);

        bgOscillator.connect(bgGain);
        bgGain.connect(audioCtx.destination);

        bgOscillator.start();
        isBgPlaying = true;
      } catch { }
    },

    stopBgMusic
  };
};

export const sound = createSoundEngine();
