export const DEMO_USER = {
  id: 'demo123',
  username: 'DemoTrader',
  email: 'demo@example.com',
  joinDate: '2024-01-01',
  portfolio: {
    stocks: [
      { symbol: 'AAPL', shares: 10, avgPrice: 150.50, currentPrice: 175.25 },
      { symbol: 'GOOGL', shares: 5, avgPrice: 2800.00, currentPrice: 2950.75 },
      { symbol: 'MSFT', shares: 15, avgPrice: 280.30, currentPrice: 310.20 },
      { symbol: 'TSLA', shares: 8, avgPrice: 190.75, currentPrice: 205.60 },
      { symbol: 'AMZN', shares: 12, avgPrice: 135.20, currentPrice: 142.80 }
    ],
    totalValue: 28450.75,
    dailyGainLoss: 875.20
  },
  watchlist: [
    { symbol: 'NVDA', currentPrice: 475.20, dayChange: +2.5 },
    { symbol: 'META', currentPrice: 325.80, dayChange: -1.2 },
    { symbol: 'AMD', currentPrice: 128.90, dayChange: +1.8 },
    { symbol: 'DIS', currentPrice: 95.40, dayChange: +0.5 }
  ],
  tradingHistory: [
    { date: '2024-01-15', type: 'BUY', symbol: 'AAPL', shares: 5, price: 148.50 },
    { date: '2024-01-10', type: 'SELL', symbol: 'GOOGL', shares: 2, price: 2900.00 },
    { date: '2024-01-05', type: 'BUY', symbol: 'MSFT', shares: 8, price: 275.60 }
  ]
};