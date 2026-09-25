/**
 * Web Audio API Synthesizer Sound Effects
 * Zero external audio file dependencies, instant latency, works offline.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Crisp celebratory 'ping' chime on correct quiz answer selection
   */
  public playCorrectPing(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Primary tone (E5: 659.25 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.08); // E5
      osc1.frequency.exponentialRampToValueAtTime(1046.5, now + 0.18); // C6

      gain1.gain.setValueAtTime(0.01, now);
      gain1.gain.linearRampToValueAtTime(0.25, now + 0.04);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      // Shimmering harmonic overtone
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1318.5, now + 0.05); // E6
      gain2.gain.setValueAtTime(0.08, now + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.5);
      osc2.start(now + 0.05);
      osc2.stop(now + 0.4);
    } catch (e) {
      console.warn('Audio feedback failed:', e);
    }
  }

  /**
   * Gentle reminder tone on incorrect selection
   */
  public playIncorrectSoft(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(261.63, now); // C4
      osc.frequency.linearRampToValueAtTime(220.0, now + 0.15); // A3

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.warn('Audio feedback failed:', e);
    }
  }

  /**
   * Sound for error/incorrect answer
   */
  public playErrorBuzzer(): void {
    this.playIncorrectSoft();
  }

  /**
   * Subtle soft click for button taps and timer controls
   */
  public playButtonTap(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.warn('Button tap audio failed:', e);
    }
  }

  public playClickSoft(): void {
    this.playButtonTap();
  }

  /**
   * Fanfare melody when a quiz or lesson is 100% completed
   */
  public playLessonCelebration(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [
        { freq: 523.25, time: 0, dur: 0.1 },      // C5
        { freq: 659.25, time: 0.1, dur: 0.1 },    // E5
        { freq: 783.99, time: 0.2, dur: 0.1 },    // G5
        { freq: 1046.50, time: 0.32, dur: 0.35 }  // C6
      ];

      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.freq, now + n.time);

        gain.gain.setValueAtTime(0.01, now + n.time);
        gain.gain.linearRampToValueAtTime(0.2, now + n.time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur + 0.05);
      });
    } catch (e) {
      console.warn('Celebration audio failed:', e);
    }
  }

  /**
   * Conbini POS Barcode Scanner Beep (High crisp beep 2400Hz)
   */
  public playBarcodeBeep(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2400, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {
      console.warn('Barcode beep audio failed:', e);
    }
  }

  /**
   * Cash Register Drawer Open / Settlement Chime
   */
  public playRegisterSettlement(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Two-tone Japanese POS confirmation (F6 -> A6)
      const freqs = [1396.91, 1760.0];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + (idx * 0.09);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.2);
      });
    } catch (e) {
      console.warn('Register chime failed:', e);
    }
  }

  /**
   * Pitch Accent Contour Tones (High Pitch vs Low Pitch)
   */
  public playPitchTones(pattern: ('H' | 'L')[]): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      pattern.forEach((p, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + (idx * 0.22);
        const freq = p === 'H' ? 523.25 : 349.23; // C5 vs F4

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.01, start);
        gain.gain.linearRampToValueAtTime(0.18, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.19);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.2);
      });
    } catch (e) {
      console.warn('Pitch tone failed:', e);
    }
  }
  private ambientInterval: any = null;
  private ambientNodes: { stop: () => void }[] = [];
  private currentAmbientType: 'off' | 'conbini' | 'cafe' | 'factory' = 'off';

  public getCurrentAmbient(): 'off' | 'conbini' | 'cafe' | 'factory' {
    return this.currentAmbientType;
  }

  public stopAmbient(): void {
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    this.ambientNodes.forEach((node) => {
      try {
        node.stop();
      } catch (e) {}
    });
    this.ambientNodes = [];
    this.currentAmbientType = 'off';
  }

  public playConbiniChime(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Classic Japanese Conbini entrance chime melody
      const notes = [
        { freq: 740.0, time: 0, dur: 0.22 },     // F#5
        { freq: 587.3, time: 0.24, dur: 0.22 },   // D5
        { freq: 440.0, time: 0.48, dur: 0.22 },   // A4
        { freq: 587.3, time: 0.72, dur: 0.22 },   // D5
        { freq: 659.3, time: 0.96, dur: 0.22 },   // E5
        { freq: 880.0, time: 1.20, dur: 0.45 },   // A5
        { freq: 659.3, time: 1.70, dur: 0.22 },   // E5
        { freq: 740.0, time: 1.94, dur: 0.22 },   // F#5
        { freq: 659.3, time: 2.18, dur: 0.22 },   // E5
        { freq: 440.0, time: 2.42, dur: 0.22 },   // A4
        { freq: 587.3, time: 2.66, dur: 0.50 }    // D5
      ];
      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, now + n.time);
        gain.gain.setValueAtTime(0.001, now + n.time);
        gain.gain.linearRampToValueAtTime(0.12, now + n.time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.time + n.dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur + 0.05);
      });
    } catch (e) {
      console.warn('Conbini chime failed:', e);
    }
  }

  public startAmbient(type: 'conbini' | 'cafe' | 'factory'): void {
    this.stopAmbient();
    this.currentAmbientType = type;
    const ctx = this.getContext();
    if (!ctx) return;

    if (type === 'conbini') {
      this.playConbiniChime();
      this.ambientInterval = setInterval(() => {
        this.playConbiniChime();
      }, 14000);
    } else if (type === 'cafe') {
      const playCafeChord = () => {
        try {
          const now = ctx.currentTime;
          const freqs = [261.63, 329.63, 392.0, 493.88, 587.33];
          freqs.forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(f, now + i * 0.04);
            gain.gain.setValueAtTime(0.001, now + i * 0.04);
            gain.gain.linearRampToValueAtTime(0.035, now + i * 0.04 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.04 + 2.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + i * 0.04);
            osc.stop(now + i * 0.04 + 2.3);
          });
        } catch (e) {}
      };
      playCafeChord();
      this.ambientInterval = setInterval(playCafeChord, 9000);
    } else if (type === 'factory') {
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(65, now);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(140, now);

        gain.gain.setValueAtTime(0.02, now);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);

        this.ambientNodes.push({
          stop: () => {
            try {
              osc.stop();
            } catch (e) {}
          }
        });

        this.ambientInterval = setInterval(() => {
          try {
            const t = ctx.currentTime;
            const clickOsc = ctx.createOscillator();
            const clickGain = ctx.createGain();
            clickOsc.type = 'square';
            clickOsc.frequency.setValueAtTime(320, t);
            clickGain.gain.setValueAtTime(0.015, t);
            clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
            clickOsc.connect(clickGain);
            clickGain.connect(ctx.destination);
            clickOsc.start(t);
            clickOsc.stop(t + 0.05);
          } catch (e) {}
        }, 800);
      } catch (e) {
        console.warn('Factory ambient failed:', e);
      }
    }
  }

  public playTick(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
    } catch (e) {}
  }
}

export const soundEffects = new SoundEngine();
