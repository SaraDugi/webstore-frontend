import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { UsersContext } from './UserContext';

export const LogInContext = createContext();

export const LogInProvider = ({ children }) => {
  const { registeredUsers } = useContext(UsersContext);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const savedLoggedInUser = Cookies.get('loggedInUser');
    if (savedLoggedInUser) {
      setLoggedInUser(JSON.parse(savedLoggedInUser));
    }
  }, []);

  useEffect(() => {
    if (loggedInUser) {
      Cookies.set('loggedInUser', JSON.stringify(loggedInUser), { expires: 7 });
    } else {
      Cookies.remove('loggedInUser');
    }
  }, [loggedInUser]);

  const handleLogin = ({ email, password }) => {
    const user = registeredUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setLoggedInUser(user);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  return (
    <LogInContext.Provider value={{ loggedInUser, handleLogin, handleLogout }}>
      {children}
    </LogInContext.Provider>
  );
};