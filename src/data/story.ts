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
  prize: string;
  result?: string;
}

export const kaggle = {
  count: 14,
  prizePool: '$3.8M',
  domains: 10,
  competitions: [
    { name: 'AI Mathematical Olympiad 3', domain: 'Math reasoning', prize: '$2.2M' },
    { name: 'ARC Prize 2025', domain: 'Reasoning', prize: '$1M' },
    { name: 'Hull Tactical', domain: 'Quant finance', prize: '$100k' },
    { name: 'Google Tunix', domain: 'NLP', prize: '$100k' },
    { name: 'Stanford RNA 3D Folding', domain: 'Bioinformatics', prize: '$75k' },
    { name: 'CSIRO Image2Biomass', domain: 'Computer vision', prize: '$75k' },
    { name: 'Deep Past · Akkadian', domain: 'NLP', prize: '$50k', result: 'Found + documented data leakage' },
    { name: 'March Mania 2026', domain: 'Sports analytics', prize: '$50k' },
    { name: 'MABe Mouse Behavior', domain: 'Motion', prize: '$50k' },
    { name: 'UrbanFloodBench', domain: 'Environmental', prize: '$7k' },
    { name: 'Motion-S Text-to-Sign', domain: 'Motion', prize: 'Kudos', result: 'Rank 25 · 97.8% of top score' },
    { name: 'Jaguar Re-ID', domain: 'Computer vision', prize: 'Kudos' },
    { name: 'House Prices', domain: 'Tabular', prize: 'Knowledge', result: '~Rank 19' },
    { name: 'Heart Disease S6E2', domain: 'Tabular', prize: 'Swag' },
  ] as Competition[],
};

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
