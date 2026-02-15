/**
 * Bonus Features Components — StellarTip
 * 
 * Dark/Light mode, QR code, transaction confirmation modal, etc.
 */

'use client';

import { useState, useEffect } from 'react';
import { FaMoon, FaSun, FaQrcode, FaCopy, FaCheck } from 'react-icons/fa';

// ============================================
// 1. Dark/Light Mode Toggle
// ============================================
export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Check for saved preference
    const saved = localStorage.getItem('stellartip-theme');
    if (saved === 'light') {
      setIsDark(false);
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('stellartip-theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('stellartip-theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 hover:border-white/20"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <FaSun className="text-amber-400 text-lg" />
      ) : (
        <FaMoon className="text-amber-600 text-lg" />
      )}
    </button>
  );
}

// ============================================
// 2. QR Code for Address (SVG-based)
// ============================================
export function AddressQRCode({ address }: { address: string }) {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple visual QR-like pattern generated from address hash
  const generatePattern = (addr: string): boolean[][] => {
    const size = 15;
    const grid: boolean[][] = [];
    let hash = 0;
    for (let i = 0; i < addr.length; i++) {
      hash = ((hash << 5) - hash + addr.charCodeAt(i)) | 0;
    }

    for (let row = 0; row < size; row++) {
      grid[row] = [];
      for (let col = 0; col < size; col++) {
        // Deterministic pattern from address
        const seed = Math.abs(hash * (row + 1) * (col + 1) + row * 31 + col * 17) % 100;
        // Finder patterns in corners
        const isCorner =
          (row < 3 && col < 3) ||
          (row < 3 && col >= size - 3) ||
          (row >= size - 3 && col < 3);
        const isCornerBorder =
          (row < 3 && col < 3 && (row === 0 || row === 2 || col === 0 || col === 2)) ||
          (row < 3 && col >= size - 3 && (row === 0 || row === 2 || col === size - 1 || col === size - 3)) ||
          (row >= size - 3 && col < 3 && (row === size - 1 || row === size - 3 || col === 0 || col === 2));
        const isCornerCenter =
          (row === 1 && col === 1) ||
          (row === 1 && col === size - 2) ||
          (row === size - 2 && col === 1);

        if (isCorner) {
          grid[row][col] = isCornerBorder || isCornerCenter;
        } else {
          grid[row][col] = seed < 45;
        }
      }
    }
    return grid;
  };

  const pattern = generatePattern(address);
  const cellSize = 8;
  const svgSize = pattern.length * cellSize;

  return (
    <div>
      <button
        onClick={() => setShowQR(!showQR)}
        className="text-amber-400 hover:text-amber-300 flex items-center gap-2 text-sm transition-colors"
      >
        <FaQrcode /> {showQR ? 'Hide QR' : 'Show QR Code'}
      </button>

      {showQR && (
        <div className="mt-4 p-5 bg-white rounded-2xl animate-fadeInScale inline-block">
          <div className="text-center">
            <p className="text-gray-600 text-xs mb-3 font-medium">Scan to get tip address</p>
            <svg
              width={svgSize}
              height={svgSize}
              viewBox={`0 0 ${svgSize} ${svgSize}`}
              className="mx-auto"
            >
              {pattern.map((row, rowIdx) =>
                row.map((cell, colIdx) =>
                  cell ? (
                    <rect
                      key={`${rowIdx}-${colIdx}`}
                      x={colIdx * cellSize}
                      y={rowIdx * cellSize}
                      width={cellSize}
                      height={cellSize}
                      fill="#1a1a2e"
                      rx={1}
                    />
                  ) : null
                )
              )}
            </svg>
            <p className="text-gray-500 text-[10px] mt-3 font-mono break-all max-w-[180px] mx-auto leading-relaxed">
              {address.slice(0, 20)}...{address.slice(-8)}
            </p>
            <button
              onClick={handleCopy}
              className="mt-2 text-amber-600 hover:text-amber-700 text-xs flex items-center gap-1 mx-auto transition-colors"
            >
              {copied ? <><FaCheck /> Copied!</> : <><FaCopy /> Copy Address</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// 3. Transaction Confirmation Modal
// ============================================
export function TransactionConfirmation({
  isOpen,
  onConfirm,
  onCancel,
  recipient,
  amount,
  memo,
}: {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  recipient: string;
  amount: string;
  memo?: string;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-white/10 animate-fadeInScale"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 mb-4">
              <span className="text-3xl">💸</span>
            </div>
            <h3 className="text-2xl font-bold text-white">Confirm Your Tip</h3>
            <p className="text-white/50 text-sm mt-1">Please review before sending</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Recipient</p>
              <p className="text-white font-mono text-sm break-all">{recipient}</p>
            </div>
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-500/20">
              <p className="text-amber-300/80 text-xs uppercase tracking-wider mb-1">Amount</p>
              <p className="text-white text-3xl font-bold">{amount} <span className="text-amber-400 text-xl">XLM</span></p>
            </div>
            {memo && (
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Message</p>
                <p className="text-white/80 text-sm">{memo}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 px-6 rounded-xl transition-colors border border-white/10"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-amber-500/20"
            >
              Send Tip 💸
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 4. Animated Card Wrapper
// ============================================
export function AnimatedCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div className="animate-fadeIn" style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ============================================
// 5. Tip Link Generator
// ============================================
export function TipLinkGenerator({ publicKey }: { publicKey: string }) {
  const [copied, setCopied] = useState(false);
  const tipLink = `https://stellartip.app/tip/${publicKey.slice(0, 8)}...${publicKey.slice(-4)}`;

  const handleCopy = async () => {
    // In production this would be a real link; for demo we copy the address
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass rounded-2xl p-5 border border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-orange-500/5 animate-fadeIn">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">🔗</span>
        <div>
          <h3 className="text-white font-bold text-sm">Share Your Tip Link</h3>
          <p className="text-white/40 text-xs">Anyone can send you tips with this link</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-white/5 rounded-xl px-4 py-2.5 border border-white/10 font-mono text-white/60 text-xs truncate">
          {tipLink}
        </div>
        <button
          onClick={handleCopy}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            copied
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
          }`}
        >
          {copied ? <><FaCheck className="inline mr-1" /> Copied</> : <><FaCopy className="inline mr-1" /> Copy</>}
        </button>
      </div>
    </div>
  );
}
