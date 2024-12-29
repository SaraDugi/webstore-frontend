import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Load data from cookies on initial render
  useEffect(() => {
    const savedUsers = Cookies.get('registeredUsers');
    if (savedUsers) {
      setRegisteredUsers(JSON.parse(savedUsers));
    }
    const savedLoggedInUser = Cookies.get('loggedInUser');
    if (savedLoggedInUser) {
      setLoggedInUser(JSON.parse(savedLoggedInUser));
    }
  }, []);

  // Save registered users to cookies whenever they change
  useEffect(() => {
    Cookies.set('registeredUsers', JSON.stringify(registeredUsers), { expires: 7 });
  }, [registeredUsers]);

  // Save logged-in user to cookies whenever they change
  useEffect(() => {
    if (loggedInUser) {
      Cookies.set('loggedInUser', JSON.stringify(loggedInUser), { expires: 7 });
    } else {
      Cookies.remove('loggedInUser');
    }
  }, [loggedInUser]);

  const handleRegister = (userData) => {
    const userExists = registeredUsers.some((u) => u.email === userData.email);

    if (userExists) {
      return false; // Registration failed due to duplicate email
    }

    setRegisteredUsers([...registeredUsers, userData]);
    return true; // Registration successful
  };

  const updateRegisteredUser = (updatedUser) => {
    setRegisteredUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.email === updatedUser.email ? updatedUser : user
      )
    );

    if (loggedInUser && loggedInUser.email === updatedUser.email) {
      setLoggedInUser(updatedUser);
    }
  };

  const updateUserInfo = (newData) => {
    if (!loggedInUser) return;

    const updatedUser = { ...loggedInUser, ...newData };

    setRegisteredUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.email === loggedInUser.email ? updatedUser : user
      )
    );

    setLoggedInUser(updatedUser);
  };

  return (
    <UsersContext.Provider
      value={{
        registeredUsers,
        loggedInUser,
        handleRegister,
        updateRegisteredUser,
        updateUserInfo,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};