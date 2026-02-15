/**
 * PaymentForm Component — StellarTip
 * 
 * "Send a Tip" form with quick amount buttons and confirmation modal.
 */

'use client';

import { useState } from 'react';
import { stellar } from '@/lib/stellar-helper';
import { FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { Card, Input, Alert } from './example-components';
import { TransactionConfirmation } from './BonusFeatures';

interface PaymentFormProps {
  publicKey: string;
  onSuccess?: () => void;
}

const QUICK_AMOUNTS = ['1', '5', '10', '25', '50'];

export default function PaymentForm({ publicKey, onSuccess }: PaymentFormProps) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ recipient?: string; amount?: string }>({});
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [txHash, setTxHash] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { recipient?: string; amount?: string } = {};

    if (!recipient.trim()) {
      newErrors.recipient = 'Recipient address is required';
    } else if (recipient.length !== 56 || !recipient.startsWith('G')) {
      newErrors.recipient = 'Invalid Stellar address (must start with G and be 56 characters)';
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        newErrors.amount = 'Amount must be a positive number';
      } else if (numAmount < 0.0000001) {
        newErrors.amount = 'Amount is too small (minimum: 0.0000001 XLM)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowConfirm(true);
  };

  const handleConfirmedSend = async () => {
    setShowConfirm(false);
    try {
      setLoading(true);
      setAlert(null);
      setTxHash('');

      const result = await stellar.sendPayment({
        from: publicKey,
        to: recipient,
        amount: amount,
        memo: memo || undefined,
      });

      if (result.success) {
        setTxHash(result.hash);
        setAlert({ type: 'success', message: 'Tip sent successfully! 🎉' });
        setRecipient('');
        setAmount('');
        setMemo('');
        setErrors({});
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      let errorMessage = 'Failed to send tip. ';
      if (error.message.includes('insufficient')) {
        errorMessage += 'Insufficient balance.';
      } else if (error.message.includes('destination')) {
        errorMessage += 'Invalid destination account.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }
      setAlert({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="animate-fadeIn">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
            <FaPaperPlane className="text-amber-400" />
          </span>
          Send a Tip
        </h2>

        {alert && (
          <div className="mb-4">
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
          </div>
        )}

        {txHash && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl animate-fadeInScale">
            <div className="flex items-start gap-3">
              <FaCheckCircle className="text-green-400 text-xl flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-green-400 font-semibold mb-2">Tip Confirmed! ✨</p>
                <p className="text-white/60 text-sm mb-2">Transaction Hash:</p>
                <p className="text-white/80 text-xs font-mono break-all mb-3">{txHash}</p>
                <a
                  href={stellar.getExplorerLink(txHash, 'tx')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 text-sm transition-colors"
                >
                  View on Stellar Expert →
                </a>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Recipient Address"
            placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            value={recipient}
            onChange={setRecipient}
            error={errors.recipient}
          />

          <div>
            <Input
              label="Tip Amount (XLM)"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={setAmount}
              error={errors.amount}
            />
            {/* Quick Amount Buttons */}
            <div className="flex flex-wrap gap-2 mt-3">
              {QUICK_AMOUNTS.map((qa) => (
                <button
                  key={qa}
                  type="button"
                  onClick={() => setAmount(qa)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    amount === qa
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20'
                      : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {qa} XLM
                </button>
              ))}
            </div>
          </div>

          <Input
            label="💬 Tip Message (Memo)"
            placeholder="Great work! Keep it up..."
            value={memo}
            onChange={setMemo}
          />

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-amber-500/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-4 border-solid border-white border-r-transparent"></div>
                  Sending Tip...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FaPaperPlane />
                  Send Tip
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/15 rounded-xl">
          <p className="text-amber-200/70 text-xs">
            ⚠️ <strong>Double-check</strong> the recipient address. Blockchain transactions are irreversible!
          </p>
        </div>
      </Card>

      {/* Confirmation Modal */}
      <TransactionConfirmation
        isOpen={showConfirm}
        onConfirm={handleConfirmedSend}
        onCancel={() => setShowConfirm(false)}
        recipient={recipient}
        amount={amount}
        memo={memo}
      />
    </>
  );
}
