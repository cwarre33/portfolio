export interface ImpactStat {
  /** Numeric target for the count-up animation */
  target: number;
  prefix?: string;
  suffix?: string;
  label: string;
  detail: string;
}

/** Headline metrics surfaced in the animated stats band (public-safe figures). */
export const impactStats: ImpactStat[] = [
  {
    target: 4000,
    suffix: '+',
    label: 'tickets auto-assigned',
    detail: 'custom round robin running in production',
  },
  {
    target: 22,
    suffix: '\u00d7',
    label: 'faster inventory browse',
    detail: '~11s \u2192 ~500ms via matviews + query redesign',
  },
  {
    target: 95,
    suffix: '%',
    label: 'faster visual search',
    detail: '15s \u2192 <500ms with persistent CLIP serving',
  },
  {
    target: 23,
    suffix: ' yrs',
    label: 'of data on shared RDS',
    detail: '~5GB Postgres, delta-synced every 15 min',
  },
];
