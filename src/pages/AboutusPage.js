import React from 'react';
import '../styles.css';

const AboutUsPage = () => {
  return (
    <div className="about-us-page">
      <div className="about-us-container">
        <h1>About Us</h1>
        <p>
          Welcome to <strong>MyStore</strong>, your one-stop shop for all your needs. 
          Founded in 2023, we are dedicated to providing the best products with a focus on 
          quality, affordability, and exceptional customer service.
        </p>
        <h2>Our Mission</h2>
        <p>
          Our mission is to deliver a seamless and enjoyable shopping experience. We 
          strive to build lasting relationships with our customers by offering the 
          best selection of products tailored to their needs.
        </p>
        <h2>Why Choose Us?</h2>
        <ul className="about-us-list">
          <li>Wide range of high-quality products</li>
          <li>Affordable pricing</li>
          <li>Fast and reliable shipping</li>
          <li>Exceptional customer support</li>
          <li>Secure and seamless online shopping</li>
        </ul>
        <h2>Contact Us</h2>
        <p>
          Have any questions or feedback? We'd love to hear from you! Reach out to us at:
        </p>
        <p>
          <strong>Email:</strong> support@mystore.com <br />
          <strong>Phone:</strong> +1 (123) 456-7890
        </p>
        <p>
          Thank you for choosing MyStore. We look forward to serving you!
        </p>
      </div>
    </div>
  );
};

export default AboutUsPage;