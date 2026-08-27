import { JLPTLevel, ContentDomain } from '../../types/nihomi';
import { KnowledgeObject, KnowledgeObjectType } from './types';

export interface GraphNode {
  id: string;
  code: string;
  type: KnowledgeObjectType;
  level: JLPTLevel;
  title: string;
  prerequisites: string[];
}

export interface GraphEdge {
  source: string;
  target: string;
  relation: 'REQUIRES' | 'DERIVES_FROM' | 'USES_VOCABULARY' | 'USES_KANJI' | 'PROGRESSES_TO';
}

export interface KnowledgeGraphTopology {
  nodes: GraphNode[];
  edges: GraphEdge[];
  totalNodes: number;
  totalEdges: number;
}

export class KnowledgeGraphService {
  private static mockGraphNodes: GraphNode[] = [
    {
      id: 'kg-n5-g1',
      code: 'N5-GRM-01',
      type: 'GRAMMAR',
      level: 'N5',
      title: 'N1 は N2 です (Topic marker & Copula)',
      prerequisites: []
    },
    {
      id: 'kg-n5-g2',
      code: 'N5-GRM-02',
      type: 'GRAMMAR',
      level: 'N5',
      title: 'これ / それ / あれ (Demonstratives)',
      prerequisites: ['kg-n5-g1']
    },
    {
      id: 'kg-n5-v1',
      code: 'N5-VOC-01',
      type: 'VOCABULARY',
      level: 'N5',
      title: '学生 (がくせい - Student)',
      prerequisites: []
    },
    {
      id: 'kg-n5-k1',
      code: 'N5-KNJ-01',
      type: 'KANJI',
      level: 'N5',
      title: '学 (Learn / Study)',
      prerequisites: []
    },
    {
      id: 'kg-n5-g20',
      code: 'N5-GRM-20',
      type: 'GRAMMAR',
      level: 'N5',
      title: '普通形 (Plain Casual Form)',
      prerequisites: ['kg-n5-g1', 'kg-n5-g2']
    }
  ];

  private static mockGraphEdges: GraphEdge[] = [
    { source: 'kg-n5-g1', target: 'kg-n5-g2', relation: 'PROGRESSES_TO' },
    { source: 'kg-n5-k1', target: 'kg-n5-v1', relation: 'USES_KANJI' },
    { source: 'kg-n5-g1', target: 'kg-n5-g20', relation: 'REQUIRES' }
  ];

  static getGraphTopology(level?: JLPTLevel): KnowledgeGraphTopology {
    let nodes = this.mockGraphNodes;
    if (level) {
      nodes = nodes.filter((n) => n.level === level);
    }
    const nodeIds = new Set(nodes.map((n) => n.id));
    const edges = this.mockGraphEdges.filter(
      (e) => nodeIds.has(e.source) && nodeIds.has(e.target)
    );

    return {
      nodes,
      edges,
      totalNodes: nodes.length,
      totalEdges: edges.length
    };
  }

  static getPrerequisitePath(nodeId: string): string[] {
    const visited = new Set<string>();
    const stack = [nodeId];

    while (stack.length > 0) {
      const current = stack.pop()!;
      const node = this.mockGraphNodes.find((n) => n.id === current);
      if (node) {
        for (const prereq of node.prerequisites) {
          if (!visited.has(prereq)) {
            visited.add(prereq);
            stack.push(prereq);
          }
        }
      }
    }

    return Array.from(visited);
  }
}
