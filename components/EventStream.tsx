/**
 * EventStream Component — StellarTip Green Belt
 *
 * Real-time event listener for contract events.
 * Displays events as a live feed/notification stream.
 * Includes auto-refresh mechanism and inter-contract call visualization.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  interContractHelper,
  InterContractResult,
  ContractEvent,
  ContractMetadata,
} from '@/lib/inter-contract-helper';

// ─── Event Badge ─────────────────────────────────────────────────
function EventBadge({ type }: { type: ContractEvent['type'] }) {
  const styles: Record<ContractEvent['type'], { bg: string; text: string; label: string }> = {
    call_start: { bg: 'bg-blue-500/10 border-blue-500/30', text: 'text-blue-300', label: '📡 CALL' },
    call_success: { bg: 'bg-green-500/10 border-green-500/30', text: 'text-green-300', label: '✅ OK' },
    call_error: { bg: 'bg-red-500/10 border-red-500/30', text: 'text-red-300', label: '❌ ERR' },
    combined_result: { bg: 'bg-purple-500/10 border-purple-500/30', text: 'text-purple-300', label: '🔗 RESULT' },
  };

  const style = styles[type];

  return (
    <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full border ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
}

// ─── Event Item ──────────────────────────────────────────────────
function EventItem({ event, isNew }: { event: ContractEvent; isNew: boolean }) {
  const timeStr = new Date(event.timestamp).toLocaleTimeString();

  return (
    <div
      className={`p-3 sm:p-4 rounded-xl border transition-all duration-500 ${
        isNew
          ? 'bg-amber-500/10 border-amber-500/30 animate-fadeIn'
          : 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <EventBadge type={event.type} />
          <span className="text-white/30 text-xs font-mono">{timeStr}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white/80 text-sm leading-relaxed break-words">{event.message}</p>
          {event.contractId !== 'N/A' && (
            <p className="text-white/25 text-xs font-mono mt-1 truncate">
              {event.contractId}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Contract Card ───────────────────────────────────────────────
function ContractCard({ contract }: { contract: ContractMetadata }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 sm:p-4 hover:bg-white/[0.06] transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
        <span className="text-lg">{contract.role === 'primary' ? '🏦' : '📋'}</span>
        <div className="min-w-0 flex-1">
          <h4 className="text-white font-semibold text-sm">{contract.name}</h4>
          <span
            className={`inline-block text-xs font-bold px-1.5 py-0.5 rounded mt-0.5 ${
              contract.role === 'primary'
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
            }`}
          >
            {contract.role.toUpperCase()}
          </span>
        </div>
      </div>
      <p className="text-white/40 text-xs leading-relaxed mb-2">{contract.description}</p>
      <p className="text-white/20 text-xs font-mono truncate">{contract.id}</p>
      <a
        href={contract.explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-2 text-amber-400/70 hover:text-amber-300 text-xs transition-colors"
      >
        View on Explorer →
      </a>
    </div>
  );
}

// ─── Result Summary ──────────────────────────────────────────────
function ResultSummary({ result }: { result: InterContractResult }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-center">
        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Contracts</p>
        <p className="text-white text-xl font-bold">{result.combinedResult.totalContractsCalled}</p>
      </div>
      <div className="bg-green-500/5 border border-green-500/15 rounded-xl p-3 text-center">
        <p className="text-green-400/60 text-xs uppercase tracking-wider mb-1">Success</p>
        <p className="text-green-400 text-xl font-bold">{result.combinedResult.successCount}</p>
      </div>
      <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-3 text-center">
        <p className="text-red-400/60 text-xs uppercase tracking-wider mb-1">Errors</p>
        <p className="text-red-400 text-xl font-bold">{result.combinedResult.errorCount}</p>
      </div>
      <div className="bg-purple-500/5 border border-purple-500/15 rounded-xl p-3 text-center">
        <p className="text-purple-400/60 text-xs uppercase tracking-wider mb-1">Latency</p>
        <p className="text-purple-400 text-xl font-bold">{result.combinedResult.totalLatency}<span className="text-sm">ms</span></p>
      </div>
    </div>
  );
}

// ─── Main EventStream Component ──────────────────────────────────
export default function EventStream() {
  const [events, setEvents] = useState<ContractEvent[]>([]);
  const [latestResult, setLatestResult] = useState<InterContractResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [newEventIds, setNewEventIds] = useState<Set<string>>(new Set());
  const autoRefreshRef = useRef<NodeJS.Timeout | null>(null);
  const contracts = interContractHelper.getContractMetadata();

  // Subscribe to events
  useEffect(() => {
    const unsubscribe = interContractHelper.onEvent((event) => {
      setEvents((prev) => [event, ...prev].slice(0, 50)); // Keep last 50
      setNewEventIds((prev) => new Set(prev).add(event.id));

      // Clear "new" highlight after 3 seconds
      setTimeout(() => {
        setNewEventIds((prev) => {
          const next = new Set(prev);
          next.delete(event.id);
          return next;
        });
      }, 3000);
    });

    return unsubscribe;
  }, []);

  // Auto-refresh mechanism
  useEffect(() => {
    if (autoRefresh) {
      autoRefreshRef.current = setInterval(() => {
        executeCall();
      }, 15000); // Every 15 seconds
    } else if (autoRefreshRef.current) {
      clearInterval(autoRefreshRef.current);
      autoRefreshRef.current = null;
    }

    return () => {
      if (autoRefreshRef.current) {
        clearInterval(autoRefreshRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh]);

  const executeCall = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    try {
      const result = await interContractHelper.executeInterContractCall();
      setLatestResult(result);
    } catch (error) {
      console.error('Inter-contract call failed:', error);
    } finally {
      setIsRunning(false);
    }
  }, [isRunning]);

  const clearAll = () => {
    interContractHelper.clearEvents();
    setEvents([]);
    setLatestResult(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="glass rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl">🔗</span>
              Inter-Contract Calls
            </h2>
            <p className="text-white/40 text-xs sm:text-sm mt-1">
              Fan-out pattern: Call multiple Soroban contracts in parallel and aggregate results
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Auto-refresh toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                autoRefresh
                  ? 'bg-green-500/10 border-green-500/30 text-green-300'
                  : 'bg-white/5 border-white/10 text-white/40 hover:text-white/60'
              }`}
            >
              {autoRefresh ? '⏹ Auto' : '▶ Auto'}
            </button>
            {/* Execute button */}
            <button
              onClick={executeCall}
              disabled={isRunning}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs sm:text-sm rounded-xl hover:shadow-lg hover:shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isRunning ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Running...
                </span>
              ) : (
                '🚀 Execute Call'
              )}
            </button>
          </div>
        </div>

        {/* Contract Cards */}
        <div className="grid sm:grid-cols-2 gap-3">
          {contracts.map((contract) => (
            <ContractCard key={contract.id} contract={contract} />
          ))}
        </div>
      </div>

      {/* Result Summary */}
      {latestResult && (
        <div className="glass rounded-2xl p-4 sm:p-6">
          <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <span>📊</span> Latest Result
          </h3>
          <ResultSummary result={latestResult} />
        </div>
      )}

      {/* Live Event Stream */}
      <div className="glass rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${autoRefresh || isRunning ? 'bg-green-400 animate-ping' : 'bg-white/30'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${autoRefresh || isRunning ? 'bg-green-400' : 'bg-white/30'}`}></span>
            </span>
            Event Stream
            {events.length > 0 && (
              <span className="text-white/30 text-xs font-normal">({events.length} events)</span>
            )}
          </h3>
          {events.length > 0 && (
            <button
              onClick={clearAll}
              className="text-white/30 hover:text-white/50 text-xs transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {events.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <span className="text-4xl sm:text-5xl mb-4 block">📡</span>
            <p className="text-white/40 text-sm">No events yet</p>
            <p className="text-white/25 text-xs mt-1">
              Click "Execute Call" to trigger inter-contract calls
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 sm:max-h-96 overflow-y-auto pr-1 custom-scrollbar">
            {events.map((event) => (
              <EventItem
                key={event.id}
                event={event}
                isNew={newEventIds.has(event.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Architecture Diagram */}
      <div className="glass rounded-2xl p-4 sm:p-6">
        <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
          <span>🏗️</span> Inter-Contract Architecture
        </h3>
        <div className="bg-black/30 rounded-xl p-3 sm:p-4 font-mono text-xs overflow-x-auto">
          <pre className="text-white/60 leading-relaxed whitespace-pre text-[10px] sm:text-xs">
{`┌─────────────────────────────────────────────┐
│              StellarTip Frontend              │
│           (Inter-Contract Helper)             │
└──────────┬───────────────────┬───────────────┘
           │                   │
    ┌──────▼──────┐    ┌──────▼──────┐
    │  Contract A │    │  Contract B │
    │ Tip Counter │    │ Tip Registry│
    │  (Primary)  │    │ (Secondary) │
    └──────┬──────┘    └──────┬──────┘
           │                   │
    ┌──────▼───────────────────▼──────┐
    │        Soroban RPC (Testnet)     │
    │     soroban-testnet.stellar.org  │
    └──────────────────────────────────┘`}
          </pre>
        </div>
        <p className="text-white/30 text-xs mt-3 leading-relaxed">
          <strong className="text-white/50">Pattern:</strong> Fan-out / Aggregator — Both contracts are called in parallel,
          and results are aggregated. This pattern is used in production DeFi protocols for multi-pool queries,
          cross-chain bridges, and composable contract systems.
        </p>
      </div>
    </div>
  );
}
