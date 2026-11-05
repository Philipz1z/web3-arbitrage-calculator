# ArbScope — Web3 Arbitrage Calculator

A transparent, browser-based calculator for estimating whether a two-market Web3 arbitrage remains profitable after trading fees, slippage, and gas.

## Features

- Real-time net profit and ROI estimates
- Buy and sell fees calculated independently
- Slippage applied to both execution legs
- Total gas-cost modeling
- Break-even sell-price calculation
- Responsive, accessible interface
- Zero runtime dependencies and no wallet connection
- Unit-tested calculation engine

## Run locally

The app is static, so you can use any local HTTP server:

```bash
npx serve .
```

Then open the URL printed in your terminal. Opening `index.html` directly may work, but an HTTP server is recommended because the app uses JavaScript modules.

## Test

Requires Node.js 20 or newer.

```bash
npm test
```

## Calculation model

1. Buy-side fee is deducted from the trade amount.
2. Buy-side slippage increases the effective entry price.
3. Sell-side slippage decreases the effective exit price.
4. Sell-side fee is deducted from gross proceeds.
5. Gas is added to total capital cost.
6. Net profit is `net proceeds − trade amount − gas`.

The break-even sell price is the quoted sell price required for net profit to reach zero under the current assumptions.

## Scope and limitations

This calculator is an estimator. It does not model pool-specific price impact curves, order-book depth, bridge fees, MEV, failed transactions, reorgs, transfer times, taxes, or quote latency. Always validate against executable quotes and on-chain conditions.

## License

[MIT](./LICENSE)

> For research and educational use only. Nothing in this project is financial advice.
