import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TailorLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/tailor', { password });
      alert(`Welcome ${res.data.tailorName}`);
      localStorage.setItem('tailorName', res.data.tailorName);
      navigate('/tailor-dashboard'); // redirect to Tailor Dashboard
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <div>
      <h2>Tailor Login</h2>
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
    </div>
  );
};

export default TailorLogin;
