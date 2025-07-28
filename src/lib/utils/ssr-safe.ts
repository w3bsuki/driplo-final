export function getSSRSafeWidth(): number {
  // Always return mobile width for SSR to prevent hydration mismatches
  return 375;
}

export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}
