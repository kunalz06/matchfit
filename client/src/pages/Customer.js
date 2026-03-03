import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/styles.css';

const Customer = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Header title="MatchFit Customer Portal" />
      <div className="container" style={{ textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px' }}>
          <h2 style={{ color: 'var(--primary-color)' }}>Welcome to Our Studio</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '30px' }}>
            Experience the perfect fit. We provide premium stitching, alterations, and bespoke designs tailored just for you.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            <div style={{ padding: '20px', background: 'var(--feature-card-bg)', borderRadius: '10px' }}>
              <h3 style={{ margin: 0 }}>Expert Stitching</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Precision in every needle stroke.</p>
            </div>
            <div style={{ padding: '20px', background: 'var(--feature-card-bg)', borderRadius: '10px' }}>
              <h3 style={{ margin: 0 }}>Fast Alterations</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Quick fixes for the perfect silhouette.</p>
            </div>
            <div style={{ padding: '20px', background: 'var(--feature-card-bg)', borderRadius: '10px' }}>
              <h3 style={{ margin: 0 }}>Custom Design</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Unique styles crafted from your vision.</p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '30px' }}>
            <h3>Ready to check your order?</h3>
            <button
              onClick={() => navigate('/track-order')}
              style={{ padding: '15px 40px', fontSize: '1.1rem', marginTop: '10px' }}
            >
              🔍 Track Your Order Now
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', color: 'var(--back-link-color)', boxShadow: 'none', marginTop: '20px' }}
        >
          ← Back to Main Page
        </button>
      </div>
    </div>
  );
};

export default Customer;
