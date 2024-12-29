import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { CartProvider } from './contexts/CartContext';
import { UsersProvider } from './contexts/UserContext';
import { LogInProvider } from './contexts/LoginContext';

ReactDOM.render(
  <React.StrictMode>
      <UsersProvider>
        <LogInProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </LogInProvider>
      </UsersProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
