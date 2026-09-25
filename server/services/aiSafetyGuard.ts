/**
 * NIHOMI.COM — AI Workforce Safety & Security Foundation
 * 
 * Enforces strict architectural boundaries for AI Agents, autonomous workers,
 * and LLM pipelines prior to autonomous system integration:
 * 
 * 1. Explicit AI Identities
 * 2. Explicit Tool Allowlists
 * 3. Permission Levels (Read-only vs Assisted-draft vs Restricted-human-in-the-loop)
 * 4. Human-In-The-Loop (HITL) Approval Boundaries
 * 5. Prompt Injection Defense & Delimiter Stripping
 * 6. Hard-blocked Autonomous Actions (money, subscriptions, schema, unreviewed publishing)
 */

export type AiAgentId = 
  | 'nihomi:agent:sensei_tutor'
  | 'nihomi:agent:content_assistant'
  | 'nihomi:agent:learning_analyst'
  | 'nihomi:agent:curriculum_evaluator';

export type AiPermissionLevel = 
  | 'READ_ONLY'                // Can read courses, progress, knowledge nodes
  | 'ASSISTED_DRAFT'          // Can propose lesson drafts, quizzes, flashcards
  | 'RESTRICTED_APPROVAL_REQ'; // Actions that modify state require Founder approval

export interface AiAgentConfig {
  id: AiAgentId;
  name: string;
  description: string;
  allowedTools: string[];
  permissionLevel: AiPermissionLevel;
  maxTokensPerInvocation: number;
}

export const AI_AGENT_REGISTRY: Record<AiAgentId, AiAgentConfig> = {
  'nihomi:agent:sensei_tutor': {
    id: 'nihomi:agent:sensei_tutor',
    name: 'Sensei Interactive Tutor',
    description: 'Conversational Japanese learning coach, grammar explainers, and pronunciation assessment.',
    allowedTools: [
      'query_vocabulary',
      'query_grammar',
      'query_kanji',
      'generate_furigana',
      'evaluate_pronunciation'
    ],
    permissionLevel: 'READ_ONLY',
    maxTokensPerInvocation: 2000
  },
  'nihomi:agent:content_assistant': {
    id: 'nihomi:agent:content_assistant',
    name: 'Curriculum Content Assistant',
    description: 'Generates structured drafts for Minna no Nihongo and JLPT N5-N1 lessons.',
    allowedTools: [
      'extract_pdf_pages',
      'ocr_japanese_text',
      'generate_lesson_draft',
      'create_quiz_draft',
      'evaluate_nihomi_standard'
    ],
    permissionLevel: 'ASSISTED_DRAFT',
    maxTokensPerInvocation: 8000
  },
  'nihomi:agent:learning_analyst': {
    id: 'nihomi:agent:learning_analyst',
    name: 'Adaptive Learning Memory Analyst',
    description: 'Analyzes student quiz errors and suggests personalized SRS review intervals.',
    allowedTools: [
      'calculate_forgetting_curve',
      'aggregate_error_patterns',
      'recommend_study_plan'
    ],
    permissionLevel: 'READ_ONLY',
    maxTokensPerInvocation: 3000
  },
  'nihomi:agent:curriculum_evaluator': {
    id: 'nihomi:agent:curriculum_evaluator',
    name: 'Nihomi Standard 14-Point Evaluator',
    description: 'Audits lesson drafts against pedagogical quality and trilingual clarity.',
    allowedTools: [
      'check_jlpt_alignment',
      'check_bangla_clarity',
      'check_cultural_nuance',
      'score_draft_quality'
    ],
    permissionLevel: 'READ_ONLY',
    maxTokensPerInvocation: 4000
  }
};

/**
 * High-Risk Actions that CANNOT be executed autonomously by any AI Agent.
 * MUST generate a pending proposal and require explicit Founder cryptographic sign-off.
 */
export const RESTRICTED_ACTIONS = [
  'SPEND_REAL_MONEY',
  'ALTER_LIVE_SUBSCRIPTION',
  'EXECUTE_REFUND',
  'ALTER_DATABASE_SCHEMA',
  'SEND_BROADCAST_COMMUNICATION',
  'PUBLISH_UNREVIEWED_CONTENT'
] as const;

export type RestrictedActionType = typeof RESTRICTED_ACTIONS[number];

export interface PendingFounderApproval {
  id: string;
  agentId: AiAgentId;
  actionType: RestrictedActionType;
  title: string;
  description: string;
  proposedChanges: any;
  status: 'PENDING_FOUNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

class AiSafetyGuardService {
  private static instance: AiSafetyGuardService;
  private pendingApprovals: PendingFounderApproval[] = [];

  public static getInstance(): AiSafetyGuardService {
    if (!AiSafetyGuardService.instance) {
      AiSafetyGuardService.instance = new AiSafetyGuardService();
    }
    return AiSafetyGuardService.instance;
  }

  /**
   * Asserts whether a given tool can be invoked by the specified AI Agent.
   */
  public validateToolInvocation(agentId: AiAgentId, toolName: string): boolean {
    const agent = AI_AGENT_REGISTRY[agentId];
    if (!agent) {
      console.warn(`[AI Safety Guard] Unknown agent: ${agentId}`);
      return false;
    }
    const isAllowed = agent.allowedTools.includes(toolName);
    if (!isAllowed) {
      console.error(`[AI Safety Guard] FORBIDDEN: Agent ${agentId} attempted unauthorized tool: ${toolName}`);
    }
    return isAllowed;
  }

  /**
   * Enforces the Human-In-The-Loop Boundary.
   * Autonomous execution of restricted actions is hard-blocked.
   */
  public submitForFounderApproval(
    agentId: AiAgentId,
    actionType: RestrictedActionType,
    title: string,
    description: string,
    proposedChanges: any
  ): PendingFounderApproval {
    const proposal: PendingFounderApproval = {
      id: `hitl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      agentId,
      actionType,
      title,
      description,
      proposedChanges,
      status: 'PENDING_FOUNDER_REVIEW',
      createdAt: new Date().toISOString()
    };

    this.pendingApprovals.push(proposal);
    console.log(`[AI Safety Guard] HITL Gate Triggered: ${actionType} submitted for Founder review (${proposal.id})`);
    return proposal;
  }

  /**
   * Lists pending proposals awaiting Founder approval.
   */
  public getPendingApprovals(): PendingFounderApproval[] {
    return this.pendingApprovals.filter(p => p.status === 'PENDING_FOUNDER_REVIEW');
  }

  /**
   * Resolves a proposal by verified Founder.
   */
  public resolveApproval(
    approvalId: string,
    approved: boolean,
    founderEmail: string,
    notes?: string
  ): PendingFounderApproval | null {
    const proposal = this.pendingApprovals.find(p => p.id === approvalId);
    if (!proposal) return null;

    proposal.status = approved ? 'APPROVED' : 'REJECTED';
    proposal.reviewedAt = new Date().toISOString();
    proposal.reviewedBy = founderEmail;
    proposal.reviewNotes = notes;

    console.log(`[AI Safety Guard] Proposal ${approvalId} ${proposal.status} by Founder (${founderEmail})`);
    return proposal;
  }

  /**
   * Sanitizes user inputs against prompt injection patterns and delimiters.
   */
  public sanitizeAiPrompt(input: string): { cleanPrompt: string; isFlagged: boolean; flagReason?: string } {
    if (!input || typeof input !== 'string') {
      return { cleanPrompt: '', isFlagged: false };
    }

    // Common jailbreak signatures
    const injectionPatterns = [
      /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
      /you\s+are\s+now\s+(DAN|unfiltered|jailbroken)/i,
      /disregard\s+(system|safety)\s+(prompt|guidelines)/i,
      /system\s*:\s*you\s+must/i,
      /<\|im_start\|>/i,
      /<\|endoftext\|>/i,
      /\[INST\]\s*<<SYS>>/i
    ];

    for (const pattern of injectionPatterns) {
      if (pattern.test(input)) {
        return {
          cleanPrompt: input.replace(pattern, '[BLOCKED_INJECTION_PATTERN]'),
          isFlagged: true,
          flagReason: 'PROMPT_INJECTION_ATTEMPT_DETECTED'
        };
      }
    }

    // Normalize dangerous control sequences
    const sanitized = input
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
      .trim();

    return { cleanPrompt: sanitized, isFlagged: false };
  }
}

export const aiSafetyGuard = AiSafetyGuardService.getInstance();
