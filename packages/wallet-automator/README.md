# @vexa-sdk/wallet-automator

Smart Wallet Automator for executing actions based on liquidity events.

## Installation

```bash
pnpm add @vexa-sdk/wallet-automator
```

## Usage

```typescript
import { SolanaClient } from '@vexa-sdk/core';
import { WalletAutomator } from '@vexa-sdk/wallet-automator';

const client = new SolanaClient();
const automator = new WalletAutomator(client, process.env.PRIVATE_KEY!);

const action = { type: 'autoSend', params: { to: 'recipientAddress', amount: 1000000 } };
await automator.executeAction(action);
```

## API

### WalletAutomator

- `constructor(client: SolanaClient, privateKey: string)`
- `executeAction(action: AutomationAction, dryRun?: boolean): Promise<string | null>`
- `getPublicKey(): PublicKey`

## Supported Actions

- `autoSend`: Send SOL to an address
- `autoSwap`: Simplified token transfer (demo)
- `autoWithdrawLP`: Transfer LP tokens to cold wallet