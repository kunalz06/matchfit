import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import '../styles/styles.css';

const TrackOrder = () => {
  const [orderNo, setOrderNo] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const trackOrder = async () => {
    if (!orderNo) return;
    setLoading(true);
    setStatus('');
    try {
      const res = await axios.get(`http://localhost:5000/api/customer/track/${orderNo}`);
      setStatus(res.data.status);
    } catch (err) {
      setStatus('Order not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title="Order Tracking" />
      <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }}>
          <h3>Check Status</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>Enter your unique order number provided during booking.</p>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
            <input
              placeholder="e.g. 1025"
              value={orderNo}
              onChange={e => setOrderNo(e.target.value)}
              style={{ margin: 0 }}
              onKeyPress={(e) => e.key === 'Enter' && trackOrder()}
            />
            <button onClick={trackOrder} disabled={loading} style={{ whiteSpace: 'nowrap' }}>
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </div>

          {status && (
            <div style={{
              padding: '25px',
              borderRadius: '12px',
              backgroundColor: status === 'Order not found' ? '#fff5f5' : '#f0fff4',
              border: `1px solid ${status === 'Order not found' ? '#feb2b2' : '#9ae6b4'}`
            }}>
              <span style={{ fontSize: '0.9rem', color: '#666', display: 'block', marginBottom: '5px' }}>
                Current Progress:
              </span>
              <h2 style={{
                margin: 0,
                color: status === 'Order not found' ? '#c53030' : '#276749',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {status}
              </h2>
            </div>
          )}

          <div style={{ marginTop: '30px', textAlign: 'left', fontSize: '0.85rem', color: '#888' }}>
            <p><strong>Note:</strong> If your order status is 'Delivered' and you haven't received it, please visit the store with your receipt.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
