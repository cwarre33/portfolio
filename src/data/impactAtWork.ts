export interface ImpactAtWorkItem {
  title: string;
  emoji: string;
  impact: string;
  outcomes: string[];
  tags: string[];
}

/** Curated, public-safe highlights derived from internal delivery work (no ticket identifiers on the site). */
export const impactAtWork: ImpactAtWorkItem[] = [
  {
    title: 'AI visual product discovery',
    emoji: '🛋️',
    impact:
      'Contributed across the full lifecycle of an AI-powered visual search experience for retail—shipping iterations, Copilot-style tooling for staff, and training collateral so teams could adopt it confidently.',
    outcomes: [
      'Delivered feature and refinement work on the customer-facing discovery experience aligned with the public SofaScope project.',
      'Produced walkthrough and documentation so sales and operations could use the system effectively.',
    ],
    tags: ['CLIP', 'vector search', 'retail AI', 'enablement'],
  },
  {
    title: 'Conversational AI for the sales floor',
    emoji: '💬',
    impact:
      'Helped define how a Copilot assistant should behave for real selling scenarios—grounding answers in the right data sources, syncing knowledge on a cadence, and closing the loop with feedback from design consultants.',
    outcomes: [
      'Shaped guidance behavior, data-source boundaries, and use-case coverage for furniture discovery.',
      'Drove validation with field stakeholders so responses matched how people actually sell.',
    ],
    tags: ['LLMs', 'prompt design', 'knowledge ops', 'feedback loops'],
  },
  {
    title: 'AWS proof & speech pipeline groundwork',
    emoji: '☁️',
    impact:
      'Built non-production proof components for cloud ingestion and async processing, and evaluated speech-to-text options for cost and latency—informing a production-grade path without duplicating the full architecture story already covered in the AWS section.',
    outcomes: [
      'Stood up foundational S3, Lambda, SQS, and ECS wiring for experimentation.',
      'Benchmarked Whisper variants to balance quality and run cost.',
    ],
    tags: ['AWS', 'SQS', 'ECS', 'Whisper', 'POC'],
  },
  {
    title: 'Customer service automation platform',
    emoji: '🎧',
    impact:
      'Owned substantial Zendesk engineering beyond one-off Lambdas: scheduled task-server jobs, routing logic, dedicated-agent workflows, and guardrails so automations stayed observable and safe.',
    outcomes: [
      'Implemented and documented round-robin and dedicated-agent flows used in live operations.',
      'Added logging, triggers, and backfills to keep ticket data consistent at scale.',
    ],
    tags: ['Zendesk', 'Node.js', 'automation', 'routing'],
  },
  {
    title: 'Operations visibility & analytics',
    emoji: '📊',
    impact:
      'Built and evolved operational dashboards and analytics hooks so leaders could see case load, agent activity, and funnel-style topic metrics—supporting data-informed staffing and product decisions.',
    outcomes: [
      'Shipped supervisor-facing reporting and case-initiator views tied to live ticket data.',
      'Extended analytics for topic funnels and related operational KPIs.',
    ],
    tags: ['dashboards', 'analytics', 'KPIs'],
  },
  {
    title: 'Contact-center routing (CCS) delivery',
    emoji: '🔀',
    impact:
      'Delivered merge-ready changes for sophisticated routing behavior—balancing native platform logic with custom round robin, feature-flag style controls, and test harnesses so releases could roll out without disrupting production chat.',
    outcomes: [
      'Prepared branch merges with environment toggles to isolate experimental routing from live traffic.',
      'Investigated and implemented CCS/VCS routing improvements with clear testing checkpoints.',
    ],
    tags: ['routing', 'feature flags', 'quality', 'CCaaS'],
  },
];
