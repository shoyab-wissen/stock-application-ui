import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Stocks.css';

function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/stocks');
      setStocks(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch stocks');
      setLoading(false);
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
                      <button className="action-btn buy">Buy</button>
                      <button className="action-btn watch">Watch</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Stocks;