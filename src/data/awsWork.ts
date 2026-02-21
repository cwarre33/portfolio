export interface AwsWorkItem {
  title: string;
  emoji: string;
  architecture: string[];
  businessOutcome: string;
  cost: string;
}

export const awsWork: AwsWorkItem[] = [
  {
    title: 'Zendesk Call Transcription Pipeline',
    emoji: '🎙️',
    architecture: [
      'API Gateway → Lambda (Ingest) → S3 (7-day TTL) → SQS → ECS Fargate (Whisper) → Lambda (Write-back) → Zendesk',
    ],
    businessOutcome:
      'Automatically transcribes customer service calls and attaches transcripts to Zendesk tickets—eliminating manual call review and enabling searchable call history.',
    cost: 'Near-zero. faster-whisper on spot/Fargate, S3 auto-deletes after 7 days, Lambda on-demand. Benchmarked model variants for cheapest viable option.',
  },
  {
    title: '3-Minute Chat Timeout Handler',
    emoji: '⏱️',
    architecture: [
      'Zendesk Trigger → Webhook → Lambda₁ → SQS (3-min delay) → Lambda₂ → Zendesk Ticket Update',
    ],
    businessOutcome:
      'Customers no longer wait indefinitely. After 3 minutes of no response, sends a graceful fallback message and collects additional info before routing to the right team.',
    cost: 'Zero. Lambda free tier, SQS free tier for message delays. No always-on infrastructure.',
  },
  {
    title: 'Dedicated Agent Ticket Assigner',
    emoji: '🎯',
    architecture: ['Zendesk Trigger → Webhook → Lambda → Zendesk API (assign ticket)'],
    businessOutcome:
      'Clients get routed to their preferred agent automatically, maintaining relationship continuity. Falls back to round-robin if no dedicated agent is set.',
    cost: 'Zero. Single Lambda per ticket, well within free tier.',
  },
];
