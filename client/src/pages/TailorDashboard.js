import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/styles.css';

const TailorDashboard = () => {
  const tailorName = localStorage.getItem('tailorName');
  const [orders, setOrders] = useState([]);
  const [sortField, setSortField] = useState('dueDate');
  const [statusUpdate, setStatusUpdate] = useState({});
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    if (!tailorName) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/tailor/${tailorName}`);
      setOrders(res.data);
    } catch (err) {
      alert('Failed to fetch orders: ' + err.message);
    }
  }, [tailorName]);

  useEffect(() => {
    if (!tailorName) {
      navigate('/tailor-login');
      return;
    }
    fetchOrders();
  }, [tailorName, navigate, fetchOrders]);

  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortField) return 0;
    let valA = a[sortField], valB = b[sortField];
    if (sortField === 'dueDate') { valA = new Date(valA); valB = new Date(valB); }
    if (valA < valB) return -1;
    if (valA > valB) return 1;
    return 0;
  });

  const updateStatus = useCallback(async (orderNo) => {
    const newStatus = statusUpdate[orderNo];
    const order = orders.find(o => o.orderNo === orderNo);

    if (!newStatus || newStatus === order.status) return;

    try {
      await axios.put(`http://localhost:5000/api/orders/update/${orderNo}`, {
        ...order,
        status: newStatus
      });
      fetchOrders();
      alert('Status updated successfully');
    } catch (err) {
      alert('Failed to update: ' + err.message);
    }
  }, [statusUpdate, orders, fetchOrders]);

  return (
    <div style={{ paddingBottom: '50px' }}>
      <Header title={`Tailor Dashboard`} role={tailorName} />

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <button onClick={() => navigate('/')} className="secondary">🏠 Home</button>

          <div className="card" style={{ padding: '10px 20px', margin: 0, display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>Sort Worklist:</span>
            <select style={{ width: 'auto', margin: 0, padding: '5px' }} onChange={e => setSortField(e.target.value)} value={sortField}>
              <option value="dueDate">Due Date</option>
              <option value="type">Order Type</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          {sortedOrders.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📁</div>
              <h3>No orders assigned to you yet.</h3>
              <p style={{ color: 'var(--text-muted)' }}>Assigned orders will appear here automatically.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order No</th>
                  <th>Service Type</th>
                  <th>Deadline</th>
                  <th>Current Status</th>
                  <th style={{ textAlign: 'right' }}>Update Progress</th>
                </tr>
              </thead>
              <tbody>
                {sortedOrders.map(order => (
                  <tr key={order.orderNo}>
                    <td style={{ fontWeight: 'bold' }}>#{order.orderNo}</td>
                    <td style={{ textTransform: 'capitalize' }}>{order.type}</td>
                    <td style={{ color: new Date(order.dueDate) < new Date() ? 'red' : 'inherit' }}>
                      {new Date(order.dueDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </td>
                    <td>
                      <span className={`status-badge status-${order.status.replace(' ', '-')}`}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                        <select
                          style={{ width: '150px', margin: 0, padding: '5px' }}
                          value={statusUpdate[order.orderNo] || order.status}
                          onChange={e => setStatusUpdate({ ...statusUpdate, [order.orderNo]: e.target.value })}
                        >
                          <option value="in progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="delivered">Delivered</option>
                        </select>
                        <button
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          onClick={() => updateStatus(order.orderNo)}
                        >
                          Save
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TailorDashboard;
