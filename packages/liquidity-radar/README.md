# @vexa-sdk/liquidity-radar

Liquidity Pulse Radar for monitoring pool liquidity changes.

## Installation

```bash
pnpm add @vexa-sdk/liquidity-radar
```

## Usage

### CLI

```bash
vexa-watch --pool <POOL_ADDRESS> --threshold 10000
```

### Programmatic

```typescript
import { SolanaClient } from '@vexa-sdk/core';
import { TokenAccountDeltaDetector } from '@vexa-sdk/liquidity-radar';

const client = new SolanaClient();
const detector = new TokenAccountDeltaDetector(client, 'poolAddress', 10000);

detector.startMonitoring((event) => {
  console.log(`Liquidity event: ${event.type} ${event.amount}`);
});
```

## API

### TokenAccountDeltaDetector

- `constructor(client: SolanaClient, poolAddress: string, threshold?: number)`
- `startMonitoring(onEvent: (event: LiquidityEvent) => void): Promise<void>`
- `stopMonitoring(): void`