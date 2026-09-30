/**
 * Curated, public-safe copy. Every figure traces to a cameron-wiki page
 * (`source`) or to metrics already published on this site. Keep ticket IDs
 * and anything from `visibility: fls-internal` pages out unless it has
 * already been sanitized for public use.
 */

export interface PipelineStage {
  label: string;
  sub?: string;
}

export interface System {
  id: string;
  index: string;
  name: string;
  kicker: string;
  summary: string;
  metrics: { value: string; label: string }[];
  pipeline: PipelineStage[];
  stack: string[];
  decision?: string;
  source: string;
}

export const systems: System[] = [
  {
    id: 'clearview',
    index: '01',
    name: 'ClearView',
    kicker: 'Inventory + shop-ops platform',
    summary:
      'Scan-first inventory and shop-request operations for floor and shop staff. Catalog reads hit a shared Postgres read plane kept fresh by a multi-lane NetSuite delta sync; operational queues stay on live NetSuite so nobody waits on lag.',
    metrics: [
      { value: '22×', label: 'faster default browse (~11s → ~500ms)' },
      { value: '1.3M+', label: 'serials across ~23 years of history' },
      { value: '70+', label: 'staff using it in production' },
      { value: '~$159', label: 'per month, steady state' },
    ],
    pipeline: [
      { label: 'NetSuite', sub: 'system of record' },
      { label: 'Delta sync', sub: 'SuiteQL · ~15 min' },
      { label: 'RDS Postgres', sub: 'matviews · timeouts' },
      { label: 'Next.js', sub: 'ECS / Fargate' },
      { label: 'ALB + WAF', sub: 'Entra ID SSO' },
    ],
    stack: ['Next.js', 'PostgreSQL', 'AWS ECS/Fargate', 'Terraform', 'WAF', 'Entra ID', 'Bitbucket CI'],
    decision: 'Live NetSuite for ops queues, replica for browse: freshness where it matters, speed everywhere else.',
    source: 'wiki/production-systems/inventory-lookup-clearview',
  },
  {
    id: 'sofascope',
    index: '02',
    name: 'SofaScope',
    kicker: 'Multimodal visual search',
    summary:
      'Photo-to-product search over a 200,000-item furniture catalog. Profiling showed the model was reloading on every request; keeping CLIP resident in a persistent service took image search from seconds to sub-second.',
    metrics: [
      { value: '33×', label: 'faster image search (~16.8s → <500ms)' },
      { value: '45ms', label: 'text search, 92% domain accuracy' },
      { value: '200k', label: 'products indexed' },
      { value: '768-d', label: 'CLIP ViT-L/14 embeddings' },
    ],
    pipeline: [
      { label: 'Query', sub: 'photo or text' },
      { label: 'Router', sub: 'modality + fallback' },
      { label: 'CLIP', sub: 'resident in memory' },
      { label: 'FAISS', sub: 'IndexFlatIP · cosine' },
      { label: 'Results', sub: '<500ms' },
    ],
    stack: ['Python', 'CLIP', 'FAISS', 'Next.js', 'TypeScript', 'Docker'],
    decision: 'Field-weighted metadata scoring beat embeddings for text: 55× faster, zero API cost, tunable.',
    source: 'wiki/production-systems/sofascope',
  },
  {
    id: 'zendesk',
    index: '03',
    name: 'Contact-center automation',
    kicker: 'Routing, transcription, telemetry',
    summary:
      'A custom round robin with dedicated-agent preference, daily caps, and env-flagged rollouts, plus a serverless pipeline that transcribes calls and writes them back to tickets.',
    metrics: [
      { value: '4,000+', label: 'tickets auto-assigned' },
      { value: '0', label: 'live-traffic disruptions from rollouts' },
      { value: '7-day', label: 'S3 TTL on call audio' },
      { value: '≈$0', label: 'idle cost (on-demand + spot)' },
    ],
    pipeline: [
      { label: 'Call ends', sub: 'API Gateway' },
      { label: 'Lambda', sub: 'ingest' },
      { label: 'S3 → SQS', sub: '7-day TTL' },
      { label: 'Whisper', sub: 'Fargate' },
      { label: 'Zendesk', sub: 'write-back' },
    ],
    stack: ['Node.js', 'AWS Lambda', 'SQS', 'ECS/Fargate', 'faster-whisper', 'Zendesk API'],
    decision: 'Benchmarked Whisper variants and shipped the cheapest one that cleared the accuracy bar.',
    source: 'wiki/initiatives/zendesk-automation-platform',
  },
  {
    id: 'sellsmart',
    index: '04',
    name: 'SellSmart',
    kicker: 'Conversational AI on the sales floor',
    summary:
      'Copilot Studio assistants for design consultants and Digital-to-Store discovery, grounded in NetSuite data with a knowledge sync on a cadence and conversation analytics feeding improvement suggestions.',
    metrics: [
      { value: '2', label: 'agent programs: SellSmart + Digital-to-Store' },
      { value: 'Synced', label: 'NetSuite → knowledge base on a cadence' },
      { value: 'Closed loop', label: 'conversation analytics → KB fixes' },
    ],
    pipeline: [
      { label: 'NetSuite', sub: 'catalog + orders' },
      { label: 'Sync', sub: 'scheduled' },
      { label: 'Knowledge', sub: 'grounding' },
      { label: 'Copilot', sub: 'Studio agents' },
      { label: 'Analytics', sub: 'feedback loop' },
    ],
    stack: ['Copilot Studio', 'LLMs', 'NetSuite', 'Power Platform'],
    source: 'wiki/initiatives/sellsmart-program',
  },
];

export interface Decision {
  title: string;
  chose: string;
  over: string;
  why: string;
  cost: string;
  metric?: string;
  domain: 'production' | 'research' | 'trading' | 'meta';
}

/** The public ADRs in wiki/decisions/. */
export const decisions: Decision[] = [
  {
    title: 'Metadata scoring vs. embeddings',
    chose: 'Field-weighted metadata scoring',
    over: 'OpenAI / local embeddings',
    why: 'Furniture attributes are enumerable, not prose. Explicit weights encode the relevance hierarchy embeddings have to guess.',
    cost: '"sofa" won’t match "couch" without a synonym map.',
    metric: '45ms vs ~2,500ms',
    domain: 'production',
  },
  {
    title: 'Persistent service over stdin/stdout',
    chose: 'Long-lived subprocess, JSON over stdio',
    over: 'FastAPI server · Triton',
    why: 'Single-machine pilot: no ports to manage, one deploy unit, a SERVICE_READY handshake with fallback to per-request search.',
    cost: 'One caller only, and no independent scaling.',
    metric: '~16.8s → <500ms',
    domain: 'production',
  },
  {
    title: 'Open model for high-frequency sentiment',
    chose: 'Llama 3.3 70B',
    over: 'GPT-4o · Claude Sonnet',
    why: '~520 calls a day on headline sentiment. Match model capability to task complexity; save frontier models for high-stakes single shots.',
    cost: 'Lower quality ceiling and less reliable JSON, so parsing needs a fallback.',
    metric: '~10× cheaper',
    domain: 'trading',
  },
  {
    title: 'Custom provider adapters',
    chose: 'Three-method ProviderAdapter per vendor',
    over: 'LiteLLM',
    why: 'Benchmark harnesses need exact control of request shape and output validation. Rate limits and retries live in the runner, not the adapter.',
    cost: 'More boilerplate per provider, and some path dependence from the upstream fork.',
    metric: '4 providers, async fan-out',
    domain: 'research',
  },
  {
    title: 'Rotate reasoning, keep outcomes',
    chose: '90-day window on decisions.jsonl',
    over: 'Keep everything forever',
    why: 'Reasoning is regime-dependent; P&L outcomes aren’t. Intentional forgetting at the horizon where markets change regime.',
    cost: '90 days is a heuristic that still needs a backtest.',
    metric: '~1 market quarter',
    domain: 'trading',
  },
  {
    title: 'Consensus-based memory distillation',
    chose: 'N candidates + MBR consensus',
    over: 'Single-pass LLM review',
    why: 'Borrowed from Akkadian translation work: a lesson only commits to memory when independent generations agree. Disagreement goes to a human.',
    cost: 'N× token spend, so distillation runs as a batch job.',
    metric: 'N ≈ 5–10',
    domain: 'meta',
  },
  {
    title: 'Hull Tactical as a signal stack',
    chose: 'GBDT + walk-forward CV',
    over: 'Random split · LLM features',
    why: 'Binary D-features behave like AutoTrader’s RSI gate, and the continuous groups act as context. The gRPC API enforces time order, so validation has to follow it too.',
    cost: 'The mapping is conceptual. The features are anonymized.',
    metric: '9,049 days · 94 features',
    domain: 'research',
  },
  {
    title: 'Wiki retention policy',
    chose: 'Distill, then prune speculative pages',
    over: 'Archive everything',
    why: 'The same principle applied to this knowledge base: ADRs and outcomes are kept forever, stale speculation is distilled into related pages before deletion.',
    cost: 'Needs a quarterly lint discipline.',
    metric: '90-day staleness gate',
    domain: 'meta',
  },
];

export interface Competition {
  name: string;
  domain: string;
  /** Kaggle competition type as listed on the site */
  kind: 'Featured' | 'Research' | 'Community' | 'Playground';
  rank?: number;
  teams: number;
  /** `live` = leaderboard still open, rank is provisional */
  status: 'final' | 'live';
  medal?: 'bronze';
  url: string;
}

/**
 * Snapshot of Cameron's Kaggle profile (cameronwarrennn), 2026-09-30.
 * Ranks are as shown on the profile's competitions tab; no prize wins.
 * The single competition medal is AIMO 3: 358/4,138 is inside the top-10%
 * bronze cutoff for 1,000+ team competitions, and no other ranked finish is.
 */
export const kaggle = {
  profile: 'https://www.kaggle.com/cameronwarrennn',
  snapshot: 'Sep 30, 2026',
  entered: 20,
  competitionMedals: 1,
  codeMedals: 2,
  badges: 33,
  ranked: [
    { name: 'Predicting EV Purchases (S6E9)', domain: 'Tabular', kind: 'Playground', rank: 42, teams: 3551, status: 'live', url: 'https://www.kaggle.com/competitions/playground-series-s6e9' },
    { name: 'AI Mathematical Olympiad 3', domain: 'Math reasoning', kind: 'Featured', rank: 358, teams: 4138, status: 'final', medal: 'bronze', url: 'https://www.kaggle.com/competitions/ai-mathematical-olympiad-progress-prize-3' },
    { name: 'Stanford RNA 3D Folding 2', domain: 'Bioinformatics', kind: 'Featured', rank: 437, teams: 1867, status: 'final', url: 'https://www.kaggle.com/competitions/stanford-rna-3d-folding-2' },
    { name: 'Orbit Wars', domain: 'Simulation / RL', kind: 'Featured', rank: 1170, teams: 4729, status: 'final', url: 'https://www.kaggle.com/competitions/orbit-wars' },
    { name: 'Predicting Heart Disease (S6E2)', domain: 'Tabular', kind: 'Playground', rank: 1373, teams: 4370, status: 'final', url: 'https://www.kaggle.com/competitions/playground-series-s6e2' },
    { name: 'UrbanFloodBench', domain: 'Environmental', kind: 'Community', rank: 117, teams: 264, status: 'final', url: 'https://www.kaggle.com/competitions/urban-flood-modelling' },
    { name: 'Deep Past · Akkadian → English', domain: 'NLP', kind: 'Featured', rank: 1200, teams: 2674, status: 'final', url: 'https://www.kaggle.com/competitions/deep-past-initiative-machine-translation' },
    { name: 'ARC Prize 2026 · ARC-AGI-3', domain: 'Reasoning', kind: 'Featured', rank: 1640, teams: 3503, status: 'live', url: 'https://www.kaggle.com/competitions/arc-prize-2026-arc-agi-3' },
    { name: 'Motion-S Text-to-Sign', domain: 'Motion generation', kind: 'Community', rank: 62, teams: 130, status: 'final', url: 'https://www.kaggle.com/competitions/motion-s-hierarchical-text-to-motion-generation-for-sign-language' },
    { name: 'Predicting Stellar Class (S6E6)', domain: 'Tabular', kind: 'Playground', rank: 1362, teams: 2816, status: 'final', url: 'https://www.kaggle.com/competitions/playground-series-s6e6' },
    { name: 'CSIRO Image2Biomass', domain: 'Computer vision', kind: 'Research', rank: 1910, teams: 3805, status: 'final', url: 'https://www.kaggle.com/competitions/csiro-biomass' },
    { name: 'March Machine Learning Mania', domain: 'Sports analytics', kind: 'Featured', rank: 2771, teams: 3462, status: 'final', url: 'https://www.kaggle.com/competitions/march-machine-learning-mania-2026' },
    { name: 'Jaguar Re-Identification', domain: 'Computer vision', kind: 'Community', rank: 299, teams: 348, status: 'final', url: 'https://www.kaggle.com/competitions/jaguar-re-id' },
  ] as Competition[],
  /** Entered without a leaderboard rank (hackathons, writeups, or no final submission scored). */
  unranked: [
    'Gemma 4 Developer Agent',
    'ARC Prize 2026 · Paper Track',
    'Google Tunix Hack',
    'MABe Mouse Behavior',
    'Hull Tactical Market Prediction',
    'ARC Prize 2025',
    'House Prices',
  ],
};

export function topPercent(c: Competition): number {
  return c.rank ? (c.rank / c.teams) * 100 : 100;
}

export interface Lab {
  name: string;
  line: string;
  stats: { value: string; label: string }[];
  tags: string[];
  url?: string;
}

export const labs: Lab[] = [
  {
    name: 'ARC-AGI harness',
    line: 'Async multi-provider eval harness: every (task × model) pair fans out concurrently with per-provider rate limits and cost tracking.',
    stats: [
      { value: '4', label: 'providers' },
      { value: '2', label: 'attempts / task' },
    ],
    tags: ['asyncio', 'tenacity', 'OpenAI', 'Anthropic', 'Gemini'],
  },
  {
    name: 'Kimi TVC harness',
    line: 'Test-Verify-Correct agent loop on a LangGraph StateGraph with a benchmark gate, SQLite skill memory, and Ollama execution.',
    stats: [
      { value: '52/52', label: 'tests passing' },
      { value: '4', label: 'benchmark adapters' },
    ],
    tags: ['LangGraph', 'Ollama', 'SWE-bench', 'GAIA'],
  },
  {
    name: 'AutoTrader',
    line: 'Paper-trading agent: RSI and LLM news sentiment must both agree before it trades, and every decision is logged for self-review.',
    stats: [
      { value: '50', label: 'tickers / 15 min' },
      { value: '5%', label: 'max position' },
    ],
    tags: ['Llama 3.3 70B', 'Alpaca', 'Docker', 'Gradio'],
    url: 'https://github.com/cwarre33/AutoTrader',
  },
];
