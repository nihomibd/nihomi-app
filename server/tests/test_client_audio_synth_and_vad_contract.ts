/**
 * Test Suite: Client-Side Procedural Pitch Audio Synthesizer,
 * Voice Activity Detection (VAD) & Adaptive Session Runner Contract
 */

import { AudioVADProcessor } from '../../src/lib/audioVADProcessor.js';
import { PitchAudioSynthesizer } from '../../src/lib/pitchAudioSynthesizer.js';
import { TokyoPitchAccentService } from '../services/pitchAccentService.js';
import { AdaptiveDrillService } from '../services/adaptiveDrillService.js';
import { db } from '../db.js';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[Assertion Failed] ${message}`);
  }
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('🧪 NIHOMI: AUDIO SYNTHESIZER, VAD & DOJO CONTRACT TEST SUITE');
  console.log('================================================================\n');

  // --------------------------------------------------------------------------
  // TEST 1: Procedural Pitch Audio Synthesizer Mathematical Constants & Structure
  // --------------------------------------------------------------------------
  console.log('▶ [Test 1] Verifying Procedural Pitch Audio Synthesizer Specification...');
  
  assert(PitchAudioSynthesizer.HIGH_PITCH_HZ === 290, 'High pitch baseline must be 290 Hz');
  assert(PitchAudioSynthesizer.LOW_PITCH_HZ === 210, 'Low pitch baseline must be 210 Hz');
  assert(PitchAudioSynthesizer.BASE_MORA_SEC === 0.20, 'Base mora duration must be 200ms at 1.0x');
  assert(PitchAudioSynthesizer.DOWNSTEP_GLIDE_SEC === 0.04, 'Downstep glide must be 40ms');

  console.log('  ✓ Procedural Pitch Synthesizer acoustic constants verified.\n');

  // --------------------------------------------------------------------------
  // TEST 2: Client-Side Voice Activity Detection (VAD) & Silence Stripping
  // --------------------------------------------------------------------------
  console.log('▶ [Test 2] Verifying VAD Processing & Boundary Detection...');

  const sampleRate = 16000;
  const silenceSamples = Math.floor(0.15 * sampleRate); // 150ms leading silence
  const speechSamples = Math.floor(0.50 * sampleRate);  // 500ms voiced speech
  const trailingSamples = Math.floor(0.15 * sampleRate);// 150ms trailing silence
  const totalSamples = silenceSamples + speechSamples + trailingSamples;

  const mockAudio = new Float32Array(totalSamples);

  // Generate low-level room noise for leading silence (< 0.003)
  for (let i = 0; i < silenceSamples; i++) {
    mockAudio[i] = (Math.random() - 0.5) * 0.004;
  }

  // Generate voiced speech at ~220 Hz (fundamental sine wave + 2nd harmonic)
  for (let i = 0; i < speechSamples; i++) {
    const t = i / sampleRate;
    const s1 = 0.5 * Math.sin(2 * Math.PI * 220 * t);
    const s2 = 0.25 * Math.sin(2 * Math.PI * 440 * t);
    mockAudio[silenceSamples + i] = s1 + s2;
  }

  // Generate low-level room noise for trailing silence
  for (let i = silenceSamples + speechSamples; i < totalSamples; i++) {
    mockAudio[i] = (Math.random() - 0.5) * 0.004;
  }

  const vadResult = AudioVADProcessor.processAudio(mockAudio, sampleRate, 2, 1);

  assert(vadResult.speechStartSec >= 0.10, `Speech start should detect leading silence (got ${vadResult.speechStartSec}s)`);
  assert(vadResult.speechEndSec <= 0.75, `Speech end should strip trailing silence (got ${vadResult.speechEndSec}s)`);
  assert(vadResult.speechDurationMs > 300 && vadResult.speechDurationMs < 650, `Speech duration should approximate 500ms (got ${vadResult.speechDurationMs}ms)`);
  assert(vadResult.croppedSampleCount < vadResult.rawSampleCount, 'Cropped audio buffer must be smaller than raw audio');
  assert(vadResult.moraSegments.length === 2, `Mora segments count must match target 2 (got ${vadResult.moraSegments.length})`);
  assert(vadResult.averageF0Hz >= 190 && vadResult.averageF0Hz <= 250, `Average F0 should approximate 220 Hz (got ${vadResult.averageF0Hz} Hz)`);
  assert(vadResult.audioBase64Wav.startsWith('data:audio/wav;base64,'), 'Output audioBase64Wav must have valid data URL prefix');

  console.log(`  ✓ VAD correctly detected speech: start=${vadResult.speechStartSec}s, end=${vadResult.speechEndSec}s, duration=${vadResult.speechDurationMs}ms, F0=${vadResult.averageF0Hz}Hz\n`);

  // --------------------------------------------------------------------------
  // TEST 3: Dynamic Stress Error & Loudness Spike Detection
  // --------------------------------------------------------------------------
  console.log('▶ [Test 3] Verifying Dynamic Stress Error Detection in VAD...');

  // Build audio where Mora 1 has excessive loudness (intensity spike) but no pitch elevation
  const stressAudio = new Float32Array(speechSamples);
  const mora1Samples = Math.floor(speechSamples / 2);

  for (let i = 0; i < speechSamples; i++) {
    const t = i / sampleRate;
    const isMora1 = i < mora1Samples;
    const amp = isMora1 ? 0.95 : 0.12; // Massive loudness difference (Bengali dynamic stress transfer)
    stressAudio[i] = amp * Math.sin(2 * Math.PI * 200 * t);
  }

  const stressVad = AudioVADProcessor.processAudio(stressAudio, sampleRate, 2, 1);
  const hasSpikeMora1 = stressVad.moraSegments[0].hasStressSpike;

  assert(hasSpikeMora1, 'Mora 1 should be flagged with hasStressSpike due to abnormal intensity disparity');
  assert(stressVad.moraSegments[0].averageIntensityDb > stressVad.moraSegments[1].averageIntensityDb, 'Mora 1 intensity should exceed Mora 2');

  console.log(`  ✓ Dynamic stress spike detected: Mora 1 Intensity=${stressVad.moraSegments[0].averageIntensityDb}dB vs Mora 2=${stressVad.moraSegments[1].averageIntensityDb}dB\n`);

  // --------------------------------------------------------------------------
  // TEST 4: 16-bit PCM WAV Header Validation
  // --------------------------------------------------------------------------
  console.log('▶ [Test 4] Verifying 16-Bit PCM WAV Header Generation...');

  const base64Data = vadResult.audioBase64Wav.replace('data:audio/wav;base64,', '');
  const binaryBuffer = Buffer.from(base64Data, 'base64');

  // Check RIFF chunk
  const riff = binaryBuffer.toString('ascii', 0, 4);
  const wave = binaryBuffer.toString('ascii', 8, 12);
  const fmt = binaryBuffer.toString('ascii', 12, 16);
  const audioFormat = binaryBuffer.readUInt16LE(20);
  const numChannels = binaryBuffer.readUInt16LE(22);
  const wavSampleRate = binaryBuffer.readUInt32LE(24);
  const bitsPerSample = binaryBuffer.readUInt16LE(34);
  const dataHeader = binaryBuffer.toString('ascii', 36, 40);

  assert(riff === 'RIFF', 'WAV header must start with RIFF');
  assert(wave === 'WAVE', 'WAV header must specify WAVE');
  assert(fmt === 'fmt ', 'WAV header must contain fmt chunk');
  assert(audioFormat === 1, 'Audio format must be 1 (PCM)');
  assert(numChannels === 1, 'Audio channel count must be 1 (Mono)');
  assert(wavSampleRate === sampleRate, `Sample rate must match ${sampleRate} (got ${wavSampleRate})`);
  assert(bitsPerSample === 16, 'Bit depth must be 16-bit PCM');
  assert(dataHeader === 'data', 'WAV must contain data chunk');

  console.log(`  ✓ 16-bit PCM WAV format verified: ${riff}/${wave}, ${wavSampleRate}Hz, ${numChannels}ch, ${bitsPerSample}-bit\n`);

  // --------------------------------------------------------------------------
  // TEST 5: End-to-End Session State Transition with VAD Input
  // --------------------------------------------------------------------------
  console.log('▶ [Test 5] Verifying Full Session State Runner with VAD Telemetry...');

  const testUserId = `test-user-dojo-${Date.now()}`;

  // Start an adaptive session
  const recommendation = await AdaptiveDrillService.getAdaptiveRecommendations(testUserId);
  assert(recommendation !== null, 'Adaptive recommendations must be generated');

  const drillPair = recommendation.recommendedPairs[0];
  assert(drillPair && drillPair.drills.length > 0, 'Recommended pair must have drills');

  const targetDrill = drillPair.drills[0];

  // Evaluate with TokyoPitchAccentService using VAD-processed F0 points and audio
  const assessment = await TokyoPitchAccentService.evaluatePitchAccent({
    userId: testUserId,
    targetPhrase: targetDrill.kanji,
    targetRomaji: targetDrill.romaji,
    targetMeaning: targetDrill.meaningBn,
    targetPattern: targetDrill.pattern,
    targetDownstepMora: targetDrill.downstepMora,
    pitchF0Points: vadResult.f0TrajectoryHz,
    audioDurationMs: vadResult.speechDurationMs,
    audioBase64: vadResult.audioBase64Wav,
    audioMimeType: 'audio/wav',
    spokenTranscript: targetDrill.readingKana
  });

  assert(assessment.overallScore >= 0 && assessment.overallScore <= 100, 'Assessment score must be between 0 and 100');
  assert(assessment.feedbackBn !== undefined, 'Assessment must contain Bengali feedback');
  assert(assessment.bengaliAcousticAnalysis !== undefined, 'Assessment must contain Bengali acoustic analysis');

  console.log(`  ✓ End-to-end evaluation with VAD output succeeded: Score=${assessment.overallScore}%, Pattern=${assessment.detectedPattern}`);
  console.log(`  ✓ Bengali Coaching Tip: "${assessment.feedbackBn}"\n`);

  console.log('================================================================');
  console.log('🎉 ALL AUDIO SYNTHESIZER, VAD & DOJO TESTS PASSED (5/5)');
  console.log('================================================================');
}

runTestSuite()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Test Suite Failed:', err);
    process.exit(1);
  });
