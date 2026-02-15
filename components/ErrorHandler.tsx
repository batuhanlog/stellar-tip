/**
 * ErrorHandler Component — StellarTip Yellow Belt
 * 
 * Demonstrates 3+ error types visually:
 * 1. Wallet Not Found
 * 2. User Rejected Transaction
 * 3. Insufficient Balance
 * 4. Contract Error
 * 5. Network Error
 */

'use client';

import { useState } from 'react';
import {
  StellarErrorType,
  StellarError,
  ERROR_MAP,
  classifyError,
} from '@/lib/soroban-helper';
import { FaExclamationTriangle, FaTimes, FaLightbulb, FaShieldAlt } from 'react-icons/fa';

interface ErrorHandlerProps {
  error?: StellarError | null;
  onDismiss?: () => void;
  showDemo?: boolean;
}

function ErrorCard({ error, onDismiss }: { error: StellarError; onDismiss?: () => void }) {
  const bgColors: Record<StellarErrorType, string> = {
    [StellarErrorType.WALLET_NOT_FOUND]: 'from-purple-500/10 to-purple-600/5 border-purple-500/20',
    [StellarErrorType.USER_REJECTED]: 'from-yellow-500/10 to-violet-600/5 border-yellow-500/20',
    [StellarErrorType.INSUFFICIENT_BALANCE]: 'from-red-500/10 to-red-600/5 border-red-500/20',
    [StellarErrorType.CONTRACT_ERROR]: 'from-blue-500/10 to-blue-600/5 border-blue-500/20',
    [StellarErrorType.NETWORK_ERROR]: 'from-gray-500/10 to-gray-600/5 border-gray-500/20',
    [StellarErrorType.UNKNOWN]: 'from-white/10 to-white/5 border-white/20',
  };

  const textColors: Record<StellarErrorType, string> = {
    [StellarErrorType.WALLET_NOT_FOUND]: 'text-purple-400',
    [StellarErrorType.USER_REJECTED]: 'text-yellow-400',
    [StellarErrorType.INSUFFICIENT_BALANCE]: 'text-red-400',
    [StellarErrorType.CONTRACT_ERROR]: 'text-blue-400',
    [StellarErrorType.NETWORK_ERROR]: 'text-gray-400',
    [StellarErrorType.UNKNOWN]: 'text-white/70',
  };

  return (
    <div className={`bg-gradient-to-r ${bgColors[error.type]} border rounded-2xl p-5 animate-fadeInScale transition-all hover:scale-[1.01]`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="text-3xl flex-shrink-0 mt-0.5">{error.icon}</div>
          <div>
            <h4 className={`font-bold text-base ${textColors[error.type]}`}>
              {error.title}
            </h4>
            <p className="text-white/60 text-sm mt-1 leading-relaxed">
              {error.message}
            </p>
            <div className="flex items-start gap-2 mt-3 p-2.5 bg-white/5 rounded-lg">
              <FaLightbulb className="text-violet-400 text-sm flex-shrink-0 mt-0.5" />
              <p className="text-violet-200/70 text-xs leading-relaxed">
                {error.suggestion}
              </p>
            </div>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0 p-1"
          >
            <FaTimes />
          </button>
        )}
      </div>
    </div>
  );
}

export default function ErrorHandler({ error, onDismiss, showDemo = false }: ErrorHandlerProps) {
  const [demoErrors, setDemoErrors] = useState<StellarErrorType[]>([]);
  const [activeError, setActiveError] = useState<StellarError | null>(null);

  const triggerDemoError = (type: StellarErrorType) => {
    const err: StellarError = { type, ...ERROR_MAP[type] };
    setActiveError(err);
    if (!demoErrors.includes(type)) {
      setDemoErrors(prev => [...prev, type]);
    }
  };

  const dismissError = () => {
    setActiveError(null);
    if (onDismiss) onDismiss();
  };

  // If an external error is passed, show it
  if (error && !showDemo) {
    return (
      <div className="animate-fadeIn">
        <ErrorCard error={error} onDismiss={onDismiss} />
      </div>
    );
  }

  // Demo mode — interactive error demonstration
  if (!showDemo) return null;

  return (
    <div className="glass rounded-2xl p-6 animate-fadeIn">
      <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30">
          <FaShieldAlt className="text-violet-400 text-sm" />
        </span>
        Error Handling Demo
      </h3>
      <p className="text-white/40 text-sm mb-5">
        StellarTip handles common blockchain errors gracefully. Click to simulate:
      </p>

      {/* Error Type Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {[
          { type: StellarErrorType.WALLET_NOT_FOUND, label: 'Wallet Not Found', emoji: '🦊', color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:border-purple-400/50' },
          { type: StellarErrorType.USER_REJECTED, label: 'User Rejected', emoji: '✋', color: 'from-yellow-500/20 to-violet-600/10 border-yellow-500/30 hover:border-yellow-400/50' },
          { type: StellarErrorType.INSUFFICIENT_BALANCE, label: 'Low Balance', emoji: '💸', color: 'from-red-500/20 to-red-600/10 border-red-500/30 hover:border-red-400/50' },
        ].map((item) => (
          <button
            key={item.type}
            onClick={() => triggerDemoError(item.type)}
            className={`bg-gradient-to-br ${item.color} border rounded-xl p-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98] group`}
          >
            <div className="text-2xl mb-2">{item.emoji}</div>
            <p className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
              {item.label}
            </p>
            {demoErrors.includes(item.type) && (
              <span className="inline-block mt-1 text-xs text-green-400/70">✓ Tested</span>
            )}
          </button>
        ))}
      </div>

      {/* Active Error Display */}
      {activeError && (
        <div className="mt-4">
          <ErrorCard error={activeError} onDismiss={dismissError} />
        </div>
      )}

      {/* Progress */}
      <div className="mt-5 pt-4 border-t border-white/[0.06]">
        <div className="flex items-center justify-between">
          <p className="text-white/30 text-xs">
            Error types tested: {demoErrors.length}/3
          </p>
          <div className="flex gap-1.5">
            {[StellarErrorType.WALLET_NOT_FOUND, StellarErrorType.USER_REJECTED, StellarErrorType.INSUFFICIENT_BALANCE].map((type) => (
              <div
                key={type}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  demoErrors.includes(type) ? 'bg-green-400' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Export for use in other components
export { ErrorCard };
