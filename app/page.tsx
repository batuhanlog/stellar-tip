/**
 * StellarTip — Main Page
 * 
 * A decentralized micropayment/tipping platform on Stellar testnet.
 * Yellow Belt: Soroban smart contract integration, error handling, tx status tracking.
 * Orange Belt: Loading states, caching, tests, complete documentation.
 * Green Belt: Inter-contract calls, event streaming, CI/CD, mobile responsive.
 * 
 * All blockchain logic is in lib/stellar-helper.ts (DO NOT MODIFY)
 * Soroban contract logic is in lib/soroban-helper.ts
 * Inter-contract logic is in lib/inter-contract-helper.ts (NEW — Green Belt)
 * Caching logic is in lib/cache-helper.ts
 */

'use client';

import { useState, useEffect } from 'react';
import WalletConnection from '@/components/WalletConnection';
import BalanceDisplay from '@/components/BalanceDisplay';
import PaymentForm from '@/components/PaymentForm';
import TransactionHistory from '@/components/TransactionHistory';
import ContractPanel from '@/components/ContractPanel';
import ErrorHandler from '@/components/ErrorHandler';
import EventStream from '@/components/EventStream';
import { ThemeToggle, TipLinkGenerator } from '@/components/BonusFeatures';

// Global loading overlay for transaction processing
function TransactionLoadingOverlay({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="glass rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl border border-violet-500/20">
        {/* Animated spinner */}
        <div className="relative w-16 h-16 mx-auto mb-5">
          <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-400 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        </div>
        <h3 className="text-white font-bold text-lg mb-2">Processing Transaction</h3>
        <p className="text-white/50 text-sm">Please wait while your tip is being processed...</p>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"
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
      <div className="h-full bg-gradient-to-r from-violet-400 via-purple-400 to-violet-400 animate-progress-bar"></div>
    </div>
  );
}

export default function Home() {
  const [publicKey, setPublicKey] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'tips' | 'contract' | 'events' | 'errors'>('tips');
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
    <div className="min-h-screen" style={{background: '#0f0f13'}}>
      {/* Top progress bar */}
      <TopProgressBar isActive={isProcessing} />

      {/* Transaction loading overlay */}
      <TransactionLoadingOverlay isVisible={isProcessing} />

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full blur-[140px]" style={{background: 'rgba(106,0,255,0.12)'}}></div>
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full blur-[120px]" style={{background: 'rgba(198,94,255,0.06)'}}></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px]" style={{background: 'rgba(106,0,255,0.06)'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-md" style={{borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(15,15,19,0.85)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-lg" style={{background: 'linear-gradient(135deg, #6a00ff, #c65eff)', boxShadow: '0 4px 20px rgba(198,94,255,0.3)'}}>
                💰
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{color: '#f5f5f5'}}>
                  Stellar<span style={{color: '#c65eff'}}>Tip</span>
                </h1>
                <p className="text-xs hidden sm:block" style={{color: 'rgba(245,245,245,0.4)'}}>Instant tips on Stellar blockchain</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Blue Belt Badge */}
              <div className="hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1" style={{background: 'rgba(198,94,255,0.1)', border: '1px solid rgba(198,94,255,0.3)'}}>
                <span className="text-sm">🔵</span>
                <span className="text-xs font-bold" style={{color: '#c65eff'}}>Blue Belt</span>
              </div>
              <ThemeToggle />
              <a
                href="https://stellar.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:block text-sm transition-colors hover:opacity-80"
                style={{color: 'rgba(245,245,245,0.4)'}}
              >
                About Stellar
              </a>
              <a
                href="https://github.com/batuhanlog/stellar-tip"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:block text-sm transition-colors hover:opacity-80"
                style={{color: 'rgba(245,245,245,0.4)'}}
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
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6" style={{background: 'rgba(198,94,255,0.08)', border: '1px solid rgba(198,94,255,0.2)'}}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{background: '#c65eff'}}></span>
                <span className="text-sm font-medium" style={{color: 'rgba(198,94,255,0.9)'}}>Live on Stellar Testnet</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight leading-tight" style={{color: '#f5f5f5'}}>
                Send Tips,<br />
                <span style={{background: 'linear-gradient(135deg, #6a00ff, #c65eff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
                  Instantly & Free
                </span>
              </h2>
              <p className="max-w-xl mx-auto text-lg leading-relaxed" style={{color: 'rgba(245,245,245,0.5)'}}>
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
                    <span className="text-violet-500/50 text-xs font-bold uppercase tracking-widest">Step {item.step}</span>
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
            <div className="glass rounded-2xl p-1.5 sm:p-2 flex gap-1 sm:gap-2 overflow-x-auto">
              {[
                { id: 'tips' as const, label: '💸 Tips', desc: 'Send & History' },
                { id: 'contract' as const, label: '📜 Contract', desc: 'Soroban' },
                { id: 'events' as const, label: '🔗 Events', desc: 'Inter-Contract' },
                { id: 'errors' as const, label: '🛡️ Errors', desc: 'Error Demo' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-0 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/20'
                      : 'text-white/50 hover:text-white/70 hover:bg-white/5'
                  }`}
                >
                  <span className="block truncate">{tab.label}</span>
                  <span className={`block text-[10px] sm:text-xs mt-0.5 truncate ${
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

            {activeTab === 'events' && (
              <div className="animate-fadeIn">
                <EventStream />
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
      <footer className="relative z-10 mt-16" style={{borderTop: '1px solid rgba(255,255,255,0.06)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">💰</span>
              <span className="text-sm font-medium" style={{color: 'rgba(245,245,245,0.4)'}}>
                Stellar<span style={{color: 'rgba(198,94,255,0.6)'}}>Tip</span>
              </span>
              <span className="text-xs ml-2" style={{color: 'rgba(245,245,245,0.2)'}}>🔵 Blue Belt</span>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-sm" style={{color: 'rgba(245,245,245,0.3)'}}>
                Built with ❤️ for the <span style={{color: 'rgba(198,94,255,0.6)'}}>Rise In Stellar Journey</span>
              </p>
              <p className="text-xs mt-1" style={{color: 'rgba(245,245,245,0.2)'}}>
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
