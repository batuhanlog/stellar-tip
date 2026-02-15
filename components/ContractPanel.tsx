/**
 * ContractPanel Component — StellarTip Yellow Belt
 * 
 * Interactive panel for Soroban smart contract interaction:
 * - Shows deployed contract info
 * - Read contract data (counter)
 * - Write to contract (increment)
 * - Display transaction status
 * - Link to Stellar Expert explorer
 */

'use client';

import { useState, useEffect } from 'react';
import { sorobanHelper, TxStatus, ContractInfo, TipRecord } from '@/lib/soroban-helper';
import TransactionStatus from './TransactionStatus';
import { FaFileContract, FaExternalLinkAlt, FaSync, FaPlay, FaCopy, FaCheck, FaChartBar } from 'react-icons/fa';
import { Card } from './example-components';

interface ContractPanelProps {
  publicKey?: string;
  isConnected: boolean;
}

export default function ContractPanel({ publicKey, isConnected }: ContractPanelProps) {
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [health, setHealth] = useState<{ status: string; latestLedger?: number } | null>(null);
  const [counterValue, setCounterValue] = useState<number>(0);
  const [txStatus, setTxStatus] = useState<TxStatus>('idle');
  const [lastTxHash, setLastTxHash] = useState<string>('');
  const [txError, setTxError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ totalCount: 0, totalVolume: 0, recentTips: [] as TipRecord[] });

  useEffect(() => {
    const info = sorobanHelper.getContractInfo();
    setContractInfo(info);
    checkHealth();
    refreshStats();
  }, []);

  const checkHealth = async () => {
    const result = await sorobanHelper.getServerHealth();
    setHealth(result);
  };

  const refreshStats = () => {
    const s = sorobanHelper.getStats();
    setStats(s);
    setCounterValue(s.totalCount);
  };

  const handleReadContract = async () => {
    setLoading(true);
    try {
      const result = await sorobanHelper.readContractCounter();
      if (result.success) {
        setCounterValue(result.counter);
      }
    } catch (error) {
      console.error('Read error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvokeContract = async () => {
    if (!publicKey) return;

    setTxError('');
    setLastTxHash('');

    try {
      const result = await sorobanHelper.invokeContract(publicKey, (status) => {
        setTxStatus(status);
      });

      if (result.success) {
        setLastTxHash(result.txHash);
        setCounterValue(result.result || counterValue + 1);
        refreshStats();
      } else {
        setTxError(result.error || 'Transaction failed');
        setTxStatus('failed');
      }
    } catch (error: any) {
      setTxError(error.message || 'Unknown error');
      setTxStatus('failed');
    }
  };

  const handleCopyContractId = async () => {
    if (!contractInfo) return;
    await navigator.clipboard.writeText(contractInfo.contractId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetTxStatus = () => {
    setTxStatus('idle');
    setTxError('');
    setLastTxHash('');
  };

  return (
    <div className="space-y-6">
      {/* Contract Info Card */}
      <Card className="animate-fadeIn">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
            <FaFileContract className="text-amber-400" />
          </span>
          Smart Contract
        </h2>

        {/* Contract Details */}
        {contractInfo && (
          <div className="space-y-4">
            {/* Contract Address */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/50 text-xs uppercase tracking-wider">Contract Address</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyContractId}
                    className="text-amber-400 hover:text-amber-300 transition-colors p-1.5 hover:bg-amber-500/10 rounded-lg"
                    title="Copy contract ID"
                  >
                    {copied ? <FaCheck className="text-green-400 text-sm" /> : <FaCopy className="text-sm" />}
                  </button>
                  <a
                    href={contractInfo.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300 transition-colors p-1.5 hover:bg-amber-500/10 rounded-lg"
                    title="View on Explorer"
                  >
                    <FaExternalLinkAlt className="text-sm" />
                  </a>
                </div>
              </div>
              <p className="text-white/80 text-xs font-mono break-all leading-relaxed">
                {contractInfo.contractId}
              </p>
            </div>

            {/* Network Info Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <p className="text-white/40 text-xs mb-1">Network</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                  <p className="text-white font-medium text-sm">{contractInfo.network}</p>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <p className="text-white/40 text-xs mb-1">RPC Status</p>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    health?.status === 'healthy' ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                  }`}></span>
                  <p className="text-white font-medium text-sm capitalize">
                    {health?.status || 'Checking...'}
                  </p>
                </div>
              </div>
            </div>

            {/* Latest Ledger */}
            {health?.latestLedger && (
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <p className="text-white/40 text-xs mb-1">Latest Ledger</p>
                <p className="text-white font-mono text-sm">#{health.latestLedger.toLocaleString()}</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Contract Interaction */}
      <Card className="animate-fadeIn delay-100">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FaChartBar className="text-amber-400" />
          Contract Interaction
        </h3>

        {/* Tip Counter Display */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-xl p-6 mb-5 text-center">
          <p className="text-white/50 text-sm mb-2">On-Chain Tip Counter</p>
          <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 mb-2">
            {counterValue}
          </div>
          <p className="text-white/30 text-xs">Total tips tracked by smart contract</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
            <p className="text-white/40 text-xs mb-1">Total Volume</p>
            <p className="text-xl font-bold text-amber-400">{stats.totalVolume.toFixed(2)}</p>
            <p className="text-white/30 text-xs">XLM</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
            <p className="text-white/40 text-xs mb-1">Tip Count</p>
            <p className="text-xl font-bold text-amber-400">{stats.totalCount}</p>
            <p className="text-white/30 text-xs">transactions</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleReadContract}
            disabled={loading}
            className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            <FaSync className={loading ? 'animate-spin' : ''} />
            Read Data
          </button>
          <button
            onClick={handleInvokeContract}
            disabled={!isConnected || txStatus !== 'idle'}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
          >
            <FaPlay />
            Increment
          </button>
        </div>

        {!isConnected && (
          <p className="text-amber-300/50 text-xs text-center mt-3">
            🔗 Connect your wallet to write to the contract
          </p>
        )}
      </Card>

      {/* Transaction Status Tracker */}
      <TransactionStatus
        status={txStatus}
        txHash={lastTxHash}
        error={txError}
        onReset={resetTxStatus}
      />

      {/* Recent Tips from Contract */}
      {stats.recentTips.length > 0 && (
        <Card className="animate-fadeIn delay-200">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            📜 Recent Contract Tips
          </h3>
          <div className="space-y-2">
            {stats.recentTips.map((tip, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white/80 text-sm font-medium">
                      {tip.amount} XLM → {tip.receiver.slice(0, 8)}...
                    </p>
                    {tip.message && (
                      <p className="text-white/40 text-xs mt-0.5">💬 {tip.message}</p>
                    )}
                  </div>
                  <span className="text-white/20 text-xs">
                    {new Date(tip.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
