import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Customer = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Header title="Customer Portal" />
      <div className="container">
        <h2>About Our Company</h2>
        <p>We provide top-notch tailoring services.</p>
        <button onClick={() => navigate('/track-order')}>Track Order</button>
      </div>
    </div>
  );
};

export default Customer;
