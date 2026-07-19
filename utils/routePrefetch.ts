/**
 * Route bundle prefetching.
 *
 * React Router 7 doesn't prefetch lazy() chunks on its own. This helper maps
 * paths to the exact same dynamic imports used by App.tsx so we can kick a
 * chunk request early — either on nav-link hover, or during browser idle
 * after the initial page loads.
 *
 * The keys MUST match the strings in App.tsx exactly so Vite/Rollup
 * de-duplicates them into a single chunk request per route.
 */

const importers: Record<string, () => Promise<unknown>> = {
  '/gallery': () => import('../pages/Gallery'),
  '/process': () => import('../pages/Process'),
  '/materials': () => import('../pages/Materials'),
  '/about': () => import('../pages/About'),
  '/contact': () => import('../pages/Contact'),
  '/faq': () => import('../pages/FAQ'),
  '/privacy-policy': () => import('../pages/PrivacyPolicy'),
  '/terms-of-use': () => import('../pages/TermsOfUse'),
  '/accessibility-statement': () => import('../pages/AccessibilityStatement'),
  '/gdpr-request': () => import('../pages/GdprRequestForm'),
};

const prefetched = new Set<string>();

export function prefetchRoute(path: string): void {
  if (prefetched.has(path)) return;
  const importer = importers[path];
  if (!importer) return;
  prefetched.add(path);
  // Fire and forget — the browser/network layer handles priority.
  importer().catch(() => {
    prefetched.delete(path);
  });
}

/**
 * Kick off prefetches for the routes visitors most commonly land on next.
 * Runs during idle time so it never fights with the initial paint.
 */
export function prefetchKeyRoutesOnIdle(): void {
  const priority: string[] = ['/gallery', '/contact', '/materials', '/about'];
  const kick = () => priority.forEach((p) => prefetchRoute(p));
  if (typeof window === 'undefined') return;
  const w = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number };
  if (typeof w.requestIdleCallback === 'function') {
    w.requestIdleCallback(kick, { timeout: 2000 });
  } else {
    setTimeout(kick, 1200);
  }
}
