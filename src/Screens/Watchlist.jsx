import React from 'react';
import './Watchlist.css';

function Watchlist() {
  const watchlistData = [
    { symbol: 'TSLA', price: 242.50, change: +15.30, changePercent: +6.73 },
    { symbol: 'AMZN', price: 3320.75, change: -12.25, changePercent: -0.37 },
    { symbol: 'NFLX', price: 425.80, change: +8.40, changePercent: +2.01 },
  ];

  return (
    <div className="watchlist">
      <div className="watchlist-header">
        <h1>My Watchlist</h1>
        <button className="add-stock-btn">+ Add Stock</button>
      </div>

      <div className="watchlist-grid">
        {watchlistData.map((stock) => (
          <div key={stock.symbol} className="stock-card">
            <div className="stock-info">
              <h2>{stock.symbol}</h2>
              <p className="stock-price">${stock.price}</p>
            </div>
            <div className="stock-change">
              <p className={stock.change > 0 ? 'gain' : 'loss'}>
                ${Math.abs(stock.change)} ({stock.changePercent}%)
              </p>
            </div>
            <div className="card-actions">
              <button className="action-btn buy">Buy</button>
              <button className="action-btn remove">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Watchlist;