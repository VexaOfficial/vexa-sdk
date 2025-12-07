import 'dotenv/config';
import { SolanaClient } from '@vexa-sdk/core';
import { TokenAccountDeltaDetector } from '@vexa-sdk/liquidity-radar';
import { WalletAutomator } from '@vexa-sdk/wallet-automator';

async function main() {
  const client = new SolanaClient();
  const detector = new TokenAccountDeltaDetector(client, process.env.POOL_ADDRESS || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', 10000);
  const automator = new WalletAutomator(client, process.env.PRIVATE_KEY!);

  console.log('Starting Vexa SDK demo...');

  await detector.startMonitoring(async (event) => {
    console.log(`Liquidity event: ${event.type} ${event.amount}`);

    if (event.type === 'remove' && event.amount > 10000) {
      // Auto-send to cold wallet
      const action = {
        type: 'autoSend' as const,
        params: { to: process.env.COLD_WALLET!, amount: 1000000 }, // 0.001 SOL
      };
      const signature = await automator.executeAction(action);
      if (signature) {
        console.log(`Auto-send executed: ${signature}`);
      }
    }
  });

  process.on('SIGINT', () => {
    detector.stopMonitoring();
    process.exit(0);
  });
}

main().catch(console.error);