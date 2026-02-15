/**
 * Example Components — shared UI primitives for StellarTip
 */

'use client';

import { useState } from 'react';

// Loading Spinner
export function LoadingSpinner() {
  return (
    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
}

// Balance Card
export function BalanceCard({ balance, label }: { balance: string; label: string }) {
  return (
    <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-6 shadow-lg">
      <p className="text-white/80 text-sm mb-2">{label}</p>
      <p className="text-4xl font-bold text-white">{balance}</p>
    </div>
  );
}

// Transaction Item
export function TransactionItem({
  type,
  amount,
  asset,
  date,
  hash,
  explorerLink,
}: {
  type: string;
  amount?: string;
  asset?: string;
  date: string;
  hash: string;
  explorerLink: string;
}) {
  return (
    <div className="bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-white font-semibold">
            {type === 'payment' ? '💸' : '📝'} {type}
          </p>
          {amount && (
            <p className="text-white/80">
              {amount} {asset || 'XLM'}
            </p>
          )}
        </div>
        <a
          href={explorerLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-400 hover:text-violet-300 text-sm"
        >
          View →
        </a>
      </div>
      <div className="flex justify-between text-xs text-white/50">
        <span>{new Date(date).toLocaleString()}</span>
        <span className="font-mono">{hash.slice(0, 8)}...</span>
      </div>
    </div>
  );
}

// Copy to Clipboard Button
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} className="text-violet-400 hover:text-violet-300 text-sm">
      {copied ? '✓ Copied!' : '📋 Copy'}
    </button>
  );
}

// Alert/Toast Component
export function Alert({
  type,
  message,
  onClose,
}: {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
}) {
  const colors = {
    success: 'bg-green-500/90 border border-green-400/30',
    error: 'bg-red-500/90 border border-red-400/30',
    info: 'bg-violet-500/90 border border-violet-400/30',
  };

  return (
    <div className={`${colors[type]} text-white px-6 py-4 rounded-xl shadow-lg flex justify-between items-center backdrop-blur-sm`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white/80 hover:text-white">✕</button>
    </div>
  );
}

// Card Component
export function Card({ title, children, className = '' }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-2xl p-6 shadow-2xl ${className}`}>
      {title && <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>}
      {children}
    </div>
  );
}

// Input Component
export function Input({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-white/80 text-sm mb-2 font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}

// Button Component
export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  fullWidth?: boolean;
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 shadow-lg shadow-violet-500/20',
    secondary: 'bg-white/10 hover:bg-white/20 border border-white/20',
    danger: 'bg-red-600 hover:bg-red-700',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]} ${fullWidth ? 'w-full' : ''} text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

// Empty State Component
export function EmptyState({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-white text-xl font-semibold mb-2">{title}</h3>
      <p className="text-white/60">{description}</p>
    </div>
  );
}

// Modal Component
export function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-white/10" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white text-2xl transition-colors">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
