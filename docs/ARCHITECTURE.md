# 🏗️ StellarTip — Architecture Document

> Comprehensive architecture overview for the StellarTip decentralized micropayment platform.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Tech Stack](#tech-stack)
3. [Component Architecture](#component-architecture)
4. [Data Flow](#data-flow)
5. [Smart Contract Integration](#smart-contract-integration)
6. [Caching Layer](#caching-layer)
7. [Inter-Contract Communication](#inter-contract-communication)
8. [Error Handling Strategy](#error-handling-strategy)
9. [Security Considerations](#security-considerations)
10. [Deployment Architecture](#deployment-architecture)
11. [Testing Strategy](#testing-strategy)
12. [Future Improvements](#future-improvements)

---

## 1. System Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                            │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    Next.js 14 App Router                       │  │
│  │                                                                │  │
│  │  ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌───────────┐ │  │
│  │  │  page.tsx │  │  Components  │  │   lib/   │  │  __tests__│ │  │
│  │  │ (4 Tabs) │──│  (10 files)  │──│ helpers  │  │  (4 files)│ │  │
│  │  └──────────┘  └──────────────┘  └────┬─────┘  └───────────┘ │  │
│  │                                       │                        │  │
│  │  ┌────────────────────────────────────┴───────────────────┐   │  │
│  │  │              In-Memory TTL Cache Layer                  │   │  │
│  │  │   Balance: 30s  │  History: 60s  │  Contract: 45s      │   │  │
│  │  └────────────────────────────────────────────────────────┘   │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────┐                                        │
│  │   Freighter Wallet Ext.  │  (Browser Extension)                   │
│  │   - Key Management       │                                        │
│  │   - Transaction Signing  │                                        │
│  └──────────────────────────┘                                        │
└──────────────────────┬───────────────────────────────────────────────┘
                       │  HTTPS (JSON-RPC / REST)
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│                     STELLAR TESTNET INFRASTRUCTURE                    │
│                                                                      │
│  ┌─────────────────────┐   ┌──────────────────────────────────────┐ │
│  │   Horizon REST API   │   │         Soroban RPC Server           │ │
│  │  horizon-testnet.    │   │    soroban-testnet.stellar.org       │ │
│  │  stellar.org         │   │                                      │ │
│  │                      │   │  ┌──────────────┐ ┌──────────────┐  │ │
│  │  - Account info      │   │  │ Contract A   │ │ Contract B   │  │ │
│  │  - Balances          │   │  │ Tip Counter  │ │ Tip Registry │  │ │
│  │  - Tx history        │   │  │ (Primary)    │ │ (Secondary)  │  │ │
│  │  - Tx submission     │   │  │ CDLZFC3S...  │ │ CAAXGP7Y...  │  │ │
│  │                      │   │  └──────────────┘ └──────────────┘  │ │
│  └─────────────────────┘   └──────────────────────────────────────┘ │
│                                                                      │
│  ┌─────────────────────┐                                             │
│  │     Friendbot        │  (Test XLM Faucet)                         │
│  │  friendbot.stellar.  │                                            │
│  │  org                 │                                            │
│  └─────────────────────┘                                             │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js | 14.x | React meta-framework with App Router, SSR/SSG support |
| **Language** | TypeScript | 5.x | Static type safety across the entire codebase |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS with custom theme (amber/orange palette) |
| **Blockchain SDK** | @stellar/stellar-sdk | latest | Horizon API client, transaction building, XDR encoding |
| **Smart Contracts** | Soroban | Testnet | WASM-based smart contract runtime on Stellar |
| **Wallet** | Freighter | Browser ext. | Key management, transaction signing, network selection |
| **Wallet Kit** | @creit.tech/stellar-wallets-kit | latest | Multi-wallet abstraction (Freighter, xBull, Lobstr, Albedo, etc.) |
| **Icons** | react-icons | latest | Icon library for UI elements |
| **Testing** | Jest + ts-jest | latest | Unit testing with TypeScript support |
| **Test Environment** | jest-environment-jsdom | latest | Browser-like DOM for component tests |
| **CI/CD** | GitHub Actions | — | Automated test + build pipeline on push/PR |
| **Hosting** | Vercel | — | Edge deployment, automatic preview deploys |

---

## 3. Component Architecture

### 3.1 Page Layer

| File | Responsibility |
|------|---------------|
| `app/page.tsx` | Main entry point. Renders hero section, 4-tab dashboard (Tips / Contract / Events / Errors), global loading overlay, and progress bar. Manages top-level state for wallet connection and active tab. |
| `app/layout.tsx` | Root HTML layout with metadata, viewport configuration, and font imports. |
| `app/globals.css` | Global styles, CSS custom properties, Tailwind directives, keyframe animations (`fadeIn`, `scale`, `spin`, `pulse`, `progress-bar`), and mobile-responsive overrides. |

### 3.2 Component Layer

| Component | File | Responsibility |
|-----------|------|---------------|
| **WalletConnection** | `WalletConnection.tsx` | Handles wallet connect/disconnect via Stellar Wallets Kit. Displays connected address with copy-to-clipboard. Supports multiple wallet providers. |
| **BalanceDisplay** | `BalanceDisplay.tsx` | Fetches and displays XLM balance with "Tip Jar" visual metaphor. Integrates cache layer (30s TTL). Shows skeleton loading state and cached/live badge. |
| **PaymentForm** | `PaymentForm.tsx` | Send-a-tip form with recipient address input, amount field, preset quick-amount buttons (1, 5, 10, 25, 50 XLM), optional memo, and confirmation modal. |
| **TransactionHistory** | `TransactionHistory.tsx` | Lists sent/received tips with timestamps, amounts, and Stellar Expert explorer links. Cached with 60s TTL. Shows skeleton loading and cache badge. |
| **ContractPanel** | `ContractPanel.tsx` | Soroban smart contract interaction UI. Displays contract address, network status, and tip counter. Supports read (query) and write (increment) operations. |
| **TransactionStatus** | `TransactionStatus.tsx` | Real-time transaction lifecycle tracker. Visual progress through stages: preparing → signing → submitting → confirming → success/fail. |
| **ErrorHandler** | `ErrorHandler.tsx` | Displays classified errors with type-specific icons, titles, messages, and recovery suggestions. Includes interactive error demo mode for testing. |
| **EventStream** | `EventStream.tsx` | Real-time feed of inter-contract call events. Auto-refresh toggle (15s interval). Renders `CALL`, `OK`, `ERR`, `RESULT` badges with latency data. Max 50 events in memory. |
| **BonusFeatures** | `BonusFeatures.tsx` | Dark/light theme toggle, SVG-based QR code for tip address, confirmation modal, shareable tip link generator. |
| **example-components** | `example-components.tsx` | Shared UI primitives: Card, Input, Button, Badge, and other reusable styled elements. |

### 3.3 Library Layer

| Module | File | Responsibility |
|--------|------|---------------|
| **stellar-helper** | `lib/stellar-helper.ts` | Core blockchain logic: account loading, balance fetching, transaction building, transaction submission, history retrieval. **⚠️ DO NOT MODIFY** — stable API contract. |
| **soroban-helper** | `lib/soroban-helper.ts` | Soroban smart contract helpers: contract invocation, result parsing, error type classification, transaction status management. |
| **cache-helper** | `lib/cache-helper.ts` | Generic in-memory TTL cache: `get`, `set`, `has`, `invalidate`, `invalidateByPrefix`, `clear`, `getCacheInfo`, `isFresh`, `getAge`, `getSize`. |
| **inter-contract-helper** | `lib/inter-contract-helper.ts` | Inter-contract communication: fan-out execution to multiple contracts, result aggregation, typed event system (subscribe/unsubscribe/emit/clear), network health checks. |

### 3.4 Component Dependency Graph

```
page.tsx
├── WalletConnection
│   └── stellar-helper (connect, disconnect, getPublicKey)
├── BalanceDisplay
│   ├── stellar-helper (getBalance)
│   └── cache-helper (balance cache, 30s TTL)
├── PaymentForm
│   ├── stellar-helper (sendPayment)
│   └── TransactionStatus (lifecycle tracking)
├── TransactionHistory
│   ├── stellar-helper (getTransactionHistory)
│   └── cache-helper (history cache, 60s TTL)
├── ContractPanel
│   ├── soroban-helper (invokeContract, readContract)
│   └── cache-helper (contract cache, 45s TTL)
├── EventStream
│   └── inter-contract-helper (subscribe, executeInterContract)
├── ErrorHandler
│   └── soroban-helper (classifyError)
└── BonusFeatures
    └── (self-contained: theme, QR, modal, share link)
```

---

## 4. Data Flow

### 4.1 Wallet Connection Flow

```
User clicks "Connect Wallet"
        │
        ▼
WalletConnection.tsx
        │
        ├── StellarWalletsKit.openModal()
        │       │
        │       ▼
        │   Freighter/xBull/Lobstr extension popup
        │       │
        │       ▼ (user approves)
        │   Returns publicKey
        │
        ▼
page.tsx receives publicKey → stores in state
        │
        ├── BalanceDisplay triggers fetch
        ├── TransactionHistory triggers fetch
        └── ContractPanel becomes interactive
```

### 4.2 Balance Fetch Flow (with Caching)

```
BalanceDisplay mounts / refresh clicked
        │
        ▼
cache-helper.get("balance:{publicKey}")
        │
        ├── CACHE HIT (< 30s old)
        │       │
        │       ▼
        │   Return cached balance
        │   Show "cached" badge (amber)
        │
        └── CACHE MISS (expired or empty)
                │
                ▼
        stellar-helper.getBalance(publicKey)
                │
                ▼
        Horizon API: GET /accounts/{publicKey}
                │
                ▼
        Parse response → extract native balance
                │
                ▼
        cache-helper.set("balance:{publicKey}", balance, 30000)
                │
                ▼
        Display balance with "live" badge (green)
```

### 4.3 Tip Sending Flow

```
User fills PaymentForm → clicks "Send Tip"
        │
        ▼
Confirmation modal appears → user confirms
        │
        ▼
TransactionStatus → "preparing" (step 1/5)
        │
        ▼
stellar-helper.buildTransaction(sender, recipient, amount, memo)
        │
        ▼
TransactionStatus → "signing" (step 2/5)
        │
        ▼
Freighter.signTransaction(xdr) → wallet popup
        │
        ▼ (user signs)
TransactionStatus → "submitting" (step 3/5)
        │
        ▼
stellar-helper.submitTransaction(signedXdr)
        │
        ▼
Horizon API: POST /transactions
        │
        ▼
TransactionStatus → "confirming" (step 4/5)
        │
        ▼
Wait for confirmation (~3-5 seconds)
        │
        ├── SUCCESS → TransactionStatus → "success" ✅
        │       │
        │       ▼
        │   cache-helper.invalidate("balance:*")
        │   cache-helper.invalidate("transactions:*")
        │   (Force fresh data on next render)
        │
        └── FAILURE → TransactionStatus → "failed" ❌
                │
                ▼
        ErrorHandler.classifyError(error)
        Display error with recovery suggestion
```

### 4.4 Transaction History Flow

```
TransactionHistory mounts / refresh clicked
        │
        ▼
cache-helper.get("transactions:{publicKey}")
        │
        ├── CACHE HIT (< 60s old) → return cached list, "cached" badge
        │
        └── CACHE MISS
                │
                ▼
        stellar-helper.getTransactionHistory(publicKey)
                │
                ▼
        Horizon API: GET /accounts/{publicKey}/operations?limit=20
                │
                ▼
        Filter payment operations → format as tip records
                │
                ▼
        cache-helper.set("transactions:{publicKey}", tips, 60000)
                │
                ▼
        Render tip list with "live" badge
```

---

## 5. Smart Contract Integration

### 5.1 Deployed Contracts

| Contract | Contract ID | Role |
|----------|------------|------|
| **Tip Counter** (Primary) | `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC` | Tracks total tip count and cumulative volume on-chain |
| **Tip Registry** (Secondary) | `CAAXGP7YXJTLS2URUIH4CBBXFYRI3RNR4IXQNLBHC3JBUFQCIPCA7F2C` | Provides tip verification and registry lookups |

### 5.2 Contract Interaction Pattern

```
ContractPanel.tsx
        │
        ▼
soroban-helper.invokeContract({
    contractId: "CDLZFC3S...",
    method: "increment" | "get_count",
    args: [...],
    network: "testnet"
})
        │
        ▼
Build Soroban transaction envelope
        │
        ▼
Simulate via Soroban RPC → get resource estimates
        │
        ▼
Sign with Freighter (for write operations)
        │
        ▼
Submit to Soroban RPC → poll for completion
        │
        ▼
Parse result from XDR → return typed response
```

### 5.3 Read vs. Write Operations

| Operation | Method | Signing Required | Gas Cost |
|-----------|--------|-----------------|----------|
| Read tip count | `get_count` | ❌ No | Free (simulation only) |
| Increment counter | `increment` | ✅ Yes (Freighter) | Minimal (~100 stroops) |

### 5.4 Soroban RPC Configuration

```typescript
const SOROBAN_RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
```

---

## 6. Caching Layer

### 6.1 Overview

The caching layer (`lib/cache-helper.ts`) implements an **in-memory TTL (Time-To-Live) cache** to reduce redundant network requests and improve perceived performance.

### 6.2 Cache Architecture

```
┌────────────────────────────────────────────────┐
│              cache-helper.ts                    │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │         Map<string, CacheEntry>          │  │
│  │                                          │  │
│  │  key: "balance:{pubkey}"                 │  │
│  │  value: { data, timestamp, ttl }         │  │
│  │                                          │  │
│  │  key: "transactions:{pubkey}"            │  │
│  │  value: { data, timestamp, ttl }         │  │
│  │                                          │  │
│  │  key: "contract:{contractId}:{method}"   │  │
│  │  value: { data, timestamp, ttl }         │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  API:                                          │
│  ├── get(key) → data | null                    │
│  ├── set(key, data, ttlMs)                     │
│  ├── has(key) → boolean                        │
│  ├── invalidate(key)                           │
│  ├── invalidateByPrefix(prefix)                │
│  ├── clear()                                   │
│  ├── isFresh(key) → boolean                    │
│  ├── getCacheInfo(key) → CacheInfo             │
│  ├── getAge(key) → number                      │
│  └── getSize() → number                        │
└────────────────────────────────────────────────┘
```

### 6.3 TTL Configuration

| Data Type | Cache Key Pattern | TTL | Rationale |
|-----------|------------------|-----|-----------|
| Balance | `balance:{publicKey}` | 30s | Balance changes on every transaction; 30s is a good compromise |
| Transaction History | `transactions:{publicKey}` | 60s | History changes less frequently; longer TTL acceptable |
| Contract Data | `contract:{contractId}:{method}` | 45s | Contract state changes on writes; moderate TTL |

### 6.4 Cache Invalidation Strategy

- **On new transaction:** All `balance:*` and `transactions:*` entries are invalidated via `invalidateByPrefix()`
- **Manual refresh:** User clicks refresh button → specific key invalidated → fresh fetch
- **TTL expiry:** Entries automatically become stale after their TTL; `get()` returns `null` for expired entries
- **Full clear:** `clear()` wipes all cached data (used on wallet disconnect)

---

## 7. Inter-Contract Communication

### 7.1 Fan-Out / Aggregator Pattern

The `inter-contract-helper.ts` module implements a **fan-out pattern** where multiple Soroban contracts are called in parallel, and results are aggregated into a single response.

```
                    ┌──────────────────────┐
                    │  executeInterContract │
                    │     (Orchestrator)    │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴───────────┐
                    │    Promise.all()      │
                    │    (Fan-Out)          │
                    └──┬───────────────┬───┘
                       │               │
              ┌────────▼──────┐ ┌──────▼────────┐
              │  Contract A   │ │  Contract B    │
              │  Tip Counter  │ │  Tip Registry  │
              │  CDLZFC3S...  │ │  CAAXGP7Y...   │
              └────────┬──────┘ └──────┬─────────┘
                       │               │
                    ┌──▼───────────────▼───┐
                    │     Aggregator        │
                    │  - success count      │
                    │  - error count        │
                    │  - per-contract       │
                    │    latency            │
                    │  - combined result    │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │   Emit Event:         │
                    │   "combined_result"   │
                    └──────────────────────┘
```

### 7.2 Event System

The inter-contract helper includes a typed pub/sub event system:

| Event Type | Trigger | Payload |
|-----------|---------|---------|
| `call_start` | Before each contract call | `{ contractId, method, timestamp }` |
| `call_success` | Successful contract response | `{ contractId, result, latencyMs }` |
| `call_error` | Failed contract call | `{ contractId, error, latencyMs }` |
| `combined_result` | After aggregation | `{ totalContracts, successCount, errorCount, results }` |

**API:**
```typescript
subscribe(callback: (event: ContractEvent) => void): string  // returns subscriptionId
unsubscribe(subscriptionId: string): void
clearEvents(): void
```

### 7.3 Real-World Analogy

This pattern mirrors production DeFi architectures:
- **Multi-pool liquidity queries:** Check multiple DEX pools in parallel
- **Cross-chain bridge status:** Poll multiple bridge contracts simultaneously
- **Composable protocol orchestration:** Call lending + swap + staking contracts in one flow

---

## 8. Error Handling Strategy

### 8.1 Error Classification System

The `soroban-helper.ts` module classifies errors into typed categories:

| Error Type | Trigger | Icon | User Message | Recovery Suggestion |
|-----------|---------|------|-------------|-------------------|
| `WALLET_NOT_FOUND` | No wallet extension detected | 🔌 | "Wallet extension not found" | "Install Freighter wallet from freighter.app" |
| `USER_REJECTED` | User declined signing | ✋ | "Transaction was rejected" | "You can try again when ready" |
| `INSUFFICIENT_BALANCE` | Not enough XLM for tx + fees | 💸 | "Insufficient balance" | "Fund your account via Friendbot" |
| `CONTRACT_ERROR` | Soroban execution failure | 📜 | "Smart contract error" | "Check contract status on Stellar Expert" |
| `NETWORK_ERROR` | RPC/Horizon unreachable | 🌐 | "Network unavailable" | "Check your connection and try again" |
| `UNKNOWN` | Unclassified errors | ❓ | "An unexpected error occurred" | "Please try again or report this issue" |

### 8.2 Error Flow

```
Any operation throws
        │
        ▼
classifyError(error: unknown)
        │
        ├── Check error.message patterns
        │   ├── /wallet.*not.*found/i    → WALLET_NOT_FOUND
        │   ├── /user.*reject|denied/i   → USER_REJECTED
        │   ├── /insufficient|balance/i  → INSUFFICIENT_BALANCE
        │   ├── /contract.*error/i       → CONTRACT_ERROR
        │   └── /network|timeout|fetch/i → NETWORK_ERROR
        │
        └── Default                      → UNKNOWN
                │
                ▼
Return ClassifiedError {
    type, title, message, suggestion, icon
}
                │
                ▼
ErrorHandler.tsx renders error card with
    icon, title, description, and suggestion
```

### 8.3 Error Demo Mode

The Errors tab includes an interactive demo that lets users trigger each error type to see the handling in action, without making real network calls.

---

## 9. Security Considerations

### 9.1 Key Management
- **Private keys never touch the application.** All signing is delegated to the Freighter browser extension.
- The app only receives the **public key** after wallet connection.
- Transaction XDR is passed to Freighter for signing; the signed envelope is returned to the app.

### 9.2 Input Validation
- Stellar addresses are validated for format (56 chars, starts with `G`, uppercase alphanumeric).
- Payment amounts are validated as positive numbers with max decimal precision.
- Memo fields are sanitized and length-limited per Stellar protocol.

### 9.3 Network Security
- All communication uses **HTTPS** to Stellar's official testnet endpoints.
- No custom backend server — the app is fully client-side, reducing attack surface.
- Soroban RPC calls use official `soroban-testnet.stellar.org` endpoint.

### 9.4 Smart Contract Security
- Contracts are deployed on **testnet only** — no real funds at risk.
- Contract interactions are simulated before submission to catch errors early.
- Write operations require explicit user approval via wallet signing popup.

### 9.5 Client-Side Considerations
- No sensitive data stored in `localStorage` or cookies.
- Cache is in-memory only (lost on page refresh) — no persistence of financial data.
- Content Security Policy headers configured via Next.js for XSS protection.

---

## 10. Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│                   Developer                      │
│                                                  │
│  git push main ──► GitHub Repository             │
│                        │                         │
│                  ┌─────▼──────┐                   │
│                  │  GitHub     │                   │
│                  │  Actions    │                   │
│                  │  CI/CD      │                   │
│                  │             │                   │
│                  │ ✓ npm ci    │                   │
│                  │ ✓ npm test  │                   │
│                  │ ✓ npm build │                   │
│                  └─────┬──────┘                   │
│                        │ (on success)             │
│                  ┌─────▼──────┐                   │
│                  │   Vercel    │                   │
│                  │  Platform   │                   │
│                  │             │                   │
│                  │ - Edge CDN  │                   │
│                  │ - Auto SSL  │                   │
│                  │ - Preview   │                   │
│                  │   deploys   │                   │
│                  └─────┬──────┘                   │
│                        │                          │
│              ┌─────────▼────────────┐             │
│              │  stellar-tip.vercel  │             │
│              │       .app           │             │
│              └──────────────────────┘             │
└─────────────────────────────────────────────────┘

         Connects to at runtime:
         ┌──────────────────────────┐
         │  Stellar Testnet         │
         │  - horizon-testnet       │
         │  - soroban-testnet       │
         │  - friendbot             │
         └──────────────────────────┘
```

### 10.1 CI/CD Pipeline

**Trigger:** Push to `main` or pull request  
**Matrix:** Node.js 18.x and 20.x  
**Steps:**
1. `npm ci` — Install locked dependencies
2. `npm test` — Run 55 tests across 4 suites
3. `npm run build` — Production build (Next.js static export)
4. Upload build artifacts (Node 20.x only)

### 10.2 Vercel Configuration
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Node.js Version:** 20.x
- **Environment Variables:** None required (all config is client-side)

---

## 11. Testing Strategy

### 11.1 Overview

| Metric | Value |
|--------|-------|
| Total Tests | 55 |
| Test Suites | 4 |
| Framework | Jest + ts-jest |
| Environment | jsdom |
| CI Integration | GitHub Actions (Node 18.x + 20.x) |

### 11.2 Test Suites

| Suite | File | Tests | Coverage Area |
|-------|------|-------|--------------|
| Address Validation | `address-validation.test.ts` | 9 | Stellar public key format validation: length, prefix, character set, edge cases |
| Error Classification | `error-classification.test.ts` | 8 | Error type mapping, error structure integrity, non-Error input handling |
| Cache Helper | `cache-helper.test.ts` | 19 | Set/get, TTL expiry, invalidation, prefix invalidation, freshness, info, size, age, key generation, TTL constants |
| Inter-Contract Helper | `inter-contract-helper.test.ts` | 19 | Contract metadata, event system (subscribe/unsubscribe/emit/clear/IDs/timestamps), fan-out execution, network health |

### 11.3 Testing Philosophy

- **Unit tests only** — each module tested in isolation with no network calls.
- **Deterministic** — no flaky tests; timers are mocked for TTL tests.
- **Fast** — entire suite completes in < 5 seconds.
- **CI-enforced** — tests must pass before merge; failures block the pipeline.

### 11.4 What Is Not Tested (and Why)

| Area | Reason |
|------|--------|
| React components | Would require React Testing Library + complex wallet mocking; planned for future |
| E2E flows | Would require Playwright + testnet account setup; planned for future |
| `stellar-helper.ts` | Stable, externally maintained module — tested via integration |

---

## 12. Future Improvements

### Short-Term
- **React component tests** — Add React Testing Library for component-level testing
- **E2E tests** — Playwright suite for full user flows on testnet
- **WebSocket subscriptions** — Replace polling with Horizon streaming for real-time updates
- **Persistent cache** — Optional `IndexedDB` cache for faster cold starts

### Medium-Term
- **Multi-asset support** — Send tips in any Stellar asset, not just XLM
- **Tip leaderboards** — On-chain leaderboard via Soroban contract
- **Social login** — Connect via social accounts using Stellar's SEP-0030 (account recovery)
- **Push notifications** — Notify users when they receive a tip

### Long-Term
- **Mainnet deployment** — Deploy contracts and app for real-value tipping
- **DAO governance** — Community voting on platform features via Soroban
- **Cross-chain bridge** — Accept tips from other chains (Ethereum, Polygon) via bridge
- **Mobile app** — React Native or PWA for native mobile experience

---

## 📎 References

- [Stellar Developer Documentation](https://developers.stellar.org/)
- [Soroban Smart Contracts](https://soroban.stellar.org/)
- [Freighter Wallet](https://www.freighter.app/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [StellarTip Live Demo](https://stellar-tip.vercel.app)
- [StellarTip GitHub](https://github.com/batuhanlog/stellar-tip)

---

<p align="center">
  <em>Document version: 1.0 — Blue Belt (Level 5)</em><br/>
  <em>Last updated: February 2026</em>
</p>
