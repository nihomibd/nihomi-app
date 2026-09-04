/**
 * In-Browser Procedural Pitch Audio Synthesizer
 * 
 * Uses Web Audio API harmonic formant synthesis to proceduralize Tokyo Japanese
 * pitch-accent contours in real-time. Eliminates static MP3 audio dependencies by
 * generating authentic human-like vocal resonance with accurate High/Low pitch drops.
 */

export type PitchSynthMode = 'harmonic' | 'vocal_hum';

export interface ParametricContourOptions {
  morae: string[];
  targetPitches: ('H' | 'L')[];
  standardHzContour?: number[];
  downstepMora?: number;
  speedMultiplier?: 0.75 | 1.0 | number;
  pitchMode?: PitchSynthMode;
  volume?: number;
  onMoraStart?: (moraIndex: number, mora: string, pitchHz: number, pitchType: 'H' | 'L') => void;
  onMoraEnd?: (moraIndex: number, mora: string) => void;
  onComplete?: () => void;
}

export class PitchAudioSynthesizer {
  private static audioCtx: AudioContext | null = null;
  private static activeNodes: {
    oscillators: OscillatorNode[];
    gainNodes: GainNode[];
    timerIds: number[];
  } | null = null;
  private static isPlaying = false;

  // Tokyo Pitch Baseline Frequencies (Hz)
  public static readonly HIGH_PITCH_HZ = 290;
  public static readonly LOW_PITCH_HZ = 210;
  public static readonly DOWNSTEP_GLIDE_SEC = 0.04;
  public static readonly BASE_MORA_SEC = 0.20;

  /**
   * Acquire or initialize the Web Audio Context
   */
  public static async getAudioContext(): Promise<AudioContext> {
    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Stop any currently active playback immediately
   */
  public static stop(): void {
    if (this.activeNodes) {
      this.activeNodes.timerIds.forEach((id) => clearTimeout(id));
      this.activeNodes.oscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // Ignore if already stopped
        }
      });
      this.activeNodes.gainNodes.forEach((gain) => {
        try {
          gain.disconnect();
        } catch {
          // Ignore
        }
      });
      this.activeNodes = null;
    }
    this.isPlaying = false;
  }

  /**
   * Check if synthesizer is currently active
   */
  public static getActiveState(): boolean {
    return this.isPlaying;
  }

  /**
   * Procedurally play a Tokyo pitch-accent contour
   */
  public static async playContour(options: ParametricContourOptions): Promise<void> {
    this.stop();

    if (typeof window === 'undefined') return;
    const ctx = await this.getAudioContext();

    const morae = options.morae && options.morae.length > 0 ? options.morae : ['あ'];
    const pitches = options.targetPitches && options.targetPitches.length === morae.length
      ? options.targetPitches
      : morae.map(() => 'H' as const);

    const speed = Math.max(0.5, Math.min(2.0, options.speedMultiplier || 1.0));
    const moraDur = this.BASE_MORA_SEC / speed;
    const mode = options.pitchMode || 'harmonic';
    const volume = Math.max(0, Math.min(1, options.volume ?? 0.35));

    this.isPlaying = true;

    const timerIds: number[] = [];
    const oscillators: OscillatorNode[] = [];
    const gainNodes: GainNode[] = [];

    // Master bus
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    masterGain.connect(ctx.destination);
    gainNodes.push(masterGain);

    const startTime = ctx.currentTime + 0.05;
    let accumulatedTime = startTime;

    // Build pitch frequency array per mora
    const moraFrequencies: number[] = morae.map((_, i) => {
      if (options.standardHzContour && options.standardHzContour[i] && options.standardHzContour[i] > 60) {
        return options.standardHzContour[i];
      }
      return pitches[i] === 'H' ? this.HIGH_PITCH_HZ : this.LOW_PITCH_HZ;
    });

    if (mode === 'harmonic') {
      // Harmonic Formant Vocal Model: Fundamental + Formants
      const osc1 = ctx.createOscillator(); // F0
      const osc2 = ctx.createOscillator(); // 2*F0
      const osc3 = ctx.createOscillator(); // 3*F0

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      osc3.type = 'sine';

      // Formant filters (Japanese vowel neutral formant band)
      const formantFilter = ctx.createBiquadFilter();
      formantFilter.type = 'bandpass';
      formantFilter.frequency.setValueAtTime(850, ctx.currentTime); // F1 bandpass
      formantFilter.Q.setValueAtTime(2.2, ctx.currentTime);

      const highShelf = ctx.createBiquadFilter();
      highShelf.type = 'highshelf';
      highShelf.frequency.setValueAtTime(2500, ctx.currentTime);
      highShelf.gain.setValueAtTime(-9, ctx.currentTime); // Tame excessive harsh high frequencies

      // Articulation Envelope Gain (envelopes each mora so syllables distinctively breathe)
      const articGain = ctx.createGain();
      articGain.gain.setValueAtTime(0.0001, ctx.currentTime);

      // Connect graph
      const mixGain = ctx.createGain();
      mixGain.gain.value = 0.5;

      osc1.connect(mixGain);
      osc2.connect(mixGain);
      osc3.connect(mixGain);

      mixGain.connect(formantFilter);
      formantFilter.connect(highShelf);
      highShelf.connect(articGain);
      articGain.connect(masterGain);

      oscillators.push(osc1, osc2, osc3);
      gainNodes.push(masterGain, mixGain, articGain);

      // Schedule mora envelope & pitch transitions
      morae.forEach((mora, i) => {
        const freq = moraFrequencies[i];
        const pitchType = pitches[i];
        const mStart = accumulatedTime;
        const mEnd = mStart + moraDur;

        // Envelope: smooth attack, sustain, slight decay
        articGain.gain.setValueAtTime(0.0001, mStart);
        articGain.gain.exponentialRampToValueAtTime(0.8, mStart + 0.035);
        articGain.gain.setValueAtTime(0.7, mEnd - 0.03);
        articGain.gain.exponentialRampToValueAtTime(0.0001, mEnd);

        // Pitch transition
        if (i === 0) {
          osc1.frequency.setValueAtTime(freq, mStart);
          osc2.frequency.setValueAtTime(freq * 2, mStart);
          osc3.frequency.setValueAtTime(freq * 3, mStart);
        } else {
          // Glide smoothly into next pitch
          const glideTime = Math.min(this.DOWNSTEP_GLIDE_SEC, moraDur * 0.3);
          osc1.frequency.exponentialRampToValueAtTime(Math.max(60, freq), mStart + glideTime);
          osc2.frequency.exponentialRampToValueAtTime(Math.max(120, freq * 2), mStart + glideTime);
          osc3.frequency.exponentialRampToValueAtTime(Math.max(180, freq * 3), mStart + glideTime);
        }

        // Trigger user UI callbacks via setTimeout
        const delayToStartMs = Math.max(0, (mStart - ctx.currentTime) * 1000);
        const delayToEndMs = Math.max(0, (mEnd - ctx.currentTime) * 1000);

        const tidStart = window.setTimeout(() => {
          if (PitchAudioSynthesizer.isPlaying && options.onMoraStart) {
            options.onMoraStart(i, mora, freq, pitchType);
          }
        }, delayToStartMs);

        const tidEnd = window.setTimeout(() => {
          if (PitchAudioSynthesizer.isPlaying && options.onMoraEnd) {
            options.onMoraEnd(i, mora);
          }
        }, delayToEndMs);

        timerIds.push(tidStart, tidEnd);
        accumulatedTime = mEnd;
      });

      // Start oscillators
      const totalDuration = accumulatedTime - ctx.currentTime;
      osc1.start(startTime);
      osc2.start(startTime);
      osc3.start(startTime);

      osc1.stop(accumulatedTime + 0.05);
      osc2.stop(accumulatedTime + 0.05);
      osc3.stop(accumulatedTime + 0.05);

      this.activeNodes = { oscillators, gainNodes, timerIds };

      // Complete callback
      const completeTid = window.setTimeout(() => {
        PitchAudioSynthesizer.isPlaying = false;
        if (options.onComplete) {
          options.onComplete();
        }
      }, Math.max(10, totalDuration * 1000 + 60));
      timerIds.push(completeTid);

    } else {
      // Vocal Hum Mode: Warm, gentle vocal humming with subtle vibrato
      const osc = ctx.createOscillator();
      osc.type = 'triangle';

      // Vibrato LFO
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 5.2; // 5.2 Hz vocal vibrato
      lfoGain.gain.value = 2.5; // +/- 2.5 Hz deviation
      lfo.connect(osc.frequency);

      // Low-pass warmth filter
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(450, ctx.currentTime);
      lowpass.Q.setValueAtTime(1.5, ctx.currentTime);

      const articGain = ctx.createGain();
      articGain.gain.setValueAtTime(0.0001, ctx.currentTime);

      osc.connect(lowpass);
      lowpass.connect(articGain);
      articGain.connect(masterGain);

      oscillators.push(osc, lfo);
      gainNodes.push(masterGain, articGain, lfoGain);

      morae.forEach((mora, i) => {
        const freq = moraFrequencies[i];
        const pitchType = pitches[i];
        const mStart = accumulatedTime;
        const mEnd = mStart + moraDur;

        // Smooth hum envelope
        articGain.gain.setValueAtTime(0.0001, mStart);
        articGain.gain.linearRampToValueAtTime(0.85, mStart + 0.04);
        articGain.gain.setValueAtTime(0.75, mEnd - 0.04);
        articGain.gain.linearRampToValueAtTime(0.0001, mEnd);

        if (i === 0) {
          osc.frequency.setValueAtTime(freq, mStart);
        } else {
          osc.frequency.exponentialRampToValueAtTime(
            Math.max(60, freq),
            mStart + Math.min(this.DOWNSTEP_GLIDE_SEC, moraDur * 0.3)
          );
        }

        const delayToStartMs = Math.max(0, (mStart - ctx.currentTime) * 1000);
        const delayToEndMs = Math.max(0, (mEnd - ctx.currentTime) * 1000);

        const tidStart = window.setTimeout(() => {
          if (PitchAudioSynthesizer.isPlaying && options.onMoraStart) {
            options.onMoraStart(i, mora, freq, pitchType);
          }
        }, delayToStartMs);

        const tidEnd = window.setTimeout(() => {
          if (PitchAudioSynthesizer.isPlaying && options.onMoraEnd) {
            options.onMoraEnd(i, mora);
          }
        }, delayToEndMs);

        timerIds.push(tidStart, tidEnd);
        accumulatedTime = mEnd;
      });

      const totalDuration = accumulatedTime - ctx.currentTime;
      lfo.start(startTime);
      osc.start(startTime);

      lfo.stop(accumulatedTime + 0.05);
      osc.stop(accumulatedTime + 0.05);

      this.activeNodes = { oscillators, gainNodes, timerIds };

      const completeTid = window.setTimeout(() => {
        PitchAudioSynthesizer.isPlaying = false;
        if (options.onComplete) {
          options.onComplete();
        }
      }, Math.max(10, totalDuration * 1000 + 60));
      timerIds.push(completeTid);
    }
  }

  /**
   * Offline Audio Buffer Generator: renders a synthetic audio buffer
   * for visualization or export without playing through speakers.
   */
  public static async generateSyntheticBuffer(
    options: Omit<ParametricContourOptions, 'onMoraStart' | 'onMoraEnd' | 'onComplete'>
  ): Promise<AudioBuffer> {
    const sampleRate = 44100;
    const speed = options.speedMultiplier || 1.0;
    const moraDur = this.BASE_MORA_SEC / speed;
    const morae = options.morae && options.morae.length > 0 ? options.morae : ['あ'];
    const totalDuration = Math.max(0.2, morae.length * moraDur + 0.1);
    const length = Math.ceil(sampleRate * totalDuration);

    const OfflineCtxClass =
      window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
    const offlineCtx = new OfflineCtxClass(1, length, sampleRate);

    const pitches = options.targetPitches && options.targetPitches.length === morae.length
      ? options.targetPitches
      : morae.map(() => 'H' as const);

    const moraFrequencies: number[] = morae.map((_, i) => {
      if (options.standardHzContour && options.standardHzContour[i]) {
        return options.standardHzContour[i];
      }
      return pitches[i] === 'H' ? this.HIGH_PITCH_HZ : this.LOW_PITCH_HZ;
    });

    const osc = offlineCtx.createOscillator();
    osc.type = options.pitchMode === 'vocal_hum' ? 'triangle' : 'sawtooth';

    const filter = offlineCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, 0);
    filter.Q.setValueAtTime(2.0, 0);

    const gainNode = offlineCtx.createGain();
    gainNode.gain.setValueAtTime(0.0001, 0);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(offlineCtx.destination);

    let t = 0.02;
    morae.forEach((_, i) => {
      const freq = moraFrequencies[i];
      const mEnd = t + moraDur;
      gainNode.gain.setValueAtTime(0.0001, t);
      gainNode.gain.exponentialRampToValueAtTime(0.6, t + 0.02);
      gainNode.gain.setValueAtTime(0.5, mEnd - 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, mEnd);

      if (i === 0) {
        osc.frequency.setValueAtTime(freq, t);
      } else {
        osc.frequency.exponentialRampToValueAtTime(freq, t + 0.03);
      }
      t = mEnd;
    });

    osc.start(0.02);
    osc.stop(t);

    return offlineCtx.startRendering();
  }
}
