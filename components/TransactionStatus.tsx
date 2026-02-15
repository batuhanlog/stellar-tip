/**
 * TransactionStatus Component — StellarTip Yellow Belt
 * 
 * Visual transaction status tracker showing pending → success/fail states
 * with smooth animations and progress indication.
 */

'use client';

import { useState, useEffect } from 'react';
import { TxStatus, TX_STATUS_MAP } from '@/lib/soroban-helper';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaExternalLinkAlt } from 'react-icons/fa';

interface TransactionStatusProps {
  status: TxStatus;
  txHash?: string;
  error?: string;
  onReset?: () => void;
}

const STATUS_STEPS: TxStatus[] = ['preparing', 'signing', 'submitting', 'confirming', 'success'];

export default function TransactionStatus({ status, txHash, error, onReset }: TransactionStatusProps) {
  const [showDetails, setShowDetails] = useState(false);

  const currentStepIndex = STATUS_STEPS.indexOf(status);
  const isActive = status !== 'idle';
  const isComplete = status === 'success';
  const isFailed = status === 'failed';

  if (!isActive) return null;

  return (
    <div className="glass rounded-2xl p-6 animate-fadeInScale">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30">
            📡
          </span>
          Transaction Status
        </h3>
        {(isComplete || isFailed) && onReset && (
          <button
            onClick={onReset}
            className="text-white/40 hover:text-white/70 text-sm transition-colors px-3 py-1 rounded-lg hover:bg-white/5"
          >
            Dismiss
          </button>
        )}
      </div>

      {/* Status Steps */}
      <div className="space-y-3 mb-6">
        {STATUS_STEPS.map((step, index) => {
          const info = TX_STATUS_MAP[step];
          const isCurrentStep = step === status;
          const isPastStep = currentStepIndex > index;
          const isFutureStep = !isPastStep && !isCurrentStep;

          return (
            <div
              key={step}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-500 ${
                isCurrentStep
                  ? 'bg-violet-500/10 border border-violet-500/30'
                  : isPastStep
                  ? 'bg-green-500/5 border border-green-500/10'
                  : 'bg-white/[0.02] border border-white/[0.04]'
              }`}
            >
              {/* Step Icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                isPastStep
                  ? 'bg-green-500/20 text-green-400'
                  : isCurrentStep
                  ? 'bg-violet-500/20 text-violet-400'
                  : 'bg-white/5 text-white/20'
              }`}>
                {isPastStep ? (
                  <FaCheckCircle className="text-lg" />
                ) : isCurrentStep ? (
                  <FaSpinner className="text-lg animate-spin" />
                ) : (
                  <span className="text-sm font-bold">{index + 1}</span>
                )}
              </div>

              {/* Step Info */}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm transition-colors ${
                  isPastStep
                    ? 'text-green-400'
                    : isCurrentStep
                    ? 'text-violet-300'
                    : 'text-white/20'
                }`}>
                  {info.label}
                </p>
                <p className={`text-xs mt-0.5 transition-colors ${
                  isPastStep
                    ? 'text-green-400/60'
                    : isCurrentStep
                    ? 'text-violet-200/60'
                    : 'text-white/10'
                }`}>
                  {isCurrentStep ? info.description : isPastStep ? 'Complete' : 'Waiting'}
                </p>
              </div>

              {/* Status Indicator */}
              {isPastStep && (
                <span className="text-green-400 text-xs font-medium">✓</span>
              )}
              {isCurrentStep && (
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/5 rounded-full h-2 mb-4 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ease-out ${
            isFailed
              ? 'bg-gradient-to-r from-red-500 to-red-600'
              : isComplete
              ? 'bg-gradient-to-r from-green-400 to-emerald-500'
              : 'bg-gradient-to-r from-violet-400 to-purple-500'
          }`}
          style={{
            width: isFailed ? '100%' : `${Math.max(((currentStepIndex + 1) / STATUS_STEPS.length) * 100, 10)}%`,
          }}
        />
      </div>

      {/* Failed State */}
      {isFailed && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-fadeIn">
          <div className="flex items-start gap-3">
            <FaTimesCircle className="text-red-400 text-xl flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-semibold">Transaction Failed</p>
              <p className="text-red-300/60 text-sm mt-1">{error || 'An unknown error occurred'}</p>
              {onReset && (
                <button
                  onClick={onReset}
                  className="mt-3 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                >
                  ← Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success State */}
      {isComplete && txHash && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl animate-fadeIn">
          <div className="flex items-start gap-3">
            <FaCheckCircle className="text-green-400 text-xl flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-green-400 font-semibold">Transaction Confirmed! 🎉</p>
              <div className="mt-2">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-white/40 hover:text-white/60 text-xs transition-colors"
                >
                  {showDetails ? 'Hide' : 'Show'} Transaction Hash
                </button>
                {showDetails && (
                  <p className="text-white/50 text-xs font-mono break-all mt-2 p-2 bg-white/5 rounded-lg">
                    {txHash}
                  </p>
                )}
              </div>
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-sm text-violet-400 hover:text-violet-300 transition-colors"
              >
                View on Explorer <FaExternalLinkAlt className="text-xs" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
