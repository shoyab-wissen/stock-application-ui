function Food() {
    const categories = [
        { name: 'Popular', icon: '⭐' },
        { name: 'Pizza', icon: '🍕' },
        { name: 'Burger', icon: '🍔' },
        { name: 'Sushi', icon: '🍱' },
        { name: 'Dessert', icon: '🍰' }
    ];

    const foodItems = [
        {
            name: 'Margherita Pizza',
            price: '₹299',
            rating: '4.5',
            image: '🍕',
            category: 'Pizza',
            description: 'Classic Italian pizza with tomato sauce and mozzarella'
        },
        {
            name: 'Chicken Burger',
            price: '₹199',
            rating: '4.3',
            image: '🍔',
            category: 'Burger',
            description: 'Juicy chicken patty with fresh vegetables'
        },
        {
            name: 'California Roll',
            price: '₹399',
            rating: '4.7',
            image: '🍱',
            category: 'Sushi',
            description: 'Fresh avocado and crab meat roll'
        },
        {
            name: 'Chocolate Cake',
            price: '₹249',
            rating: '4.8',
            image: '🍰',
            category: 'Dessert',
            description: 'Rich chocolate cake with ganache'
        }
    ];

    return (
        <div className="food-page">
            <section className="food-hero">
                <h1>Food Delivery</h1>
                <p className="subtitle">Delicious food delivered to your doorstep</p>
                <div className="search-bar">
                    <input type="text" placeholder="Search for food..." className="form-input" />
                    <button className="btn btn-register">Search</button>
                </div>
            </section>

            <section className="categories-section">
                <div className="categories-scroll">
                    {categories.map((category, index) => (
                        <button key={index} className="category-pill">
                            <span>{category.icon}</span>
                            {category.name}
                        </button>
                    ))}
                </div>
            </section>

            <section className="food-grid">
                {foodItems.map((item, index) => (
                    <div key={index} className="card food-card">
                        <div className="food-image">{item.image}</div>
                        <div className="food-details">
                            <h3>{item.name}</h3>
                            <p className="food-description">{item.description}</p>
                            <div className="food-meta">
                                <span className="food-price">{item.price}</span>
                                <span className="food-rating">⭐ {item.rating}</span>
                            </div>
                            <button className="btn btn-register">Add to Cart</button>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}

export default Food;