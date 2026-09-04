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
    title: 'Inventory + shop-ops platform',
    emoji: '📦',
    impact:
      'Own ClearView, a production Next.js app for floor and shop staff: scan-first inventory across ~1.3M serials / 200k+ products, plus shop-request operations with live NetSuite as the system of record, used by 70+ people in production.',
    outcomes: [
      'Cut default grouped browse from ~11s to ~150ms-1s (warm snapshot path ~11s → ~500ms; filtered browse ~10.4s → ~2.2s) with matviews, query redesign, and statement-timeout guardrails.',
      'Shipped shop-request queue/detail with attachments, write-back, and role-gated access; catalog reads from shared Postgres RDS (~5GB, ~23 years, ~15-min delta sync) while ops queues hit live NetSuite so staff are not waiting on lag.',
    ],
    tags: ['Next.js', 'PostgreSQL', 'RDS', 'NetSuite', 'ECS', 'Entra ID', 'RBAC'],
  },
  {
    title: 'AI visual product discovery',
    emoji: '🛋️',
    impact:
      'Contributed across the full lifecycle of an AI-powered visual search experience for retail: shipping iterations, Copilot-style tooling for staff, and training collateral so teams could adopt it confidently.',
    outcomes: [
      'Delivered feature and refinement work on the customer-facing discovery experience aligned with SofaScope: image search latency from ~15s to <500ms via persistent CLIP serving.',
      'Produced walkthrough and documentation so sales and operations could use the system effectively.',
    ],
    tags: ['CLIP', 'FAISS', 'vector search', 'retail AI', 'enablement'],
  },
  {
    title: 'Conversational AI for the sales floor',
    emoji: '💬',
    impact:
      'Shipped Copilot Studio assistants for real selling scenarios: Design Consultant SellSmart guidance plus Digital-to-Store discovery agents grounded in NetSuite data.',
    outcomes: [
      'Defined guidance behavior, data-source boundaries, and furniture-discovery use cases so answers stayed actionable on the floor.',
      'Built SellSmart tooling to sync NetSuite into the knowledge base on a cadence and surface improvement suggestions from conversation analytics.',
    ],
    tags: ['LLMs', 'Copilot Studio', 'NetSuite', 'knowledge ops', 'feedback loops'],
  },
  {
    title: 'Customer service automation platform',
    emoji: '🎧',
    impact:
      'Owned substantial Zendesk engineering beyond one-off Lambdas: scheduled task-server jobs, custom round robin, dedicated-agent / vendor routing, and telemetry so automations stayed observable and safe in production.',
    outcomes: [
      'Custom round robin has assigned 4,000+ tickets across CCS/VCS with dedicated-agent preference, daily caps, dual tagging, and env-flagged rollouts that never disrupted live traffic.',
      'Shipped call auto-transcription, chat timeout handling, NetSuite→Zendesk customer sync, and supervisor-facing reporting hooks.',
    ],
    tags: ['Zendesk', 'Node.js', 'automation', 'routing', 'Lambda'],
  },
  {
    title: 'AWS & cloud infrastructure',
    emoji: '☁️',
    impact:
      'Delivered production cloud footing for inventory and contact-center systems: CI/CD pipelines with true staging/prod separation, ECS/Fargate hosting, Terraform-managed secrets, shared RDS, and serverless event pipelines.',
    outcomes: [
      'Built the deployment pipeline end to end: quality-gated CI, auto-deploy to isolated staging, and manual digest promotion to prod on ECS/Fargate behind internal and public ALBs, with AWS WAF on the internet path.',
      'Reused AWS patterns across Lambda/SQS automations and the shared RDS + task-server sync plane used by the engineering team; ClearView steady-state ~$159/mo.',
    ],
    tags: ['AWS', 'CI/CD', 'Terraform', 'ECS/Fargate', 'WAF', 'RDS'],
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
