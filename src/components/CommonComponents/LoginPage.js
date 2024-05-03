import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/loginpageStyles.css';
import { saveToken, getRole } from '../../auth/auth';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email: username,
        password: password,
      });
      if (response.status === 200) {
        saveToken(response.data.token);
        const role = getRole(); // Get the user's role from the token
        if (role === 'security') {
          navigate('/security/dashboard');
        } else {
          navigate('/admin/dashboard');
        }
      } else {
        setError(response.data.error);
      }
    } catch (error) {
      setError("An error occurred during login.");
      console.error("Error during login:", error);
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/signup");
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
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            Login
          </button>
          <p className="register-link" onClick={handleRegisterRedirect}>
            Don't have an account? Register
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;