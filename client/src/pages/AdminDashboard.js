import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/styles.css';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [tailorsList, setTailorsList] = useState([]);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editOrder, setEditOrder] = useState(null);
  const [showTailorPanel, setShowTailorPanel] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteTailorTarget, setDeleteTailorTarget] = useState(null);
  const [editTailor, setEditTailor] = useState(null);
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

  const fetchTailors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/tailors');
      setTailorsList(res.data);
    } catch (err) {
      console.error('Failed to fetch tailors:', err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchTailors();
  }, []);

  const sortedOrders = [...orders].sort((a, b) => {
    if (!sortField) return 0;
    let valA = a[sortField], valB = b[sortField];
    if (sortField === 'dueDate') { valA = new Date(valA); valB = new Date(valB); }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const confirmDelete = (order) => {
    setDeleteTarget(order);
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`http://localhost:5000/api/orders/delete/${deleteTarget.orderNo}`);
      setDeleteTarget(null);
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
      alert('Failed to save: ' + (err.response?.data?.error || err.message));
    }
  };

  const addOrder = async () => {
    try {
      await axios.post(`http://localhost:5000/api/orders/add`, newOrder);
      setNewOrder({ orderNo: '', type: 'stitching', tailor: '', dueDate: '', status: 'in progress' });
      setEditOrder(null);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add order: ' + err.message);
    }
  };

  // ---- Tailor Management ----
  const handleAddTailor = async () => {
    if (!newTailor.name || !newTailor.password) {
      return alert("Please provide both Name and Password");
    }
    try {
      const res = await axios.post('http://localhost:5000/api/auth/add-tailor', newTailor);
      alert(res.data.message);
      setNewTailor({ name: '', password: '' });
      fetchTailors();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding tailor');
    }
  };

  const handleUpdateTailor = async () => {
    if (!editTailor || !editTailor.name) return alert("Tailor name is required");
    try {
      const res = await axios.put(`http://localhost:5000/api/auth/update-tailor/${editTailor.id}`, {
        name: editTailor.name,
        password: editTailor.newPassword || ''
      });
      alert(res.data.message);
      setEditTailor(null);
      fetchTailors();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating tailor');
    }
  };

  const executeDeleteTailor = async () => {
    if (!deleteTailorTarget) return;
    try {
      await axios.delete(`http://localhost:5000/api/auth/delete-tailor/${deleteTailorTarget.id}`);
      setDeleteTailorTarget(null);
      fetchTailors();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting tailor');
    }
  };

  // Analytics helpers
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const tailorCounts = orders.reduce((acc, o) => {
    acc[o.tailor] = (acc[o.tailor] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ paddingBottom: '50px' }}>
      <Header title="Admin Dashboard" role="Administrator" />

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '10px' }}>
          <button onClick={() => navigate('/')} className="secondary">🏠 Home</button>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setShowOverview(!showOverview); setShowTailorPanel(false); }}
              style={{ backgroundColor: showOverview ? 'var(--primary-color)' : '#555' }}
            >
              📊 {showOverview ? 'Hide Overview' : 'Status Overview'}
            </button>
            <button
              onClick={() => { setShowTailorPanel(!showTailorPanel); setShowOverview(false); }}
              style={{ backgroundColor: showTailorPanel ? 'var(--primary-color)' : '#333' }}
            >
              👤 {showTailorPanel ? 'View Orders' : 'Manage Tailors'}
            </button>
            <button onClick={() => { setShowTailorPanel(false); setShowOverview(false); setEditOrder({}); }}>+ Add Order</button>
          </div>
        </div>

        {/* Status Overview Panel */}
        {showOverview && (
          <div className="card" style={{ borderLeft: '5px solid var(--primary-color)' }}>
            <h3 style={{ marginTop: 0 }}>📊 Status Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '25px' }}>
              <div style={{ background: 'var(--status-pending-bg)', border: '1px solid var(--status-pending-border)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--status-pending-text)' }}>{statusCounts['in progress'] || 0}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--status-pending-text)', fontWeight: 600 }}>In Progress</div>
              </div>
              <div style={{ background: 'var(--status-completed-bg)', border: '1px solid var(--status-completed-border)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--status-completed-text)' }}>{statusCounts['completed'] || 0}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--status-completed-text)', fontWeight: 600 }}>Completed</div>
              </div>
              <div style={{ background: 'var(--status-delivered-bg)', border: '1px solid var(--status-delivered-border)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--status-delivered-text)' }}>{statusCounts['delivered'] || 0}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--status-delivered-text)', fontWeight: 600 }}>Delivered</div>
              </div>
              <div style={{ background: 'var(--feature-card-bg)', border: '1px solid var(--border-color)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{orders.length}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Orders</div>
              </div>
            </div>

            <h4 style={{ marginBottom: '10px' }}>Orders by Tailor</h4>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Tailor</th>
                    <th>Total Orders</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(tailorCounts).map(([tailor, count]) => (
                    <tr key={tailor}>
                      <td style={{ fontWeight: 'bold' }}>{tailor}</td>
                      <td>{count}</td>
                    </tr>
                  ))}
                  {Object.keys(tailorCounts).length === 0 && (
                    <tr><td colSpan="2" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No data yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Manage Tailors Panel */}
        {showTailorPanel && (
          <div>
            {/* Add New Tailor */}
            <div className="card" style={{ borderLeft: '5px solid #333' }}>
              <h3 style={{ marginTop: 0 }}>➕ Add New Tailor</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>The tailor will use the password below to access their dashboard.</p>
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

            {/* Existing Tailors List */}
            <div className="card" style={{ borderLeft: '5px solid var(--primary-color)' }}>
              <h3 style={{ marginTop: 0 }}>📋 Existing Tailors ({tailorsList.length})</h3>
              {tailorsList.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No tailors registered yet.</p>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tailorsList.map(tailor => (
                        <tr key={tailor.id}>
                          <td>{tailor.id}</td>
                          <td style={{ fontWeight: 'bold' }}>{tailor.name}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              className="secondary"
                              style={{ padding: '6px 12px', fontSize: '0.8rem', marginRight: '5px' }}
                              onClick={() => setEditTailor({ ...tailor, newPassword: '' })}
                            >
                              Edit
                            </button>
                            <button
                              style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: 'var(--delete-btn-bg)', color: 'var(--primary-color)' }}
                              onClick={() => setDeleteTailorTarget(tailor)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Edit Tailor Inline Form */}
            {editTailor && (
              <div className="card" style={{ borderLeft: '5px solid #ffc107' }}>
                <h3 style={{ marginTop: 0 }}>✏️ Editing Tailor: {editTailor.name}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                  <div>
                    <label>Tailor Name</label>
                    <input
                      value={editTailor.name}
                      onChange={e => setEditTailor({ ...editTailor, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>New Password (leave blank to keep current)</label>
                    <input
                      type="password"
                      placeholder="New password (optional)"
                      value={editTailor.newPassword}
                      onChange={e => setEditTailor({ ...editTailor, newPassword: e.target.value })}
                    />
                  </div>
                </div>
                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                  <button className="secondary" style={{ marginRight: '10px' }} onClick={() => setEditTailor(null)}>Cancel</button>
                  <button onClick={handleUpdateTailor}>Save Changes</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Order Sorting & Table */}
        {!showTailorPanel && !showOverview && (
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
              <div className="card" style={{ borderLeft: '5px solid var(--primary-color)' }}>
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
                    <select
                      value={editOrder.tailor || newOrder.tailor}
                      onChange={e => editOrder.orderNo ? setEditOrder({ ...editOrder, tailor: e.target.value }) : setNewOrder({ ...newOrder, tailor: e.target.value })}
                    >
                      <option value="">-- Select Tailor --</option>
                      {tailorsList.map(t => (
                        <option key={t.id} value={t.name}>{t.name}</option>
                      ))}
                    </select>
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
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No orders found in the system.</div>
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
                            style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: 'var(--delete-btn-bg)', color: 'var(--primary-color)' }}
                            onClick={() => confirmDelete(order)}
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

      {/* Delete Order Confirmation Modal */}
      {deleteTarget && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>⚠️ Confirm Deletion</h3>
            <p style={{ margin: '15px 0' }}>
              Are you sure you want to permanently delete this order?
            </p>
            <div style={{ background: 'var(--modal-detail-bg)', padding: '15px', borderRadius: '8px', margin: '15px 0', textAlign: 'left' }}>
              <p style={{ margin: '4px 0' }}><strong>Order No:</strong> #{deleteTarget.orderNo}</p>
              <p style={{ margin: '4px 0' }}><strong>Tailor:</strong> {deleteTarget.tailor}</p>
              <p style={{ margin: '4px 0' }}><strong>Status:</strong> {deleteTarget.status}</p>
            </div>
            <div className="modal-actions">
              <button className="secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button style={{ backgroundColor: '#c53030' }} onClick={executeDelete}>Delete Order</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Tailor Confirmation Modal */}
      {deleteTailorTarget && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>⚠️ Delete Tailor Account</h3>
            <p style={{ margin: '15px 0' }}>
              Are you sure you want to permanently delete this tailor account?
            </p>
            <div style={{ background: 'var(--modal-detail-bg)', padding: '15px', borderRadius: '8px', margin: '15px 0', textAlign: 'left' }}>
              <p style={{ margin: '4px 0' }}><strong>ID:</strong> {deleteTailorTarget.id}</p>
              <p style={{ margin: '4px 0' }}><strong>Name:</strong> {deleteTailorTarget.name}</p>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Note: Existing orders assigned to this tailor will not be affected.
            </p>
            <div className="modal-actions">
              <button className="secondary" onClick={() => setDeleteTailorTarget(null)}>Cancel</button>
              <button style={{ backgroundColor: '#c53030' }} onClick={executeDeleteTailor}>Delete Tailor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
