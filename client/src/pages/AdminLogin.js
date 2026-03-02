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
    <div className="login-container">
      <div className="card login-card">
        <h2 style={{ color: '#b11226' }}>Admin Login</h2>
        <p style={{ color: '#666', marginBottom: '25px' }}>Please enter your credentials to manage orders.</p>
        <div style={{ textAlign: 'left' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Username</label>
          <input
            placeholder="e.g. admin_kunal"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Password</label>
          <input
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button onClick={login} style={{ width: '100%', marginTop: '20px', padding: '14px' }}>
          Sign In
        </button>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', color: '#666', boxShadow: 'none', marginTop: '10px' }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
