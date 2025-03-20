import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Portfolio.css';

function Portfolio() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/portfolio/1');
        setPortfolioData(response.data.data);
      } catch (err) {
        setError('Failed to fetch portfolio data');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!portfolioData) return null;

  const calculateTotalValue = () => {
    return portfolioData.ownedStocks.reduce((total, stock) => total + stock.currentValue, 0);
  };

  const calculateTotalProfitLoss = () => {
    return portfolioData.ownedStocks.reduce((total, stock) => total + stock.profitLoss, 0);
  };

  return (
    <div className="portfolio">
      <div className="portfolio-header">
        <h1>Portfolio Overview</h1>
        <div className="user-info">
          <p>Account: {portfolioData.name}</p>
          <p>Balance: ${portfolioData.balance.toLocaleString()}</p>
        </div>
        <div className="portfolio-summary">
          <div className="summary-card">
            <h3>Total Portfolio Value</h3>
            <p>${calculateTotalValue().toLocaleString()}</p>
          </div>
          <div className="summary-card">
            <h3>Total Profit/Loss</h3>
            <p className={calculateTotalProfitLoss() >= 0 ? 'gain' : 'loss'}>
              ${Math.abs(calculateTotalProfitLoss()).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="holdings-section">
        <h2>Holdings</h2>
        <div className="portfolio-table">
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Company</th>
                <th>Quantity</th>
                <th>Avg. Buy Price</th>
                <th>Current Price</th>
                <th>Total Investment</th>
                <th>Current Value</th>
                <th>Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              {portfolioData.ownedStocks.map((holding) => (
                <tr key={holding.id}>
                  <td>{holding.stock.symbol}</td>
                  <td>{holding.stock.name}</td>
                  <td>{holding.quantity}</td>
                  <td>${holding.averageBuyPrice.toFixed(2)}</td>
                  <td>${holding.stock.price.toFixed(2)}</td>
                  <td>${holding.totalInvestment.toLocaleString()}</td>
                  <td>${holding.currentValue.toLocaleString()}</td>
                  <td className={holding.profitLoss >= 0 ? 'gain' : 'loss'}>
                    ${Math.abs(holding.profitLoss).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="watchlist-section">
        <h2>Watchlist</h2>
        <div className="watchlist-grid">
          {portfolioData.watchlist.map((stock) => {
            const priceChange = stock.price - stock.lastClosingPrice;
            const changePercent = ((priceChange / stock.lastClosingPrice) * 100).toFixed(2);
            
            return (
              <div key={stock.id} className="stock-card">
                <div className="stock-header">
                  <h3>{stock.symbol}</h3>
                  <p>{stock.name}</p>
                </div>
                <div className="stock-price">
                  <span>${stock.price.toFixed(2)}</span>
                  <span className={priceChange >= 0 ? 'gain' : 'loss'}>
                    {changePercent}%
                  </span>
                </div>
                <div className="stock-details">
                  <p>Day Range: ${stock.minValue} - ${stock.maxValue}</p>
                  <button className="buy-btn">Buy</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Portfolio;

