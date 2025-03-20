function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Stock Market App</h3>
                    <p>Empowering investors with real-time stock trading and market insights.</p>
                </div>
                
                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/market">Market Trends</a></li>
                        <li><a href="/portfolio">My Portfolio</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Contact Us</h4>
                    <ul>
                        <li>📞 1800-STOCKS-24</li>
                        <li>📧 support@stockmarketapp.com</li>
                        <li>📍 100 Wall Street, New York, NY</li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Follow Us</h4>
                    <div className="social-links">
                        <a href="#" className="social-link">Twitter</a>
                        <a href="#" className="social-link">LinkedIn</a>
                        <a href="#" className="social-link">YouTube</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 Stock Market App. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
