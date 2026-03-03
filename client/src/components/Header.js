import React from 'react';

const Header = ({ title, role }) => (
  <header style={{
    width: '100%',
    padding: '30px 0',
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    textAlign: 'center',
    boxShadow: 'var(--shadow)',
    borderBottomLeftRadius: '25px',
    borderBottomRightRadius: '25px',
    marginBottom: '30px',
    position: 'relative'
  }}>
    <h1 style={{ margin: 0, fontSize: '2.4rem', letterSpacing: '1px' }}>{title}</h1>
    <div className="brand-subtitle">Matchfit Tailoring LLC</div>
    {role && (
      <span style={{
        position: 'absolute',
        bottom: '10px',
        right: '25px',
        fontSize: '0.9rem',
        opacity: 0.8,
        background: 'rgba(255,255,255,0.2)',
        padding: '2px 12px',
        borderRadius: '15px'
      }}>
        {role} Portal
      </span>
    )}
  </header>
);

export default Header;
