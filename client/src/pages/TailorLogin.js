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
    <div className="login-container">
      <div className="card login-card">
        <h2 style={{ color: '#b11226' }}>Tailor Login</h2>
        <p style={{ color: '#666', marginBottom: '25px' }}>Enter your security code to view assigned tasks.</p>
        <div style={{ textAlign: 'left' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Access Code</label>
          <input
            placeholder="Enter your tailor password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button onClick={login} style={{ width: '100%', marginTop: '20px', padding: '14px', backgroundColor: '#333' }}>
          Access Dashboard
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

export default TailorLogin;
