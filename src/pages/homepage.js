import React, { useContext } from 'react';
import '../styles.css';
import { CartContext } from '../contexts/CartContext'; // Assuming you have a CartContext

const HomePage = () => {
  const { addToCart } = useContext(CartContext); // Access the addToCart function

  const featuredProducts = [
    { id: 1, name: 'Product 1', price: '$19.99', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Product 2', price: '$29.99', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Product 3', price: '$39.99', image: 'https://via.placeholder.com/150' },
  ];

  const handleAddToCart = (product) => {
    addToCart(product); // Call the context function to add the product to the cart
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to MyStore</h1>
          <p>Your one-stop shop for all your needs</p>
          <a href="/products" className="cta-button">Shop Now</a>
        </div>
      </section>

      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="products">
          {featuredProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.price}</p>
              <button
                className="add-to-cart-button"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="services">
        <h2>Our Services</h2>
        <div className="service-list">
          <div className="service-card">
            <h3>Fast Shipping</h3>
            <p>Get your products delivered quickly and reliably.</p>
          </div>
          <div className="service-card">
            <h3>Secure Payments</h3>
            <p>Your transactions are safe with us.</p>
          </div>
          <div className="service-card">
            <h3>24/7 Support</h3>
            <p>We're here to help you anytime you need.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;