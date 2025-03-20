function About() {
    const values = [
        { title: 'Transparency', icon: '📜', description: 'Providing clear and accurate market information' },
        { title: 'Innovation', icon: '🚀', description: 'Using technology to enhance trading and investment' },
        { title: 'Security', icon: '🔐', description: 'Ensuring safe and secure trading transactions' },
        { title: 'Growth', icon: '📈', description: 'Helping investors maximize their returns' }
    ];

    return (
        <div className="about-page">
            <section className="about-hero">
                <h1>About Stock Market App</h1>
                <p className="subtitle">Empowering Investors for a Brighter Future</p>
            </section>

            <section className="about-content">
                <div className="card mission-card">
                    <h2>Our Story</h2>
                    <p>
                        Established to bridge the gap between technology and stock trading, the Stock Market App
                        offers a seamless platform for investors to track, trade, and manage their portfolios. 
                        Our mission is to provide a transparent, secure, and efficient trading experience for everyone.
                    </p>
                </div>

                <div className="stats-grid">
                    {[
                        { number: '10+', label: 'Years in Financial Markets' },
                        { number: '100K+', label: 'Active Traders' },
                        { number: '500+', label: 'Stocks Listed' },
                        { number: '24/7', label: 'Market Insights' }
                    ].map((stat, index) => (
                        <div key={index} className="card stat-card">
                            <div className="stat-number">{stat.number}</div>
                            <div className="stat-label">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <div className="values-section">
                    <h2>Our Values</h2>
                    <div className="values-grid">
                        {values.map((value, index) => (
                            <div key={index} className="card value-card">
                                <div className="value-icon">{value.icon}</div>
                                <h3>{value.title}</h3>
                                <p>{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="team-section">
                    <h2>Meet Our Experts</h2>
                    <div className="team-grid">
                        {[
                            { name: 'Shoyab', position: 'Chief Market Analyst', image: '📊' },
                            { name: 'Omkar', position: 'Head of Investments', image: '💰' },
                            { name: 'Akash', position: 'Technology Lead', image: '💻' },
                            { name: 'Abhinav', position: 'Risk Management Officer', image: '⚖️' }
                        ].map((member, index) => (
                            <div key={index} className="card team-card">
                                <div className="team-member-image">{member.image}</div>
                                <h3>{member.name}</h3>
                                <p>{member.position}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;
