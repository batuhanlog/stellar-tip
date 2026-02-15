/**
 * TransactionHistory Component — StellarTip
 * 
 * Shows "Tip History" with sent/received labels and explorer links.
 * Orange Belt: Added caching with TTL and "cached"/"live" indicator.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { stellar } from '@/lib/stellar-helper';
import { cache, CACHE_TTL, CACHE_KEYS } from '@/lib/cache-helper';
import { FaSync, FaArrowUp, FaArrowDown, FaExternalLinkAlt } from 'react-icons/fa';
import { Card, EmptyState } from './example-components';

interface Transaction {
  id: string;
  type: string;
  amount?: string;
  asset?: string;
  from?: string;
  to?: string;
  createdAt: string;
  hash: string;
}

interface TransactionHistoryProps {
  publicKey: string;
}

export default function TransactionHistory({ publicKey }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isCached, setIsCached] = useState(false);
  const [limit] = useState(10);

  const cacheKey = CACHE_KEYS.transactions(publicKey);

  const fetchTransactions = useCallback(async (forceRefresh = false) => {
    try {
      setRefreshing(true);

      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cached = cache.get<Transaction[]>(cacheKey);
        if (cached) {
          setTransactions(cached);
          setIsCached(true);
          setLoading(false);
          setRefreshing(false);
          return;
        }
      }

      const txs = await stellar.getRecentTransactions(publicKey, limit);
      setTransactions(txs);
      setIsCached(false);

      // Store in cache
      cache.set<Transaction[]>(cacheKey, txs, CACHE_TTL.TRANSACTIONS);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [publicKey, cacheKey, limit]);

  useEffect(() => {
    if (publicKey) {
      fetchTransactions();
    }
  }, [publicKey, fetchTransactions]);

  const handleRefresh = () => {
    cache.invalidate(cacheKey);
    fetchTransactions(true);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const formatAddress = (address?: string): string => {
    if (!address) return 'N/A';
    return stellar.formatAddress(address, 4, 4);
  };

  const isOutgoing = (tx: Transaction): boolean => {
    return tx.from === publicKey;
  };

  // Loading skeleton
  if (loading) {
    return (
      <Card className="animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-2xl">📜</span>
            Tip History
          </h2>
          <div className="w-8 h-8 bg-white/5 rounded-lg animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-xl"></div>
                    <div>
                      <div className="h-4 bg-white/5 rounded w-20 mb-2"></div>
                      <div className="h-6 bg-white/5 rounded w-28"></div>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-white/5 rounded"></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-10 bg-white/5 rounded"></div>
                  <div className="h-10 bg-white/5 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-2xl">📜</span>
          Tip History
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
            title="Refresh history (force)"
          >
            <FaSync className={`text-lg ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          icon="💸"
          title="No Tips Yet"
          description="Your tip history will appear here once you start sending or receiving tips."
        />
      ) : (
        <div className="space-y-3">
          {transactions.map((tx, index) => {
            const outgoing = isOutgoing(tx);

            return (
              <div
                key={tx.id}
                className="bg-white/5 hover:bg-white/[0.08] rounded-xl p-4 transition-all border border-white/5 hover:border-white/10 animate-fadeIn"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        outgoing
                          ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20'
                          : 'bg-green-500/15 text-green-400 border border-green-500/20'
                      }`}
                    >
                      {outgoing ? <FaArrowUp /> : <FaArrowDown />}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {outgoing ? 'Tip Sent' : 'Tip Received'}
                      </p>
                      {tx.amount && (
                        <p className={`text-lg font-bold ${outgoing ? 'text-purple-400' : 'text-green-400'}`}>
                          {outgoing ? '-' : '+'}
                          {parseFloat(tx.amount).toFixed(2)} {tx.asset || 'XLM'}
                        </p>
                      )}
                    </div>
                  </div>

                  <a
                    href={stellar.getExplorerLink(tx.hash, 'tx')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400/70 hover:text-violet-400 text-sm flex items-center gap-1 transition-colors"
                  >
                    <FaExternalLinkAlt className="text-xs" />
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-white/30 text-xs mb-1">From</p>
                    <p className="text-white/70 font-mono text-xs">{formatAddress(tx.from)}</p>
                  </div>
                  <div>
                    <p className="text-white/30 text-xs mb-1">To</p>
                    <p className="text-white/70 font-mono text-xs">{formatAddress(tx.to)}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                  <p className="text-white/30 text-xs">{formatDate(tx.createdAt)}</p>
                  <p className="text-white/20 text-xs font-mono">{tx.hash.slice(0, 12)}...</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {transactions.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-white/30 text-sm">
            Showing last {transactions.length} tip{transactions.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </Card>
  );
}
