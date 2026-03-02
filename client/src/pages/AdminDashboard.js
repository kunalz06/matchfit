import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/styles.css';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editOrder, setEditOrder] = useState(null);
  const [showTailorPanel, setShowTailorPanel] = useState(false);
  const [newTailor, setNewTailor] = useState({ name: '', password: '' });

  const [newOrder, setNewOrder] = useState({
    orderNo: '',
    type: 'stitching',
    tailor: '',
    dueDate: '',
    status: 'in progress'
  });

  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders/all');
      setOrders(res.data);
    } catch (err) {
      alert('Failed to fetch orders: ' + err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortField) return 0;
    let valA = a[sortField], valB = b[sortField];
    if (sortField === 'dueDate') { valA = new Date(valA); valB = new Date(valB); }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const deleteOrder = async (orderNo) => {
    if (!window.confirm(`Are you sure you want to delete order ${orderNo}?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/orders/delete/${orderNo}`);
      fetchOrders();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const saveEdit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/orders/update/${editOrder.orderNo}`, editOrder);
      setEditOrder(null);
      fetchOrders();
    } catch (err) {
      alert('Failed to save: ' + err.message);
    }
  };

  const addOrder = async () => {
    try {
      await axios.post(`http://localhost:5000/api/orders/add`, newOrder);
      setNewOrder({ orderNo: '', type: 'stitching', tailor: '', dueDate: '', status: 'in progress' });
      setEditOrder(null);
      fetchOrders();
    } catch (err) {
      alert('Failed to add: ' + err.message);
    }
  };

  const handleAddTailor = async () => {
    if (!newTailor.name || !newTailor.password) {
      return alert("Please provide both Name and Password");
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/add-tailor', newTailor);
      alert(res.data.message);
      setNewTailor({ name: '', password: '' });
      setShowTailorPanel(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding tailor');
    }
  };

  return (
    <div style={{ paddingBottom: '50px' }}>
      <Header title="Admin Dashboard" role="Administrator" />

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <button onClick={() => navigate('/')} className="secondary">🏠 Home</button>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => setShowTailorPanel(!showTailorPanel)}
              style={{ backgroundColor: '#333' }}
            >
              👤 {showTailorPanel ? 'View Orders' : 'Manage Tailors'}
            </button>
            <button onClick={() => { setShowTailorPanel(false); setEditOrder({}); }}>+ Add Order</button>
          </div>
        </div>

        {/* Manage Tailors Panel */}
        {showTailorPanel && (
          <div className="card" style={{ borderLeft: '5px solid #333' }}>
            <h3 style={{ marginTop: 0 }}>Add New Tailor</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>The tailor will use the password below to access their dashboard.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <label>Tailor Name</label>
                <input
                  placeholder="Full Name"
                  value={newTailor.name}
                  onChange={e => setNewTailor({ ...newTailor, name: e.target.value })}
                />
              </div>
              <div>
                <label>Login Password</label>
                <input
                  type="password"
                  placeholder="Set password"
                  value={newTailor.password}
                  onChange={e => setNewTailor({ ...newTailor, password: e.target.value })}
                />
              </div>
            </div>
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button onClick={handleAddTailor}>Register Tailor</button>
            </div>
          </div>
        )}

        {/* Order Sorting & Table (Original Logic) */}
        {!showTailorPanel && (
          <>
            <div className="card" style={{ padding: '15px 30px', marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold' }}>Quick Sort:</span>
              <select style={{ width: 'auto', margin: 0 }} onChange={e => setSortField(e.target.value)}>
                <option value="">None</option>
                <option value="tailor">Tailor</option>
                <option value="dueDate">Due Date</option>
                <option value="status">Status</option>
              </select>
              <select style={{ width: 'auto', margin: 0 }} onChange={e => setSortOrder(e.target.value)}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            {editOrder !== null && (
              <div className="card" style={{ borderLeft: '5px solid #b11226' }}>
                <h3 style={{ marginTop: 0 }}>{editOrder.orderNo ? `Editing Order #${editOrder.orderNo}` : 'New Order Details'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <div>
                    <label>Order Number</label>
                    <input
                      disabled={!!editOrder.orderNo}
                      placeholder="Order No"
                      value={editOrder.orderNo || newOrder.orderNo}
                      onChange={e => editOrder.orderNo ? setEditOrder({ ...editOrder, orderNo: e.target.value }) : setNewOrder({ ...newOrder, orderNo: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Service Type</label>
                    <select value={editOrder.type || newOrder.type}
                      onChange={e => editOrder.type ? setEditOrder({ ...editOrder, type: e.target.value }) : setNewOrder({ ...newOrder, type: e.target.value })}>
                      <option value="stitching">Stitching</option>
                      <option value="alteration">Alteration</option>
                      <option value="designing">Designing</option>
                    </select>
                  </div>
                  <div>
                    <label>Assigned Tailor</label>
                    <input placeholder="Tailor Name" value={editOrder.tailor || newOrder.tailor}
                      onChange={e => editOrder.tailor ? setEditOrder({ ...editOrder, tailor: e.target.value }) : setNewOrder({ ...newOrder, tailor: e.target.value })} />
                  </div>
                  <div>
                    <label>Due Date</label>
                    <input type="date" value={editOrder.dueDate ? editOrder.dueDate.substring(0, 10) : newOrder.dueDate}
                      onChange={e => editOrder.orderNo ? setEditOrder({ ...editOrder, dueDate: e.target.value }) : setNewOrder({ ...newOrder, dueDate: e.target.value })} />
                  </div>
                  <div>
                    <label>Current Status</label>
                    <select value={editOrder.status || newOrder.status}
                      onChange={e => editOrder.status ? setEditOrder({ ...editOrder, status: e.target.value }) : setNewOrder({ ...newOrder, status: e.target.value })}>
                      <option value="in progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                  <button className="secondary" style={{ marginRight: '10px' }} onClick={() => setEditOrder(null)}>Cancel</button>
                  <button onClick={editOrder.orderNo ? saveEdit : addOrder}>Save Order</button>
                </div>
              </div>
            )}

            <div className="table-container">
              {sortedOrders.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No orders found in the system.</div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Order No</th>
                      <th>Type</th>
                      <th>Tailor</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedOrders.map(order => (
                      <tr key={order.orderNo}>
                        <td style={{ fontWeight: 'bold' }}>#{order.orderNo}</td>
                        <td style={{ textTransform: 'capitalize' }}>{order.type}</td>
                        <td>{order.tailor}</td>
                        <td>{new Date(order.dueDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</td>
                        <td>
                          <span className={`status-badge status-${order.status.replace(' ', '-')}`}>
                            {order.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="secondary"
                            style={{ padding: '6px 12px', fontSize: '0.8rem', marginRight: '5px' }}
                            onClick={() => setEditOrder(order)}
                          >
                            Edit
                          </button>
                          <button
                            style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: '#ffe3e6', color: '#b11226' }}
                            onClick={() => deleteOrder(order.orderNo)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
