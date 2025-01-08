import React, { createContext } from 'react';
import axios from 'axios';

export const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const handleRegister = async (userData) => {
    try {
      const normalizedData = { ...userData, email: userData.email.toLowerCase().trim() };

      const response = await axios.post('http://localhost:5000/users/', normalizedData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 201) {
        return { success: true };
      }
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 400) {
          return { success: false, message: 'Validation error: Email or password missing.' };
        }
        if (status === 409) {
          return { success: false, message: 'A user with this email already exists.' };
        }
        return { success: false, message: data?.message || 'Unexpected error occurred.' };
      }
      console.error('Network or unexpected error: ', err);
      return { success: false, message: 'Network error. Please try again later.' };
    }
  };

  return (
    <UsersContext.Provider value={{ handleRegister }}>
      {children}
    </UsersContext.Provider>
  );
};