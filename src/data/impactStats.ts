export interface ImpactStat {
  /** Numeric target for the count-up animation */
  target: number;
  prefix?: string;
  suffix?: string;
  /** Decimal places for the count-up (default 0). Use 1 for values like 1.3M. */
  decimals?: number;
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
    target: 1.3,
    suffix: 'M+',
    decimals: 1,
    label: 'serials tracked',
    detail: '~200k products · ~23 years on shared RDS',
  },
];
