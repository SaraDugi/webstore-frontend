import React, { useState } from 'react';
import './header.css';

const Header = ({ cartCount, user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="header">
      {/* Top Row for Cart */}
      <div className="cart-row">
        <a href="/cart" className="cart-link">🛒 Cart ({cartCount})</a>
      </div>

      {/* Main Row for Logo and Navigation */}
      <div className="main-row">
        <div className="logo">
          <h1>MyStore</h1>
        </div>
        <nav className="nav">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/about">About Us</a></li>
          </ul>
        </nav>
        {/* Profile Icon */}
        <div className="user-icon" onClick={toggleDropdown}>
          <span className="icon">👤</span>
          {dropdownOpen && (
            <ul className="dropdown-menu">
              {user ? (
                <>
                  <li><a href="/profile">Profile</a></li>
                  <li><a href="/orders">My Orders</a></li>
                  <li><a href="/settings">Settings</a></li>
                  <li><button onClick={onLogout} className="btn-logout">Logout</button></li>
                </>
              ) : (
                <>
                  <li><a href="/login">Login</a></li>
                  <li><a href="/register">Register</a></li>
                </>
              )}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;