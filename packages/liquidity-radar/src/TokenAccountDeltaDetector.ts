import { SolanaClient, LiquidityEvent } from '@vexa-sdk/core';
import { PublicKey, Connection } from '@solana/web3.js';
import { getAccount, getMint } from '@solana/spl-token';
import fetch from 'node-fetch';

export class TokenAccountDeltaDetector {
  private client: SolanaClient;
  private connection: Connection;
  private poolAddress: string;
  private threshold: number;
  private intervalId?: NodeJS.Timeout;
  private lastBalance: number = 0;

  constructor(client: SolanaClient, poolAddress: string, threshold: number = 10000) {
    this.client = client;
    this.connection = client.getConnection();
    this.poolAddress = poolAddress;
    this.threshold = threshold;
  }

  async startMonitoring(onEvent: (event: LiquidityEvent) => void): Promise<void> {
    const publicKey = new PublicKey(this.poolAddress);
    this.lastBalance = await this.getTokenBalance(publicKey);

    this.intervalId = setInterval(async () => {
      try {
        const currentBalance = await this.getTokenBalance(publicKey);
        const delta = currentBalance - this.lastBalance;

        if (Math.abs(delta) > this.threshold) {
          const usdValue = await this.getUsdValue(delta);
          const event: LiquidityEvent = {
            type: delta > 0 ? 'add' : 'remove',
            poolAddress: this.poolAddress,
            amount: Math.abs(delta),
            usdValue,
            timestamp: Date.now(),
          };
          onEvent(event);
        }

        this.lastBalance = currentBalance;
      } catch (error) {
        console.error('Error monitoring token account:', error);
      }
    }, 5000); // Poll every 5 seconds
  }

  stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  private async getTokenBalance(publicKey: PublicKey): Promise<number> {
    const account = await getAccount(this.connection, publicKey);
    return Number(account.amount);
  }

  private async getUsdValue(amount: number): Promise<number | undefined> {
    try {
      // Simple SOL price fetch as fallback
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      const data = await response.json() as any;
      const solPrice = data.solana.usd;
      // Assume amount is in lamports for simplicity; adjust based on token
      return (amount / 1000000000) * solPrice;
    } catch {
      return undefined;
    }
  }
}