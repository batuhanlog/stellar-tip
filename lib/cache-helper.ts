/**
 * Cache Helper — StellarTip Orange Belt
 *
 * Simple in-memory caching utility with TTL (Time-To-Live).
 * Used for caching balance, transaction history, and contract data
 * to reduce redundant network calls and improve UX.
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // milliseconds
}

class CacheHelper {
  private store: Map<string, CacheEntry<any>> = new Map();

  /**
   * Set a value in the cache with a TTL (in milliseconds).
   */
  set<T>(key: string, data: T, ttlMs: number): void {
    this.store.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  /**
   * Get a value from the cache.
   * Returns null if the key doesn't exist or has expired.
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    if (age > entry.ttl) {
      this.store.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Check if a cache entry exists and is still valid.
   */
  has(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;

    const age = Date.now() - entry.timestamp;
    if (age > entry.ttl) {
      this.store.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Invalidate (delete) a specific cache entry.
   */
  invalidate(key: string): void {
    this.store.delete(key);
  }

  /**
   * Invalidate all cache entries that match a prefix.
   * Useful for invalidating all entries for a specific public key.
   */
  invalidateByPrefix(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Clear the entire cache.
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Get the age of a cache entry in milliseconds.
   * Returns -1 if the entry doesn't exist.
   */
  getAge(key: string): number {
    const entry = this.store.get(key);
    if (!entry) return -1;
    return Date.now() - entry.timestamp;
  }

  /**
   * Check if a cache entry is "fresh" (less than half its TTL).
   */
  isFresh(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;
    const age = Date.now() - entry.timestamp;
    return age < entry.ttl / 2;
  }

  /**
   * Get cache info for a key (for UI display).
   */
  getInfo(key: string): { cached: boolean; fresh: boolean; ageMs: number } | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    if (age > entry.ttl) {
      this.store.delete(key);
      return null;
    }

    return {
      cached: true,
      fresh: age < entry.ttl / 2,
      ageMs: age,
    };
  }

  /**
   * Get the number of entries in the cache.
   */
  get size(): number {
    return this.store.size;
  }
}

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  BALANCE: 30_000,        // 30 seconds
  TRANSACTIONS: 60_000,   // 60 seconds
  CONTRACT_DATA: 45_000,  // 45 seconds
  HEALTH: 15_000,         // 15 seconds
} as const;

// Cache key builders
export const CACHE_KEYS = {
  balance: (publicKey: string) => `balance:${publicKey}`,
  transactions: (publicKey: string) => `txs:${publicKey}`,
  contractCounter: () => 'contract:counter',
  contractHealth: () => 'contract:health',
} as const;

// Singleton instance
export const cache = new CacheHelper();

// Export class for testing
export { CacheHelper };
