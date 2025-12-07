#!/usr/bin/env node

import { Command } from 'commander';
import { SolanaClient } from '@vexa-sdk/core';
import { TokenAccountDeltaDetector } from '@vexa-sdk/liquidity-radar';
import { WalletAutomator } from '@vexa-sdk/wallet-automator';
import * as fs from 'fs-extra';

const program = new Command();

program
  .name('vexa')
  .description('Vexa SDK CLI')
  .version('1.0.0');

program
  .command('watch')
  .description('Watch liquidity changes for a pool')
  .option('--pool <address>', 'Pool address')
  .option('--threshold <number>', 'Threshold', '10000')
  .action(async (options: { pool?: string; threshold?: string }) => {
    const client = new SolanaClient();
    const detector = new TokenAccountDeltaDetector(client, options.pool || '', parseInt(options.threshold || '10000'));

    console.log(`Watching pool: ${options.pool}`);

    await detector.startMonitoring((event: any) => {
      console.log(JSON.stringify(event));
    });

    process.on('SIGINT', () => {
      detector.stopMonitoring();
      process.exit(0);
    });
  });

program
  .command('run-rule')
  .description('Run automation rule from JSON file')
  .argument('<file>', 'Rule JSON file')
  .option('--dry-run', 'Dry run mode')
  .action(async (file: string, options: { dryRun?: boolean }) => {
    const rule = await fs.readJson(file);
    const client = new SolanaClient();
    const automator = new WalletAutomator(client, process.env.PRIVATE_KEY!);

    for (const action of rule.actions) {
      const result = await automator.executeAction(action, !!options.dryRun);
      if (result) {
        console.log(`Action executed: ${result}`);
      }
    }
  });

program.parse();