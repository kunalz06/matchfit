import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/styles.css';

const TrackOrder = () => {
  const [orderNo, setOrderNo] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const navigate = useNavigate();

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

  const getStatusStyle = (s) => {
    if (s === 'Order not found') return { bg: 'var(--bg-color)', border: '#feb2b2', color: '#c53030' };
    if (s === 'delivered') return { bg: 'var(--bg-color)', border: '#9ae6b4', color: '#276749' };
    if (s === 'completed') return { bg: 'var(--bg-color)', border: '#ffc107', color: '#856404' };
    if (s === 'in progress') return { bg: 'var(--bg-color)', border: '#feb2b2', color: '#c53030' };
    return { bg: 'var(--bg-color)', border: '#9ae6b4', color: '#276749' };
  };

  // Landing state
  if (!started) {
    return (
      <div>
        <Header title="Order Tracking" />
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', textAlign: 'center', padding: '60px 40px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '15px' }}>📦</div>
            <h2 style={{ color: 'var(--text-main)', marginBottom: '10px' }}>Welcome to Matchfit</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '35px' }}>
              Got your order? Track it here.
            </p>
            <button onClick={() => setStarted(true)} style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
              🔍 Track Here
            </button>
            <div style={{ marginTop: '25px' }}>
              <span className="back-home" onClick={() => navigate('/')}>← Back to Home</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusStyle = getStatusStyle(status);

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
              backgroundColor: statusStyle.bg,
              border: `1px solid ${statusStyle.border}`
            }}>
              <span style={{ fontSize: '0.9rem', color: '#666', display: 'block', marginBottom: '5px' }}>
                Current Progress:
              </span>
              <h2 style={{
                margin: 0,
                color: statusStyle.color,
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

          <div style={{ marginTop: '15px' }}>
            <span className="back-home" onClick={() => { setStarted(false); setStatus(''); setOrderNo(''); }}>← Back to Welcome</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
