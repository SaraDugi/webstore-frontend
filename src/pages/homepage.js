import React, { useContext } from 'react';
import '../styles/homepage.css';

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
