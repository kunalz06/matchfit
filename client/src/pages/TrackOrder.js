import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';

const TrackOrder = () => {
  const [orderNo, setOrderNo] = useState('');
  const [status, setStatus] = useState('');

  const trackOrder = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/customer/track/${orderNo}`);
      setStatus(res.data.status);
    } catch (err) {
      setStatus('Order not found');
    }
  };

  return (
    <div>
      <Header title="Track Order" />
      <div className="container">
        <input placeholder="Enter Order No" value={orderNo} onChange={e => setOrderNo(e.target.value)} />
        <button onClick={trackOrder}>Track</button>
        {status && <p>Status: {status}</p>}
      </div>
    </div>
  );
};

export default TrackOrder;
