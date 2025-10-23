import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from '@/components/ErrorBoundary';
// Note: Initialize chunk error handling via a client-only component to avoid server-side bundling issues
import ChunkErrorInit from '@/components/ChunkErrorInit';
import FeatureBanner from '@/components/ui/FeatureBanner';
import ClientOnly from '@/components/ClientOnly';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KAIRO - Copy Trade Any Investor',
  description: 'The ultimate social trading platform. Copy trade hedge funds, managers, celebrities, and friends.',
  keywords: 'trading, copy trading, social trading, investment, portfolio, stocks',
  authors: [{ name: 'KAIRO Team' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            <ChunkErrorInit />
            <FeatureBanner />
            <div className="min-h-screen bg-background">
              {children}
            </div>
            <ClientOnly>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--card-foreground))',
                    border: '1px solid hsl(var(--border))',
                  },
                }}
              />
            </ClientOnly>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}