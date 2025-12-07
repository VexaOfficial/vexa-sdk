# @vexa-sdk/example-app

Example application demonstrating Vexa SDK usage.

## Setup

1. Copy `.env.example` to `.env` and fill in values.
2. Run `pnpm start`

## What it does

- Monitors a sample pool for liquidity changes.
- When liquidity is removed above threshold, auto-sends a small amount to cold wallet.