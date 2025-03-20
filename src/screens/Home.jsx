function Home() {
    return (
        <div>
            <section className="hero">
                <h1>Welcome to Stock Market App</h1>
                <p className="subtitle">Invest, Trade, and Grow Your Wealth</p>
                <div className="hero-buttons">
                    <a href="/register" className="btn btn-register">Create Account</a>
                    <a href="/stocks" className="btn btn-login">View Stocks</a>
                </div>
            </section>

            <section className="features">
                <h2>Why Choose Us?</h2>
                <div className="feature-grid">
                    {[
                        { title: 'Portfolio Management', icon: '📈', desc: 'Track and manage your investments' },
                        { title: 'Live Trading', icon: '💹', desc: 'Buy and sell stocks in real-time' },
                        { title: 'Market Analysis', icon: '📊', desc: 'Get insights and trends on stocks' },
                        { title: 'Secure Transactions', icon: '🔒', desc: 'Trade with confidence and safety' }
                    ].map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Home;
