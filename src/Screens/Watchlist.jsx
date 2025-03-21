import React, { useEffect, useState } from 'react';
import './Watchlist.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Watchlist() {
  const [watchlistData, setWatchlistData] = useState([]);
  useEffect(() => {
    getWatchlist();
  }, []);
  function getWatchlist() {
    axios.get('http://localhost:9999/portfolio/api/portfolio/1/watchlist')
    .then(
      (response) => {
        console.log(response.data.data);
        if (response.data.data != null) {
          setWatchlistData(response.data.data);
        }
        else{
          setWatchlistData([]);
        }
      }
    )
  }
  function deleteWatchlistItem(id) {
    axios.delete('http://localhost:8081/api/portfolio/1/watchlist/' + id)
    .then(
      (response) => {
        console.log(response.data.data);
        getWatchlist();
      }
    )
  }
  return (
    <div className="watchlist">
      <div className="watchlist-header">
        <h1>My Watchlist</h1>
        
        <button className="add-stock-btn"><Link to="/stocks" className="nav-link">+ Add Stocks</Link></button>
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
                <button className="action-btn remove" onClick={() => deleteWatchlistItem(stock.id)}>Remove</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Watchlist;



