import React, { useState, useContext } from 'react';
import { LogInContext } from '../contexts/LoginContext';
import { useNavigate, Navigate } from 'react-router-dom';

const LoginPage = () => {
  const { handleLogin, loggedInUser } = useContext(LogInContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (loggedInUser) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const success = await handleLogin({ email, password });
      if (success) {
        navigate('/');
      } else {
        setError('Invalid email or password.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
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
        <button type="submit" className="btn-primary">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;