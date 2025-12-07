import { Connection, PublicKey, LAMPORTS_PER_SOL, AccountChangeCallback } from '@solana/web3.js';
import pRetry from 'p-retry';

export class SolanaClient {
  private connection: Connection;

  constructor(rpcUrl?: string) {
    const url = rpcUrl || process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
    this.connection = new Connection(url, 'confirmed');
  }

  getConnection(): Connection {
    return this.connection;
  }

  async getBalance(pubkey: string): Promise<{ lamports: number; sol: number }> {
    const publicKey = new PublicKey(pubkey);
    const lamports = await pRetry(() => this.connection.getBalance(publicKey), { retries: 3 });
    return {
      lamports,
      sol: lamports / LAMPORTS_PER_SOL,
    };
  }

  async getRecentTransactions(address: string, limit: number = 10): Promise<any[]> {
    const publicKey = new PublicKey(address);
    const signatures = await pRetry(
      () => this.connection.getConfirmedSignaturesForAddress2(publicKey, { limit }),
      { retries: 3 }
    );
    return signatures;
  }

  async subscribeAccount(
    account: string,
    callback: AccountChangeCallback
  ): Promise<() => void> {
    const publicKey = new PublicKey(account);
    const subscriptionId = await this.connection.onAccountChange(publicKey, callback);
    return () => {
      this.connection.removeAccountChangeListener(subscriptionId);
    };
  }
}