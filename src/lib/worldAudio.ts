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

  public playConbiniDoorChime() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Authentic Japanese Convenience Store Entrance Chime Melody
      // Part 1: F#5 (740Hz), D5 (587Hz), A4 (440Hz), D5 (587Hz), E5 (659Hz), A5 (880Hz)
      // Part 2: E5 (659Hz), F#5 (740Hz), E5 (659Hz), A4 (440Hz), D5 (587Hz)
      const melody = [
        { freq: 739.99, time: 0.00, dur: 0.18 }, // F#5
        { freq: 587.33, time: 0.18, dur: 0.18 }, // D5
        { freq: 440.00, time: 0.36, dur: 0.18 }, // A4
        { freq: 587.33, time: 0.54, dur: 0.18 }, // D5
        { freq: 659.25, time: 0.72, dur: 0.18 }, // E5
        { freq: 880.00, time: 0.90, dur: 0.40 }, // A5
        { freq: 659.25, time: 1.35, dur: 0.18 }, // E5
        { freq: 739.99, time: 1.53, dur: 0.18 }, // F#5
        { freq: 659.25, time: 1.71, dur: 0.18 }, // E5
        { freq: 440.00, time: 1.89, dur: 0.18 }, // A4
        { freq: 587.33, time: 2.07, dur: 0.50 }, // D5
      ];

      melody.forEach(({ freq, time, dur }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Warm electric bell chime timbre (sine with gentle overtone)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.0001, now + time);
        gain.gain.exponentialRampToValueAtTime(0.12, now + time + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur + 0.35);
      });
    } catch {}
  }

  public playFootstepSound() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(70 + Math.random() * 20, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.06);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.065);
    } catch {}
  }

  public playSuccessRewardChime() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Upbeat Level-Up / Coin Reward sequence (C5 -> E5 -> G5 -> C6)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.14, now + idx * 0.08 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.65);
      });
    } catch {}
  }

  public playPedestrianSignal(type: 'piyo' | 'kakkou' = 'piyo') {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      if (type === 'piyo') {
        // Tokyo Scramble Crossing "Piyo Piyo" acoustic bird chirp
        [0.0, 0.28].forEach((offset) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(2450, now + offset);
          osc.frequency.exponentialRampToValueAtTime(1750, now + offset + 0.16);

          gain.gain.setValueAtTime(0.0001, now + offset);
          gain.gain.exponentialRampToValueAtTime(0.08, now + offset + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.2);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + offset);
          osc.stop(now + offset + 0.22);
        });
      } else {
        // Tokyo Scramble Crossing "Kakkou" (Cuckoo) two-tone chime
        const notes = [
          { freq: 1046.5, time: 0.0, dur: 0.24 }, // High C6
          { freq: 830.6, time: 0.28, dur: 0.35 }  // Ab5
        ];
        notes.forEach(({ freq, time, dur }) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + time);

          gain.gain.setValueAtTime(0.0001, now + time);
          gain.gain.exponentialRampToValueAtTime(0.09, now + time + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + time);
          osc.stop(now + time + dur + 0.05);
        });
      }
    } catch {}
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const worldAudio = new WorldAudioEngine();
