import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Include global styles
import App from './App';
import { CartProvider } from './contexts/CartContext'; // Import CartProvider

ReactDOM.render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>,
  document.getElementById('root') // Ensure your `index.html` has a root div
);