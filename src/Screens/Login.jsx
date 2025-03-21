import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../store/slices/authSlice';
import { setProfileData } from '../store/slices/profileSlice';
import { setPortfolioData } from '../store/slices/portfolioSlice';
import { setWatchlistData } from '../store/slices/watchlistSlice';
import { DEMO_USER } from '../constants/demoUser';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector(state => state.auth);

  const handleDemoLogin = () => {
    // Simulate loading
    dispatch(loginSuccess({
      id: DEMO_USER.id,
      username: DEMO_USER.username,
      email: DEMO_USER.email
    }));

    // Set profile data
    dispatch(setProfileData({
      username: DEMO_USER.username,
      email: DEMO_USER.email,
      joinDate: DEMO_USER.joinDate,
      tradingHistory: DEMO_USER.tradingHistory
    }));

    // Set portfolio data
    dispatch(setPortfolioData({
      stocks: DEMO_USER.portfolio.stocks,
      totalValue: DEMO_USER.portfolio.totalValue,
      dailyGainLoss: DEMO_USER.portfolio.dailyGainLoss
    }));

    // Set watchlist data
    dispatch(setWatchlistData(DEMO_USER.watchlist));

    navigate('/portfolio');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('Regular login is disabled in demo mode. Please use the demo login.');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <button 
            type="button" 
            className="demo-login-button"
            onClick={handleDemoLogin}
            disabled={loading}
          >
            Try Demo Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
