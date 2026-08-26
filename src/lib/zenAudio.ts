// ==============================================================================
// NIHOMI SEIJAKU ZEN AUDIO ENGINE (Web Audio API Synthesizer)
// Pure client-side harmonic chime & soothing ambient frequency generator
// ==============================================================================

class ZenAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;

  // Japanese Hirajoshi / Insen pentatonic tuning (Hz) for serene focus
  private notes = [
    261.63, // C4
    277.18, // C#4
    349.23, // F4
    392.00, // G4
    466.16, // A#4
    523.25, // C5
    554.37  // C#5
  ];

  private getContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a soft, resonant Japanese temple bell / chime note
  private playChime(freq: number) {
    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;

      // Primary sine oscillator (fundamental tone)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();

      // Overtone oscillator (harmonic resonance)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2.76, now); // Metallic chime ratio

      // Envelopes for smooth, natural bell decay
      gain1.gain.setValueAtTime(0.0001, now);
      gain1.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

      gain2.gain.setValueAtTime(0.0001, now);
      gain2.gain.exponentialRampToValueAtTime(0.03, now + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

      osc1.connect(gain1);
      osc2.connect(gain2);

      gain1.connect(this.masterGain);
      gain2.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);

      osc1.stop(now + 4.6);
      osc2.stop(now + 2.1);
    } catch {}
  }

  // Start low-volume warm harmonic background drone
  private startWarmDrone() {
    if (!this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      this.droneOsc = this.ctx.createOscillator();
      this.droneGain = this.ctx.createGain();

      this.droneOsc.type = 'sine';
      this.droneOsc.frequency.setValueAtTime(108.0, now); // 108Hz Zen sacred frequency

      this.droneGain.gain.setValueAtTime(0.0001, now);
      this.droneGain.gain.linearRampToValueAtTime(0.025, now + 3.0);

      this.droneOsc.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);
      this.droneOsc.start(now);
    } catch {}
  }

  public start() {
    if (this.isPlaying) return;
    this.isPlaying = true;

    try {
      const ctx = this.getContext();
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, ctx.currentTime);
      this.masterGain.connect(ctx.destination);

      this.startWarmDrone();

      // Trigger initial soft chime
      this.playChime(this.notes[0]);

      // Periodic random harmonic chimes (every 8-12 seconds)
      const scheduleNext = () => {
        if (!this.isPlaying) return;
        const delay = 8000 + Math.random() * 5000;
        this.timerId = window.setTimeout(() => {
          if (!this.isPlaying) return;
          const randomNote = this.notes[Math.floor(Math.random() * this.notes.length)];
          this.playChime(randomNote);
          scheduleNext();
        }, delay);
      };

      scheduleNext();
    } catch (e) {
      console.warn('Zen Audio initialization error:', e);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }

    if (this.droneGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.droneGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
        setTimeout(() => {
          if (this.droneOsc) {
            try {
              this.droneOsc.stop();
              this.droneOsc.disconnect();
            } catch {}
            this.droneOsc = null;
          }
        }, 900);
      } catch {}
    }

    if (this.masterGain) {
      try {
        this.masterGain.disconnect();
      } catch {}
      this.masterGain = null;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const zenAudioService = new ZenAudioEngine();
