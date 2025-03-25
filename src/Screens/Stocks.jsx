import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './Stocks.css';

function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { user, isAuthenticated } = useUser();

  useEffect(() => {
    fetchData();
  }, []);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const stocksResponse = await axios.get('http://localhost:9999/trading/api/stocks');
      console.log(stocksResponse.data.data);
      setStocks(stocksResponse.data.data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWatchlist = async (stockId) => {
    // Clear any existing messages
    setError(null);
    setSuccessMessage(null);

    if (!isAuthenticated || !user) {
      setError('Please login to add stocks to watchlist');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:9999/portfolio/api/portfolio/${user.id}/watchlist/${stockId}`
      );
      setSuccessMessage('Stock added to watchlist successfully');
      console.log('Added to watchlist:', response.data);
    } catch (err) {
      console.error('Failed to add to watchlist:', err);
      if (err.response?.data?.message?.includes('already exists')) {
        setError('Stock is already in your watchlist');
      } else {
        setError(err.response?.data?.message || 'Failed to add to watchlist');
      }
    }
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="stocks-container">
      <div className="stocks-header">
        <h2>Available Stocks</h2>
        {isAuthenticated && (
          <Link to="/watchlist" className="view-watchlist-btn">
            View Watchlist
          </Link>
        )}
      </div>

      {/* Message Display */}
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {!isAuthenticated && (
        <div className="login-banner">
          <Link to="/login" className="login-link">
            Log in to start trading and managing your watchlist
          </Link>
        </div>
      )}

      <div className="stocks-grid">
        {stocks.map(stock => (
          <div key={stock.id} className="stock-card">
            <div className="stock-header">
              <h3>{stock.name}</h3>
              <span className="stock-symbol">{stock.symbol}</span>
            </div>
            
            <div className="stock-price">
              <span className="current-price">${stock.price.toFixed(2)}</span>
              <span className="price-change">
                Last closing: ${stock.lastClosingPrice.toFixed(2)}
              </span>
            </div>

            <div className="stock-details">
              <div className="detail-row">
                <span>Quantity:</span>
                <span>{stock.quantity.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span>Total Value:</span>
                <span>${stock.totalValue.toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span>Day Range:</span>
                <span>${stock.minValue.toFixed(2)} - ${stock.maxValue.toFixed(2)}</span>
              </div>
            </div>

            {isAuthenticated && (
              <div className="stock-actions">
                <button 
                  className="watchlist-btn"
                  onClick={() => handleAddToWatchlist(stock.id)}
                >
                  Add to Watchlist
                </button>
                <button className="buy-btn">
                  Buy
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stocks;
