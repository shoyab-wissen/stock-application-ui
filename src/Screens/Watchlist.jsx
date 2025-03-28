import React, { useEffect, useState } from 'react';
import './Watchlist.css';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { watchlistApi } from '../services/api';
import axios from 'axios';

function Watchlist() {
  const [watchlistData, setWatchlistData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { user, isAuthenticated } = useUser();

  // Buy Modal States
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [buyError, setBuyError] = useState(null);
  const [buyLoading, setBuyLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      getWatchlist();
    }
  }, [user, isAuthenticated]);

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

  const handleBuyClick = (stock) => {
    setSelectedStock(stock);
    setShowBuyModal(true);
    setBuyError(null);
    setQuantity(1);
  };

  const handleBuySubmit = async () => {
    setBuyError(null);
    setBuyLoading(true);

    try {
      const postData = {
        userId: user.id,
        stockSymbol: selectedStock.symbol,
        quantity: parseInt(quantity),
        price: selectedStock.price,
        tradeType: 'BUY'
      };

      const response = await axios.post('http://localhost:8083/api/trade/buy', postData);
      
      if (response.data) {
        setSuccessMessage(`Successfully bought ${quantity} shares of ${selectedStock.symbol}`);
        setShowBuyModal(false);
        setQuantity(1);
        // Refresh watchlist data
        getWatchlist();
      }
    } catch (err) {
      console.error('Buy stock error:', err);
      setBuyError(err.response?.data?.message || 'Failed to complete purchase');
    } finally {
      setBuyLoading(false);
    }
  };

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
                  <button 
                    className="action-btn buy"
                    onClick={() => handleBuyClick(stock)}
                  >
                    Buy
                  </button>
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

      {/* Buy Modal */}
      {showBuyModal && selectedStock && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Buy {selectedStock.symbol}</h3>
            <div className="modal-content">
              <div className="price-info">
                <p>Current Price: ${selectedStock.price.toFixed(2)}</p>
                <p>Total Cost: ${(selectedStock.price * quantity).toFixed(2)}</p>
              </div>
              <div className="quantity-input">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
              {buyError && <div className="error-message">{buyError}</div>}
              <div className="modal-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowBuyModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="confirm-btn"
                  onClick={handleBuySubmit}
                  disabled={buyLoading}
                >
                  {buyLoading ? 'Processing...' : 'Confirm Purchase'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Watchlist;
