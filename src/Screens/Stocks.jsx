import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './Stocks.css';

function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [buyError, setBuyError] = useState(null);
  const [buyLoading, setBuyLoading] = useState(false);

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

  const handleStockClick = (stockId) => {
    navigate(`/stocks/${stockId}`);
  };

  const handleBuyClick = (e, stock) => {
    e.stopPropagation(); // Prevent navigation to stock detail
    if (!isAuthenticated) {
      setError('Please login to buy stocks');
      return;
    }
    setSelectedStock(stock);
    setShowBuyModal(true);
    setBuyError(null);
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
      console.log('Buying stock:', postData );
      const response = await axios.post('http://localhost:8083/api/trade/buy', postData);
      if (response.data) {
        setSuccessMessage(`Successfully bought ${quantity} shares of ${selectedStock.symbol}`);
        setShowBuyModal(false);
        setQuantity(1);
        // Refresh stock data
        fetchData();
      }
    } catch (err) {
      console.error('Buy stock error:', err);
      setBuyError(err.response?.data?.message || 'Failed to complete purchase');
    } finally {
      setBuyLoading(false);
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
          <div 
            key={stock.id} 
            className="stock-card"
            onClick={() => handleStockClick(stock.symbol)}
          >
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
                  onClick={(e) => handleAddToWatchlist(stock.id)}
                >
                  Add to Watchlist
                </button>
                <button 
                  className="buy-btn"
                  onClick={(e) => handleBuyClick(e, stock)}
                >
                  Buy
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

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

export default Stocks;
