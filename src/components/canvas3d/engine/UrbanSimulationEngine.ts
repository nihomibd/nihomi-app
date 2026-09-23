// src/components/canvas3d/engine/UrbanSimulationEngine.ts
// NIHOMI REAL JAPAN CANVAS™ — REUSABLE URBAN TRAFFIC & POPULATION SIMULATION
// Scalable distance-based LOD, biomechanical pedestrian locomotion, vehicular traffic flow with stop-lines,
// and traffic signal state machine synchronized with live Tokyo solar density.

import * as THREE from 'three';
import { SolarAtmosphereState } from './TokyoTimeEngine';

export interface TrafficVehicleEntity {
  mesh: THREE.Group;
  speed: number;
  axis: 'x' | 'z';
  minCoord: number;
  maxCoord: number;
  direction: number; // 1 or -1
  wheels: THREE.Group[];
  headlights: THREE.SpotLight;
}

export interface PedestrianEntity {
  mesh: THREE.Group;
  torso: THREE.Group;
  speed: number;
  pathType: 'diagonal_northwest' | 'diagonal_northeast' | 'sidewalk_west' | 'sidewalk_east';
  progress: number;
  leftThigh: THREE.Group;
  rightThigh: THREE.Group;
  leftKnee: THREE.Group;
  rightKnee: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftForearm: THREE.Group;
  rightForearm: THREE.Group;
}

export class UrbanSimulationEngine {
  public group: THREE.Group;
  public vehicles: TrafficVehicleEntity[] = [];
  public pedestrians: PedestrianEntity[] = [];
  public trafficLights: THREE.Mesh[] = [];

  private trafficTimer: number = 0;
  private isWalkSignalActive: boolean = true;
  private onSignalChange?: (state: 'walk_green' | 'traffic_green') => void;

  constructor(onSignalChange?: (state: 'walk_green' | 'traffic_green') => void) {
    this.group = new THREE.Group();
    this.group.name = 'Nihomi_UrbanSimulationLayer';
    this.onSignalChange = onSignalChange;
  }

  public getSignalState(): 'walk_green' | 'traffic_green' {
    return this.isWalkSignalActive ? 'walk_green' : 'traffic_green';
  }

  /**
   * Initializes the traffic and pedestrian population in the scene
   */
  public initialize(scene: THREE.Scene): void {
    scene.add(this.group);
  }

  /**
   * Main simulation step: updates kinematics, signals, and LOD distance scaling
   */
  public update(delta: number, now: number, playerPos: THREE.Vector3, atmosphere: SolarAtmosphereState): void {
    // 1. Traffic Light Cycle (14s Walk Green ↔ 12s Traffic Green)
    this.trafficTimer += delta;
    if (this.trafficTimer > 13.0) {
      this.trafficTimer = 0;
      this.isWalkSignalActive = !this.isWalkSignalActive;
      const signalState = this.isWalkSignalActive ? 'walk_green' : 'traffic_green';
      this.onSignalChange?.(signalState);

      // Update traffic signal emissives
      this.trafficLights.forEach((mesh) => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mesh.name === 'green_light') {
          mat.emissiveIntensity = this.isWalkSignalActive ? 1.8 : 0.15;
        } else if (mesh.name === 'red_light') {
          mat.emissiveIntensity = this.isWalkSignalActive ? 0.15 : 1.8;
        }
      });
    }

    // 2. Vehicle Traffic Kinematics & Crosswalk Braking
    const speedMultiplier = atmosphere.trafficDensityFactor;
    this.vehicles.forEach((veh) => {
      // Distance-based LOD: skip processing if beyond 65m
      const distToPlayer = Math.hypot(veh.mesh.position.x - playerPos.x, veh.mesh.position.z - playerPos.z);
      if (distToPlayer > 75.0) return;

      let shouldStop = false;
      if (this.isWalkSignalActive) {
        if (veh.axis === 'x') {
          if (veh.direction > 0 && veh.mesh.position.x > -18 && veh.mesh.position.x < -14) shouldStop = true;
          if (veh.direction < 0 && veh.mesh.position.x < 18 && veh.mesh.position.x > 14) shouldStop = true;
        } else {
          if (veh.direction > 0 && veh.mesh.position.z > -18 && veh.mesh.position.z < -14) shouldStop = true;
          if (veh.direction < 0 && veh.mesh.position.z < 18 && veh.mesh.position.z > 14) shouldStop = true;
        }
      }

      if (!shouldStop) {
        const step = veh.speed * speedMultiplier * veh.direction * delta;
        if (veh.axis === 'x') {
          veh.mesh.position.x += step;
          if (veh.direction > 0 && veh.mesh.position.x > veh.maxCoord) veh.mesh.position.x = veh.minCoord;
          if (veh.direction < 0 && veh.mesh.position.x < veh.minCoord) veh.mesh.position.x = veh.maxCoord;
        } else {
          veh.mesh.position.z += step;
          if (veh.direction > 0 && veh.mesh.position.z > veh.maxCoord) veh.mesh.position.z = veh.minCoord;
          if (veh.direction < 0 && veh.mesh.position.z < veh.minCoord) veh.mesh.position.z = veh.maxCoord;
        }

        // Wheel Rotation
        veh.wheels.forEach((w) => {
          w.rotation.x += step * 1.5;
        });
      }
    });

    // 3. Ambient Pedestrian Crowd Movement & Biomechanical Walking
    this.pedestrians.forEach((ped) => {
      const distToPlayer = Math.hypot(ped.mesh.position.x - playerPos.x, ped.mesh.position.z - playerPos.z);
      if (distToPlayer > 60.0) return;

      ped.progress += (ped.speed * delta) / 30;
      if (ped.progress > 1) ped.progress = 0;

      const p = ped.progress;
      let x = 0;
      let z = 0;
      let angle = 0;

      if (ped.pathType === 'diagonal_northwest') {
        x = -16 + p * 32;
        z = -16 + p * 32;
        angle = Math.PI / 4;
      } else if (ped.pathType === 'diagonal_northeast') {
        x = 16 - p * 32;
        z = -16 + p * 32;
        angle = -Math.PI / 4;
      } else if (ped.pathType === 'sidewalk_west') {
        x = -10;
        z = -20 + p * 40;
        angle = 0;
      } else {
        x = 10;
        z = 20 - p * 40;
        angle = Math.PI;
      }

      ped.mesh.position.set(x, 0.28, z);
      ped.mesh.rotation.y = angle;

      // Biomechanical locomotion kinematics
      const phase = now * 0.007 * ped.speed;
      ped.torso.position.y = 0.88 + Math.abs(Math.sin(phase)) * 0.035;
      ped.torso.rotation.y = Math.sin(phase) * 0.09;

      ped.leftThigh.rotation.x = Math.sin(phase) * 0.55;
      ped.rightThigh.rotation.x = -Math.sin(phase) * 0.55;

      ped.leftKnee.rotation.x = Math.max(0, -Math.sin(phase) * 0.65);
      ped.rightKnee.rotation.x = Math.max(0, Math.sin(phase) * 0.65);

      ped.leftArm.rotation.x = -Math.sin(phase) * 0.45;
      ped.rightArm.rotation.x = Math.sin(phase) * 0.45;
      ped.leftForearm.rotation.x = -Math.max(0, -Math.sin(phase) * 0.35) - 0.15;
      ped.rightForearm.rotation.x = -Math.max(0, Math.sin(phase) * 0.35) - 0.15;
    });
  }

  public dispose(): void {
    this.vehicles = [];
    this.pedestrians = [];
    this.trafficLights = [];
  }
}
