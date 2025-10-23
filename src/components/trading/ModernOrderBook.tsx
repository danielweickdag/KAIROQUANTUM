'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface OrderBookEntry {
  price: string;
  quantity: string;
  total?: number;
}

interface OrderBookData {
  symbol: string;
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  lastPrice?: number;
  priceChange?: number;
  priceChangePercent?: number;
}

interface ModernOrderBookProps {
  symbol?: string;
  limit?: number;
}

export default function ModernOrderBook({ symbol = 'BTCUSDT', limit = 15 }: ModernOrderBookProps) {
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'both' | 'buy' | 'sell'>('both');

  useEffect(() => {
    fetchOrderBook();
    const interval = setInterval(fetchOrderBook, 1000); // Update every second

    return () => clearInterval(interval);
  }, [symbol, limit]);

  const fetchOrderBook = async () => {
    try {
      const response = await fetch(`/api/binance/orderbook/${symbol}?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch order book');

      const data = await response.json();

      if (data.success) {
        // Get 24hr ticker for price change
        const tickerResponse = await fetch(`/api/binance/ticker/${symbol}`);
        const tickerData = await tickerResponse.json();

        setOrderBook({
          symbol,
          bids: data.data.bids.slice(0, limit),
          asks: data.data.asks.slice(0, limit),
          lastPrice: tickerData.success ? parseFloat(tickerData.data.lastPrice) : undefined,
          priceChange: tickerData.success ? parseFloat(tickerData.data.priceChange) : undefined,
          priceChangePercent: tickerData.success ? parseFloat(tickerData.data.priceChangePercent) : undefined,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order book:', error);
      setLoading(false);
    }
  };

  const calculateDepth = (orders: OrderBookEntry[], maxTotal: number): OrderBookEntry[] => {
    let runningTotal = 0;
    return orders.map(order => {
      runningTotal += parseFloat(order.quantity);
      return {
        ...order,
        total: (runningTotal / maxTotal) * 100,
      };
    });
  };

  if (loading) {
    return (
      <div className="modern-order-book loading">
        <div className="shimmer-effect">
          <div className="shimmer-line"></div>
          <div className="shimmer-line"></div>
          <div className="shimmer-line"></div>
        </div>
      </div>
    );
  }

  if (!orderBook) {
    return (
      <div className="modern-order-book error">
        <p>Failed to load order book</p>
      </div>
    );
  }

  const maxTotal = Math.max(
    ...orderBook.bids.map(b => parseFloat(b.quantity)),
    ...orderBook.asks.map(a => parseFloat(a.quantity))
  );

  const bidsWithDepth = calculateDepth(orderBook.bids, maxTotal);
  const asksWithDepth = calculateDepth(orderBook.asks, maxTotal);

  return (
    <div className="modern-order-book">
      <style jsx>{`
        .modern-order-book {
          background: rgb(0, 0, 0);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        .order-book-header {
          padding: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .symbol-info h3 {
          font-family: 'Satoshi', sans-serif;
          font-weight: 700;
          font-size: 20px;
          color: rgb(255, 255, 255);
          margin: 0 0 4px 0;
        }

        .last-price {
          font-size: 24px;
          font-weight: 700;
          color: ${orderBook.priceChange && orderBook.priceChange >= 0
            ? 'rgb(34, 197, 94)'
            : 'rgb(239, 68, 68)'};
        }

        .price-change {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          font-weight: 600;
          color: ${orderBook.priceChangePercent && orderBook.priceChangePercent >= 0
            ? 'rgb(34, 197, 94)'
            : 'rgb(239, 68, 68)'};
        }

        .view-selector {
          display: flex;
          gap: 8px;
          background: rgba(255, 255, 255, 0.05);
          padding: 4px;
          border-radius: 9999px;
        }

        .view-button {
          padding: 8px 16px;
          border-radius: 9999px;
          border: none;
          background: transparent;
          color: rgb(156, 163, 175);
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .view-button.active {
          background: linear-gradient(135deg, rgb(43, 253, 243), rgb(218, 254, 51));
          color: rgb(0, 0, 0);
        }

        .view-button:hover:not(.active) {
          background: rgba(255, 255, 255, 0.1);
          color: rgb(255, 255, 255);
        }

        .order-book-columns {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          padding: 12px 20px;
          gap: 8px;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .column-header {
          font-size: 11px;
          font-weight: 600;
          color: rgb(156, 163, 175);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .column-header.right {
          text-align: right;
        }

        .order-book-content {
          display: grid;
          grid-template-columns: ${view === 'both' ? '1fr 1fr' : '1fr'};
          height: 500px;
        }

        .order-list {
          overflow-y: auto;
          padding: 8px 0;
        }

        .order-list::-webkit-scrollbar {
          width: 4px;
        }

        .order-list::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        .order-list::-webkit-scrollbar-thumb {
          background: rgba(43, 253, 243, 0.3);
          border-radius: 2px;
        }

        .order-list::-webkit-scrollbar-thumb:hover {
          background: rgba(43, 253, 243, 0.5);
        }

        .order-row {
          position: relative;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          padding: 6px 20px;
          gap: 8px;
          cursor: pointer;
          transition: background 0.1s;
        }

        .order-row:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .depth-bar {
          position: absolute;
          top: 0;
          right: 0;
          height: 100%;
          opacity: 0.1;
          transition: width 0.3s ease;
        }

        .depth-bar.bid {
          background: rgb(34, 197, 94);
        }

        .depth-bar.ask {
          background: rgb(239, 68, 68);
        }

        .order-price {
          font-size: 13px;
          font-weight: 600;
          position: relative;
          z-index: 1;
        }

        .order-price.bid {
          color: rgb(34, 197, 94);
        }

        .order-price.ask {
          color: rgb(239, 68, 68);
        }

        .order-quantity,
        .order-total {
          font-size: 13px;
          color: rgb(255, 255, 255);
          position: relative;
          z-index: 1;
        }

        .order-total {
          text-align: right;
        }

        .spread-indicator {
          padding: 12px 20px;
          background: rgba(255, 255, 255, 0.03);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
        }

        .spread-label {
          font-size: 11px;
          color: rgb(156, 163, 175);
          margin-bottom: 4px;
        }

        .spread-value {
          font-size: 14px;
          font-weight: 700;
          background: linear-gradient(135deg, rgb(43, 253, 243), rgb(218, 254, 51));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .loading,
        .error {
          padding: 40px;
          text-align: center;
          color: rgb(156, 163, 175);
        }

        .shimmer-effect {
          padding: 20px;
        }

        .shimmer-line {
          height: 40px;
          background: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
          margin-bottom: 12px;
        }

        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        @media (max-width: 768px) {
          .order-book-content {
            grid-template-columns: 1fr;
            height: 400px;
          }

          .header-top {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>

      <div className="order-book-header">
        <div className="header-top">
          <div className="symbol-info">
            <h3>{symbol}</h3>
            {orderBook.lastPrice && (
              <div className="last-price">
                ${orderBook.lastPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            )}
            {orderBook.priceChangePercent !== undefined && (
              <div className="price-change">
                {orderBook.priceChangePercent >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {orderBook.priceChangePercent >= 0 ? '+' : ''}
                {orderBook.priceChangePercent.toFixed(2)}%
              </div>
            )}
          </div>

          <div className="view-selector">
            <button
              className={`view-button ${view === 'both' ? 'active' : ''}`}
              onClick={() => setView('both')}
            >
              Both
            </button>
            <button
              className={`view-button ${view === 'buy' ? 'active' : ''}`}
              onClick={() => setView('buy')}
            >
              Bids
            </button>
            <button
              className={`view-button ${view === 'sell' ? 'active' : ''}`}
              onClick={() => setView('sell')}
            >
              Asks
            </button>
          </div>
        </div>
      </div>

      <div className="order-book-columns">
        <div className="column-header">Price (USDT)</div>
        <div className="column-header">Amount</div>
        <div className="column-header right">Total</div>
      </div>

      <div className="order-book-content">
        {/* Asks (Sell Orders) */}
        {(view === 'both' || view === 'sell') && (
          <div className="order-list asks-list">
            {asksWithDepth.reverse().map((ask, index) => (
              <div key={`ask-${index}`} className="order-row">
                <div className="depth-bar ask" style={{ width: `${ask.total}%` }}></div>
                <div className="order-price ask">{parseFloat(ask.price).toFixed(2)}</div>
                <div className="order-quantity">{parseFloat(ask.quantity).toFixed(6)}</div>
                <div className="order-total">{(parseFloat(ask.price) * parseFloat(ask.quantity)).toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}

        {/* Bids (Buy Orders) */}
        {(view === 'both' || view === 'buy') && (
          <div className="order-list bids-list">
            {view === 'both' && orderBook.bids[0] && orderBook.asks[0] && (
              <div className="spread-indicator">
                <div className="spread-label">Spread</div>
                <div className="spread-value">
                  ${(parseFloat(orderBook.asks[0].price) - parseFloat(orderBook.bids[0].price)).toFixed(2)}
                </div>
              </div>
            )}

            {bidsWithDepth.map((bid, index) => (
              <div key={`bid-${index}`} className="order-row">
                <div className="depth-bar bid" style={{ width: `${bid.total}%` }}></div>
                <div className="order-price bid">{parseFloat(bid.price).toFixed(2)}</div>
                <div className="order-quantity">{parseFloat(bid.quantity).toFixed(6)}</div>
                <div className="order-total">{(parseFloat(bid.price) * parseFloat(bid.quantity)).toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
