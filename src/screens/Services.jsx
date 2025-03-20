function Services() {
    const services = [
        {
            title: 'Savings Account',
            icon: '💰',
            description: 'High-interest savings accounts with zero maintenance fees',
            features: ['No minimum balance', 'Free online banking', 'Mobile app access']
        },
        {
            title: 'Fixed Deposits',
            icon: '📈',
            description: 'Secure your savings with competitive interest rates',
            features: ['Flexible tenure', 'Attractive returns', 'Auto renewal option']
        },
        {
            title: 'Personal Loans',
            icon: '💳',
            description: 'Quick personal loans with minimal documentation',
            features: ['Low interest rates', 'Quick approval', 'Flexible repayment']
        },
        {
            title: 'Investment Services',
            icon: '📊',
            description: 'Expert guidance for your investment portfolio',
            features: ['Mutual funds', 'Stock trading', 'Portfolio management']
        }
    ];

    return (
        <div className="services-page">
            <h1>Our Services</h1>
            <div className="services-grid">
                {services.map((service, index) => (
                    <div key={index} className="card service-card">
                        <div className="service-icon">{service.icon}</div>
                        <h2>{service.title}</h2>
                        <p>{service.description}</p>
                        <ul className="service-features">
                            {service.features.map((feature, i) => (
                                <li key={i}>{feature}</li>
                            ))}
                        </ul>
                        <button className="btn btn-login">Learn More</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Services
