# 💰 StellarTip

> A decentralized micropayment and tipping platform built on the Stellar testnet.

![Stellar](https://img.shields.io/badge/Stellar-Testnet-blue?logo=stellar)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3-38bdf8?logo=tailwindcss)
![Soroban](https://img.shields.io/badge/Soroban-Smart%20Contract-orange?logo=stellar)
![Belt](https://img.shields.io/badge/Belt-Yellow%20🥋-yellow)

---

## 🚀 What is StellarTip?

StellarTip is a decentralized micropayment platform that lets you **send and receive tips instantly** on the Stellar blockchain. With near-zero fees and 3-5 second settlement times, it's the perfect way to appreciate great work.

**Tagline:** *Instant tips on Stellar blockchain*

---

## 🥋 Yellow Belt (Level 2) — Soroban Integration

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

### Transaction Hash (Contract Call)
> `[tx hash populated after contract interaction]`

---

## ✨ Features

### Core (White Belt)
- 🔗 **Wallet Connection** — Connect any Stellar wallet (Freighter, xBull, Lobstr, Albedo, Rabet, Hana, WalletConnect)
- 💰 **Balance Display** — Real-time XLM balance with "Tip Jar" visual
- 💸 **Send Tips** — Quick tipping form with preset amounts (1, 5, 10, 25, 50 XLM)
- 📜 **Tip History** — View sent/received tips with explorer links
- 💬 **Tip Messages** — Attach memos to your tips

### Yellow Belt — Soroban Smart Contract
- 📜 **Smart Contract Panel** — View deployed contract info, address, network status
- 📡 **Contract Interaction** — Read data from and write to the Soroban contract
- 🔄 **Transaction Status Tracker** — Real-time visual progress: preparing → signing → submitting → confirming → success/fail
- 🛡️ **Error Handling** — 3+ error types with visual cards (wallet not found, user rejected, insufficient balance)
- 📊 **On-Chain Tip Counter** — Track total tips and volume via smart contract
- 🧪 **Error Demo Mode** — Interactive error simulation for testing all error types

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

## 📸 Screenshots

### Hero / Landing Page
> [Screenshot: Landing page with hero section, "Send Tips, Instantly & Free" headline, and connect wallet CTA]

### Wallet Options
> [Screenshot: Wallet selection modal showing Freighter, xBull, Albedo, Rabet, Lobstr, Hana, WalletConnect options]

### Connected Dashboard
> [Screenshot: Wallet connected showing Tip Jar balance, tab navigation, Send a Tip form, and Tip History]

### Smart Contract Panel
> [Screenshot: Contract panel showing deployed contract address CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC, network status, tip counter, and interaction buttons]

### Transaction Status Tracker
> [Screenshot: Transaction status showing progress steps — preparing, signing, submitting, confirming, success with animated indicators]

### Error Handling Demo
> [Screenshot: Error handling demo with three error type buttons — Wallet Not Found (purple), User Rejected (yellow), Insufficient Balance (red) — and error detail card]

### Transaction Confirmation
> [Screenshot: Modal showing recipient, amount, and memo before confirming the tip]

### Light Mode
> [Screenshot: The dashboard in light mode with warm amber theme]

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

## 📖 How It Works

1. **Connect Wallet** — Click "Connect Wallet" and select your preferred Stellar wallet
2. **Fund Account** — Use [Stellar Friendbot](https://friendbot.stellar.org) to get free testnet XLM
3. **Send Tips** — Enter a recipient address, choose an amount (or use quick buttons), add an optional message, and send!
4. **Track Tips** — View your tip history with sent/received labels and explorer links
5. **Interact with Contract** — Switch to the Contract tab to read/write Soroban smart contract data
6. **Test Error Handling** — Switch to the Errors tab to see how 3+ error types are handled

### Flow

```
Connect Wallet → Fund with Testnet XLM → Send Tips → View History
                                        ↓
                              Interact with Soroban Contract
                                        ↓
                              Track Transaction Status (pending → success/fail)
```

---

## 🎨 Design

- **Color Theme:** Warm amber/orange/yellow gradient — tipping vibes 🔥
- **Glass Morphism:** Backdrop blur with translucent cards
- **Dark by Default:** Professional dark theme with light mode option
- **Responsive:** Mobile-first design that works on all screen sizes
- **Animations:** Smooth fadeIn, scale, spin, and pulse-glow effects

---

## 📁 Project Structure

```
stellar-tip/
├── app/
│   ├── globals.css              # Global styles, animations, theme variables
│   ├── layout.tsx               # Root layout with metadata
│   └── page.tsx                 # Main page — hero + tabbed dashboard
├── components/
│   ├── WalletConnection.tsx     # Wallet connect/disconnect
│   ├── BalanceDisplay.tsx       # Tip Jar balance display
│   ├── PaymentForm.tsx          # Send a Tip form
│   ├── TransactionHistory.tsx   # Tip History list
│   ├── BonusFeatures.tsx        # Theme toggle, QR, confirmation modal, tip link
│   ├── ContractPanel.tsx        # 🆕 Soroban contract interaction UI
│   ├── TransactionStatus.tsx    # 🆕 Transaction status tracker (pending/success/fail)
│   ├── ErrorHandler.tsx         # 🆕 Error handling with 3+ error types
│   └── example-components.tsx   # Shared UI primitives (Card, Input, Button, etc.)
├── lib/
│   ├── stellar-helper.ts       # Blockchain logic (DO NOT MODIFY)
│   └── soroban-helper.ts       # 🆕 Soroban smart contract helper
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 🏆 Built For

**Rise In — Stellar Journey to Mastery** challenge

| Belt | Status | Description |
|---|---|---|
| ⬜ White Belt | ✅ Complete | Wallet connection, balance, payments, history |
| 🟡 Yellow Belt | ✅ Complete | Soroban contract, error handling, tx status |

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
