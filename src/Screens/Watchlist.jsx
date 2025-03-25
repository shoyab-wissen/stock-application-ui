import React, { useEffect, useState } from 'react';
import './Watchlist.css';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { watchlistApi } from '../services/api';

function Watchlist() {
  const [watchlistData, setWatchlistData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { user, isAuthenticated } = useUser();

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      getWatchlist();
    }
  }, [user, isAuthenticated]);

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

  async function getWatchlist() {
    try {
      setLoading(true);
      setError(null);
      const watchlist = await watchlistApi.getWatchlist(user.id);
      setWatchlistData(watchlist || []);
    } catch (err) {
      setError('Failed to fetch watchlist');
      console.error('Error fetching watchlist:', err);
      setWatchlistData([]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteWatchlistItem(id) {
    try {
      setLoading(true);
      await watchlistApi.removeFromWatchlist(user.id, id);
      setSuccessMessage('Stock removed from watchlist');
      const updatedWatchlist = await watchlistApi.getWatchlist(user.id);
      setWatchlistData(updatedWatchlist || []);
    } catch (err) {
      setError('Failed to remove stock from watchlist');
      console.error('Error removing stock:', err);
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="watchlist-unauthorized">
        <h2>Please Log In</h2>
        <p>You need to be logged in to view your watchlist.</p>
        <Link to="/login" className="login-link">Log In</Link>
      </div>
    );
  }

  if (loading) {
    return <div className="watchlist-loading">Loading...</div>;
  }

  return (
    <div className="watchlist">
      <div className="watchlist-header">
              <h2>Your Watchlist</h2>
                <Link to="/stocks" className="add-stock-btn">
                  Add Stocks 
                </Link>
            </div>

      {/* Message Display */}
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      {(!watchlistData || watchlistData.length === 0) ? (
        <div className="empty-watchlist">
          <p>Your watchlist is empty.</p>
          <Link to="/stocks" className="nav-link">Browse available stocks</Link>
        </div>
      ) : (
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
                  <p className={priceChange >= 0 ? 'gain' : 'loss'}>
                    ${Math.abs(priceChange).toFixed(2)} ({changePercent}%)
                  </p>
                </div>
                <div className="card-actions">
                  <button className="action-btn buy">Buy</button>
                  <button 
                    className="action-btn remove" 
                    onClick={() => deleteWatchlistItem(stock.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Watchlist;
