import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogInContext } from '../../contexts/LoginContext';
import './header.css';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';

const Header = () => {
  const { loggedInUser, handleLogout } = useContext(LogInContext);
  const [role, setRole] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!loggedInUser || !loggedInUser.token) {
        setRole(null);
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/users/${loggedInUser.id}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();

        if (result.data && result.data.role) {
          setRole(result.data.role);
        } else {
          setError('Role information is missing in the response.');
        }
      } catch (err) {
        console.error(err.message);
        setError('An error occurred while fetching role information.');
      }
    };

    fetchUserRole();
  }, [loggedInUser]);

  const onLogout = () => {
    handleLogout();
    navigate('/');
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
            {role === 'admin' && (
              <li className="nav-item dropdown">
                <span className="dropdown-title">Management</span>
                <ul className="dropdown-menu">
                  <li>
                      <Link to="/orders" className="dropdown-link">
                        All Orders
                      </Link>
                  </li>
                  <li>
                    <Link to="/users" className="dropdown-link">
                      User Management
                    </Link>
                  </li>
                  <li>
                    <Link to="/catalog-management" className="dropdown-link">
                      Item Management
                    </Link>
                  </li>
                  <li>
                    <Link to="/coupon-management" className="dropdown-link">
                      Coupon Management
                    </Link>
                  </li>
                  <li>
                    <Link to="/reports" className="dropdown-link">
                      Reports
                    </Link>
                  </li>
                </ul>
              </li>
            )}
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
                      <Link to="/shipments" className="dropdown-link">
                        My Shipments
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
      {error && <p className="error-message">{error}</p>}
    </header>
  );
};

export default Header;