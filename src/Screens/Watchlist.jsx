import React, { useEffect, useState } from 'react';
import './Watchlist.css';
import axios from 'axios';

function Watchlist() {
  const [watchlistData, setWatchlistData] = useState([]);
  useEffect(() => {
    getWatchlist();
  }, []);
  function getWatchlist() {
    axios.get('http://localhost:8081/api/portfolio/2/watchlist')
    .then(
      (response) => {
        console.log(response.data.data);
        setWatchlistData(response.data.data);
      }
    )
  }
  return (
    <div className="watchlist">
      <div className="watchlist-header">
        <h1>My Watchlist</h1>
        <button className="add-stock-btn">+ Add Stock</button>
      </div>

      <div className="watchlist-grid">
        {watchlistData.map((stock) => {
          const priceChange = stock.price - stock.lastClosingPrice;
          const changePercent = ((priceChange / stock.lastClosingPrice) * 100).toFixed(2);
          
          return (
            <div key={stock.id} className="stock-card">
              <div className="stock-info">
                <h2>{stock.symbol}</h2>
                <p className="stock-name">{stock.name}</p>
                <p className="stock-price">${stock.price.toFixed(2)}</p>
              </div>
              <div className="stock-details">
                <div className="detail-row">
                  <span>Day Range:</span>
                  <span>${stock.minValue} - ${stock.maxValue}</span>
                </div>
                <div className="detail-row">
                  <span>Quantity:</span>
                  <span>{stock.quantity}</span>
                </div>
                <div className="detail-row">
                  <span>Total Value:</span>
                  <span>${stock.totalValue.toLocaleString()}</span>
                </div>
              </div>
              <div className="stock-change">
                <p className={priceChange > 0 ? 'gain' : 'loss'}>
                  ${Math.abs(priceChange).toFixed(2)} ({changePercent}%)
                </p>
              </div>
              <div className="card-actions">
                <button className="action-btn buy">Buy</button>
                <button className="action-btn remove">Remove</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Watchlist;



