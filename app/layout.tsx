import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StellarTip — Instant Tips on Stellar Blockchain',
  description: 'A decentralized micropayment and tipping platform built on the Stellar testnet. Send instant tips with near-zero fees.',
  keywords: ['Stellar', 'tipping', 'blockchain', 'micropayment', 'XLM', 'decentralized'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#0a0a0f',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
