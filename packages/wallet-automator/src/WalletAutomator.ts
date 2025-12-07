import { SolanaClient, AutomationAction } from '@vexa-sdk/core';
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import { transfer, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import bs58 from 'bs58';

interface AutoSendParams {
  to: string;
  amount: number;
}

interface AutoSwapParams {
  tokenMint: string;
  amount: number;
}

interface AutoWithdrawLPParams {
  poolAddress: string;
  amount: number;
}

export class WalletAutomator {
  private client: SolanaClient;
  private connection: Connection;
  private keypair: Keypair;

  constructor(client: SolanaClient, privateKey: string) {
    this.client = client;
    this.connection = client.getConnection();
    this.keypair = this.loadKeypair(privateKey);
  }

  private loadKeypair(privateKey: string): Keypair {
    try {
      // Try as base58
      const secretKey = bs58.decode(privateKey);
      return Keypair.fromSecretKey(secretKey);
    } catch {
      // Try as JSON array
      const secretKey = JSON.parse(privateKey);
      return Keypair.fromSecretKey(new Uint8Array(secretKey));
    }
  }

  async executeAction(action: AutomationAction, dryRun: boolean = false): Promise<string | null> {
    switch (action.type) {
      case 'autoSend':
        return this.autoSend(action.params as AutoSendParams, dryRun);
      case 'autoSwap':
        return this.autoSwap(action.params as AutoSwapParams, dryRun);
      case 'autoWithdrawLP':
        return this.autoWithdrawLP(action.params as AutoWithdrawLPParams, dryRun);
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  private async autoSend(params: AutoSendParams, dryRun: boolean): Promise<string | null> {
    const toPubkey = new PublicKey(params.to);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: this.keypair.publicKey,
        toPubkey,
        lamports: params.amount,
      })
    );

    if (dryRun) {
      console.log('Dry run: Would send', params.amount, 'lamports to', params.to);
      return null;
    }

    const signature = await sendAndConfirmTransaction(this.connection, transaction, [this.keypair]);
    return signature;
  }

  private async autoSwap(params: AutoSwapParams, dryRun: boolean): Promise<string | null> {
    // Simplified: transfer SPL token instead of full swap
    const mint = new PublicKey(params.tokenMint);
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      this.connection,
      this.keypair,
      mint,
      this.keypair.publicKey
    );
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      this.connection,
      this.keypair,
      mint,
      this.keypair.publicKey // For demo, send to self; adjust as needed
    );

    if (dryRun) {
      console.log('Dry run: Would swap', params.amount, 'tokens of', params.tokenMint);
      return null;
    }

    const signature = await transfer(
      this.connection,
      this.keypair,
      fromTokenAccount.address,
      toTokenAccount.address,
      this.keypair.publicKey,
      params.amount
    );
    return signature;
  }

  private async autoWithdrawLP(params: AutoWithdrawLPParams, dryRun: boolean): Promise<string | null> {
    // Placeholder: transfer LP tokens
    const mint = new PublicKey(params.poolAddress);
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
      this.connection,
      this.keypair,
      mint,
      this.keypair.publicKey
    );
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      this.connection,
      this.keypair,
      mint,
      new PublicKey(process.env.COLD_WALLET || '') // Assume env set
    );

    if (dryRun) {
      console.log('Dry run: Would withdraw', params.amount, 'LP tokens from', params.poolAddress);
      return null;
    }

    const signature = await transfer(
      this.connection,
      this.keypair,
      fromTokenAccount.address,
      toTokenAccount.address,
      this.keypair.publicKey,
      params.amount
    );
    return signature;
  }

  getPublicKey(): PublicKey {
    return this.keypair.publicKey;
  }
}