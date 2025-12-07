import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SolanaClient } from '../SolanaClient';
import { Connection, PublicKey } from '@solana/web3.js';

// Mock @solana/web3.js
vi.mock('@solana/web3.js', () => ({
  Connection: vi.fn().mockImplementation(() => ({
    getBalance: vi.fn(),
    getConfirmedSignaturesForAddress2: vi.fn(),
    onAccountChange: vi.fn(),
    removeAccountChangeListener: vi.fn(),
  })),
  PublicKey: vi.fn().mockImplementation((key) => ({ key })),
  LAMPORTS_PER_SOL: 1000000000,
}));

describe('SolanaClient', () => {
  let client: SolanaClient;
  let mockConnection: any;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new SolanaClient();
    mockConnection = client.getConnection();
  });

  it('should initialize with default RPC URL', () => {
    expect(Connection).toHaveBeenCalledWith('https://api.devnet.solana.com', 'confirmed');
  });

  it('should initialize with custom RPC URL', () => {
    const customUrl = 'https://custom.rpc.com';
    new SolanaClient(customUrl);
    expect(Connection).toHaveBeenCalledWith(customUrl, 'confirmed');
  });

  it('should get balance', async () => {
    mockConnection.getBalance.mockResolvedValue(1000000000);
    const balance = await client.getBalance('testPubkey');
    expect(balance.lamports).toBe(1000000000);
    expect(balance.sol).toBe(1);
  });

  it('should get recent transactions', async () => {
    const mockSigs = [{ signature: 'sig1' }];
    mockConnection.getConfirmedSignaturesForAddress2.mockResolvedValue(mockSigs);
    const txs = await client.getRecentTransactions('testAddr');
    expect(txs).toEqual(mockSigs);
  });

  it('should subscribe to account changes', async () => {
    const callback = vi.fn();
    mockConnection.onAccountChange.mockResolvedValue(123);
    const unsubscribe = await client.subscribeAccount('testAccount', callback);
    expect(mockConnection.onAccountChange).toHaveBeenCalled();
    unsubscribe();
    expect(mockConnection.removeAccountChangeListener).toHaveBeenCalledWith(123);
  });
});