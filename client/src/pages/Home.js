import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%)'
    }}>
      <div className="card" style={{ padding: '50px', maxWidth: '600px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '10px' }}>MatchFit</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '40px' }}>
          Precision Tailoring & Order Management System
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
          <button onClick={() => navigate('/admin-login')} style={{ padding: '18px' }}>
            🔐 Admin Access
          </button>
          <button onClick={() => navigate('/tailor-login')} style={{ padding: '18px', backgroundColor: '#333' }}>
            🧵 Tailor Access
          </button>
          <button onClick={() => navigate('/customer')} className="secondary" style={{ padding: '18px' }}>
            🛍️ Customer Portal
          </button>
        </div>
      </div>
      <footer style={{ marginTop: '30px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        © 2026 MatchFit tailoring services. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
