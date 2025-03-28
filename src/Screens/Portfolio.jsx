import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { watchlistApi } from '../services/api';
import './Portfolio.css';

function Portfolio() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [tradeType, setTradeType] = useState(null); // 'BUY' or 'SELL'
  const [quantity, setQuantity] = useState(1);
  const [tradeError, setTradeError] = useState(null);
  const [tradeLoading, setTradeLoading] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [buyError, setBuyError] = useState(null);
  const [buyLoading, setBuyLoading] = useState(false);

  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      navigate('/login');
      return;
    }
    fetchAllData();
  }, [user, isAuthenticated, navigate]);

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

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [summaryResponse, holdingsResponse, portfolioResponse, watchlistData] = await Promise.all([
        axios.get(`http://localhost:9999/portfolio/api/portfolio/${user.id}/summary`),
        axios.get(`http://localhost:9999/portfolio/api/portfolio/${user.id}/holdings`),
        axios.get(`http://localhost:9999/portfolio/api/portfolio/${user.id}`),
        watchlistApi.getWatchlist(user.id)
      ]);

      setSummary(summaryResponse.data.data);
      setHoldings(holdingsResponse.data.data);
      setPortfolioData(portfolioResponse.data.data);
      setWatchlist(watchlistData || []); // watchlistData is already an array or empty array

    } catch (err) {
      console.error('Data fetch error:', err);
      setError(err.response?.data?.message || 'Failed to fetch data');
      
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (stockId) => {
    try {
      await watchlistApi.removeFromWatchlist(user.id, stockId);
      setSuccessMessage('Stock removed from watchlist');
      const updatedWatchlist = await watchlistApi.getWatchlist(user.id);
      setWatchlist(updatedWatchlist);
    } catch (err) {
      setError(err.message || 'Failed to remove from watchlist');
    }
  };

  const handleTradeClick = (holding, type) => {
    setSelectedHolding(holding);
    setTradeType(type);
    setQuantity(1);
    setTradeError(null);
    setShowTradeModal(true);
  };

  const handleTradeSubmit = async () => {
    setTradeError(null);
    setTradeLoading(true);

    try {
      const endpoint = `http://localhost:8083/api/trade/${tradeType.toLowerCase()}`;
      const response = await axios.post(endpoint, {
        userId: user.id,
        stockSymbol: selectedHolding.stock.symbol,
        quantity: parseInt(quantity),
        price: selectedHolding.stock.price,
        tradeType: tradeType
      });

      if (response.data) {
        setSuccessMessage(`Successfully ${tradeType.toLowerCase()}ed ${quantity} shares of ${selectedHolding.stock.symbol}`);
        setShowTradeModal(false);
        setQuantity(1);
        // Refresh portfolio data
        fetchAllData();
      }
    } catch (err) {
      console.error('Trade error:', err);
      setTradeError(err.response?.data?.message || `Failed to ${tradeType.toLowerCase()} stock`);
    } finally {
      setTradeLoading(false);
    }
  };

  const handleBuyClick = (stock) => {
    if (!isAuthenticated) {
      setError('Please login to buy stocks');
      return;
    }
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
        // Refresh portfolio data
        fetchAllData();
      }
    } catch (err) {
      console.error('Buy stock error:', err);
      setBuyError(err.response?.data?.message || 'Failed to complete purchase');
    } finally {
      setBuyLoading(false);
    }
  };

  if (!user || !user.id) {
    return (
      <div className="portfolio-error">
        <h3>Not Authenticated</h3>
        <p>Please log in to view your portfolio.</p>
        <button className="login-btn" onClick={() => navigate('/login')}>
          Log In
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="portfolio-loading">
        <div className="loader"></div>
        <p>Loading your portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="portfolio-error">
        <h3>Error</h3>
        <p>{error}</p>
        <button className="retry-btn" onClick={fetchAllData}>
          Retry
        </button>
      </div>
    );
  }

  const hasHoldings = holdings && holdings.length > 0;
  const hasSummary = summary && Object.keys(summary).length > 0;

  if (!hasHoldings && !hasSummary) {
    return (
      <div className="portfolio-empty">
        <h3>No Portfolio Data</h3>
        <p>You don't have any holdings in your portfolio yet.</p>
        <button className="browse-stocks-btn" onClick={() => navigate('/stocks')}>
          Browse Stocks
        </button>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      {successMessage && <div className="success-message">{successMessage}</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Summary Section */}
      {summary && (
        <div className="portfolio-summary">
          <h2>Portfolio Summary</h2>
          <div className="summary-stats">
            <div className="stat-item">
              <span>Total Investment:</span>
              <span>${summary.totalInvestment?.toFixed(2)}</span>
            </div>
            <div className="stat-item">
              <span>Current Value:</span>
              <span>${summary.currentValue?.toFixed(2)}</span>
            </div>
            <div className="stat-item">
              <span>Total Profit/Loss:</span>
              <span className={summary.profitLoss >= 0 ? 'profit' : 'loss'}>
                ${Math.abs(summary.profitLoss)?.toFixed(2)}
                ({summary.profitLossPercentage?.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Holdings Section */}
      {holdings && holdings.length > 0 && (
        <div className="holdings-section">
          <h2>Your Holdings</h2>
          <div className="holdings-list">
            {holdings.map(holding => (
              <div key={holding.id} className="holding-item">
                <div className="holding-header">
                  <h3>{holding.stock.name}</h3>
                  <span className="stock-symbol">{holding.stock.symbol}</span>
                </div>
                <div className="holding-details">
                  <div className="detail-row">
                    <span>Quantity:</span>
                    <span>{holding.quantity}</span>
                  </div>
                  <div className="detail-row">
                    <span>Current Price:</span>
                    <span>${holding.stock.price.toFixed(2)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Last Updated:</span>
                    <span>{new Date(holding.stock.lastUpdated).toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span>Total Investment:</span>
                    <span>${holding.totalInvestment.toFixed(2)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Current Value:</span>
                    <span>${holding.currentValue.toFixed(2)}</span>
                  </div>
                  <div className="detail-row">
                    <span>Profit/Loss:</span>
                    <span className={holding.profitLoss >= 0 ? 'profit' : 'loss'}>
                      ${Math.abs(holding.profitLoss).toFixed(2)}
                      ({((holding.profitLoss / holding.totalInvestment) * 100).toFixed(2)}%)
                    </span>
                  </div>
                  <div className="detail-row">
                    <span>Day Range:</span>
                    <span>${holding.stock.minValue.toFixed(2)} - ${holding.stock.maxValue.toFixed(2)}</span>
                  </div>
                </div>
                <div className="holding-actions">
                  <button 
                    className="buy-more-btn"
                    onClick={() => handleTradeClick(holding, 'BUY')}
                  >
                    Buy More
                  </button>
                  <button 
                    className="sell-btn"
                    onClick={() => handleTradeClick(holding, 'SELL')}
                  >
                    Sell
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Watchlist Section */}
      <div className="watchlist-section">
        <h2>Your Watchlist</h2>
        {watchlist && watchlist.length > 0 ? (
          <div className="watchlist-grid">
            {watchlist.map(stock => {
              const priceChange = stock.price - stock.lastClosingPrice;
              const changePercent = ((priceChange / stock.lastClosingPrice) * 100).toFixed(2);
              
              return (
                <div key={stock.id} className="watchlist-item">
                  <div className="stock-header">
                    <h3>{stock.name}</h3>
                    <span className="stock-symbol">{stock.symbol}</span>
                  </div>
                  <div className="stock-details">
                    <div className="detail-row">
                      <span>Current Price:</span>
                      <span>${stock.price.toFixed(2)}</span>
                    </div>
                    <div className="detail-row">
                      <span>Price Change:</span>
                      <span className={priceChange >= 0 ? 'profit' : 'loss'}>
                        ${Math.abs(priceChange).toFixed(2)} ({changePercent}%)
                      </span>
                    </div>
                    <div className="detail-row">
                      <span>Day Range:</span>
                      <span>${stock.minValue} - ${stock.maxValue}</span>
                    </div>
                    <div className="detail-row">
                      <span>Last Updated:</span>
                      <span>{new Date(stock.lastUpdated).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="watchlist-actions">
                    <button 
                      className="remove-btn"
                      onClick={() => handleRemoveFromWatchlist(stock.id)}
                    >
                      Remove from Watchlist
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-watchlist">
            <p>Your watchlist is empty.</p>
            <button className="browse-stocks-btn" onClick={() => navigate('/stocks')}>
              Browse Stocks
            </button>
          </div>
        )}
      </div>

      {/* Trade Modal */}
      {showTradeModal && selectedHolding && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{tradeType} {selectedHolding.stock.symbol}</h3>
            <div className="modal-content">
              <div className="stock-info">
                <p>Current Price: ${selectedHolding.stock.price.toFixed(2)}</p>
                {tradeType === 'SELL' && (
                  <p>Available Shares: {selectedHolding.quantity}</p>
                )}
                <p>Total {tradeType === 'BUY' ? 'Cost' : 'Value'}: 
                  ${(selectedHolding.stock.price * quantity).toFixed(2)}
                </p>
              </div>
              <div className="quantity-input">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={tradeType === 'SELL' ? selectedHolding.quantity : undefined}
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    if (tradeType === 'SELL') {
                      setQuantity(Math.min(Math.max(1, value), selectedHolding.quantity));
                    } else {
                      setQuantity(Math.max(1, value));
                    }
                  }}
                />
              </div>
              {tradeError && <div className="error-message">{tradeError}</div>}
              <div className="modal-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowTradeModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="confirm-btn"
                  onClick={handleTradeSubmit}
                  disabled={tradeLoading || (tradeType === 'SELL' && quantity > selectedHolding.quantity)}
                >
                  {tradeLoading ? 'Processing...' : `Confirm ${tradeType}`}
                </button>
              </div>
            </div>
          </div>
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

export default Portfolio;

