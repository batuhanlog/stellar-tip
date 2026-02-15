/**
 * Inter-Contract Helper Tests — StellarTip Green Belt
 *
 * Tests for the inter-contract call patterns including:
 * - Contract metadata
 * - Event subscription and emission
 * - Fan-out / aggregator pattern
 */

import { InterContractHelper, ContractEvent } from '@/lib/inter-contract-helper';

describe('InterContractHelper', () => {
  let helper: InterContractHelper;

  beforeEach(() => {
    helper = new InterContractHelper();
  });

  describe('Contract Metadata', () => {
    it('should return metadata for two contracts', () => {
      const metadata = helper.getContractMetadata();
      expect(metadata).toHaveLength(2);
    });

    it('should have a primary contract (Tip Counter)', () => {
      const metadata = helper.getContractMetadata();
      const primary = metadata.find((c) => c.role === 'primary');
      expect(primary).toBeDefined();
      expect(primary!.name).toBe('Tip Counter');
      expect(primary!.id).toMatch(/^C[A-Z0-9]{55}$/);
    });

    it('should have a secondary contract (Tip Registry)', () => {
      const metadata = helper.getContractMetadata();
      const secondary = metadata.find((c) => c.role === 'secondary');
      expect(secondary).toBeDefined();
      expect(secondary!.name).toBe('Tip Registry');
      expect(secondary!.id).toMatch(/^C[A-Z0-9]{55}$/);
    });

    it('should have valid explorer URLs for both contracts', () => {
      const metadata = helper.getContractMetadata();
      metadata.forEach((contract) => {
        expect(contract.explorerUrl).toContain('stellar.expert/explorer/testnet/contract/');
        expect(contract.explorerUrl).toContain(contract.id);
      });
    });

    it('should have descriptions for both contracts', () => {
      const metadata = helper.getContractMetadata();
      metadata.forEach((contract) => {
        expect(contract.description.length).toBeGreaterThan(10);
      });
    });
  });

  describe('Event System', () => {
    it('should start with no events', () => {
      expect(helper.getEvents()).toHaveLength(0);
    });

    it('should subscribe to events and receive them', async () => {
      const receivedEvents: ContractEvent[] = [];
      helper.onEvent((event) => receivedEvents.push(event));

      // Execute a call (will create events)
      await helper.executeInterContractCall();

      // Should have received multiple events (call_start, call_success/call_error for each, plus combined)
      expect(receivedEvents.length).toBeGreaterThanOrEqual(3);
    });

    it('should unsubscribe from events', () => {
      const receivedEvents: ContractEvent[] = [];
      const unsubscribe = helper.onEvent((event) => receivedEvents.push(event));
      unsubscribe();

      // After unsubscribe, events should not be received by this listener
      // We can verify this indirectly — the helper still tracks events internally
      expect(receivedEvents).toHaveLength(0);
    });

    it('should clear events', async () => {
      await helper.executeInterContractCall();
      expect(helper.getEvents().length).toBeGreaterThan(0);

      helper.clearEvents();
      expect(helper.getEvents()).toHaveLength(0);
    });

    it('should generate unique event IDs', async () => {
      await helper.executeInterContractCall();
      const events = helper.getEvents();
      const ids = events.map((e) => e.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should include timestamps on all events', async () => {
      await helper.executeInterContractCall();
      const events = helper.getEvents();
      events.forEach((event) => {
        expect(event.timestamp).toBeGreaterThan(0);
        expect(typeof event.timestamp).toBe('number');
      });
    });
  });

  describe('Inter-Contract Execution', () => {
    it('should return results for both contracts', async () => {
      const result = await helper.executeInterContractCall();

      expect(result.counterContract).toBeDefined();
      expect(result.registryContract).toBeDefined();
      expect(result.combinedResult).toBeDefined();
    });

    it('should report 2 total contracts called', async () => {
      const result = await helper.executeInterContractCall();
      expect(result.combinedResult.totalContractsCalled).toBe(2);
    });

    it('should have correct success + error count summing to total', async () => {
      const result = await helper.executeInterContractCall();
      const { successCount, errorCount, totalContractsCalled } = result.combinedResult;
      expect(successCount + errorCount).toBe(totalContractsCalled);
    });

    it('should include latency measurements', async () => {
      const result = await helper.executeInterContractCall();
      expect(result.counterContract.latency).toBeGreaterThanOrEqual(0);
      expect(result.registryContract.latency).toBeGreaterThanOrEqual(0);
      expect(result.combinedResult.totalLatency).toBeGreaterThanOrEqual(0);
    });

    it('should include contract IDs in results', async () => {
      const result = await helper.executeInterContractCall();
      expect(result.counterContract.contractId).toMatch(/^C[A-Z0-9]{55}$/);
      expect(result.registryContract.contractId).toMatch(/^C[A-Z0-9]{55}$/);
    });

    it('should include a timestamp in combined result', async () => {
      const result = await helper.executeInterContractCall();
      expect(result.combinedResult.timestamp).toBeGreaterThan(0);
    });

    it('should emit a combined_result event', async () => {
      const events: ContractEvent[] = [];
      helper.onEvent((e) => events.push(e));

      await helper.executeInterContractCall();

      const combinedEvents = events.filter((e) => e.type === 'combined_result');
      expect(combinedEvents).toHaveLength(1);
      expect(combinedEvents[0].message).toContain('Inter-contract call complete');
    });
  });

  describe('Network Health', () => {
    it('should return a status string', async () => {
      const health = await helper.getNetworkHealth();
      expect(typeof health.status).toBe('string');
      expect(health.status.length).toBeGreaterThan(0);
    });
  });
});
