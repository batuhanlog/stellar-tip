/**
 * BalanceDisplay Component — StellarTip
 * 
 * Displays the user's XLM balance as a "Tip Jar" with visual flair.
 */

'use client';

import { useState, useEffect } from 'react';
import { stellar } from '@/lib/stellar-helper';
import { FaSync } from 'react-icons/fa';
import { Card } from './example-components';
import { AddressQRCode } from './BonusFeatures';

interface BalanceDisplayProps {
  publicKey: string;
}

export default function BalanceDisplay({ publicKey }: BalanceDisplayProps) {
  const [balance, setBalance] = useState<string>('0');
  const [assets, setAssets] = useState<Array<{ code: string; issuer: string; balance: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBalance = async () => {
    try {
      setRefreshing(true);
      const balanceData = await stellar.getBalance(publicKey);
      setBalance(balanceData.xlm);
      setAssets(balanceData.assets);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (publicKey) {
      fetchBalance();
    }
  }, [publicKey]);

  const formatBalance = (bal: string): string => {
    const num = parseFloat(bal);
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 7,
    });
  };

  if (loading) {
    return (
      <Card className="animate-fadeIn">
        <div className="animate-pulse">
          <div className="h-8 bg-white/5 rounded-lg mb-4 w-1/3"></div>
          <div className="h-20 bg-white/5 rounded-xl mb-4"></div>
          <div className="h-10 bg-white/5 rounded-lg w-1/2"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="animate-fadeIn overflow-hidden relative">
      {/* Decorative background glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between mb-6 relative z-10">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="text-3xl">🫙</span>
          Tip Jar
        </h2>
        <button
          onClick={fetchBalance}
          disabled={refreshing}
          className="text-amber-400 hover:text-amber-300 disabled:opacity-50 transition-colors p-2 hover:bg-amber-500/10 rounded-lg"
          title="Refresh balance"
        >
          <FaSync className={`text-lg ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Main XLM Balance */}
      <div className="bg-gradient-to-br from-amber-500/15 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6 mb-5 relative z-10">
        <p className="text-amber-300/80 text-sm mb-2 uppercase tracking-wider font-medium">Available Balance</p>
        <div className="flex items-baseline gap-2">
          <p className="text-5xl font-bold text-white tracking-tight">
            {formatBalance(balance)}
          </p>
          <p className="text-2xl text-amber-400 font-semibold">XLM</p>
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
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-center">
          <p className="text-orange-400 text-xs uppercase tracking-wider mb-1">Tips Sent</p>
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
      <div className="mt-5 p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl relative z-10">
        <p className="text-amber-200/70 text-xs">
          💡 <strong>Tip:</strong> Keep at least 1 XLM for network reserves. Share your address to receive tips!
        </p>
      </div>
    </Card>
  );
}
