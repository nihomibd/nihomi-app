/**
 * Tokyo Pitch Accent Web Audio Synthesizer & Real-Time Pitch Tracking Engine
 * Provides authentic Tokyo pitch contour auditory models and autocorrelation-based F0 pitch extraction.
 */

// Pitch Frequency Constants for Tokyo Japanese Speech Range (Hz)
export const TOKYO_PITCH_FREQUENCIES = {
  HIGH_MORA_HZ: 310,  // Standard female/male normalized Tokyo high mora (H)
  LOW_MORA_HZ: 220,   // Standard normalized Tokyo low mora (L)
  DROP_GLIDE_MS: 40,  // Downstep transition glide duration
  MORA_DURATION_MS: 200 // Standard Tokyo conversational mora tempo
};

/**
 * Play authentic Tokyo Pitch Contour Melody using Web Audio API
 */
export async function playTokyoPitchMelody(
  targetPitches: ('H' | 'L')[],
  morae: string[],
  speedMultiplier = 1.0
): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const now = ctx.currentTime;
    const moraDur = (TOKYO_PITCH_FREQUENCIES.MORA_DURATION_MS / 1000) / speedMultiplier;

    // Master Gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.25, now);
    masterGain.connect(ctx.destination);

    // Create oscillator for melodic pitch line
    const osc = ctx.createOscillator();
    osc.type = 'triangle'; // Smooth, vocal-formant-like wave

    // Formant Filter to give speech-like vocal quality
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(3.0, now);

    osc.connect(filter);
    filter.connect(masterGain);

    let currentTime = now + 0.05;

    targetPitches.forEach((pitch, i) => {
      const targetFreq =
        pitch === 'H'
          ? TOKYO_PITCH_FREQUENCIES.HIGH_MORA_HZ
          : TOKYO_PITCH_FREQUENCIES.LOW_MORA_HZ;

      // Smooth glide into pitch
      if (i === 0) {
        osc.frequency.setValueAtTime(targetFreq, currentTime);
      } else {
        osc.frequency.exponentialRampToValueAtTime(
          Math.max(80, targetFreq),
          currentTime + 0.03
        );
      }

      currentTime += moraDur;
    });

    // Fade out smoothly at the end
    masterGain.gain.setValueAtTime(0.25, currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, currentTime + 0.08);

    osc.start(now + 0.05);
    osc.stop(currentTime + 0.1);

    // Clean up AudioContext when done
    setTimeout(() => {
      if (ctx.state !== 'closed') {
        ctx.close().catch(() => {});
      }
    }, (currentTime - now + 0.2) * 1000);
  } catch (err) {
    console.warn('[Pitch Audio] Web Audio melody synthesis warning:', err);
  }
}

/**
 * Play authentic full sentence Tokyo pitch contour melody using Web Audio API oscillator
 */
export async function playSentenceProsodyMelody(
  f0Points: { timeMs: number; f0Hz: number }[],
  speedMultiplier = 1.0,
  onEnd?: () => void
): Promise<void> {
  if (typeof window === 'undefined' || !f0Points || f0Points.length === 0) {
    if (onEnd) onEnd();
    return;
  }

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.22, now);
    masterGain.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = 'triangle';

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(850, now);
    filter.Q.setValueAtTime(2.5, now);

    osc.connect(filter);
    filter.connect(masterGain);

    const startTime = now + 0.05;
    const lastPoint = f0Points[f0Points.length - 1];
    const totalDurationSec = (lastPoint.timeMs / 1000) / speedMultiplier;

    osc.frequency.setValueAtTime(f0Points[0].f0Hz, startTime);

    for (let i = 1; i < f0Points.length; i++) {
      const p = f0Points[i];
      const targetTime = startTime + (p.timeMs / 1000) / speedMultiplier;
      osc.frequency.exponentialRampToValueAtTime(Math.max(60, Math.min(600, p.f0Hz)), targetTime);
    }

    masterGain.gain.setValueAtTime(0.22, startTime + totalDurationSec);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + totalDurationSec + 0.08);

    osc.start(startTime);
    osc.stop(startTime + totalDurationSec + 0.1);

    setTimeout(() => {
      if (ctx.state !== 'closed') {
        ctx.close().catch(() => {});
      }
      if (onEnd) onEnd();
    }, (totalDurationSec + 0.25) * 1000);
  } catch (err) {
    console.warn('[Pitch Audio] Sentence melody synthesis warning:', err);
    if (onEnd) onEnd();
  }
}

/**
 * Play Native Tokyo Japanese Speech using Web Speech API
 */
export function playNativeTokyoSpeech(
  phrase: string,
  rate = 1.0,
  onStart?: () => void,
  onEnd?: () => void
): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(phrase);
  utterance.lang = 'ja-JP';
  utterance.rate = Math.max(0.6, Math.min(1.2, rate));
  utterance.pitch = 1.0;

  // Try to locate a native Tokyo Japanese voice
  const voices = window.speechSynthesis.getVoices();
  const jaVoice =
    voices.find((v) => v.lang === 'ja-JP' || v.lang.startsWith('ja')) ||
    voices.find((v) => v.name.includes('Japanese') || v.name.includes('Tokyo'));

  if (jaVoice) {
    utterance.voice = jaVoice;
  }

  if (onStart) utterance.onstart = onStart;
  utterance.onend = () => {
    if (onEnd) onEnd();
  };
  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

/**
 * Real-Time Autocorrelation Pitch Detector (F0 Extraction)
 */
export class BrowserPitchTracker {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private buffer: Float32Array = new Float32Array(2048);
  private collectedF0Points: number[] = [];
  private isListening = false;
  private animId: number | null = null;
  private onVolumeChange?: (volume: number) => void;
  private onPitchDetected?: (hz: number) => void;

  private onDirectPitch?: (freq: number, confidence: number) => void;

  public async start(
    stream: MediaStream,
    callbacks?:
      | {
          onVolumeChange?: (vol: number) => void;
          onPitchDetected?: (hz: number) => void;
        }
      | ((freq: number, confidence: number) => void)
  ): Promise<void> {
    this.mediaStream = stream;
    if (typeof callbacks === 'function') {
      this.onDirectPitch = callbacks;
    } else {
      this.onVolumeChange = callbacks?.onVolumeChange;
      this.onPitchDetected = callbacks?.onPitchDetected;
    }
    this.collectedF0Points = [];

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.audioCtx = new AudioContextClass();
    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    const source = this.audioCtx.createMediaStreamSource(stream);
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.buffer = new Float32Array(this.analyser.fftSize);

    source.connect(this.analyser);
    this.isListening = true;

    this.trackPitchLoop();
  }

  private trackPitchLoop = () => {
    if (!this.isListening || !this.analyser) return;

    this.analyser.getFloatTimeDomainData(this.buffer);

    // Compute RMS Volume
    let sumSquares = 0;
    for (let i = 0; i < this.buffer.length; i++) {
      sumSquares += this.buffer[i] * this.buffer[i];
    }
    const rms = Math.sqrt(sumSquares / this.buffer.length);
    const volumePercent = Math.min(100, Math.round(rms * 400));

    if (this.onVolumeChange) {
      this.onVolumeChange(volumePercent);
    }

    // Only detect pitch when learner is actually speaking
    if (rms > 0.015 && this.audioCtx) {
      const pitchHz = this.autoCorrelate(this.buffer, this.audioCtx.sampleRate);
      if (pitchHz > 75 && pitchHz < 550) {
        this.collectedF0Points.push(Math.round(pitchHz));
        if (this.onPitchDetected) {
          this.onPitchDetected(Math.round(pitchHz));
        }
        if (this.onDirectPitch) {
          this.onDirectPitch(Math.round(pitchHz), Math.min(1.0, rms * 10));
        }
      }
    }

    this.animId = requestAnimationFrame(this.trackPitchLoop);
  };

  /**
   * Normalized Autocorrelation Algorithm for F0 Pitch Extraction
   */
  private autoCorrelate(buffer: Float32Array, sampleRate: number): number {
    const SIZE = buffer.length;
    let sumOfSquares = 0;
    for (let i = 0; i < SIZE; i++) {
      sumOfSquares += buffer[i] * buffer[i];
    }
    const rms = Math.sqrt(sumOfSquares / SIZE);
    if (rms < 0.01) return -1; // Not enough sound energy

    // Trim quiet edges to find zero-crossings
    let r1 = 0;
    let r2 = SIZE - 1;
    const thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buffer[i]) < thres) {
        r1 = i;
        break;
      }
    }
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buffer[SIZE - i]) < thres) {
        r2 = SIZE - i;
        break;
      }
    }

    const trimmed = buffer.slice(r1, r2);
    const c = new Array(trimmed.length).fill(0);

    for (let i = 0; i < trimmed.length; i++) {
      for (let j = 0; j < trimmed.length - i; j++) {
        c[i] = c[i] + trimmed[j] * trimmed[j + i];
      }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1;
    let maxpos = -1;

    for (let i = d; i < trimmed.length; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }

    let T0 = maxpos;
    if (T0 > 0 && T0 < trimmed.length - 1) {
      // Parabolic interpolation for fine frequency estimation
      const x1 = c[T0 - 1];
      const x2 = c[T0];
      const x3 = c[T0 + 1];
      const a = (x1 + x3 - 2 * x2) / 2;
      const b = (x3 - x1) / 2;
      if (a) T0 = T0 - b / (2 * a);
    }

    return sampleRate / T0;
  }

  public getPitchTrajectory(): number[] {
    return [...this.collectedF0Points];
  }

  public stop(): number[] {
    this.isListening = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
    return [...this.collectedF0Points];
  }
}
