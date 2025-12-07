# @vexa-sdk/core

Core utilities and types for the Vexa SDK.

## Installation

```bash
pnpm add @vexa-sdk/core
```

## Usage

```typescript
import { SolanaClient } from '@vexa-sdk/core';

const client = new SolanaClient();
const balance = await client.getBalance('YourPublicKey');
console.log(`Balance: ${balance.sol} SOL`);
```

## API

### SolanaClient

- `constructor(rpcUrl?: string)`: Initialize with optional RPC URL.
- `getConnection(): Connection`: Get the underlying Solana connection.
- `getBalance(pubkey: string): Promise<{lamports: number, sol: number}>`: Get balance in lamports and SOL.
- `getRecentTransactions(address: string, limit?: number)`: Get recent transaction signatures.
- `subscribeAccount(account: string, callback: AccountChangeCallback): Promise<() => void>`: Subscribe to account changes.