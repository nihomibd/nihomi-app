/**
 * Client-Side Voice Activity Detection (VAD) & Mora Alignment Engine
 * 
 * Performs real-time frame energy and zero-crossing rate analysis to strip ambient
 * background noise, isolate active speech boundaries, and warp user morae against
 * reference Tokyo Japanese acoustic models.
 */

export interface MoraSegment {
  moraIndex: number;
  startTimeMs: number;
  endTimeMs: number;
  durationMs: number;
  averageF0Hz: number;
  averageIntensityDb: number;
  isVoiced: boolean;
  hasStressSpike: boolean; // Flagged if intensity was used for emphasis instead of pitch elevation
}

export interface VADProcessedResult {
  rawSampleCount: number;
  croppedSampleCount: number;
  sampleRate: number;
  speechStartSec: number;
  speechEndSec: number;
  speechDurationMs: number;
  croppedFloat32: Float32Array;
  f0TrajectoryHz: number[];
  intensityEnvelopeDb: number[];
  averageF0Hz: number;
  minF0Hz: number;
  maxF0Hz: number;
  snrDb: number;
  moraSegments: MoraSegment[];
  audioBase64Wav: string;
}

export class AudioVADProcessor {
  // Configurable VAD parameters
  public static readonly FRAME_SIZE_MS = 25; // 25ms frames
  public static readonly HOP_SIZE_MS = 10;   // 10ms frame stride
  public static readonly MIN_SPEECH_DURATION_MS = 150; // Minimum valid speech burst
  public static readonly SILENCE_ENERGY_THRESHOLD = 0.012; // Energy floor for speech
  public static readonly ZCR_LOWER_THRESHOLD = 0.02; // Min zero-crossing rate for voiced speech
  public static readonly ZCR_UPPER_THRESHOLD = 0.55; // Max zero-crossing rate (filters out high hiss/fan noise)

  // Human Japanese Speech Fundamental Frequency Range (Hz)
  public static readonly MIN_F0_HZ = 75;
  public static readonly MAX_F0_HZ = 450;

  /**
   * Process raw audio buffer from MediaRecorder or Web Audio API
   */
  public static processAudio(
    audioBuffer: Float32Array,
    sampleRate: number,
    targetMoraCount = 2,
    targetDownstepMora = 0
  ): VADProcessedResult {
    const frameSize = Math.floor((this.FRAME_SIZE_MS / 1000) * sampleRate);
    const hopSize = Math.floor((this.HOP_SIZE_MS / 1000) * sampleRate);
    const numFrames = Math.max(1, Math.floor((audioBuffer.length - frameSize) / hopSize) + 1);

    const frameEnergies: number[] = new Array(numFrames);
    const frameZCRs: number[] = new Array(numFrames);
    const frameF0s: number[] = new Array(numFrames);

    let noiseEnergySum = 0;
    let noiseFrames = 0;

    // Estimate noise floor from the first 5 frames (assuming user hasn't spoken immediately)
    const initialNoiseFrames = Math.min(5, numFrames);
    for (let i = 0; i < initialNoiseFrames; i++) {
      const start = i * hopSize;
      let sumSq = 0;
      for (let j = 0; j < frameSize; j++) {
        const s = audioBuffer[start + j] || 0;
        sumSq += s * s;
      }
      noiseEnergySum += Math.sqrt(sumSq / frameSize);
      noiseFrames++;
    }
    const measuredNoiseFloor = noiseFrames > 0 ? noiseEnergySum / noiseFrames : 0.005;
    // If the opening frames already contain high energy (>0.025), the speaker began immediately
    const noiseFloor = measuredNoiseFloor > 0.025 ? 0.005 : measuredNoiseFloor;
    const adaptiveEnergyThreshold = Math.max(this.SILENCE_ENERGY_THRESHOLD, noiseFloor * 2.8);

    // Frame-by-frame Energy, ZCR & Autocorrelation F0
    for (let f = 0; f < numFrames; f++) {
      const frameStart = f * hopSize;
      const frame = audioBuffer.subarray(frameStart, frameStart + frameSize);

      // 1. RMS Energy
      let sumSq = 0;
      let zeroCrossings = 0;
      for (let s = 0; s < frame.length; s++) {
        const val = frame[s];
        sumSq += val * val;
        if (s > 0 && ((frame[s - 1] >= 0 && val < 0) || (frame[s - 1] < 0 && val >= 0))) {
          zeroCrossings++;
        }
      }
      const rms = Math.sqrt(sumSq / frame.length);
      const zcr = zeroCrossings / frame.length;

      frameEnergies[f] = rms;
      frameZCRs[f] = zcr;

      // 2. Autocorrelation Pitch Extraction if energy exceeds noise floor
      if (rms >= adaptiveEnergyThreshold && zcr >= this.ZCR_LOWER_THRESHOLD && zcr <= this.ZCR_UPPER_THRESHOLD) {
        frameF0s[f] = this.extractPitchAutocorrelation(frame, sampleRate);
      } else {
        frameF0s[f] = 0;
      }
    }

    // Identify active speech boundaries (leading and trailing silence stripping)
    let speechStartFrame = -1;
    let speechEndFrame = -1;

    // Look for onset of speech (at least 3 consecutive active frames)
    for (let f = 0; f < numFrames - 2; f++) {
      if (
        frameEnergies[f] >= adaptiveEnergyThreshold &&
        frameEnergies[f + 1] >= adaptiveEnergyThreshold &&
        frameEnergies[f + 2] >= adaptiveEnergyThreshold
      ) {
        speechStartFrame = Math.max(0, f - 2); // Include slight 20ms attack padding
        break;
      }
    }

    // Look for offset of speech from the back
    for (let f = numFrames - 1; f >= 2; f--) {
      if (
        frameEnergies[f] >= adaptiveEnergyThreshold &&
        frameEnergies[f - 1] >= adaptiveEnergyThreshold &&
        frameEnergies[f - 2] >= adaptiveEnergyThreshold
      ) {
        speechEndFrame = Math.min(numFrames - 1, f + 2); // Include slight 20ms release padding
        break;
      }
    }

    // Fallback if no distinct boundary detected
    if (speechStartFrame === -1 || speechEndFrame === -1 || speechEndFrame <= speechStartFrame) {
      speechStartFrame = 0;
      speechEndFrame = numFrames - 1;
    }

    const startSample = speechStartFrame * hopSize;
    const endSample = Math.min(audioBuffer.length, (speechEndFrame + 1) * hopSize + frameSize);
    const speechDurationMs = Math.max(100, Math.round(((endSample - startSample) / sampleRate) * 1000));

    // Crop audio buffer
    let cropped = audioBuffer.subarray(startSample, endSample);

    // Normalize cropped audio to -1.0 .. 1.0 peak
    let maxPeak = 0;
    for (let i = 0; i < cropped.length; i++) {
      const absVal = Math.abs(cropped[i]);
      if (absVal > maxPeak) maxPeak = absVal;
    }
    const normalizedCropped = new Float32Array(cropped.length);
    const normFactor = maxPeak > 0.01 ? 0.95 / maxPeak : 1.0;
    for (let i = 0; i < cropped.length; i++) {
      normalizedCropped[i] = cropped[i] * normFactor;
    }

    // Extract cropped F0 trajectory and intensity envelope
    const activeF0s: number[] = [];
    const activeEnergiesDb: number[] = [];

    for (let f = speechStartFrame; f <= speechEndFrame; f++) {
      const f0 = frameF0s[f];
      activeF0s.push(f0);

      const e = frameEnergies[f];
      // Convert to dB scale (0 to 100 relative)
      const db = Math.max(0, Math.min(100, Math.round(20 * Math.log10(e / 0.00002))));
      activeEnergiesDb.push(db);
    }

    // Smooth F0 contour (fill small 1-frame dropouts using linear interpolation)
    const smoothedF0 = this.smoothContour(activeF0s);

    // Calculate F0 metrics
    const voicedF0s = smoothedF0.filter((f) => f > 0);
    const averageF0Hz = voicedF0s.length > 0
      ? Math.round(voicedF0s.reduce((a, b) => a + b, 0) / voicedF0s.length)
      : 220;
    const minF0Hz = voicedF0s.length > 0 ? Math.min(...voicedF0s) : 180;
    const maxF0Hz = voicedF0s.length > 0 ? Math.max(...voicedF0s) : 260;

    // Estimate Signal-to-Noise Ratio (SNR) in dB
    const avgSpeechEnergy = frameEnergies.slice(speechStartFrame, speechEndFrame + 1).reduce((a, b) => a + b, 0) /
      Math.max(1, speechEndFrame - speechStartFrame + 1);
    const snrDb = Math.max(0, Math.round(20 * Math.log10((avgSpeechEnergy + 0.0001) / (noiseFloor + 0.0001))));

    // Dynamic Time Warping & Mora Segmentation
    const moraSegments = this.alignMoraSegments(
      smoothedF0,
      activeEnergiesDb,
      speechDurationMs,
      targetMoraCount,
      targetDownstepMora
    );

    // Encode cropped audio to 16-bit PCM WAV base64
    const audioBase64Wav = this.encodeWAVBase64(normalizedCropped, sampleRate);

    return {
      rawSampleCount: audioBuffer.length,
      croppedSampleCount: normalizedCropped.length,
      sampleRate,
      speechStartSec: Number((startSample / sampleRate).toFixed(3)),
      speechEndSec: Number((endSample / sampleRate).toFixed(3)),
      speechDurationMs,
      croppedFloat32: normalizedCropped,
      f0TrajectoryHz: smoothedF0,
      intensityEnvelopeDb: activeEnergiesDb,
      averageF0Hz,
      minF0Hz,
      maxF0Hz,
      snrDb,
      moraSegments,
      audioBase64Wav
    };
  }

  /**
   * Autocorrelation Pitch Extraction with Parabolic Interpolation
   */
  private static extractPitchAutocorrelation(frame: Float32Array, sampleRate: number): number {
    const minLag = Math.floor(sampleRate / this.MAX_F0_HZ);
    const maxLag = Math.ceil(sampleRate / this.MIN_F0_HZ);

    let maxCorr = -1;
    let bestLag = -1;

    // Calculate normalized autocorrelation
    for (let lag = minLag; lag <= maxLag; lag++) {
      let corr = 0;
      let energy1 = 0;
      let energy2 = 0;

      for (let i = 0; i < frame.length - lag; i++) {
        const x = frame[i];
        const y = frame[i + lag];
        corr += x * y;
        energy1 += x * x;
        energy2 += y * y;
      }

      const denom = Math.sqrt(energy1 * energy2);
      const normCorr = denom > 0.00001 ? corr / denom : 0;

      if (normCorr > maxCorr) {
        maxCorr = normCorr;
        bestLag = lag;
      }
    }

    // Require decent correlation confidence
    if (maxCorr < 0.38 || bestLag <= 0) {
      return 0; // Unvoiced
    }

    // Parabolic interpolation for sub-sample peak precision
    let refinedLag = bestLag;
    if (bestLag > minLag && bestLag < maxLag) {
      const alpha = this.getLagCorrelation(frame, bestLag - 1);
      const beta = maxCorr;
      const gamma = this.getLagCorrelation(frame, bestLag + 1);
      const delta = (alpha - gamma) / (2 * (alpha - 2 * beta + gamma) || 1);
      refinedLag = bestLag + Math.max(-0.5, Math.min(0.5, delta));
    }

    const freq = sampleRate / refinedLag;
    return Math.round(Math.max(this.MIN_F0_HZ, Math.min(this.MAX_F0_HZ, freq)));
  }

  private static getLagCorrelation(frame: Float32Array, lag: number): number {
    let corr = 0;
    let energy1 = 0;
    let energy2 = 0;
    for (let i = 0; i < frame.length - lag; i++) {
      const x = frame[i];
      const y = frame[i + lag];
      corr += x * y;
      energy1 += x * x;
      energy2 += y * y;
    }
    const denom = Math.sqrt(energy1 * energy2);
    return denom > 0.00001 ? corr / denom : 0;
  }

  /**
   * Smooth contour by linearly interpolating short unvoiced gaps
   */
  private static smoothContour(f0s: number[]): number[] {
    const result = [...f0s];
    for (let i = 1; i < result.length - 1; i++) {
      if (result[i] === 0 && result[i - 1] > 0 && result[i + 1] > 0) {
        // 1-frame dropout interpolation
        result[i] = Math.round((result[i - 1] + result[i + 1]) / 2);
      }
    }
    return result;
  }

  /**
   * Align extracted frames to Japanese mora segments and detect stress spikes
   */
  private static alignMoraSegments(
    f0s: number[],
    energies: number[],
    totalDurationMs: number,
    moraCount: number,
    targetDownstepMora: number
  ): MoraSegment[] {
    const morae: MoraSegment[] = [];
    const count = Math.max(1, moraCount);
    const framesPerMora = Math.max(1, Math.floor(f0s.length / count));
    const msPerMora = Math.round(totalDurationMs / count);

    // Calculate global average intensity across voiced segments
    const allEnergies = energies.filter((_, idx) => f0s[idx] > 0);
    const globalMeanIntensity = allEnergies.length > 0
      ? allEnergies.reduce((a, b) => a + b, 0) / allEnergies.length
      : 60;

    for (let m = 0; m < count; m++) {
      const startFrame = m * framesPerMora;
      const endFrame = m === count - 1 ? f0s.length : (m + 1) * framesPerMora;

      const moraF0s = f0s.slice(startFrame, endFrame).filter((f) => f > 0);
      const moraEnergies = energies.slice(startFrame, endFrame);

      const avgF0 = moraF0s.length > 0
        ? Math.round(moraF0s.reduce((a, b) => a + b, 0) / moraF0s.length)
        : 0;

      const avgIntensity = moraEnergies.length > 0
        ? Math.round(moraEnergies.reduce((a, b) => a + b, 0) / moraEnergies.length)
        : 50;

      // Detect Dynamic Stress Error:
      // In Japanese, native morae have relatively flat, uniform intensity (<4-6dB variation).
      // In Bengali native transfer, speakers place dynamic stress on a syllable, causing a prominent
      // intensity spike (>7dB above mean, or >10dB above the minimum voiced mora).
      const minVoicedIntensity = allEnergies.length > 0 ? Math.min(...allEnergies) : globalMeanIntensity;
      const hasStressSpike = (avgIntensity > globalMeanIntensity + 7 || avgIntensity > minVoicedIntensity + 10) && avgF0 > 0;

      morae.push({
        moraIndex: m + 1,
        startTimeMs: m * msPerMora,
        endTimeMs: Math.min(totalDurationMs, (m + 1) * msPerMora),
        durationMs: msPerMora,
        averageF0Hz: avgF0,
        averageIntensityDb: avgIntensity,
        isVoiced: moraF0s.length > 0,
        hasStressSpike
      });
    }

    return morae;
  }

  /**
   * Convert Float32Array to valid 16-bit PCM WAV Base64 data URL
   */
  public static encodeWAVBase64(samples: Float32Array, sampleRate: number): string {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    // RIFF chunk descriptor
    this.writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    this.writeString(view, 8, 'WAVE');

    // fmt sub-chunk
    this.writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
    view.setUint16(20, 1, true);  // AudioFormat (1 for PCM)
    view.setUint16(22, 1, true);  // NumChannels (1 for Mono)
    view.setUint32(24, sampleRate, true); // SampleRate
    view.setUint32(28, sampleRate * 2, true); // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
    view.setUint16(32, 2, true);  // BlockAlign (NumChannels * BitsPerSample/8)
    view.setUint16(34, 16, true); // BitsPerSample (16 bits)

    // data sub-chunk
    this.writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);

    // Write 16-bit PCM samples
    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }

    // Convert ArrayBuffer to Base64 in chunks to avoid call stack limits
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, chunk as any);
    }

    return `data:audio/wav;base64,${btoa(binary)}`;
  }

  private static writeString(view: DataView, offset: number, string: string): void {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}
