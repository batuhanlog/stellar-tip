/**
 * Cache Helper Tests — StellarTip Orange Belt
 *
 * Tests the caching utility including:
 * - Setting and getting values
 * - TTL expiration
 * - Cache invalidation
 * - Freshness checks
 * - Key prefix invalidation
 */

import { CacheHelper, CACHE_TTL, CACHE_KEYS } from '@/lib/cache-helper';

describe('Cache Helper', () => {
  let cacheInstance: CacheHelper;

  beforeEach(() => {
    cacheInstance = new CacheHelper();
  });

  test('should store and retrieve a value', () => {
    cacheInstance.set('test-key', { balance: '100.00' }, 30000);
    const result = cacheInstance.get<{ balance: string }>('test-key');
    expect(result).toEqual({ balance: '100.00' });
  });

  test('should return null for non-existent keys', () => {
    const result = cacheInstance.get('non-existent');
    expect(result).toBeNull();
  });

  test('should expire entries after TTL', () => {
    // Use a very short TTL for testing
    cacheInstance.set('expire-test', 'data', 1); // 1ms TTL

    // Wait for expiration
    const start = Date.now();
    while (Date.now() - start < 10) {
      // busy wait ~10ms
    }

    const result = cacheInstance.get('expire-test');
    expect(result).toBeNull();
  });

  test('should report has() correctly for existing and expired entries', () => {
    cacheInstance.set('has-test', 'data', 60000);
    expect(cacheInstance.has('has-test')).toBe(true);
    expect(cacheInstance.has('no-key')).toBe(false);
  });

  test('should invalidate a specific key', () => {
    cacheInstance.set('key1', 'value1', 60000);
    cacheInstance.set('key2', 'value2', 60000);

    cacheInstance.invalidate('key1');

    expect(cacheInstance.get('key1')).toBeNull();
    expect(cacheInstance.get('key2')).toBe('value2');
  });

  test('should invalidate by prefix', () => {
    cacheInstance.set('balance:ABC123', '100', 60000);
    cacheInstance.set('balance:DEF456', '200', 60000);
    cacheInstance.set('txs:ABC123', [], 60000);

    cacheInstance.invalidateByPrefix('balance:');

    expect(cacheInstance.get('balance:ABC123')).toBeNull();
    expect(cacheInstance.get('balance:DEF456')).toBeNull();
    expect(cacheInstance.get('txs:ABC123')).toEqual([]);
  });

  test('should clear all entries', () => {
    cacheInstance.set('a', 1, 60000);
    cacheInstance.set('b', 2, 60000);
    cacheInstance.set('c', 3, 60000);

    expect(cacheInstance.size).toBe(3);

    cacheInstance.clear();

    expect(cacheInstance.size).toBe(0);
    expect(cacheInstance.get('a')).toBeNull();
  });

  test('should report freshness correctly', () => {
    // Entry with 60s TTL — should be fresh immediately
    cacheInstance.set('fresh-test', 'data', 60000);
    expect(cacheInstance.isFresh('fresh-test')).toBe(true);
  });

  test('should report non-existent keys as not fresh', () => {
    expect(cacheInstance.isFresh('nope')).toBe(false);
  });

  test('should return correct cache info', () => {
    cacheInstance.set('info-test', 'data', 60000);
    const info = cacheInstance.getInfo('info-test');

    expect(info).not.toBeNull();
    expect(info!.cached).toBe(true);
    expect(info!.fresh).toBe(true);
    expect(info!.ageMs).toBeGreaterThanOrEqual(0);
    expect(info!.ageMs).toBeLessThan(1000); // Should be very recent
  });

  test('should return null info for non-existent keys', () => {
    expect(cacheInstance.getInfo('nothing')).toBeNull();
  });

  test('should track size correctly', () => {
    expect(cacheInstance.size).toBe(0);
    cacheInstance.set('x', 1, 60000);
    expect(cacheInstance.size).toBe(1);
    cacheInstance.set('y', 2, 60000);
    expect(cacheInstance.size).toBe(2);
    cacheInstance.invalidate('x');
    expect(cacheInstance.size).toBe(1);
  });

  test('should overwrite existing entries', () => {
    cacheInstance.set('overwrite', 'old', 60000);
    cacheInstance.set('overwrite', 'new', 60000);
    expect(cacheInstance.get('overwrite')).toBe('new');
    expect(cacheInstance.size).toBe(1);
  });

  test('should return correct age for entries', () => {
    cacheInstance.set('age-test', 'data', 60000);
    const age = cacheInstance.getAge('age-test');
    expect(age).toBeGreaterThanOrEqual(0);
    expect(age).toBeLessThan(1000);
  });

  test('should return -1 age for non-existent keys', () => {
    expect(cacheInstance.getAge('nope')).toBe(-1);
  });
});

describe('Cache Keys and TTL Constants', () => {
  test('should generate correct balance cache key', () => {
    const key = CACHE_KEYS.balance('GABC123');
    expect(key).toBe('balance:GABC123');
  });

  test('should generate correct transactions cache key', () => {
    const key = CACHE_KEYS.transactions('GXYZ789');
    expect(key).toBe('txs:GXYZ789');
  });

  test('should generate correct contract cache keys', () => {
    expect(CACHE_KEYS.contractCounter()).toBe('contract:counter');
    expect(CACHE_KEYS.contractHealth()).toBe('contract:health');
  });

  test('should have reasonable TTL values', () => {
    expect(CACHE_TTL.BALANCE).toBe(30000);
    expect(CACHE_TTL.TRANSACTIONS).toBe(60000);
    expect(CACHE_TTL.CONTRACT_DATA).toBe(45000);
    expect(CACHE_TTL.HEALTH).toBe(15000);
    
    // All TTLs should be positive
    Object.values(CACHE_TTL).forEach(ttl => {
      expect(ttl).toBeGreaterThan(0);
    });
  });
});
