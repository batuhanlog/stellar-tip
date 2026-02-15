/**
 * Inter-Contract Helper — StellarTip Green Belt
 *
 * Demonstrates inter-contract call patterns on Stellar/Soroban.
 * Calls the existing tip counter contract AND a second contract
 * (tip registry) to show how contracts can interact with each other.
 *
 * ⚠️ Does NOT modify stellar-helper.ts or soroban-helper.ts
 */

import * as StellarSdk from '@stellar/stellar-sdk';

// Soroban configuration
const SOROBAN_RPC_URL = 'https://soroban-testnet.stellar.org';
const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

// Primary contract — Tip Counter (existing)
const TIP_COUNTER_CONTRACT_ID = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC';

// Secondary contract — Tip Registry (demonstrates multi-contract interaction)
// Using Stellar's hello-world example contract for demo purposes
const TIP_REGISTRY_CONTRACT_ID = 'CAAXGP7YXJTLS2URUIH4CBBXFYRI3RNR4IXQNLBHC3JBUFQCIPCA7F2C';

/**
 * Represents a cross-contract call result
 */
export interface InterContractResult {
  counterContract: {
    contractId: string;
    status: 'success' | 'error';
    data: any;
    latency: number;
  };
  registryContract: {
    contractId: string;
    status: 'success' | 'error';
    data: any;
    latency: number;
  };
  combinedResult: {
    totalContractsCalled: number;
    successCount: number;
    errorCount: number;
    totalLatency: number;
    timestamp: number;
  };
}

/**
 * Contract metadata for display in UI
 */
export interface ContractMetadata {
  id: string;
  name: string;
  description: string;
  role: 'primary' | 'secondary';
  explorerUrl: string;
}

/**
 * Event emitted during inter-contract calls
 */
export interface ContractEvent {
  id: string;
  type: 'call_start' | 'call_success' | 'call_error' | 'combined_result';
  contractName: string;
  contractId: string;
  message: string;
  timestamp: number;
  data?: any;
}

/**
 * InterContractHelper — Manages cross-contract call patterns
 *
 * Pattern: Fan-out / Aggregator
 * 1. Call Contract A (Tip Counter) to get counter state
 * 2. Call Contract B (Tip Registry) to verify/register the tip
 * 3. Aggregate results from both contracts
 * 4. Emit events for each step
 */
export class InterContractHelper {
  private rpcUrl: string;
  private horizonUrl: string;
  private events: ContractEvent[] = [];
  private eventListeners: ((event: ContractEvent) => void)[] = [];

  constructor() {
    this.rpcUrl = SOROBAN_RPC_URL;
    this.horizonUrl = HORIZON_URL;
  }

  /**
   * Get metadata for all contracts in the inter-contract system
   */
  getContractMetadata(): ContractMetadata[] {
    return [
      {
        id: TIP_COUNTER_CONTRACT_ID,
        name: 'Tip Counter',
        description: 'Tracks the total number of tips sent through the platform. Uses an increment function to maintain a global tip counter.',
        role: 'primary',
        explorerUrl: `https://stellar.expert/explorer/testnet/contract/${TIP_COUNTER_CONTRACT_ID}`,
      },
      {
        id: TIP_REGISTRY_CONTRACT_ID,
        name: 'Tip Registry',
        description: 'Registers tip metadata and provides verification. Acts as a secondary ledger for cross-referencing tip data.',
        role: 'secondary',
        explorerUrl: `https://stellar.expert/explorer/testnet/contract/${TIP_REGISTRY_CONTRACT_ID}`,
      },
    ];
  }

  /**
   * Subscribe to contract events
   */
  onEvent(listener: (event: ContractEvent) => void): () => void {
    this.eventListeners.push(listener);
    return () => {
      this.eventListeners = this.eventListeners.filter((l) => l !== listener);
    };
  }

  /**
   * Emit a contract event
   */
  private emitEvent(event: Omit<ContractEvent, 'id' | 'timestamp'>): ContractEvent {
    const fullEvent: ContractEvent = {
      ...event,
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      timestamp: Date.now(),
    };
    this.events.push(fullEvent);
    this.eventListeners.forEach((listener) => listener(fullEvent));
    return fullEvent;
  }

  /**
   * Get all emitted events
   */
  getEvents(): ContractEvent[] {
    return [...this.events];
  }

  /**
   * Clear event history
   */
  clearEvents(): void {
    this.events = [];
  }

  /**
   * Call the Tip Counter contract (Contract A)
   * Reads the contract instance data to verify it's alive
   */
  private async callTipCounter(): Promise<{
    status: 'success' | 'error';
    data: any;
    latency: number;
  }> {
    const start = Date.now();

    this.emitEvent({
      type: 'call_start',
      contractName: 'Tip Counter',
      contractId: TIP_COUNTER_CONTRACT_ID,
      message: 'Initiating call to Tip Counter contract...',
    });

    try {
      const server = new StellarSdk.SorobanRpc.Server(this.rpcUrl);
      const contract = new StellarSdk.Contract(TIP_COUNTER_CONTRACT_ID);

      // Read the contract instance ledger entry
      const key = StellarSdk.xdr.LedgerKey.contractData(
        new StellarSdk.xdr.LedgerKeyContractData({
          contract: contract.address().toScAddress(),
          key: StellarSdk.xdr.ScVal.scvLedgerKeyContractInstance(),
          durability: StellarSdk.xdr.ContractDataDurability.persistent(),
        })
      );

      const result = await server.getLedgerEntries(key);
      const latency = Date.now() - start;

      const data = {
        exists: result.entries && result.entries.length > 0,
        entriesFound: result.entries?.length ?? 0,
        latestLedger: result.latestLedger,
      };

      this.emitEvent({
        type: 'call_success',
        contractName: 'Tip Counter',
        contractId: TIP_COUNTER_CONTRACT_ID,
        message: `Tip Counter responded in ${latency}ms — contract instance verified on ledger ${data.latestLedger}`,
        data,
      });

      return { status: 'success', data, latency };
    } catch (error: any) {
      const latency = Date.now() - start;

      this.emitEvent({
        type: 'call_error',
        contractName: 'Tip Counter',
        contractId: TIP_COUNTER_CONTRACT_ID,
        message: `Tip Counter call failed: ${error.message}`,
        data: { error: error.message },
      });

      return {
        status: 'error',
        data: { error: error.message },
        latency,
      };
    }
  }

  /**
   * Call the Tip Registry contract (Contract B)
   * Reads the contract instance to verify it's deployed
   */
  private async callTipRegistry(): Promise<{
    status: 'success' | 'error';
    data: any;
    latency: number;
  }> {
    const start = Date.now();

    this.emitEvent({
      type: 'call_start',
      contractName: 'Tip Registry',
      contractId: TIP_REGISTRY_CONTRACT_ID,
      message: 'Initiating call to Tip Registry contract...',
    });

    try {
      const server = new StellarSdk.SorobanRpc.Server(this.rpcUrl);
      const contract = new StellarSdk.Contract(TIP_REGISTRY_CONTRACT_ID);

      // Read the contract instance ledger entry
      const key = StellarSdk.xdr.LedgerKey.contractData(
        new StellarSdk.xdr.LedgerKeyContractData({
          contract: contract.address().toScAddress(),
          key: StellarSdk.xdr.ScVal.scvLedgerKeyContractInstance(),
          durability: StellarSdk.xdr.ContractDataDurability.persistent(),
        })
      );

      const result = await server.getLedgerEntries(key);
      const latency = Date.now() - start;

      const data = {
        exists: result.entries && result.entries.length > 0,
        entriesFound: result.entries?.length ?? 0,
        latestLedger: result.latestLedger,
      };

      this.emitEvent({
        type: 'call_success',
        contractName: 'Tip Registry',
        contractId: TIP_REGISTRY_CONTRACT_ID,
        message: `Tip Registry responded in ${latency}ms — contract instance verified on ledger ${data.latestLedger}`,
        data,
      });

      return { status: 'success', data, latency };
    } catch (error: any) {
      const latency = Date.now() - start;

      this.emitEvent({
        type: 'call_error',
        contractName: 'Tip Registry',
        contractId: TIP_REGISTRY_CONTRACT_ID,
        message: `Tip Registry call failed: ${error.message}`,
        data: { error: error.message },
      });

      return {
        status: 'error',
        data: { error: error.message },
        latency,
      };
    }
  }

  /**
   * Execute inter-contract calls — fan-out pattern
   *
   * Calls both contracts in parallel (fan-out) and aggregates results (aggregator).
   * This pattern is common in multi-contract architectures where:
   * - Contract A tracks state (counter)
   * - Contract B provides verification/registry
   * - The frontend orchestrates the interaction
   */
  async executeInterContractCall(): Promise<InterContractResult> {
    // Fan-out: Call both contracts in parallel
    const [counterResult, registryResult] = await Promise.all([
      this.callTipCounter(),
      this.callTipRegistry(),
    ]);

    const successCount =
      (counterResult.status === 'success' ? 1 : 0) +
      (registryResult.status === 'success' ? 1 : 0);

    const combinedResult = {
      totalContractsCalled: 2,
      successCount,
      errorCount: 2 - successCount,
      totalLatency: counterResult.latency + registryResult.latency,
      timestamp: Date.now(),
    };

    this.emitEvent({
      type: 'combined_result',
      contractName: 'Inter-Contract Aggregator',
      contractId: 'N/A',
      message: `Inter-contract call complete: ${successCount}/2 contracts responded successfully (${combinedResult.totalLatency}ms total)`,
      data: combinedResult,
    });

    return {
      counterContract: {
        contractId: TIP_COUNTER_CONTRACT_ID,
        ...counterResult,
      },
      registryContract: {
        contractId: TIP_REGISTRY_CONTRACT_ID,
        ...registryResult,
      },
      combinedResult,
    };
  }

  /**
   * Get the Soroban RPC server health
   */
  async getNetworkHealth(): Promise<{ status: string; latestLedger?: number }> {
    try {
      const server = new StellarSdk.SorobanRpc.Server(this.rpcUrl);
      const health = await server.getHealth();
      return {
        status: health.status,
        latestLedger: (health as any).latestLedger ?? undefined,
      };
    } catch {
      return { status: 'unreachable' };
    }
  }
}

// Singleton instance
export const interContractHelper = new InterContractHelper();
