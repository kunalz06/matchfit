import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const TailorDashboard = () => {
  const tailorName = localStorage.getItem('tailorName');
  const [orders, setOrders] = useState([]);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [statusUpdate, setStatusUpdate] = useState({});
  const navigate = useNavigate();

  // Fetch orders for this tailor from backend
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/tailor/${tailorName}`);
      setOrders(res.data);
    } catch (err) {
      alert('Failed to fetch orders: ' + err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Sort orders
  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortField) return 0;
    let valA = a[sortField], valB = b[sortField];
    if (sortField === 'dueDate') { valA = new Date(valA); valB = new Date(valB); }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Update status of an order
  const updateStatus = async (orderNo) => {
    if (!statusUpdate[orderNo]) return alert('Select a status first');
    const order = orders.find(o => o.orderNo === orderNo);
    try {
      await axios.put(`http://localhost:5000/api/orders/update/${orderNo}`, {
        ...order,
        status: statusUpdate[orderNo]
      });
      fetchOrders();
    } catch (err) {
      alert('Failed to update: ' + err.message);
    }
  };

  const buttonStyle = {
    padding: '6px 15px',
    borderRadius: '10px',
    backgroundColor: '#b11226',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    marginLeft: '10px'
  };

  return (
    <div>
      <Header title={`Tailor Dashboard - ${tailorName}`} role="Tailor" />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button style={buttonStyle} onClick={() => navigate('/')}>🏠 Home</button>

        <div style={{ margin: '20px' }}>
          <label>Sort by: </label>
          <select onChange={e => setSortField(e.target.value)}>
            <option value="">None</option>
            <option value="type">Type</option>
            <option value="dueDate">Due Date</option>
            <option value="status">Status</option>
          </select>
          <select onChange={e => setSortOrder(e.target.value)}>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>

        {sortedOrders.length === 0 ? (
          <p>No orders assigned yet.</p>
        ) : (
          <table style={{
            width: '90%',
            margin: '0 auto',
            borderCollapse: 'collapse',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <thead style={{ backgroundColor: '#b11226', color: 'white' }}>
              <tr>
                <th style={{ padding: '10px' }}>Order No</th>
                <th>Type</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map(order => (
                <tr key={order.orderNo} style={{ textAlign: 'center', borderBottom: '1px solid #ccc' }}>
                  <td>{order.orderNo}</td>
                  <td>{order.type}</td>
                  <td>{new Date(order.dueDate).toLocaleDateString()}</td>
                  <td>{order.status}</td>
                  <td>
                    <select
                      value={statusUpdate[order.orderNo] || order.status}
                      onChange={e => setStatusUpdate({ ...statusUpdate, [order.orderNo]: e.target.value })}
                    >
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="delivered">Delivered</option>
                    </select>
                    <button style={buttonStyle} onClick={() => updateStatus(order.orderNo)}>Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TailorDashboard;