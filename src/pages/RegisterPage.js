import React, { useState, useContext } from 'react';
import { UsersContext } from '../contexts/UserContext';
import { LogInContext } from '../contexts/LoginContext';
import { Navigate } from 'react-router-dom';

const RegisterPage = () => {
  const { loggedInUser } = useContext(LogInContext);
  const { handleRegister } = useContext(UsersContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (loggedInUser) {
    return <Navigate to="/profile" replace />;
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!username || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const success = handleRegister({ username, email, password });

    if (success) {
      setSuccessMessage('Registration successful! You can now log in.');
    } else {
      setError('A user with this email already exists.');
    }
  };

  return (
    <div className="register-page">
      <h1>Register</h1>
      <form className="register-form" onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <button type="submit" className="btn-primary">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;