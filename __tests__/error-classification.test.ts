/**
 * Error Classification Tests — StellarTip Orange Belt
 *
 * Tests the error classification system from soroban-helper.ts.
 * Verifies that different error messages are correctly classified
 * into the appropriate StellarErrorType.
 */

import { classifyError, StellarErrorType } from '@/lib/soroban-helper';

describe('Error Classification', () => {
  test('should classify "wallet not found" errors correctly', () => {
    const error1 = new Error('Wallet not found in browser');
    const error2 = new Error('No wallet extension installed');
    const error3 = new Error('Freighter wallet not installed');

    expect(classifyError(error1).type).toBe(StellarErrorType.WALLET_NOT_FOUND);
    expect(classifyError(error2).type).toBe(StellarErrorType.WALLET_NOT_FOUND);
    expect(classifyError(error3).type).toBe(StellarErrorType.WALLET_NOT_FOUND);
  });

  test('should classify "user rejected" errors correctly', () => {
    const error1 = new Error('User rejected the transaction');
    const error2 = new Error('Transaction denied by user');
    const error3 = new Error('User cancelled the operation');
    const error4 = new Error('User declined the request');
    const error5 = new Error('User refused to sign');

    expect(classifyError(error1).type).toBe(StellarErrorType.USER_REJECTED);
    expect(classifyError(error2).type).toBe(StellarErrorType.USER_REJECTED);
    expect(classifyError(error3).type).toBe(StellarErrorType.USER_REJECTED);
    expect(classifyError(error4).type).toBe(StellarErrorType.USER_REJECTED);
    expect(classifyError(error5).type).toBe(StellarErrorType.USER_REJECTED);
  });

  test('should classify "insufficient balance" errors correctly', () => {
    const error1 = new Error('Insufficient balance for transaction');
    const error2 = new Error('Account underfunded');
    const error3 = new Error('Not enough XLM to complete');

    expect(classifyError(error1).type).toBe(StellarErrorType.INSUFFICIENT_BALANCE);
    expect(classifyError(error2).type).toBe(StellarErrorType.INSUFFICIENT_BALANCE);
    expect(classifyError(error3).type).toBe(StellarErrorType.INSUFFICIENT_BALANCE);
  });

  test('should classify contract errors correctly', () => {
    const error1 = new Error('Contract execution failed');
    const error2 = new Error('Soroban invocation error');
    const error3 = new Error('WASM execution error');

    expect(classifyError(error1).type).toBe(StellarErrorType.CONTRACT_ERROR);
    expect(classifyError(error2).type).toBe(StellarErrorType.CONTRACT_ERROR);
    expect(classifyError(error3).type).toBe(StellarErrorType.CONTRACT_ERROR);
  });

  test('should classify network errors correctly', () => {
    const error1 = new Error('Network request failed');
    const error2 = new Error('Failed to fetch');
    const error3 = new Error('Connection timeout');
    const error4 = new Error('ECONNREFUSED');

    expect(classifyError(error1).type).toBe(StellarErrorType.NETWORK_ERROR);
    expect(classifyError(error2).type).toBe(StellarErrorType.NETWORK_ERROR);
    expect(classifyError(error3).type).toBe(StellarErrorType.NETWORK_ERROR);
    expect(classifyError(error4).type).toBe(StellarErrorType.NETWORK_ERROR);
  });

  test('should classify unknown errors as UNKNOWN', () => {
    const error1 = new Error('Something completely random happened');
    const error2 = new Error('');

    expect(classifyError(error1).type).toBe(StellarErrorType.UNKNOWN);
    expect(classifyError(error2).type).toBe(StellarErrorType.UNKNOWN);
  });

  test('should return proper error structure with title, message, suggestion, icon', () => {
    const error = new Error('Wallet not found');
    const classified = classifyError(error);

    expect(classified).toHaveProperty('type');
    expect(classified).toHaveProperty('title');
    expect(classified).toHaveProperty('message');
    expect(classified).toHaveProperty('suggestion');
    expect(classified).toHaveProperty('icon');
    expect(typeof classified.title).toBe('string');
    expect(typeof classified.message).toBe('string');
    expect(typeof classified.suggestion).toBe('string');
    expect(typeof classified.icon).toBe('string');
  });

  test('should handle non-Error inputs gracefully', () => {
    const stringError = 'insufficient funds';
    const objectError = { message: 'user rejected' };

    expect(classifyError(stringError).type).toBe(StellarErrorType.INSUFFICIENT_BALANCE);
    expect(classifyError(objectError).type).toBe(StellarErrorType.USER_REJECTED);
  });
});
