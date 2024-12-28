import React, { useState } from 'react';
import '../styles.css';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const users = [
    { email: 'user1@example.com', password: 'password123' },
    { email: 'user2@example.com', password: 'mypassword' },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    let hasError = false;

    setEmailError('');
    setPasswordError('');

    if (!email.includes('@')) {
      setEmailError('Invalid email format.');
      hasError = true;
    } else if (!users.find((user) => user.email === email)) {
      setEmailError('Email does not exist.');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Password cannot be empty.');
      hasError = true;
    } else if (
      users.find((user) => user.email === email && user.password !== password)
    ) {
      setPasswordError('Incorrect password.');
      hasError = true;
    }

    if (!hasError) {
      onLogin({ email });
      alert('Login successful!');
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form className="login-form" onSubmit={handleLogin}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={emailError ? 'input-error' : ''}
        />
        {emailError && <p className="error-message">{emailError}</p>}

        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={passwordError ? 'input-error' : ''}
        />
        {passwordError && <p className="error-message">{passwordError}</p>}

        <button type="submit" className="btn-primary">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;