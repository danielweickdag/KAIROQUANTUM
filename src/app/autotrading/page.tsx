'use client';

import { AutoTradingPanel } from '@/components/trading/AutoTradingPanel';
import Navigation from '@/components/Navigation';

export default function AutoTradingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Automated Trading</h1>
          <p className="text-gray-600 mb-8">
            Configure and monitor your automated trading strategies
          </p>

          <AutoTradingPanel />
        </div>
      </div>
    </div>
  );
}
