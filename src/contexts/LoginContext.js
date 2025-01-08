import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

export const LogInContext = createContext();

export const LogInProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const savedToken = Cookies.get('authToken');
    if (savedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      setLoggedInUser({ token: savedToken });
    }
  }, []);

  const handleLogin = async ({ email, password }) => {
    try {
      const response = await axios.post('http://localhost:5000/users/login', { email, password });
      const { access_token } = response.data.data;
  
      if (!access_token) {
        return false;
      }
  
      Cookies.set('authToken', access_token, { expires: 7 });
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
  
      setLoggedInUser({ token: access_token, email, currentPassword: password });
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
