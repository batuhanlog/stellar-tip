# 💰 StellarTip

> A decentralized micropayment and tipping platform built on the Stellar testnet.

![Stellar](https://img.shields.io/badge/Stellar-Testnet-blue?logo=stellar)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3-38bdf8?logo=tailwindcss)

---

## 🚀 What is StellarTip?

StellarTip is a decentralized micropayment platform that lets you **send and receive tips instantly** on the Stellar blockchain. With near-zero fees and 3-5 second settlement times, it's the perfect way to appreciate great work.

**Tagline:** *Instant tips on Stellar blockchain*

---

## ✨ Features

### Core
- 🔗 **Wallet Connection** — Connect any Stellar wallet (Freighter, xBull, Lobstr, Albedo, Rabet, Hana, WalletConnect)
- 💰 **Balance Display** — Real-time XLM balance with "Tip Jar" visual
- 💸 **Send Tips** — Quick tipping form with preset amounts (1, 5, 10, 25, 50 XLM)
- 📜 **Tip History** — View sent/received tips with explorer links
- 💬 **Tip Messages** — Attach memos to your tips

### Bonus Features
- 🌗 **Dark/Light Mode** — Toggle theme with persistent preference
- 📱 **QR Code** — SVG-based QR pattern for your tip address
- ✅ **Confirmation Modal** — Review transaction details before sending
- 🔗 **Shareable Tip Link** — Generate a shareable link concept
- 🎨 **Smooth Animations** — fadeIn, scale, and stagger animations
- 📱 **Mobile Responsive** — Fully responsive design for all screen sizes
- 📋 **Copy Address** — One-click copy for wallet address

---

## 📸 Screenshots

### Hero / Landing Page
> [Screenshot: Landing page with hero section, "Send Tips, Instantly & Free" headline, and connect wallet CTA]

### Connected Dashboard
> [Screenshot: Wallet connected showing Tip Jar balance, Send a Tip form with quick amounts, and Tip History]

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
| **Stellar SDK** | Blockchain interaction |
| **Stellar Wallets Kit** | Multi-wallet connection |
| **react-icons** | UI icons |

---

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+
- A Stellar wallet browser extension (e.g., [Freighter](https://www.freighter.app/))

### Installation

```bash
# Clone the repository
git clone https://github.com/mrkayahan66/stellar-tip.git
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

### Flow

```
Connect Wallet → Fund with Testnet XLM → Send Tips → View History
```

---

## 🎨 Design

- **Color Theme:** Warm amber/orange/yellow gradient — tipping vibes 🔥
- **Glass Morphism:** Backdrop blur with translucent cards
- **Dark by Default:** Professional dark theme with light mode option
- **Responsive:** Mobile-first design that works on all screen sizes

---

## 📁 Project Structure

```
stellar-tip/
├── app/
│   ├── globals.css          # Global styles, animations, theme variables
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main page — hero + dashboard
├── components/
│   ├── WalletConnection.tsx # Wallet connect/disconnect
│   ├── BalanceDisplay.tsx   # Tip Jar balance display
│   ├── PaymentForm.tsx      # Send a Tip form
│   ├── TransactionHistory.tsx # Tip History list
│   ├── BonusFeatures.tsx    # Theme toggle, QR, confirmation modal, tip link
│   └── example-components.tsx # Shared UI primitives (Card, Input, Button, etc.)
├── lib/
│   └── stellar-helper.ts   # Blockchain logic (DO NOT MODIFY)
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 🏆 Built For

**Rise In — Stellar Journey to Mastery** challenge (White Belt submission)

This project demonstrates frontend development skills using the Stellar blockchain, including wallet integration, balance display, payment handling, and transaction history — all wrapped in a professional, polished UI.

---

## ⚠️ Disclaimer

This is a **testnet application**. Do not use real funds. All transactions occur on the Stellar testnet.

---

## 📄 License

MIT

---

<p align="center">
  Built with ❤️ on the <strong>Stellar Network</strong>
</p>
