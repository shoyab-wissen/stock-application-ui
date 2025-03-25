import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Home() {
    const { isAuthenticated } = useUser();

    return (
        <div className="home">
            <section className="hero">
                <div className="hero-content">
                    <h1>Trade Smarter, Not Harder</h1>
                    <p>Your all-in-one platform for stock trading and market analysis</p>
                    <Link to={isAuthenticated ? "/stocks" : "/register"}>
                        <button className="cta-button">
                            {isAuthenticated ? "Browse Stocks" : "Get Started"}
                        </button>
                    </Link>
                </div>
            </section>

            <section className="features">
                <h2>Why Choose Us</h2>
                <div className="feature-grid">
                    <div className="feature-card">
                        <h3>Real-Time Data</h3>
                        <p>Get instant access to market data and stock prices</p>
                    </div>
                    <div className="feature-card">
                        <h3>Advanced Analytics</h3>
                        <p>Powerful tools for technical and fundamental analysis</p>
                    </div>
                    <div className="feature-card">
                        <h3>Portfolio Tracking</h3>
                        <p>Monitor your investments in one place</p>
                    </div>
                    <div className="feature-card">
                        <h3>Market Insights</h3>
                        <p>Expert analysis and market news at your fingertips</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
