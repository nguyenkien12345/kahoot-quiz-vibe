class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgOscillator: OscillatorNode | null = null;
  private bgGain: GainNode | null = null;
  private isBgPlaying: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isBgPlaying) {
      this.stopBgMusic();
    }
  }

  public playTick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio context policy blocked or not supported
    }
  }

  public playWarningTick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(1000, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {}
  }

  public playCorrect() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.25, this.ctx!.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + idx * 0.08);
        osc.stop(this.ctx!.currentTime + idx * 0.08 + 0.3);
      });
    } catch {}
  }

  public playWrong() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } catch {}
  }

  public playFanfare() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const arpeggiated = [
        { f: 523.25, t: 0 },
        { f: 659.25, t: 0.12 },
        { f: 783.99, t: 0.24 },
        { f: 1046.50, t: 0.36 },
        { f: 880.00, t: 0.5 },
        { f: 1046.50, t: 0.65 }
      ];

      arpeggiated.forEach((note) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(note.f, this.ctx!.currentTime + note.t);

        gain.gain.setValueAtTime(0.2, this.ctx!.currentTime + note.t);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + note.t + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + note.t);
        osc.stop(this.ctx!.currentTime + note.t + 0.4);
      });
    } catch {}
  }

  public startBgMusic() {
    if (this.isMuted || this.isBgPlaying) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // Simple low-volume ambient pulse
      this.bgOscillator = this.ctx.createOscillator();
      this.bgGain = this.ctx.createGain();

      this.bgOscillator.type = "sine";
      this.bgOscillator.frequency.setValueAtTime(220, this.ctx.currentTime);

      this.bgGain.gain.setValueAtTime(0.03, this.ctx.currentTime);

      this.bgOscillator.connect(this.bgGain);
      this.bgGain.connect(this.ctx.destination);

      this.bgOscillator.start();
      this.isBgPlaying = true;
    } catch {}
  }

  public stopBgMusic() {
    if (this.bgOscillator) {
      try {
        this.bgOscillator.stop();
        this.bgOscillator.disconnect();
      } catch {}
      this.bgOscillator = null;
    }
    this.isBgPlaying = false;
  }
}

export const sound = new SoundEngine();
