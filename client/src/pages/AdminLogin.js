import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/admin', { username, password });
      alert(res.data.message);
      navigate('/admin-dashboard');
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>Admin Portal</h2>
        <p>Login with your administrative credentials</p>

        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button className="login-button" onClick={login}>Authenticate</button>

        <div className="back-home" onClick={() => navigate('/')}>
          ← Return to selection
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
