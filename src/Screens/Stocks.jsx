import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Stocks.css';

function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [buyError, setBuyError] = useState(null);

  // Assuming user ID is stored in localStorage after login
  const userId = localStorage.getItem('userId') || 1;

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await axios.get('http://localhost:9999/trading/api/stocks');
      setStocks(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch stocks');
      setLoading(false);
    }
  };

  const handleBuyClick = (stock) => {
    setSelectedStock(stock);
    setShowBuyModal(true);
    setBuyError(null);
  };
  const addToWatchlist = async (stock) => {
    axios.post("http://localhost:9999/portfolio/api/portfolio/1/watchlist/" + stock.id)
    .then(
      (response) => {
        console.log(response.data.data);
      }
    )
    
  }
  const handleBuySubmit = async () => {
    try {
      const buyData = {
        userId: userId,
        stockSymbol: selectedStock.symbol,
        quantity: parseInt(quantity),
        price: selectedStock.price,
        tradeType: "BUY"
      };
      console.log(buyData);
      
      await axios.post('http://localhost:9999/trading/api/trade/buy', buyData);
      setShowBuyModal(false);
      setQuantity(1);
      // Optionally refresh the stocks list
      fetchStocks();
    } catch (err) {
      setBuyError(err.response?.data?.message || 'Failed to process buy order');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="stocks">
      <div className="stocks-header">
        <h1>Available Stocks</h1>
      </div>

      <div className="stocks-table">
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Company</th>
              <th>Price</th>
              <th>Day Range</th>
              <th>Change</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => {
              const priceChange = stock.price - stock.lastClosingPrice;
              const changePercent = ((priceChange / stock.lastClosingPrice) * 100).toFixed(2);

              return (
                <tr key={stock.id}>
                  <td>{stock.symbol}</td>
                  <td>{stock.name}</td>
                  <td>${stock.price.toFixed(2)}</td>
                  <td>${stock.minValue} - ${stock.maxValue}</td>
                  <td className={priceChange >= 0 ? 'gain' : 'loss'}>
                    ${Math.abs(priceChange).toFixed(2)} ({changePercent}%)
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn buy" onClick={() => handleBuyClick(stock)}>Buy</button>
                      <button className="action-btn watch" onClick={() => addToWatchlist(stock)}>Watch</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showBuyModal && selectedStock && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Buy {selectedStock.symbol}</h2>
            <div className="modal-content">
              <div className="stock-info">
                <p>Current Price: ${selectedStock.price.toFixed(2)}</p>
                <p>Total Cost: ${(selectedStock.price * quantity).toFixed(2)}</p>
              </div>
              <div className="form-group">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              {buyError && <div className="error-message">{buyError}</div>}
              <div className="modal-actions">
                <button className="action-btn buy" onClick={handleBuySubmit}>
                  Confirm Buy
                </button>
                <button className="action-btn cancel" onClick={() => setShowBuyModal(false)}>
                  Cancel
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