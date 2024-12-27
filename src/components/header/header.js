import React, { useState } from 'react';
import './header.css';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <h1>MyStore</h1>
      </div>
      <nav className="nav">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/products">Products</a></li>
          <li><a href="/about">About Us</a></li>
          <li className="user-icon" onClick={toggleDropdown}>
            <span className="icon">👤</span>
            {dropdownOpen && (
              <ul className="dropdown-menu">
                <li><a href="/profile">Profile</a></li>
                <li><a href="/orders">My Orders</a></li>
                <li><a href="/settings">Settings</a></li>
                <li><a href="/logout">Logout</a></li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;