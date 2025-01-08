import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client
import './index.css';
import App from './App';
import { CartProvider } from './contexts/CartContext';
import { UsersProvider } from './contexts/UserContext';
import { LogInProvider } from './contexts/LoginContext';

const container = document.getElementById('root'); // Get the root container element
const root = createRoot(container); // Create a root for rendering

root.render(
  <React.StrictMode>
    <UsersProvider>
      <LogInProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </LogInProvider>
    </UsersProvider>
  </React.StrictMode>
);