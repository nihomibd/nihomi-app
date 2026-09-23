// src/components/canvas3d/worldGraph/WorldGraphManager.ts
// NIHOMI WORLD™ — WORLD GRAPH STATE & TRANSIT ROUTING MANAGER

import {
  WorldGraphNode,
  TransitRoute,
  WorldDistrict,
  WorldCity,
  WorldRegion
} from './WorldGraphTypes';
import {
  WORLD_NODES,
  JAPAN_DISTRICTS,
  JAPAN_CITIES,
  JAPAN_REGIONS
} from './WorldGraphData';

export interface PlayerTransitState {
  currentNodeId: string;
  suicaBalanceYen: number;
  hasWelcomeSuica: boolean;
  transitHistory: Array<{
    routeId: string;
    fromNodeId: string;
    toNodeId: string;
    timestamp: number;
    fareChargedYen: number;
  }>;
}

export type WorldGraphEvent =
  | { type: 'NODE_CHANGED'; node: WorldGraphNode; previousNodeId: string }
  | { type: 'SUICA_CHARGED'; amountYen: number; newBalanceYen: number }
  | { type: 'FARE_DEDUCTED'; amountYen: number; newBalanceYen: number }
  | { type: 'TRANSIT_START'; route: TransitRoute }
  | { type: 'TRANSIT_COMPLETE'; route: TransitRoute };

export class WorldGraphManager {
  private static instance: WorldGraphManager;

  private state: PlayerTransitState = {
    currentNodeId: 'node_shibuya_scramble',
    suicaBalanceYen: 2000, // Standard Tokyo Welcome Suica starting balance
    hasWelcomeSuica: true,
    transitHistory: []
  };

  private listeners: Array<(event: WorldGraphEvent) => void> = [];

  public static getInstance(): WorldGraphManager {
    if (!WorldGraphManager.instance) {
      WorldGraphManager.instance = new WorldGraphManager();
    }
    return WorldGraphManager.instance;
  }

  public getCurrentNode(): WorldGraphNode {
    return WORLD_NODES[this.state.currentNodeId] || WORLD_NODES['node_shibuya_scramble'];
  }

  public getCurrentDistrict(): WorldDistrict {
    const node = this.getCurrentNode();
    return JAPAN_DISTRICTS[node.districtId] || JAPAN_DISTRICTS['shibuya'];
  }

  public getCurrentCity(): WorldCity {
    const district = this.getCurrentDistrict();
    return JAPAN_CITIES[district.cityId] || JAPAN_CITIES['tokyo'];
  }

  public getCurrentRegion(): WorldRegion {
    const city = this.getCurrentCity();
    return JAPAN_REGIONS[city.regionId] || JAPAN_REGIONS['kanto'];
  }

  public getSuicaBalance(): number {
    return this.state.suicaBalanceYen;
  }

  /**
   * Recharge Suica / Pasmo IC card at ticket vending machine
   */
  public chargeSuica(amountYen: number): number {
    if (amountYen <= 0) return this.state.suicaBalanceYen;
    this.state.suicaBalanceYen += amountYen;
    this.notify({
      type: 'SUICA_CHARGED',
      amountYen,
      newBalanceYen: this.state.suicaBalanceYen
    });
    return this.state.suicaBalanceYen;
  }

  /**
   * Travel along a defined transit route (train, flight, taxi, walking)
   */
  public travelRoute(routeId: string): { success: boolean; error?: string; targetNode?: WorldGraphNode } {
    const currentNode = this.getCurrentNode();
    const route = currentNode.transitRoutes.find((r) => r.id === routeId);

    if (!route) {
      return { success: false, error: 'Route not available from current location' };
    }

    if (route.requiresICCardOrTicket && this.state.suicaBalanceYen < route.fareYen) {
      return {
        success: false,
        error: `Insufficient IC Card balance. Required: ¥${route.fareYen}, Current: ¥${this.state.suicaBalanceYen}. Please charge at ticket machine.`
      };
    }

    const previousNodeId = this.state.currentNodeId;

    // Deduct fare
    if (route.fareYen > 0) {
      this.state.suicaBalanceYen -= route.fareYen;
      this.notify({
        type: 'FARE_DEDUCTED',
        amountYen: route.fareYen,
        newBalanceYen: this.state.suicaBalanceYen
      });
    }

    // Record history
    this.state.transitHistory.push({
      routeId: route.id,
      fromNodeId: previousNodeId,
      toNodeId: route.targetNodeId,
      timestamp: Date.now(),
      fareChargedYen: route.fareYen
    });

    this.notify({ type: 'TRANSIT_START', route });

    // Transition node
    this.state.currentNodeId = route.targetNodeId;
    const targetNode = this.getCurrentNode();

    this.notify({
      type: 'NODE_CHANGED',
      node: targetNode,
      previousNodeId
    });

    this.notify({ type: 'TRANSIT_COMPLETE', route });

    return { success: true, targetNode };
  }

  /**
   * Teleport / Switch node directly (e.g. from developer navigation or world map)
   */
  public setNodeDirect(nodeId: string): boolean {
    if (!WORLD_NODES[nodeId]) return false;
    const previousNodeId = this.state.currentNodeId;
    this.state.currentNodeId = nodeId;
    const node = this.getCurrentNode();
    this.notify({
      type: 'NODE_CHANGED',
      node,
      previousNodeId
    });
    return true;
  }

  public subscribe(listener: (event: WorldGraphEvent) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(event: WorldGraphEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (err) {
        console.error('[WorldGraphManager] Listener error:', err);
      }
    }
  }
}

export const worldGraphManager = WorldGraphManager.getInstance();
