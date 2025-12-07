#!/usr/bin/env node

import { Command } from 'commander';
import { SolanaClient } from '@vexa-sdk/core';
import { TokenAccountDeltaDetector } from '../TokenAccountDeltaDetector';

const program = new Command();

program
  .name('vexa-watch')
  .description('Watch liquidity changes for a pool')
  .option('--pool <address>', 'Pool token account address', 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v') // Example USDC mint
  .option('--threshold <number>', 'Threshold for liquidity change detection', '10000')
  .action(async (options) => {
    const client = new SolanaClient();
    const detector = new TokenAccountDeltaDetector(client, options.pool, parseInt(options.threshold));

    console.log(`Starting liquidity radar for pool: ${options.pool}`);

    await detector.startMonitoring((event) => {
      console.log(`Liquidity ${event.type}: ${event.amount} tokens (${event.usdValue?.toFixed(2) || 'N/A'} USD)`);
    });

    // Keep running
    process.on('SIGINT', () => {
      console.log('Stopping radar...');
      detector.stopMonitoring();
      process.exit(0);
    });
  });

program.parse();