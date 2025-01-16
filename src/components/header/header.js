import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogInContext } from '../../contexts/LoginContext'; // Use the correct context
import './header.css';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';

const Header = () => {
  const { loggedInUser, handleLogout } = useContext(LogInContext); // Use loggedInUser instead of user
  const navigate = useNavigate();

  const onLogout = () => {
    handleLogout();
    navigate('/'); // Redirect to home after logout
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">MyStore</Link>
        </div>
        <nav className="nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/products" className="nav-link">
                Products
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/cart" className="nav-link cart-icon">
                <FaShoppingCart size={20} />
              </Link>
            </li>
            <li className="nav-item dropdown">
              <FaUserCircle size={25} className="profile-icon" />
              <ul className="dropdown-menu">
                {loggedInUser ? (
                  <>
                    <li>
                      <Link to="/orders" className="dropdown-link">
                        My Orders
                      </Link>
                    </li>
                    <li>
                      <Link to="/payment-history" className="dropdown-link">
                        Payment History
                      </Link>
                    </li>
                    <li>
                      <Link to="/settings" className="dropdown-link">
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button onClick={onLogout} className="dropdown-link logout-button">
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login" className="dropdown-link">
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link to="/register" className="dropdown-link">
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;