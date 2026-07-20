export {};

declare global {
  interface Window {
    goatcounter?: {
      count: (vars?: { path?: string; title?: string; event?: boolean }) => void;
    };
    clarity?: (action: string, ...args: unknown[]) => void;
  }
}
