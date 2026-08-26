// ==============================================================================
// NIHOMI SEIJAKU ZEN AUDIO ENGINE (Web Audio API Synthesizer)
// Pure client-side harmonic chime, gentle rain, bamboo wind & temple ambient soundscapes
// ==============================================================================

export type ZenSoundscapeType = 'chimes' | 'rain' | 'wind' | 'stream';

export interface ZenSoundscapeInfo {
  id: ZenSoundscapeType;
  label: string;
  labelJa: string;
  icon: string;
  description: string;
}

export const ZEN_SOUNDSCAPES: ZenSoundscapeInfo[] = [
  {
    id: 'chimes',
    label: 'Kyoto Temple Chimes',
    labelJa: '京都の鐘',
    icon: '🔔',
    description: 'Insen/Hirajoshi pentatonic bell chimes with 108Hz drone',
  },
  {
    id: 'rain',
    label: 'Serene Kyoto Rain',
    labelJa: '静寂の雨',
    icon: '🌧️',
    description: 'Calming pink noise rainfall with resonant water drops',
  },
  {
    id: 'wind',
    label: 'Bamboo Grove Wind',
    labelJa: '竹林の風',
    icon: '🎋',
    description: 'Soothing modulated wind resonance for deep concentration',
  },
  {
    id: 'stream',
    label: 'Mountain Stream',
    labelJa: '山の小川',
    icon: '🌊',
    description: 'Flowing natural stream water dynamics',
  },
];

class ZenAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentMode: ZenSoundscapeType = 'chimes';
  private timerId: number | null = null;
  private noiseTimerId: number | null = null;
  private masterGain: GainNode | null = null;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private noiseGain: GainNode | null = null;

  // Japanese Hirajoshi / Insen pentatonic tuning (Hz) for serene focus
  private notes = [
    261.63, // C4
    277.18, // C#4
    349.23, // F4
    392.00, // G4
    466.16, // A#4
    523.25, // C5
    554.37, // C#5
    698.46, // F5
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
      this.droneGain.gain.linearRampToValueAtTime(0.02, now + 3.0);

      this.droneOsc.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);
      this.droneOsc.start(now);
    } catch {}
  }

  // Generate pink/white noise buffer for natural rain/wind soundscapes
  private createNoiseBuffer(ctx: AudioContext, isPink: boolean = true): AudioBuffer {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (isPink) {
        // Pink noise filtering algorithm
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      } else {
        data[i] = white * 0.03;
      }
    }
    return buffer;
  }

  // Start soundscape layer (Rain, Wind, Stream) with customizable fade-in time
  private startSoundscapeLayer(mode: ZenSoundscapeType, fadeInDuration: number = 2.0): { node: AudioNode; gain: GainNode } | null {
    if (!this.ctx || !this.masterGain) return null;

    try {
      const ctx = this.ctx;
      const now = ctx.currentTime;
      const noiseBuffer = this.createNoiseBuffer(ctx, mode !== 'wind');
      
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      // Filter to shape the frequency response
      const filter = ctx.createBiquadFilter();
      const gainNode = ctx.createGain();

      if (mode === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);
        gainNode.gain.setValueAtTime(0.0001, now);
        gainNode.gain.linearRampToValueAtTime(0.045, now + fadeInDuration);
      } else if (mode === 'wind') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(450, now);
        filter.Q.setValueAtTime(3.0, now);
        gainNode.gain.setValueAtTime(0.0001, now);
        gainNode.gain.linearRampToValueAtTime(0.035, now + fadeInDuration);

        // Modulate wind frequency for natural gusting
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.15, now);
        lfoGain.gain.setValueAtTime(180, now);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start(now);
      } else if (mode === 'stream') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(850, now);
        filter.Q.setValueAtTime(1.5, now);
        gainNode.gain.setValueAtTime(0.0001, now);
        gainNode.gain.linearRampToValueAtTime(0.04, now + fadeInDuration);
      }

      noiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.masterGain);

      noiseSource.start(now);
      return { node: noiseSource, gain: gainNode };
    } catch {
      return null;
    }
  }

  // Smooth cross-fade between soundscape modes (Seijaku ambient transition)
  public setMode(mode: ZenSoundscapeType) {
    if (this.currentMode === mode) return;
    const oldMode = this.currentMode;
    this.currentMode = mode;

    if (!this.isPlaying || !this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const crossfadeTime = 1.4; // 1.4 second smooth crossfade ramp

      // 1. Smoothly fade out old noise layer if present
      const oldGain = this.noiseGain;
      const oldNode = this.noiseNode;

      if (oldGain) {
        try {
          oldGain.gain.cancelScheduledValues(now);
          oldGain.gain.setValueAtTime(oldGain.gain.value, now);
          oldGain.gain.linearRampToValueAtTime(0.0001, now + crossfadeTime);
          
          setTimeout(() => {
            try {
              if (oldNode) {
                (oldNode as any).stop?.();
                oldNode.disconnect();
              }
              oldGain.disconnect();
            } catch {}
          }, (crossfadeTime + 0.2) * 1000);
        } catch {}
      }

      // 2. Concurrently fade in new soundscape layer if not pure chimes
      if (mode !== 'chimes') {
        const newLayer = this.startSoundscapeLayer(mode, crossfadeTime);
        if (newLayer) {
          this.noiseNode = newLayer.node;
          this.noiseGain = newLayer.gain;
        } else {
          this.noiseNode = null;
          this.noiseGain = null;
        }
      } else {
        this.noiseNode = null;
        this.noiseGain = null;
      }

      // 3. Play a soft harmonic chime note to signify harmonious transition
      this.playChime(this.notes[Math.floor(Math.random() * this.notes.length)]);
    } catch (e) {
      console.warn('Crossfade error:', e);
    }
  }

  public getMode(): ZenSoundscapeType {
    return this.currentMode;
  }

  public start(mode?: ZenSoundscapeType) {
    if (mode) this.currentMode = mode;
    if (this.isPlaying) return;
    this.isPlaying = true;

    try {
      const ctx = this.getContext();
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, ctx.currentTime);
      this.masterGain.connect(ctx.destination);

      this.startWarmDrone();

      if (this.currentMode !== 'chimes') {
        this.startSoundscapeLayer(this.currentMode);
      }

      // Trigger initial soft chime
      this.playChime(this.notes[0]);

      // Periodic random harmonic chimes (every 9-14 seconds)
      const scheduleNext = () => {
        if (!this.isPlaying) return;
        const delay = 9000 + Math.random() * 5000;
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
    if (this.noiseTimerId !== null) {
      clearTimeout(this.noiseTimerId);
      this.noiseTimerId = null;
    }

    if (this.noiseGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.noiseGain.gain.linearRampToValueAtTime(0.0001, now + 0.6);
        setTimeout(() => {
          if (this.noiseNode) {
            try {
              (this.noiseNode as any).stop?.();
              this.noiseNode.disconnect();
            } catch {}
            this.noiseNode = null;
          }
        }, 700);
      } catch {}
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
