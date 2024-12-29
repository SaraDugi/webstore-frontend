import React, { useState, useContext } from 'react';
import { LogInContext } from '../contexts/LoginContext';
import { useNavigate, Navigate } from 'react-router-dom';

const LoginPage = () => {
  const { handleLogin, loggedInUser } = useContext(LogInContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Use React Router's useNavigate for navigation

  // Redirect if the user is already logged in
  if (loggedInUser) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    const success = handleLogin({ email, password });
    if (success) {
      navigate('/'); // Redirect to the home page after successful login
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
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
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="btn-primary">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;