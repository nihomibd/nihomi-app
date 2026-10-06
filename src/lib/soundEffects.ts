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

  public playButtonClick(): void {
    this.playButtonTap();
  }

  public playCorrect(): void {
    this.playCorrectPing();
  }

  public playWrong(): void {
    this.playIncorrectSoft();
  }

  public playIncorrect(): void {
    this.playIncorrectSoft();
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

  public playLevelUp(): void {
    this.playLessonCelebration();
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

  /**
   * Authentic Japanese Conbini commercial microwave completion triple-beep (ピー、ピー、ピー)
   */
  public playMicrowaveChime(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const beeps = [0, 0.22, 0.44];

      beeps.forEach((startOffset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2093.0, now + startOffset); // C7

        gain.gain.setValueAtTime(0.001, now + startOffset);
        gain.gain.linearRampToValueAtTime(0.18, now + startOffset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + 0.16);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + startOffset);
        osc.stop(now + startOffset + 0.18);
      });
    } catch (e) {
      console.warn('Microwave chime failed:', e);
    }
  }

  /**
   * Heavy POS Cash Drawer release, slide & bell clunk
   */
  public playCashDrawerSound(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 1. Initial mechanical latch snap
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snapOsc.type = 'square';
      snapOsc.frequency.setValueAtTime(880, now);
      snapOsc.frequency.exponentialRampToValueAtTime(220, now + 0.04);
      snapGain.gain.setValueAtTime(0.2, now);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapOsc.start(now);
      snapOsc.stop(now + 0.05);

      // 2. Heavy metal slide & tray bump
      const slideOsc = ctx.createOscillator();
      const slideGain = ctx.createGain();
      slideOsc.type = 'triangle';
      slideOsc.frequency.setValueAtTime(160, now + 0.03);
      slideOsc.frequency.exponentialRampToValueAtTime(65, now + 0.18);
      slideGain.gain.setValueAtTime(0.22, now + 0.03);
      slideGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      slideOsc.connect(slideGain);
      slideGain.connect(ctx.destination);
      slideOsc.start(now + 0.03);
      slideOsc.stop(now + 0.24);

      // 3. Register bell ding
      const bellOsc = ctx.createOscillator();
      const bellGain = ctx.createGain();
      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(1760, now + 0.08); // A6
      bellGain.gain.setValueAtTime(0.12, now + 0.08);
      bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      bellOsc.connect(bellGain);
      bellGain.connect(ctx.destination);
      bellOsc.start(now + 0.08);
      bellOsc.stop(now + 0.38);
    } catch (e) {
      console.warn('Cash drawer sound failed:', e);
    }
  }

  /**
   * Authentic Japanese IC Transit Touch Chime (Suica / Pasmo "ピピッ")
   */
  public playIcCardChime(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Two-step crisp chime (G6: 1567.98Hz -> C7: 2093.00Hz)
      const tones = [
        { freq: 1567.98, time: 0, dur: 0.07 },
        { freq: 2093.00, time: 0.085, dur: 0.16 }
      ];

      tones.forEach((t) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(t.freq, now + t.time);

        gain.gain.setValueAtTime(0.01, now + t.time);
        gain.gain.linearRampToValueAtTime(0.22, now + t.time + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + t.time + t.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + t.time);
        osc.stop(now + t.time + t.dur + 0.02);
      });
    } catch (e) {
      console.warn('IC Card chime failed:', e);
    }
  }

  /**
   * Thermal Receipt Printer rapid paper feed & cut sound (ジジジッ)
   */
  public playReceiptPrinterSound(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Rapid stepper motor ticks
      const tickCount = 9;
      for (let i = 0; i < tickCount; i++) {
        const tickTime = now + (i * 0.035);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(800 + (i % 2) * 200, tickTime);

        gain.gain.setValueAtTime(0.06, tickTime);
        gain.gain.exponentialRampToValueAtTime(0.001, tickTime + 0.025);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(tickTime);
        osc.stop(tickTime + 0.028);
      }

      // Paper tear cut sound at end
      const cutTime = now + (tickCount * 0.035) + 0.05;
      const cutOsc = ctx.createOscillator();
      const cutGain = ctx.createGain();
      cutOsc.type = 'triangle';
      cutOsc.frequency.setValueAtTime(1200, cutTime);
      cutOsc.frequency.exponentialRampToValueAtTime(300, cutTime + 0.05);

      cutGain.gain.setValueAtTime(0.12, cutTime);
      cutGain.gain.exponentialRampToValueAtTime(0.001, cutTime + 0.06);

      cutOsc.connect(cutGain);
      cutGain.connect(ctx.destination);
      cutOsc.start(cutTime);
      cutOsc.stop(cutTime + 0.07);
    } catch (e) {
      console.warn('Receipt printer sound failed:', e);
    }
  }

  /**
   * PayPay / Code Payment smartphone scan chime
   */
  public playPayPaySound(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Two joyful notes
      const notes = [
        { freq: 880.0, time: 0, dur: 0.12 },    // A5
        { freq: 1318.5, time: 0.11, dur: 0.25 } // E6
      ];

      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, now + n.time);

        gain.gain.setValueAtTime(0.01, now + n.time);
        gain.gain.linearRampToValueAtTime(0.24, now + n.time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.time + n.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur + 0.02);
      });
    } catch (e) {
      console.warn('PayPay sound failed:', e);
    }
  }

  /**
   * 7-Eleven Japan 4-Tone Entrance Electronic Chime
   */
  public playSevenEntrance(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // 7-Eleven classic chime: G5 -> E5 -> G5 -> C6
      const notes = [
        { freq: 783.99, time: 0, dur: 0.16 },     // G5
        { freq: 659.25, time: 0.16, dur: 0.16 },  // E5
        { freq: 783.99, time: 0.32, dur: 0.16 },  // G5
        { freq: 1046.50, time: 0.48, dur: 0.35 }  // C6
      ];
      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, now + n.time);
        gain.gain.setValueAtTime(0.001, now + n.time);
        gain.gain.linearRampToValueAtTime(0.18, now + n.time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.time + n.dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur + 0.02);
      });
    } catch (e) {
      console.warn('7-Eleven chime failed:', e);
    }
  }

  /**
   * 7-Eleven Nanaco Bird Chirp (ピヨピヨ double tweet)
   */
  public playNanacoChirp(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // High rapid double chirp (2800Hz ramp to 3600Hz)
      [0, 0.14].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2600, now + delay);
        osc.frequency.exponentialRampToValueAtTime(3600, now + delay + 0.08);

        gain.gain.setValueAtTime(0.01, now + delay);
        gain.gain.linearRampToValueAtTime(0.2, now + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.09);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.1);
      });
    } catch (e) {
      console.warn('Nanaco chirp failed:', e);
    }
  }

  /**
   * Lawson Japan Classic Two-Tone Doorbell Chime
   */
  public playLawsonDoorbell(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Lawson mellow warm two-tone (D5 -> B4 -> G4)
      const notes = [
        { freq: 587.33, time: 0, dur: 0.28 },     // D5
        { freq: 493.88, time: 0.25, dur: 0.28 },  // B4
        { freq: 392.00, time: 0.50, dur: 0.55 }   // G4
      ];
      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.freq, now + n.time);
        gain.gain.setValueAtTime(0.001, now + n.time);
        gain.gain.linearRampToValueAtTime(0.22, now + n.time + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.time + n.dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur + 0.05);
      });
    } catch (e) {
      console.warn('Lawson chime failed:', e);
    }
  }

  /**
   * Lawson Ponta Point Chime
   */
  public playPontaSound(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Ponta two-tone confirmation (C6 -> G6)
      const notes = [
        { freq: 1046.50, time: 0, dur: 0.10 },
        { freq: 1567.98, time: 0.09, dur: 0.20 }
      ];
      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, now + n.time);
        gain.gain.setValueAtTime(0.01, now + n.time);
        gain.gain.linearRampToValueAtTime(0.22, now + n.time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur + 0.02);
      });
    } catch (e) {
      console.warn('Ponta sound failed:', e);
    }
  }

  /**
   * FamilyMart Iconic Door Melody (Matsushita Chime)
   */
  public playFamilyMartChime(): void {
    this.playConbiniChime();
  }

  /**
   * Commercial Conbini 1500W Microwave Triple Completion Beep (ピー、ピー、ピー)
   */
  public playMicrowaveBeep(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // High-frequency conbini microwave beep (2093Hz - C7) in 3 rapid bursts
      [0, 0.22, 0.44].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(2093, now + delay);

        gain.gain.setValueAtTime(0.01, now + delay);
        gain.gain.linearRampToValueAtTime(0.18, now + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.16);
      });
    } catch (e) {
      console.warn('Microwave beep failed:', e);
    }
  }

  /**
   * Conbini Mechanical Cash Drawer Pop & Spring Glide
   */
  public playCashDrawerPop(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Heavy metallic solenoid release pop
      const popOsc = ctx.createOscillator();
      const popGain = ctx.createGain();
      popOsc.type = 'triangle';
      popOsc.frequency.setValueAtTime(140, now);
      popOsc.frequency.exponentialRampToValueAtTime(50, now + 0.06);

      popGain.gain.setValueAtTime(0.35, now);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      popOsc.connect(popGain);
      popGain.connect(ctx.destination);
      popOsc.start(now);
      popOsc.stop(now + 0.1);

      // Roller drawer glide chime
      const glideOsc = ctx.createOscillator();
      const glideGain = ctx.createGain();
      glideOsc.type = 'sine';
      glideOsc.frequency.setValueAtTime(1200, now + 0.05);
      glideOsc.frequency.linearRampToValueAtTime(900, now + 0.15);

      glideGain.gain.setValueAtTime(0.08, now + 0.05);
      glideGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      glideOsc.connect(glideGain);
      glideGain.connect(ctx.destination);
      glideOsc.start(now + 0.05);
      glideOsc.stop(now + 0.23);
    } catch (e) {
      console.warn('Drawer pop failed:', e);
    }
  }

  /**
   * Yen Coins Dropping on Blue Acrylic Cartone Tray (カルトン)
   */
  public playCoinDrop(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 3 subtle metallic clinks of 100/500 Yen coins bouncing
      const clinks = [
        { freq: 4200, time: 0, dur: 0.06 },
        { freq: 3800, time: 0.05, dur: 0.05 },
        { freq: 4500, time: 0.09, dur: 0.07 }
      ];

      clinks.forEach((c) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(c.freq, now + c.time);

        gain.gain.setValueAtTime(0.12, now + c.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + c.time + c.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + c.time);
        osc.stop(now + c.time + c.dur + 0.01);
      });
    } catch (e) {
      console.warn('Coin drop failed:', e);
    }
  }

  /**
   * Hot Snack Tongs Click (Metallic grab)
   */
  public playHotSnackTong(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Dual metal click of kitchen tongs
      [0, 0.08].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1800, now + delay);
        osc.frequency.exponentialRampToValueAtTime(1200, now + delay + 0.04);

        gain.gain.setValueAtTime(0.15, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.045);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.05);
      });
    } catch (e) {
      console.warn('Tong sound failed:', e);
    }
  }

  /**
   * Conbini Polyethylene Shopping Bag Rustle Sound (シャカシャカ)
   */
  public playPlasticBagSound(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // 4 rapid high-frequency crinkle pops
      [0, 0.04, 0.08, 0.13].forEach((delay, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(3200 + (idx % 2) * 800, now + delay);
        osc.frequency.linearRampToValueAtTime(1400, now + delay + 0.035);

        gain.gain.setValueAtTime(0.08, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.045);
      });
    } catch (e) {
      console.warn('Plastic bag sound failed:', e);
    }
  }
}

export const soundEffects = new SoundEngine();
