import React from 'react';
import '../styles.css';

const AboutUsPage = () => {
  return (
    <div className="about-us-page">
      <div className="about-us-container">
        <h1 className="about-us-title">About Us</h1>
        <p className="about-us-text">
          Welcome to <strong>MyStore</strong>, your one-stop shop for all your needs. 
          Founded in 2023, we are dedicated to providing the best products with a focus on 
          quality, affordability, and exceptional customer service.
        </p>
        <h2 className="about-us-subtitle">Our Mission</h2>
        <p className="about-us-text">
          Our mission is to deliver a seamless and enjoyable shopping experience. We 
          strive to build lasting relationships with our customers by offering the 
          best selection of products tailored to their needs.
        </p>
        <h2 className="about-us-subtitle">Why Choose Us?</h2>
        <ul className="about-us-list">
          <li className="about-us-list-item">Wide range of high-quality products</li>
          <li className="about-us-list-item">Affordable pricing</li>
          <li className="about-us-list-item">Fast and reliable shipping</li>
          <li className="about-us-list-item">Exceptional customer support</li>
          <li className="about-us-list-item">Secure and seamless online shopping</li>
        </ul>
        <h2 className="about-us-subtitle">Contact Us</h2>
        <p className="about-us-text">
          Have any questions or feedback? We'd love to hear from you! Reach out to us at:
        </p>
        <p className="about-us-contact">
          <strong>Email:</strong> support@mystore.com <br />
          <strong>Phone:</strong> +1 (123) 456-7890
        </p>
        <p className="about-us-text">
          Thank you for choosing MyStore. We look forward to serving you!
        </p>
      </div>
    </div>
  );
};

export default AboutUsPage;
