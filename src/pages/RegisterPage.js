import React, { useState, useContext } from 'react';
import { UsersContext } from '../contexts/UserContext';
import { LogInContext } from '../contexts/LoginContext';
import { Navigate } from 'react-router-dom';
import '../styles/registerpage.css';

const RegisterPage = () => {
  const { loggedInUser } = useContext(LogInContext);
  const { handleRegister } = useContext(UsersContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (loggedInUser) {
    return <Navigate to="/profile" replace />;
  }

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    try {
      const result = await handleRegister({ email: normalizedEmail, password });

      if (result.success) {
        setSuccessMessage('Registration successful! You can now log in.');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="register-page">
      <h1>Register</h1>
      <form className="register-form" onSubmit={handleSubmit}>
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
        <button type="submit" className="btn-primary">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;