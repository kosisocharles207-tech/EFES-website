// Web Audio API synthesized sound effects with anti-popping smooth ramps
class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private init(): boolean {
    if (this.isMuted) return false;
    if (typeof window === 'undefined') return false;

    if (!this.ctx) {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      } catch {
        return false;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return !!this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playClick() {
    if (this.isMuted) return;
    try {
      if (!this.init() || !this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.04);

      // Smooth anti-crack envelope: 0 -> target -> 0
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.05, t + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    } catch {
      // ignore
    }
  }

  public playGoldenChime() {
    if (this.isMuted) return;
    try {
      if (!this.init() || !this.ctx) return;
      const t = this.ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      
      freqs.forEach((freq, index) => {
        if (!this.ctx) return;
        const noteTime = t + index * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        // Smooth anti-crack chime envelope
        gain.gain.setValueAtTime(0.0001, noteTime);
        gain.gain.linearRampToValueAtTime(0.08, noteTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(noteTime);
        osc.stop(noteTime + 0.65);
      });
    } catch {
      // ignore
    }
  }

  public playWhistle() {
    if (this.isMuted) return;
    try {
      if (!this.init() || !this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800, t);
      osc.frequency.linearRampToValueAtTime(2100, t + 0.06);
      osc.frequency.linearRampToValueAtTime(1900, t + 0.14);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.06, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.26);
    } catch {
      // ignore
    }
  }

  public playTrophyFanfare() {
    if (this.isMuted) return;
    try {
      if (!this.init() || !this.ctx) return;
      const t = this.ctx.currentTime;
      const notes = [
        { f: 440, delay: 0 },
        { f: 554.37, delay: 0.1 },
        { f: 659.25, delay: 0.2 },
        { f: 880, delay: 0.32 },
        { f: 1108.73, delay: 0.46 },
      ];
      notes.forEach(({ f, delay }) => {
        if (!this.ctx) return;
        const noteTime = t + delay;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, noteTime);

        gain.gain.setValueAtTime(0.0001, noteTime);
        gain.gain.linearRampToValueAtTime(0.09, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(noteTime);
        osc.stop(noteTime + 0.55);
      });
    } catch {
      // ignore
    }
  }
}

export const sounds = new SoundManager();
