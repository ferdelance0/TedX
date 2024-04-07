import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/loginpageStyles.css';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would add logic to authenticate the user
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Remember Me:', rememberMe);
  };
  const handleLogin = () => {
    navigate('/admin/dashboard');
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-header">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              className="input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              className="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
          <button type="submit" className="login-button" onClick={handleLogin}>
            Login
          </button>
          <p className="register-link">Don't have an account? Register</p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
