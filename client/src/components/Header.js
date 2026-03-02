import React from 'react';

const Header = ({ title }) => (
  <div style={{
    width: '100%',
    textAlign: 'center',
    padding: '20px 0',
    backgroundColor: '#b11226', // crimson
    color: 'white',
    fontSize: '2em',
    fontWeight: 'bold',
    borderBottomLeftRadius: '15px',
    borderBottomRightRadius: '15px'
  }}>
    {title}
  </div>
);

export default Header;
