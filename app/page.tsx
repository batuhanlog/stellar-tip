/**
 * StellarTip — Main Page
 * 
 * A decentralized micropayment/tipping platform on Stellar testnet.
 * Yellow Belt: Soroban smart contract integration, error handling, tx status tracking.
 * Orange Belt: Loading states, caching, tests, complete documentation.
 * 
 * All blockchain logic is in lib/stellar-helper.ts (DO NOT MODIFY)
 * Soroban contract logic is in lib/soroban-helper.ts
 * Caching logic is in lib/cache-helper.ts (NEW — Orange Belt)
 */

'use client';

import { useState, useEffect } from 'react';
import WalletConnection from '@/components/WalletConnection';
import BalanceDisplay from '@/components/BalanceDisplay';
import PaymentForm from '@/components/PaymentForm';
import TransactionHistory from '@/components/TransactionHistory';
import ContractPanel from '@/components/ContractPanel';
import ErrorHandler from '@/components/ErrorHandler';
import { ThemeToggle, TipLinkGenerator } from '@/components/BonusFeatures';

// Global loading overlay for transaction processing
function TransactionLoadingOverlay({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="glass rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl border border-amber-500/20">
        {/* Animated spinner */}
        <div className="relative w-16 h-16 mx-auto mb-5">
          <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-400 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-orange-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        </div>
        <h3 className="text-white font-bold text-lg mb-2">Processing Transaction</h3>
        <p className="text-white/50 text-sm">Please wait while your tip is being processed...</p>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Progress bar that shows at the top of the page
function TopProgressBar({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1">
      <div className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 animate-progress-bar"></div>
    </div>
  );
}

export default function Home() {
  const [publicKey, setPublicKey] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'tips' | 'contract' | 'errors'>('tips');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConnect = (key: string) => {
    setPublicKey(key);
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setPublicKey('');
    setIsConnected(false);
  };

  const handlePaymentSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-warm-gradient">
      {/* Top progress bar */}
      <TopProgressBar isActive={isProcessing} />

      {/* Transaction loading overlay */}
      <TransactionLoadingOverlay isVisible={isProcessing} />

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-amber-500/[0.07] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-500/[0.05] rounded-full blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.06] backdrop-blur-md bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-amber-500/20">
                💰
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Stellar<span className="text-amber-400">Tip</span>
                </h1>
                <p className="text-white/40 text-xs hidden sm:block">Instant tips on Stellar blockchain</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Orange Belt Badge */}
              <div className="hidden sm:flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/30 rounded-full px-3 py-1">
                <span className="text-sm">🥋</span>
                <span className="text-orange-400 text-xs font-bold">Orange Belt</span>
              </div>
              <ThemeToggle />
              <a
                href="https://stellar.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:block text-white/40 hover:text-white/70 text-sm transition-colors"
              >
                About Stellar
              </a>
              <a
                href="https://github.com/batuhanlog/stellar-tip"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:block text-white/40 hover:text-white/70 text-sm transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Section — Not Connected */}
        {!isConnected && (
          <div className="mb-10 animate-fadeIn">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                <span className="text-amber-300 text-sm font-medium">Live on Stellar Testnet</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-tight">
                Send Tips,<br />
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  Instantly & Free
                </span>
              </h2>
              <p className="text-white/50 max-w-xl mx-auto text-lg leading-relaxed">
                A decentralized micropayment platform powered by Stellar.
                Send tips in seconds with near-zero fees.
              </p>
            </div>

            {/* Wallet Connection */}
            <div className="max-w-lg mx-auto mb-12">
              <WalletConnection onConnect={handleConnect} onDisconnect={handleDisconnect} />
            </div>

            {/* How It Works */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: '🦊', step: '01', title: 'Install a Wallet', desc: 'Choose any Stellar wallet — Freighter, xBull, Lobstr, and more.' },
                { icon: '🔗', step: '02', title: 'Connect', desc: 'Click connect and approve the connection from your wallet.' },
                { icon: '💧', step: '03', title: 'Get Testnet XLM', desc: 'Use the Friendbot to fund your testnet account for free.' },
                { icon: '💸', step: '04', title: 'Send Tips', desc: 'Enter an address, pick an amount, and tip instantly!' },
              ].map((item, i) => (
                <div
                  key={item.step}
                  className="glass rounded-2xl p-5 animate-fadeIn group hover:bg-white/[0.08] transition-all"
                  style={{ animationDelay: `${i * 100 + 200}ms` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="text-amber-500/50 text-xs font-bold uppercase tracking-widest">Step {item.step}</span>
                  </div>
                  <h3 className="text-white font-semibold mb-1.5">{item.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              {[
                { icon: '⚡', title: 'Lightning Fast', desc: 'Transactions settle in 3-5 seconds on the Stellar network.' },
                { icon: '🪙', title: 'Near-Zero Fees', desc: 'Transaction fees are just 0.00001 XLM — practically free.' },
                { icon: '📜', title: 'Smart Contracts', desc: 'On-chain tip tracking with Soroban smart contracts.' },
              ].map((item, i) => (
                <div
                  key={item.title}
                  className="glass rounded-2xl p-5 text-center animate-fadeIn"
                  style={{ animationDelay: `${i * 100 + 600}ms` }}
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="text-white font-semibold mb-1.5">{item.title}</h3>
                  <p className="text-white/40 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Error Handling Demo (visible without wallet) */}
            <div className="mt-10">
              <ErrorHandler showDemo={true} />
            </div>

            {/* Contract Info Preview */}
            <div className="mt-6">
              <ContractPanel isConnected={false} />
            </div>
          </div>
        )}

        {/* Connected Dashboard */}
        {isConnected && publicKey && (
          <div className="space-y-6">
            {/* Top Bar: Wallet + Tip Link */}
            <div className="grid lg:grid-cols-2 gap-6">
              <WalletConnection onConnect={handleConnect} onDisconnect={handleDisconnect} />
              <TipLinkGenerator publicKey={publicKey} />
            </div>

            {/* Balance */}
            <div key={`balance-${refreshKey}`}>
              <BalanceDisplay publicKey={publicKey} />
            </div>

            {/* Tab Navigation */}
            <div className="glass rounded-2xl p-2 flex gap-2">
              {[
                { id: 'tips' as const, label: '💸 Tips', desc: 'Send & History' },
                { id: 'contract' as const, label: '📜 Contract', desc: 'Soroban' },
                { id: 'errors' as const, label: '🛡️ Errors', desc: 'Error Demo' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20'
                      : 'text-white/50 hover:text-white/70 hover:bg-white/5'
                  }`}
                >
                  <span className="block">{tab.label}</span>
                  <span className={`block text-xs mt-0.5 ${
                    activeTab === tab.id ? 'text-white/80' : 'text-white/30'
                  }`}>{tab.desc}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'tips' && (
              <div className="grid lg:grid-cols-2 gap-6 animate-fadeIn">
                <PaymentForm publicKey={publicKey} onSuccess={handlePaymentSuccess} />
                <div key={`history-${refreshKey}`}>
                  <TransactionHistory publicKey={publicKey} />
                </div>
              </div>
            )}

            {activeTab === 'contract' && (
              <div className="animate-fadeIn">
                <ContractPanel publicKey={publicKey} isConnected={true} />
              </div>
            )}

            {activeTab === 'errors' && (
              <div className="animate-fadeIn">
                <ErrorHandler showDemo={true} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">💰</span>
              <span className="text-white/40 text-sm font-medium">
                Stellar<span className="text-amber-500/60">Tip</span>
              </span>
              <span className="text-white/20 text-xs ml-2">🥋 Orange Belt</span>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-white/30 text-sm">
                Built with ❤️ for the <span className="text-amber-400/50">Rise In Stellar Journey</span>
              </p>
              <p className="text-white/20 text-xs mt-1">
                ⚠️ Testnet only — do not use real funds
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* CSS for progress bar animation */}
      <style jsx>{`
        @keyframes progress-bar {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 70%; margin-left: 15%; }
          100% { width: 0%; margin-left: 100%; }
        }
        .animate-progress-bar {
          animation: progress-bar 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
