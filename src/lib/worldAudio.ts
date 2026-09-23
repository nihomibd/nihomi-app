// src/lib/worldAudio.ts
// NIHOMI WORLD™ — Ambient Tokyo Soundscape Engine (Web Audio API Synthesizer)
// Zero external assets required. Generates soothing ambient drone & authentic Tokyo station chime.

class WorldAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public startTokyoAmbient(): boolean {
    try {
      this.initContext();
      if (!this.ctx) return false;
      if (this.isPlaying) return true;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(0.12, this.ctx.currentTime + 3);
      this.masterGain.connect(this.ctx.destination);

      // Low soothing warm drone (fundamental C2 / G2 harmonic)
      const freqs = [65.41, 98.00, 196.00, 261.63];
      this.oscillators = [];

      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Subtle LFO modulation for breathing Tokyo night air
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.15 + idx * 0.05, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(1.5, this.ctx.currentTime);
        lfo.connect(osc.frequency);
        lfo.start();

        gain.gain.setValueAtTime(0.08 / (idx + 1), this.ctx.currentTime);
        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        this.oscillators.push(osc);
      });

      this.isPlaying = true;
      return true;
    } catch (e) {
      console.warn('[WorldAudio] Ambient audio initialisation skipped:', e);
      return false;
    }
  }

  public stopTokyoAmbient() {
    try {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
        setTimeout(() => {
          this.oscillators.forEach(o => {
            try { o.stop(); o.disconnect(); } catch {}
          });
          this.oscillators = [];
          this.isPlaying = false;
        }, 1300);
      } else {
        this.isPlaying = false;
      }
    } catch {}
  }

  public playTokyoChime() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Traditional Japanese Station departure bell chord (E5, B5, G#5)
      const notes = [659.25, 830.61, 987.77];
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);

        gain.gain.setValueAtTime(0.001, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.15, now + i * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 1.3);
      });
    } catch {}
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const worldAudio = new WorldAudioEngine();
