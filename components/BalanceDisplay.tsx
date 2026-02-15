/**
 * BalanceDisplay Component — StellarTip
 * 
 * Displays the user's XLM balance as a "Tip Jar" with visual flair.
 * Orange Belt: Added caching with TTL and "cached"/"live" indicator.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { stellar } from '@/lib/stellar-helper';
import { cache, CACHE_TTL, CACHE_KEYS } from '@/lib/cache-helper';
import { FaSync } from 'react-icons/fa';
import { Card } from './example-components';
import { AddressQRCode } from './BonusFeatures';

interface BalanceDisplayProps {
  publicKey: string;
}

interface BalanceData {
  xlm: string;
  assets: Array<{ code: string; issuer: string; balance: string }>;
}

export default function BalanceDisplay({ publicKey }: BalanceDisplayProps) {
  const [balance, setBalance] = useState<string>('0');
  const [assets, setAssets] = useState<Array<{ code: string; issuer: string; balance: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isCached, setIsCached] = useState(false);

  const cacheKey = CACHE_KEYS.balance(publicKey);

  const fetchBalance = useCallback(async (forceRefresh = false) => {
    try {
      setRefreshing(true);

      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cached = cache.get<BalanceData>(cacheKey);
        if (cached) {
          setBalance(cached.xlm);
          setAssets(cached.assets);
          setIsCached(true);
          setLoading(false);
          setRefreshing(false);
          return;
        }
      }

      const balanceData = await stellar.getBalance(publicKey);
      setBalance(balanceData.xlm);
      setAssets(balanceData.assets);
      setIsCached(false);

      // Store in cache
      cache.set<BalanceData>(cacheKey, balanceData, CACHE_TTL.BALANCE);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [publicKey, cacheKey]);

  useEffect(() => {
    if (publicKey) {
      fetchBalance();
    }
  }, [publicKey, fetchBalance]);

  const handleRefresh = () => {
    cache.invalidate(cacheKey);
    fetchBalance(true);
  };

  const formatBalance = (bal: string): string => {
    const num = parseFloat(bal);
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 7,
    });
  };

  // Loading skeleton
  if (loading) {
    return (
      <Card className="animate-fadeIn">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/5 rounded-lg"></div>
              <div className="h-7 bg-white/5 rounded-lg w-24"></div>
            </div>
            <div className="w-8 h-8 bg-white/5 rounded-lg"></div>
          </div>
          <div className="bg-white/5 rounded-2xl p-6 mb-5">
            <div className="h-4 bg-white/5 rounded w-28 mb-3"></div>
            <div className="h-12 bg-white/5 rounded-lg w-48 mb-2"></div>
            <div className="h-4 bg-white/5 rounded w-20"></div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="h-24 bg-white/5 rounded-xl"></div>
            <div className="h-24 bg-white/5 rounded-xl"></div>
          </div>
          <div className="h-16 bg-white/5 rounded-xl"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="animate-fadeIn overflow-hidden relative">
      {/* Decorative background glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between mb-6 relative z-10">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-3xl">🫙</span>
          Tip Jar
        </h2>
        <div className="flex items-center gap-2">
          {/* Cache indicator */}
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border transition-all ${
              isCached
                ? 'bg-violet-500/10 border-violet-500/30 text-violet-300'
                : 'bg-green-500/10 border-green-500/30 text-green-300'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isCached ? 'bg-violet-400' : 'bg-green-400 animate-pulse'}`}></span>
            {isCached ? 'cached' : 'live'}
          </span>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-violet-400 hover:text-violet-300 disabled:opacity-50 transition-colors p-2 hover:bg-violet-500/10 rounded-lg"
            title="Refresh balance (force)"
          >
            <FaSync className={`text-lg ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main XLM Balance */}
      <div className="bg-gradient-to-br from-violet-500/15 to-purple-500/10 border border-violet-500/20 rounded-2xl p-6 mb-5 relative z-10">
        <p className="text-violet-300/80 text-sm mb-2 uppercase tracking-wider font-medium">Available Balance</p>
        <div className="flex items-baseline gap-2">
          <p className="text-5xl font-bold text-white tracking-tight">
            {formatBalance(balance)}
          </p>
          <p className="text-2xl text-violet-400 font-semibold">XLM</p>
        </div>
        <p className="text-white/30 text-sm mt-2">
          ≈ ${(parseFloat(balance) * 0.12).toFixed(2)} USD
        </p>
      </div>

      {/* Tip Stats (concept) */}
      <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
          <p className="text-green-400 text-xs uppercase tracking-wider mb-1">Tips Received</p>
          <p className="text-white text-lg font-bold">—</p>
          <p className="text-white/30 text-xs">connect to track</p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
          <p className="text-purple-400 text-xs uppercase tracking-wider mb-1">Tips Sent</p>
          <p className="text-white text-lg font-bold">—</p>
          <p className="text-white/30 text-xs">connect to track</p>
        </div>
      </div>

      {/* QR Code */}
      <div className="relative z-10">
        <AddressQRCode address={publicKey} />
      </div>

      {/* Other Assets */}
      {assets.length > 0 && (
        <div className="space-y-2 mt-5 relative z-10">
          <p className="text-white/50 text-sm mb-3 uppercase tracking-wider">Other Assets</p>
          {assets.map((asset, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-white font-semibold">{asset.code}</p>
                <p className="text-white/30 text-xs font-mono truncate max-w-[200px]">
                  {asset.issuer}
                </p>
              </div>
              <p className="text-white text-lg font-bold">
                {formatBalance(asset.balance)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="mt-5 p-3 bg-violet-500/5 border border-violet-500/15 rounded-xl relative z-10">
        <p className="text-violet-200/70 text-xs">
          💡 <strong>Tip:</strong> Keep at least 1 XLM for network reserves. Share your address to receive tips!
        </p>
      </div>
    </Card>
  );
}
