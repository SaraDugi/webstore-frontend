// Footer.jsx
import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} MyStore. All Rights Reserved.</p>
        <p>
          Follow us:
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"> Facebook</a> |
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"> Twitter</a> |
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"> Instagram</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
