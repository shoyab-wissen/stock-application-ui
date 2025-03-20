import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPortfolioData, setLoading, setError } from '../store/slices/portfolioSlice';
import './Portfolio.css';

function Portfolio() {
  const dispatch = useDispatch();
  const { stocks, totalValue, dailyGainLoss, loading, error } = useSelector((state) => state.portfolio);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      dispatch(setLoading(true));
      try {
        // Replace with actual API call
        const mockData = {
          stocks: [
            { symbol: 'AAPL', shares: 10, avgPrice: 150.50, currentPrice: 175.25 },
            { symbol: 'GOOGL', shares: 5, avgPrice: 2800.00, currentPrice: 2950.75 },
            { symbol: 'MSFT', shares: 15, avgPrice: 280.30, currentPrice: 310.20 },
          ],
          totalValue: 12450.75,
          dailyGainLoss: 345.20,
        };
        dispatch(setPortfolioData(mockData));
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchPortfolioData();
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const calculateValue = (shares, price) => (shares * price).toFixed(2);
  const calculateGainLoss = (shares, currentPrice, avgPrice) => 
    ((currentPrice - avgPrice) * shares).toFixed(2);

  return (
    <div className="portfolio">
      <div className="portfolio-header">
        <h1>My Portfolio</h1>
        <div className="portfolio-summary">
          <div className="summary-card">
            <h3>Total Value</h3>
            <p>${totalValue}</p>
          </div>
          <div className="summary-card">
            <h3>Today's Gain/Loss</h3>
            <p className={dailyGainLoss >= 0 ? 'gain' : 'loss'}>
              {dailyGainLoss >= 0 ? '+' : '-'}${Math.abs(dailyGainLoss)}
            </p>
          </div>
        </div>
      </div>

      <div className="portfolio-table">
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Shares</th>
              <th>Avg Price</th>
              <th>Current Price</th>
              <th>Current Value</th>
              <th>Gain/Loss</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.symbol}>
                <td>{stock.symbol}</td>
                <td>{stock.shares}</td>
                <td>${stock.avgPrice}</td>
                <td>${stock.currentPrice}</td>
                <td>${calculateValue(stock.shares, stock.currentPrice)}</td>
                <td className={calculateGainLoss(stock.shares, stock.currentPrice, stock.avgPrice) > 0 ? 'gain' : 'loss'}>
                  ${calculateGainLoss(stock.shares, stock.currentPrice, stock.avgPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Portfolio;
