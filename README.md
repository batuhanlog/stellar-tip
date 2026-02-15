# 💰 StellarTip

> A decentralized micropayment and tipping platform built on the Stellar testnet.

![Stellar](https://img.shields.io/badge/Stellar-Testnet-blue?logo=stellar)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3-38bdf8?logo=tailwindcss)
![Soroban](https://img.shields.io/badge/Soroban-Smart%20Contract-orange?logo=stellar)
![Tests](https://img.shields.io/badge/Tests-36%20passing-brightgreen)
![Belt](https://img.shields.io/badge/Belt-Orange%20🥋-orange)

---

## 🚀 What is StellarTip?

StellarTip is a decentralized micropayment platform that lets you **send and receive tips instantly** on the Stellar blockchain. With near-zero fees and 3-5 second settlement times, it's the perfect way to appreciate great work.

**Tagline:** *Instant tips on Stellar blockchain*

### 🔗 Links

- **Live Demo:** [https://stellar-tip.vercel.app](https://stellar-tip.vercel.app)
- **GitHub:** [https://github.com/batuhanlog/stellar-tip](https://github.com/batuhanlog/stellar-tip)
- **Demo Video:** [Watch 1-minute demo](https://www.youtube.com/watch?v=PLACEHOLDER)
- **Contract Explorer:** [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC)

---

## 🥋 Belt Progression

| Belt | Status | Description |
|---|---|---|
| ⬜ **White Belt** (Level 1) | ✅ Complete | Wallet connection, balance display, payments, transaction history |
| 🟡 **Yellow Belt** (Level 2) | ✅ Complete | Soroban smart contract, error handling (3+ types), transaction status tracking |
| 🟠 **Orange Belt** (Level 3) | ✅ Complete | Loading states, caching with TTL, 36 passing tests, complete documentation |

---

## 🟠 Orange Belt (Level 3) — What's New

### Loading States & Progress Indicators
- **Skeleton loading** for balance display, transaction history, and contract panel
- **Global loading overlay** with animated spinner during transaction processing
- **Top progress bar** animation when operations are in progress
- Smooth `animate-pulse` transitions between loading → loaded states

### Basic Caching Implementation
- **Balance caching** with 30-second TTL
- **Transaction history caching** with 60-second TTL
- **Contract data caching** with 45-second TTL
- **Cache indicator badges** — "cached" (amber) vs "live" (green) shown in UI
- **Force refresh** — click refresh button to bypass cache and fetch fresh data
- Cache invalidation on new transactions

### Test Suite (36 Tests Passing)
- **3 test files** covering address validation, error classification, and cache helper
- Run with `npm test`
- Full details in [Testing](#-testing) section below

### Documentation
- Complete README with all belt features documented
- Architecture section, setup instructions, test output
- Demo video placeholder

---

## 🟡 Yellow Belt (Level 2) — Soroban Integration

### Deployed Contract
- **Contract ID:** `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC`
- **Network:** Stellar Testnet
- **Explorer:** [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC)

### Yellow Belt Requirements Met
| Requirement | Status | Details |
|---|---|---|
| 3 error types handled | ✅ | Wallet not found, user rejected, insufficient balance |
| Contract deployed on testnet | ✅ | Soroban increment contract on testnet |
| Contract called from frontend | ✅ | Read/write via ContractPanel component |
| Transaction status visible | ✅ | Pending → signing → submitting → success/fail |
| 2+ meaningful commits | ✅ | Contract integration + UI commits |

---

## ✨ Features

### Core (White Belt)
- 🔗 **Wallet Connection** — Connect any Stellar wallet (Freighter, xBull, Lobstr, Albedo, Rabet, Hana, WalletConnect)
- 💰 **Balance Display** — Real-time XLM balance with "Tip Jar" visual
- 💸 **Send Tips** — Quick tipping form with preset amounts (1, 5, 10, 25, 50 XLM)
- 📜 **Tip History** — View sent/received tips with explorer links
- 💬 **Tip Messages** — Attach memos to your tips

### Smart Contract (Yellow Belt)
- 📜 **Smart Contract Panel** — View deployed contract info, address, network status
- 📡 **Contract Interaction** — Read data from and write to the Soroban contract
- 🔄 **Transaction Status Tracker** — Real-time visual progress: preparing → signing → submitting → confirming → success/fail
- 🛡️ **Error Handling** — 3+ error types with visual cards (wallet not found, user rejected, insufficient balance)
- 📊 **On-Chain Tip Counter** — Track total tips and volume via smart contract
- 🧪 **Error Demo Mode** — Interactive error simulation for testing all error types

### Performance & Quality (Orange Belt)
- ⏳ **Loading Skeletons** — Smooth skeleton states for balance, history, and contract data
- 🔄 **Global Loading Overlay** — Animated spinner + progress bar for transactions
- 💾 **Smart Caching** — TTL-based caching for balance (30s), history (60s), contract data (45s)
- 🏷️ **Cache Indicators** — "cached" vs "live" badges on all data components
- ✅ **Test Suite** — 36 passing tests across 3 test files
- 📖 **Complete Documentation** — Full README with architecture, setup, testing, deployment

### Bonus Features
- 🌗 **Dark/Light Mode** — Toggle theme with persistent preference
- 📱 **QR Code** — SVG-based QR pattern for your tip address
- ✅ **Confirmation Modal** — Review transaction details before sending
- 🔗 **Shareable Tip Link** — Generate a shareable link concept
- 🎨 **Smooth Animations** — fadeIn, scale, and stagger animations
- 📱 **Mobile Responsive** — Fully responsive design for all screen sizes
- 📋 **Copy Address** — One-click copy for wallet address
- 🗂️ **Tab Navigation** — Organized dashboard with Tips / Contract / Errors tabs

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Next.js App Router                 │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │   page.tsx   │  │ Components/  │  │   lib/      │ │
│  │  (Main UI)   │  │              │  │             │ │
│  │  - Tabs      │──│ WalletConn.  │──│ stellar-    │ │
│  │  - Loading   │  │ BalanceDisp. │  │ helper.ts   │ │
│  │  - Progress  │  │ PaymentForm  │  │ (DO NOT     │ │
│  │              │  │ TxHistory    │  │  MODIFY!)   │ │
│  └──────────────┘  │ ContractPanel│  │             │ │
│                     │ ErrorHandler │  │ soroban-    │ │
│                     │ TxStatus     │  │ helper.ts   │ │
│                     │ BonusFeatures│  │             │ │
│                     └──────────────┘  │ cache-      │ │
│                                       │ helper.ts   │ │
│                                       └─────────────┘ │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │              Cache Layer (Orange Belt)            │ │
│  │  Balance: 30s TTL │ History: 60s │ Contract: 45s │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │           Stellar Network (Testnet)               │ │
│  │  Horizon API  │  Soroban RPC  │  Friendbot        │ │
│  └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Data Flow
1. **User Action** → Component triggers fetch
2. **Cache Check** → Cache helper checks for valid cached data
3. **Cache Hit** → Return cached data immediately (shows "cached" badge)
4. **Cache Miss** → Fetch from Stellar network → Store in cache → Show "live" badge
5. **Force Refresh** → User clicks refresh → Invalidates cache → Fresh fetch

---

## 📸 Screenshots

### Hero / Landing Page
> [Screenshot: Landing page with hero section, "Send Tips, Instantly & Free" headline, and connect wallet CTA]

### Connected Dashboard with Cache Indicators
> [Screenshot: Dashboard showing "cached" and "live" badges on balance and history components]

### Loading Skeletons
> [Screenshot: Skeleton loading states for balance and transaction history with animate-pulse]

### Smart Contract Panel
> [Screenshot: Contract panel showing deployed contract address, network status, tip counter]

### Error Handling Demo
> [Screenshot: Error handling demo with three error type buttons and error detail card]

### Test Output (36 Tests Passing)
> [Screenshot: Terminal showing `npm test` output with 3 test suites, 36 tests all passing]

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS 3** | Utility-first styling |
| **Stellar SDK** | Blockchain + Soroban interaction |
| **Stellar Wallets Kit** | Multi-wallet connection |
| **Soroban RPC** | Smart contract communication |
| **react-icons** | UI icons |
| **Jest** | Testing framework |
| **ts-jest** | TypeScript support for Jest |
| **jest-environment-jsdom** | DOM environment for tests |

---

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+
- A Stellar wallet browser extension (e.g., [Freighter](https://www.freighter.app/))

### Installation

```bash
# Clone the repository
git clone https://github.com/batuhanlog/stellar-tip.git
cd stellar-tip

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 🧪 Testing

StellarTip includes a comprehensive test suite with **36 tests across 3 test files**.

### Run Tests

```bash
npm test
```

### Test Files

| Test File | Tests | Description |
|---|---|---|
| `__tests__/address-validation.test.ts` | 9 tests | Validates Stellar address format (56 chars, starts with G, alphanumeric) |
| `__tests__/error-classification.test.ts` | 8 tests | Tests error classification system (wallet not found, user rejected, insufficient balance, contract error, network error, unknown) |
| `__tests__/cache-helper.test.ts` | 19 tests | Tests cache set/get, TTL expiry, invalidation, prefix invalidation, freshness, cache info, size tracking |

### Test Output

```
PASS __tests__/address-validation.test.ts
  Stellar Address Validation
    ✓ should accept a valid Stellar public key
    ✓ should accept the deployed contract address as valid format
    ✓ should reject an address that is too short
    ✓ should reject an address that is too long
    ✓ should reject an address that does not start with G
    ✓ should reject an empty string
    ✓ should reject null/undefined inputs
    ✓ should reject addresses with lowercase characters
    ✓ should reject addresses with special characters

PASS __tests__/cache-helper.test.ts
  Cache Helper
    ✓ should store and retrieve a value
    ✓ should return null for non-existent keys
    ✓ should expire entries after TTL
    ✓ should report has() correctly for existing and expired entries
    ✓ should invalidate a specific key
    ✓ should invalidate by prefix
    ✓ should clear all entries
    ✓ should report freshness correctly
    ✓ should report non-existent keys as not fresh
    ✓ should return correct cache info
    ✓ should return null info for non-existent keys
    ✓ should track size correctly
    ✓ should overwrite existing entries
    ✓ should return correct age for entries
    ✓ should return -1 age for non-existent keys
  Cache Keys and TTL Constants
    ✓ should generate correct balance cache key
    ✓ should generate correct transactions cache key
    ✓ should generate correct contract cache keys
    ✓ should have reasonable TTL values

PASS __tests__/error-classification.test.ts
  Error Classification
    ✓ should classify "wallet not found" errors correctly
    ✓ should classify "user rejected" errors correctly
    ✓ should classify "insufficient balance" errors correctly
    ✓ should classify contract errors correctly
    ✓ should classify network errors correctly
    ✓ should classify unknown errors as UNKNOWN
    ✓ should return proper error structure with title, message, suggestion, icon
    ✓ should handle non-Error inputs gracefully

Test Suites: 3 passed, 3 total
Tests:       36 passed, 36 total
Snapshots:   0 total
```

---

## 📖 How It Works

1. **Connect Wallet** — Click "Connect Wallet" and select your preferred Stellar wallet
2. **Fund Account** — Use [Stellar Friendbot](https://friendbot.stellar.org) to get free testnet XLM
3. **Send Tips** — Enter a recipient address, choose an amount (or use quick buttons), add an optional message, and send!
4. **Track Tips** — View your tip history with sent/received labels and explorer links
5. **Interact with Contract** — Switch to the Contract tab to read/write Soroban smart contract data
6. **Test Error Handling** — Switch to the Errors tab to see how 3+ error types are handled

### Caching System

- **Balance data** is cached for 30 seconds — avoids redundant API calls
- **Transaction history** is cached for 60 seconds — invalidated on new transactions
- **Contract data** is cached for 45 seconds
- Each component shows a **"cached"** or **"live"** badge so you know the data source
- Click the **refresh button** to force a fresh fetch

### Flow

```
Connect Wallet → Fund with Testnet XLM → Send Tips → View History
                                        ↓
                              Interact with Soroban Contract
                                        ↓
                              Track Transaction Status (pending → success/fail)
                                        ↓
                              Cached Data with TTL Indicators
```

---

## 🎨 Design

- **Color Theme:** Warm amber/orange/yellow gradient — tipping vibes 🔥
- **Glass Morphism:** Backdrop blur with translucent cards
- **Dark by Default:** Professional dark theme with light mode option
- **Responsive:** Mobile-first design that works on all screen sizes
- **Animations:** Smooth fadeIn, scale, spin, pulse, and progress-bar effects
- **Loading Skeletons:** `animate-pulse` with `bg-white/5` blocks
- **Cache Badges:** Amber for "cached", green for "live"

---

## 📁 Project Structure

```
stellar-tip/
├── app/
│   ├── globals.css              # Global styles, animations, theme variables
│   ├── layout.tsx               # Root layout with metadata
│   └── page.tsx                 # Main page — hero + tabbed dashboard + loading overlay
├── components/
│   ├── WalletConnection.tsx     # Wallet connect/disconnect
│   ├── BalanceDisplay.tsx       # Tip Jar balance display + caching + skeleton loading
│   ├── PaymentForm.tsx          # Send a Tip form
│   ├── TransactionHistory.tsx   # Tip History list + caching + skeleton loading
│   ├── BonusFeatures.tsx        # Theme toggle, QR, confirmation modal, tip link
│   ├── ContractPanel.tsx        # Soroban contract interaction UI
│   ├── TransactionStatus.tsx    # Transaction status tracker (pending/success/fail)
│   ├── ErrorHandler.tsx         # Error handling with 3+ error types
│   └── example-components.tsx   # Shared UI primitives (Card, Input, Button, etc.)
├── lib/
│   ├── stellar-helper.ts       # Blockchain logic (DO NOT MODIFY)
│   ├── soroban-helper.ts       # Soroban smart contract helper
│   └── cache-helper.ts         # 🆕 Caching utility with TTL (Orange Belt)
├── __tests__/
│   ├── address-validation.test.ts   # 🆕 Stellar address format tests (9 tests)
│   ├── error-classification.test.ts # 🆕 Error classification tests (8 tests)
│   └── cache-helper.test.ts        # 🆕 Cache helper tests (19 tests)
├── jest.config.js               # 🆕 Jest testing configuration
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 🎬 Demo Video

> 📹 **[Watch the 1-minute demo video](https://www.youtube.com/watch?v=PLACEHOLDER)**

The demo covers:
1. Connecting a Stellar wallet
2. Viewing balance with cache indicator
3. Sending a tip with loading overlay
4. Viewing transaction history
5. Interacting with the Soroban smart contract
6. Testing error handling

---

## 🏆 Built For

**Rise In — Stellar Journey to Mastery** challenge

| Belt | Status | What I Learned |
|---|---|---|
| ⬜ White Belt | ✅ | Wallet connection, balance display, payments, history |
| 🟡 Yellow Belt | ✅ | Soroban contracts, error handling, transaction status |
| 🟠 Orange Belt | ✅ | Loading states, caching with TTL, testing, documentation |

---

## ⚠️ Disclaimer

This is a **testnet application**. Do not use real funds. All transactions occur on the Stellar testnet.

---

## 📄 License

MIT

---

<p align="center">
  Built with ❤️ on the <strong>Stellar Network</strong> 🥋
</p>
