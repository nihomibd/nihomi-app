// src/components/canvas3d/engine/SpatialAudioEngine.ts
// NIHOMI REAL JAPAN CANVAS™ — CONTEXTUAL SPATIAL AUDIO SOUNDSCAPE
// Authentic Japanese urban acoustic environment: Crosswalk Piyo-Piyo / Kakkou chirps,
// Station platform departure melodies, 7-Eleven/Famima chimes, walking cadence, and rain soundscapes.

class SpatialAudioEngineClass {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private rainNode: AudioBufferSourceNode | null = null;
  private rainGain: GainNode | null = null;

  private initCtx(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (!muted) {
      this.initCtx();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Tokyo Pedestrian Crossing Acoustic Signal
   * 'piyo': High-frequency multi-tone chirp used for North-South crossings
   * 'kakkou': Dual-pitch whistle used for East-West crossings
   */
  public playPedestrianSignal(type: 'piyo' | 'kakkou' = 'piyo'): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    if (type === 'piyo') {
      // 2450Hz down to 1750Hz chirp
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2450, now);
      osc.frequency.exponentialRampToValueAtTime(1750, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);

      // Echo repeat after 160ms
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2450, now + 0.16);
      osc2.frequency.exponentialRampToValueAtTime(1750, now + 0.28);

      gain2.gain.setValueAtTime(0.06, now + 0.16);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.16);
      osc2.stop(now + 0.31);
    } else {
      // 'kakkou' two-tone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1100, now);
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.19);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(780, now + 0.2);
      gain2.gain.setValueAtTime(0.07, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.2);
      osc2.stop(now + 0.43);
    }
  }

  /**
   * Convenience Store Door Chime (Famima / 7-Eleven Style Arrival Melody)
   */
  public playConbiniDoorChime(): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const notes = [587.33, 440.0, 493.88, 659.25, 493.88, 440.0];
    const delays = [0.0, 0.22, 0.44, 0.66, 0.88, 1.1];

    notes.forEach((freq, idx) => {
      const startTime = ctx.currentTime + delays[idx];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.09, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.38);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }

  /**
   * JR Yamanote Platform Departure Chime Melody
   */
  public playStationDepartureChime(): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    const delays = [0.0, 0.18, 0.36, 0.54];

    notes.forEach((freq, idx) => {
      const startTime = ctx.currentTime + delays[idx];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.08, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  }

  /**
   * Footstep sound synchronized with character walking
   */
  public playFootstepSound(): void {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }
}

export const spatialAudio = new SpatialAudioEngineClass();
