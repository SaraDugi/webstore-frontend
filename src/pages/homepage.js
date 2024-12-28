import React from 'react';
import '../styles.css';

const HomePage = () => {
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
          <div className="product-card">
            <img src="https://via.placeholder.com/150" alt="Product 1" />
            <h3>Product 1</h3>
            <p>$19.99</p>
          </div>
          <div className="product-card">
            <img src="https://via.placeholder.com/150" alt="Product 2" />
            <h3>Product 2</h3>
            <p>$29.99</p>
          </div>
          <div className="product-card">
            <img src="https://via.placeholder.com/150" alt="Product 3" />
            <h3>Product 3</h3>
            <p>$39.99</p>
          </div>
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