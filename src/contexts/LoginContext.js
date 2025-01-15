import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const LogInContext = createContext();

export const LogInProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const savedToken = Cookies.get('authToken');
    if (savedToken) {
      try {
        const decodedToken = jwtDecode(savedToken);
        if (decodedToken.exp * 1000 > Date.now()) {
          // Token is valid
          axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
          setLoggedInUser({
            token: savedToken,
            id: decodedToken.sub,
            email: decodedToken.name,
            role: decodedToken.role,
          });
        } else {
          // Token expired
          handleLogout();
        }
      } catch (error) {
        console.error('Error decoding token:', error.message);
        handleLogout();
      }
    }
  }, []);

  const handleLogin = async ({ email, password }) => {
    try {
      const response = await axios.post('http://localhost:5000/users/login', { email, password });
      const { access_token } = response.data.data;

      if (!access_token) {
        return false;
      }

      const decodedToken = jwtDecode(access_token);

      if (decodedToken.exp * 1000 <= Date.now()) {
        console.error('Token is expired.');
        return false;
      }

      Cookies.set('authToken', access_token, { expires: 7 });
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      setLoggedInUser({
        token: access_token,
        id: decodedToken.sub,
        email: decodedToken.name,
        role: decodedToken.role,
        currentPassword: password, // Optional: Store for account changes
      });

      return true;
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      return false;
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    Cookies.remove('authToken');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <LogInContext.Provider value={{ loggedInUser, handleLogin, handleLogout }}>
      {children}
    </LogInContext.Provider>
  );
};