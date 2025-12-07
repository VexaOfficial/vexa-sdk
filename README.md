# Vexa SDK

Smart Liquidity Automation Engine (SLAE) for Solana.

## Overview

Vexa SDK provides a comprehensive toolkit for monitoring liquidity changes in Solana pools and automating wallet actions in response. Built with TypeScript, it offers a plugin-style architecture for extensibility.

## Architecture

```
vexa-sdk/
├── packages/
│   ├── core/           # Core utilities & Solana client
│   ├── liquidity-radar/ # Liquidity monitoring
│   ├── wallet-automator/ # Automation actions
│   ├── cli/            # Command-line interface
│   └── example-app/    # Demo application
├── examples/           # Sample rules & configs
└── docs/               # Documentation
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm -r build

# Run tests
pnpm -r test

# Watch liquidity
vexa watch --pool <POOL_ADDRESS>
```

## Requirements

- **Node.js**: version 18 or newer.
- **pnpm**: v7+ recommended (pnpm v8+ tested). Install via `corepack enable` or `npm i -g pnpm`.
- **TypeScript**: provided via workspace devDependencies (no global install required).
- **Network**: outgoing HTTPS access to the Solana RPC (defaults to Devnet) and CoinGecko for fallback price lookups.

Environment variables the repo expects (see `.env.example`):

- `SOLANA_RPC_URL` — optional; defaults to `https://api.devnet.solana.com`.
- `PRIVATE_KEY` — wallet secret (base58 string or JSON array). Never commit this value.
- `COLD_WALLET` — optional target address for auto-send/withdraw actions.
- `DEVNET_INTEGRATION` — set to `true` to run integration tests against Devnet.

Safety notes:

- Use a dedicated throwaway Devnet keypair when experimenting. Never use mainnet keys for testing.
- Store secrets in secure vaults or CI secret stores; load them via environment variables at runtime.

Running the code locally:

```bash
# install
pnpm install

# build packages
pnpm -r build

# run tests (unit + mocked network tests)
pnpm -r test

# run example app (after copying .env.example -> .env)
pnpm --filter @vexa-sdk/example-app start
```

## Environment Setup

Copy `.env.example` to `.env` and configure:

- `SOLANA_RPC_URL`: RPC endpoint (defaults to devnet)
- `PRIVATE_KEY`: Wallet private key (base58 or JSON array)
- `COLD_WALLET`: Address for auto-send actions

**⚠️ NEVER commit private keys!**

## Packages

### @vexa-sdk/core
Core Solana client with retry logic and utilities.

### @vexa-sdk/liquidity-radar
Monitors token account balances for liquidity changes.

### @vexa-sdk/wallet-automator
Executes automated actions like sends, swaps, and withdrawals.

### @vexa-sdk/cli
Command-line tools for monitoring and automation.

### @vexa-sdk/example-app
Working example of integrated usage.

## Development

```bash
# Install
pnpm install

# Build
pnpm build

# Test
pnpm test

# Lint
pnpm lint

# Format
pnpm format
```

## Deployment

For production use:

1. Set environment variables securely
2. Use a dedicated keypair for automation
3. Monitor logs and transaction signatures
4. Implement rate limiting and error handling

## Contributing

See CONTRIBUTING.md

## License

MIT
