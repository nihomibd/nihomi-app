// src/components/canvas3d/engine/TokyoTimeEngine.ts
// NIHOMI REAL JAPAN CANVAS™ — DYNAMIC TOKYO SOLAR & TIME-OF-DAY ENGINE
// Automatic Tokyo JST Date/Time (UTC+9) drives Solar Elevation, Sky Color, Sunlight, Dynamic Shadows,
// Neon Illumination, Urban Density and Audio Profiles. Includes Development-Only Override for Testing.

import * as THREE from 'three';

export type TokyoTimePeriod = 'dawn' | 'morning_rush' | 'day' | 'golden_hour' | 'dusk' | 'night';
export type TokyoWeather = 'clear' | 'cloudy' | 'rain';

export interface SolarAtmosphereState {
  tokyoTimeString: string;     // e.g. "17:45 JST"
  decimalHourJST: number;      // e.g. 17.75
  period: TokyoTimePeriod;
  weather: TokyoWeather;
  sunElevationDeg: number;     // Degrees relative to horizon (-90 to +90)
  sunAzimuthDeg: number;       // Compass direction (0 = North, 90 = East, 180 = South, 270 = West)
  sunPosition: THREE.Vector3;
  sunColor: THREE.Color;
  sunIntensity: number;
  ambientColor: THREE.Color;
  ambientIntensity: number;
  skyColor: THREE.Color;
  fogColor: THREE.Color;
  fogDensity: number;
  neonIntensityMultiplier: number;
  pedestrianDensityFactor: number;
  trafficDensityFactor: number;
}

export type TimeOverridePreset = 'auto_jst' | 'dawn' | 'day' | 'golden_hour' | 'dusk' | 'night';

export class TokyoTimeEngine {
  private overrideMode: boolean = false;
  private overrideHour: number = 20.0;
  private weather: TokyoWeather = 'clear';

  /**
   * Retrieves the current decimal hour in Tokyo Standard Time (JST = UTC+9)
   */
  public getLiveJSTHour(): number {
    const now = new Date();
    const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
    let jstHours = utcHours + 9.0;
    if (jstHours >= 24) jstHours -= 24;
    return jstHours;
  }

  /**
   * Sets a development-only time override for QA testing of all lighting states
   */
  public setTimeOverride(preset: TimeOverridePreset): void {
    if (preset === 'auto_jst') {
      this.overrideMode = false;
    } else {
      this.overrideMode = true;
      switch (preset) {
        case 'dawn':
          this.overrideHour = 5.8;
          break;
        case 'day':
          this.overrideHour = 13.0;
          break;
        case 'golden_hour':
          this.overrideHour = 17.2;
          break;
        case 'dusk':
          this.overrideHour = 18.8;
          break;
        case 'night':
          this.overrideHour = 21.5;
          break;
      }
    }
  }

  public setWeather(weather: TokyoWeather): void {
    this.weather = weather;
  }

  public isOverrideActive(): boolean {
    return this.overrideMode;
  }

  /**
   * Calculates the full physical solar and atmospheric lighting state
   */
  public calculateAtmosphere(): SolarAtmosphereState {
    const hour = this.overrideMode ? this.overrideHour : this.getLiveJSTHour();

    const hoursInt = Math.floor(hour);
    const minutesInt = Math.floor((hour - hoursInt) * 60);
    const tokyoTimeString = `${String(hoursInt).padStart(2, '0')}:${String(minutesInt).padStart(2, '0')} JST`;

    // Tokyo latitude: 35.6595° N.
    // Approximate solar elevation based on hour angle (solar noon at ~12:00)
    const solarHourAngle = ((hour - 12.0) / 12.0) * Math.PI;
    const sunElevationDeg = Math.sin(solarHourAngle - Math.PI / 2) * -65.0; // -65° at midnight to +65° at noon
    const sunAzimuthDeg = (hour / 24.0) * 360.0;

    let period: TokyoTimePeriod = 'night';
    if (hour >= 5.0 && hour < 6.5) period = 'dawn';
    else if (hour >= 6.5 && hour < 9.5) period = 'morning_rush';
    else if (hour >= 9.5 && hour < 16.5) period = 'day';
    else if (hour >= 16.5 && hour < 18.2) period = 'golden_hour';
    else if (hour >= 18.2 && hour < 20.0) period = 'dusk';
    else period = 'night';

    // Physical sun position vector
    const elevationRad = THREE.MathUtils.degToRad(Math.max(-10, sunElevationDeg));
    const azimuthRad = THREE.MathUtils.degToRad(sunAzimuthDeg);
    const sunDist = 70.0;
    const sunX = sunDist * Math.cos(elevationRad) * Math.sin(azimuthRad);
    const sunY = Math.max(8, sunDist * Math.sin(elevationRad));
    const sunZ = sunDist * Math.cos(elevationRad) * Math.cos(azimuthRad);
    const sunPosition = new THREE.Vector3(sunX, sunY, sunZ);

    let sunColor = new THREE.Color(0xffffff);
    let sunIntensity = 0.95;
    let ambientColor = new THREE.Color(0x334155);
    let ambientIntensity = 0.45;
    let skyColor = new THREE.Color(0x0a0a12);
    let fogColor = new THREE.Color(0x0a0a12);
    let fogDensity = 0.0005;
    let neonIntensityMultiplier = 0.2;
    let pedestrianDensityFactor = 1.0;
    let trafficDensityFactor = 1.0;

    switch (period) {
      case 'dawn':
        sunColor = new THREE.Color(0xfde047);
        sunIntensity = 0.65;
        ambientColor = new THREE.Color(0x1e293b);
        ambientIntensity = 0.35;
        skyColor = new THREE.Color(0x332845);
        fogColor = new THREE.Color(0x332845);
        neonIntensityMultiplier = 0.6;
        pedestrianDensityFactor = 0.7;
        trafficDensityFactor = 0.8;
        break;

      case 'morning_rush':
        sunColor = new THREE.Color(0xfffaed);
        sunIntensity = 0.85;
        ambientColor = new THREE.Color(0x334155);
        ambientIntensity = 0.40;
        skyColor = new THREE.Color(0x273549);
        fogColor = new THREE.Color(0x273549);
        neonIntensityMultiplier = 0.2;
        pedestrianDensityFactor = 1.5; // High commuter scramble density
        trafficDensityFactor = 1.3;
        break;

      case 'day':
        sunColor = new THREE.Color(0xfffaed);
        sunIntensity = 0.95; // Mathematically calibrated natural Tokyo sunlight (prevents overexposure)
        ambientColor = new THREE.Color(0x334155);
        ambientIntensity = 0.45; // Balanced sky fill without washing out diffuse materials
        skyColor = new THREE.Color(0x3b5370);
        fogColor = new THREE.Color(0x3b5370);
        fogDensity = 0.0005;
        neonIntensityMultiplier = 0.15;
        pedestrianDensityFactor = 1.1;
        trafficDensityFactor = 1.0;
        break;

      case 'golden_hour':
        sunColor = new THREE.Color(0xf97316); // Warm Tokyo sunset amber
        sunIntensity = 0.90;
        ambientColor = new THREE.Color(0x2d1810);
        ambientIntensity = 0.40;
        skyColor = new THREE.Color(0x4a2e38);
        fogColor = new THREE.Color(0x4a2e38);
        neonIntensityMultiplier = 0.85;
        pedestrianDensityFactor = 1.6; // Shibuya evening rush
        trafficDensityFactor = 1.4;
        break;

      case 'dusk':
        sunColor = new THREE.Color(0xa855f7);
        sunIntensity = 0.45;
        ambientColor = new THREE.Color(0x0f172a);
        ambientIntensity = 0.35;
        skyColor = new THREE.Color(0x1a1a32);
        fogColor = new THREE.Color(0x1a1a32);
        neonIntensityMultiplier = 1.3;
        pedestrianDensityFactor = 1.3;
        trafficDensityFactor = 1.2;
        break;

      case 'night':
      default:
        sunColor = new THREE.Color(0x6366f1); // Cool subtle moonlight
        sunIntensity = 0.20;
        ambientColor = new THREE.Color(0x05070f);
        ambientIntensity = 0.30;
        skyColor = new THREE.Color(0x030308);
        fogColor = new THREE.Color(0x030308);
        neonIntensityMultiplier = 1.8; // Rich Tokyo neon night glow
        pedestrianDensityFactor = 0.7;
        trafficDensityFactor = 0.9;
        break;
    }

    // Weather Adjustments
    if (this.weather === 'rain') {
      sunIntensity *= 0.45;
      ambientIntensity *= 0.75;
      fogDensity = 0.022;
      fogColor = new THREE.Color(0x111827);
    } else if (this.weather === 'cloudy') {
      sunIntensity *= 0.65;
      ambientIntensity *= 0.85;
      fogDensity = 0.016;
    }

    return {
      tokyoTimeString,
      decimalHourJST: hour,
      period,
      weather: this.weather,
      sunElevationDeg,
      sunAzimuthDeg,
      sunPosition,
      sunColor,
      sunIntensity,
      ambientColor,
      ambientIntensity,
      skyColor,
      fogColor,
      fogDensity,
      neonIntensityMultiplier,
      pedestrianDensityFactor,
      trafficDensityFactor
    };
  }
}
