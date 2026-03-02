import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const buttonStyle = {
    padding: '15px 40px',
    margin: '20px',
    fontSize: '1.2em',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#b11226',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
    transition: 'all 0.2s ease-in-out'
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '10%' }}>
      <h1>Welcome to MatchFit</h1>
      <div>
        <button style={buttonStyle} onClick={() => navigate('/admin-login')}>Admin</button>
        <button style={buttonStyle} onClick={() => navigate('/customer')}>Customer</button>
        <button style={buttonStyle} onClick={() => navigate('/tailor-login')}>Tailor</button>
      </div>
    </div>
  );
};

export default Home;
