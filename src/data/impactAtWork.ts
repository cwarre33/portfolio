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
    title: 'Inventory lookup platform',
    emoji: '📦',
    impact:
      'Co-built a scan-first inventory experience for the sales floor—search, item detail, history, exports, and role-based pricing—backed by shared AWS RDS and automated NetSuite delta sync.',
    outcomes: [
      'Shipped browse/search performance work (snapshots, matviews, query redesign) so filtered lookups stay fast under concurrent use.',
      'Delivered Microsoft Entra ID SSO with session roles and API/UI gating, plus Bitbucket CI quality gates for the repo.',
    ],
    tags: ['Next.js', 'PostgreSQL', 'RDS', 'Entra ID', 'NetSuite sync'],
  },
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
      'Built SellSmart tooling to sync NetSuite data into the knowledge base and surface improvement suggestions from conversation analytics.',
    ],
    tags: ['LLMs', 'Copilot Studio', 'knowledge ops', 'feedback loops'],
  },
  {
    title: 'Customer service automation platform',
    emoji: '🎧',
    impact:
      'Owned substantial Zendesk engineering beyond one-off Lambdas: scheduled task-server jobs, custom round robin, dedicated-agent / vendor routing, and telemetry so automations stayed observable and safe in production.',
    outcomes: [
      'Implemented VCS/CCS routing with daily caps, dual tagging for dedicated assigns, and env-flagged rollouts that never disrupted live traffic.',
      'Shipped call auto-transcription, chat timeout handling, customer sync from NetSuite, and supervisor-facing reporting hooks.',
    ],
    tags: ['Zendesk', 'Node.js', 'automation', 'routing'],
  },
  {
    title: 'AWS proof & speech pipeline groundwork',
    emoji: '☁️',
    impact:
      'Built non-production proof components for cloud ingestion and async processing, and evaluated speech-to-text options for cost and latency—informing a production-grade path without duplicating the full architecture story already covered in the AWS section.',
    outcomes: [
      'Stood up foundational S3, Lambda, SQS, and ECS wiring for experimentation.',
      'Benchmarked Whisper variants to balance quality and run cost; later reused patterns for shared RDS and task-server sync.',
    ],
    tags: ['AWS', 'SQS', 'ECS', 'Whisper', 'POC'],
  },
  {
    title: 'Operations visibility & NetSuite reporting',
    emoji: '📊',
    impact:
      'Built and evolved operational dashboards, case-initiator views, and NetSuite reporting pipelines (vouchers, commissions, D2K/Choros-style exports) so leaders could act on live ticket and order data.',
    outcomes: [
      'Shipped supervisor-facing reporting and analytics tied to live Zendesk and NetSuite sources.',
      'Hardened SuiteQL/ODBC report jobs and Suitelets used by warehouse and sales workflows.',
    ],
    tags: ['dashboards', 'SuiteQL', 'KPIs', 'NetSuite'],
  },
];
