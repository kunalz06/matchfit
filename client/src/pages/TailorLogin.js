import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';

const TailorLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/tailor', { password });
      alert(`Welcome ${res.data.tailorName}`);
      localStorage.setItem('tailorName', res.data.tailorName);
      navigate('/tailor-dashboard');
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>Tailor Access</h2>
        <p>Enter your unique access code to view orders</p>

        <div className="input-group">
          <label>Security Code</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button className="login-button" onClick={login}>Access Dashboard</button>

        <div className="back-home" onClick={() => navigate('/')}>
          ← Return to selection
        </div>
      </div>
    </div>
  );
};

export default TailorLogin;
