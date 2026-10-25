/**
 * In-memory resilient cache with TTL and stale fallback support
 */
import { DataStatus, MarketData } from "./types.js";

interface CacheEntry<T> {
  data: MarketData<T>;
  cachedAt: number;
  ttlMs: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export class MarketCache {
  /**
   * Get valid cached data, or stale data if expired but still usable
   */
  static get<T>(key: string): { data: MarketData<T> | null; isExpired: boolean } {
    const entry = store.get(key) as CacheEntry<T> | undefined;
    if (!entry) {
      return { data: null, isExpired: true };
    }

    const now = Date.now();
    const isExpired = now - entry.cachedAt > entry.ttlMs;

    return {
      data: entry.data,
      isExpired,
    };
  }

  /**
   * Set fresh cache entry
   */
  static set<T>(key: string, data: MarketData<T>, ttlMs: number): void {
    store.set(key, {
      data,
      cachedAt: Date.now(),
      ttlMs,
    });
  }

  /**
   * Helper to fetch with resilient caching & stale fallback
   */
  static async wrap<T>({
    key,
    ttlMs,
    fetcher,
    defaultSource,
    defaultSourceUrl,
  }: {
    key: string;
    ttlMs: number;
    fetcher: () => Promise<MarketData<T>>;
    defaultSource: string;
    defaultSourceUrl: string;
  }): Promise<MarketData<T>> {
    const { data: cached, isExpired } = MarketCache.get<T>(key);

    // If cache is still fresh, return it
    if (cached && !isExpired && cached.status !== "unavailable") {
      return cached;
    }

    // Try fetching fresh data
    try {
      const fresh = await fetcher();
      if (fresh.status !== "unavailable" && fresh.value !== null) {
        MarketCache.set(key, fresh, ttlMs);
        return fresh;
      }

      // If fresh failed or is unavailable, check if we have stale cache
      if (cached && cached.value !== null) {
        return {
          ...cached,
          status: "stale",
          error: fresh.error || "Upstream provider refresh failed; serving cached observation.",
          fetchedAt: new Date().toISOString(),
        };
      }

      return fresh;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`[MarketCache] Fetch error for key "${key}":`, errorMsg);

      if (cached && cached.value !== null) {
        return {
          ...cached,
          status: "stale",
          error: `Network error (${errorMsg}); serving cached observation.`,
          fetchedAt: new Date().toISOString(),
        };
      }

      return {
        value: null,
        source: defaultSource,
        sourceUrl: defaultSourceUrl,
        asOf: null,
        fetchedAt: new Date().toISOString(),
        status: "unavailable",
        error: errorMsg,
      };
    }
  }

  /**
   * Clear all cache entries (useful for tests or forced manual refresh)
   */
  static clear(): void {
    store.clear();
  }
}
