/**
 * WalletConnection Component — StellarTip
 * 
 * Handles wallet connection/disconnection with StellarTip branding.
 */

'use client';

import { useState } from 'react';
import { stellar } from '@/lib/stellar-helper';
import { FaWallet, FaCopy, FaCheck } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
import { Card } from './example-components';

interface WalletConnectionProps {
  onConnect: (publicKey: string) => void;
  onDisconnect: () => void;
}

export default function WalletConnection({ onConnect, onDisconnect }: WalletConnectionProps) {
  const [publicKey, setPublicKey] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      const key = await stellar.connectWallet();
      setPublicKey(key);
      setIsConnected(true);
      onConnect(key);
    } catch (error: any) {
      console.error('Connection error:', error);
      alert(`Failed to connect wallet:\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    stellar.disconnect();
    setPublicKey('');
    setIsConnected(false);
    onDisconnect();
  };

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isConnected) {
    return (
      <Card className="animate-fadeIn">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-4">
            <FaWallet className="text-3xl text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            Link your Stellar wallet to start sending and receiving tips instantly.
          </p>
        </div>

        <button
          onClick={handleConnect}
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 shadow-lg shadow-amber-500/20"
        >
          {loading ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-4 border-solid border-white border-r-transparent"></div>
              Connecting...
            </>
          ) : (
            <>
              <FaWallet className="text-xl" />
              Connect Wallet
            </>
          )}
        </button>

        <div className="mt-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
          <p className="text-white/70 text-sm mb-3">
            💡 <strong className="text-amber-300">Supported Wallets</strong>
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs text-white/50">
            <div>✓ Freighter</div>
            <div>✓ xBull</div>
            <div>✓ Albedo</div>
            <div>✓ Rabet</div>
            <div>✓ Lobstr</div>
            <div>✓ Hana</div>
            <div>✓ WalletConnect</div>
            <div>✓ More...</div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="animate-fadeIn">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">Wallet Connected</span>
        </div>
        <button
          onClick={handleDisconnect}
          className="text-red-400 hover:text-red-300 text-sm flex items-center gap-2 transition-colors hover:bg-red-500/10 px-3 py-1.5 rounded-lg"
        >
          <MdLogout /> Disconnect
        </button>
      </div>

      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <p className="text-white/50 text-xs mb-2 uppercase tracking-wider">Your Tip Address</p>
        <div className="flex items-center justify-between gap-3">
          <p className="text-white font-mono text-sm break-all leading-relaxed">
            {publicKey}
          </p>
          <button
            onClick={handleCopyAddress}
            className="text-amber-400 hover:text-amber-300 text-xl flex-shrink-0 transition-colors p-2 hover:bg-amber-500/10 rounded-lg"
            title={copied ? 'Copied!' : 'Copy address'}
          >
            {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
          </button>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <a
          href={stellar.getExplorerLink(publicKey, 'account')}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 hover:text-amber-300 text-sm transition-colors"
        >
          View on Explorer →
        </a>
      </div>
    </Card>
  );
}
