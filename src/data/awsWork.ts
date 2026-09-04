export interface AwsWorkItem {
  title: string;
  emoji: string;
  architecture: string[];
  businessOutcome: string;
  cost: string;
}

export const awsWork: AwsWorkItem[] = [
  {
    title: 'Shared RDS + NetSuite Delta Sync',
    emoji: '🗄️',
    architecture: [
      'On-prem task server → multi-lane SuiteQL delta sync → AWS RDS PostgreSQL (read plane) → Next.js inventory APIs (matviews + statement timeouts)',
    ],
    businessOutcome:
      'Floor staff browse ~1.3M serials / ~5GB / ~23 years of inventory history against RDS instead of hammering live SuiteQL. Default grouped browse ~11s → ~150ms-1s (warm snapshot path ~11s → ~500ms), kept fresh on a ~15-minute production cadence. Shop-request queues stay on live NetSuite so ops are not waiting on that lag.',
    cost: 'Dev RDS ~$30/mo baseline; production Multi-AZ db.t4g.small shared across the team. Query work focused on matviews and planner fixes so a small instance stays usable under concurrent load.',
  },
  {
    title: 'CI/CD to ECS/Fargate: Staging → Prod',
    emoji: '🚀',
    architecture: [
      'Bitbucket Pipelines (verify:ci gate) → OIDC → ECR → auto-deploy staging → manual promote to prod · fully separated staging/prod (own ECS services, RDS, DNS) · internal + public ALBs · AWS WAF on the public path · Terraform/SSM secrets · Entra ID SSO',
    ],
    businessOutcome:
      'Designed and own the full deployment pipeline: quality-gated builds, image digest promotion from staging to prod, and internet-reachable ClearView behind Entra SSO + WAF so floor and shop staff can use it off the internal network.',
    cost: 'ClearView steady-state ~$159/mo (under the prior ~$201–216 estimate), including public ALB + dedicated WAF. Reuses shared ALB/cluster patterns instead of a parallel network.',
  },
  {
    title: 'Zendesk Call Transcription Pipeline',
    emoji: '🎙️',
    architecture: [
      'API Gateway → Lambda (Ingest) → S3 (7-day TTL) → SQS → ECS Fargate (Whisper) → Lambda (Write-back) → Zendesk',
    ],
    businessOutcome:
      'Automatically transcribes customer service calls and attaches transcripts to Zendesk tickets, eliminating manual call review and enabling searchable call history.',
    cost: 'Near-zero. faster-whisper on spot/Fargate, S3 auto-deletes after 7 days, Lambda on-demand. Benchmarked model variants for cheapest viable option.',
  },
];
