import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editOrder, setEditOrder] = useState(null);
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
      fetchOrders();
    } catch (err) {
      alert('Failed to add: ' + err.message);
    }
  };

  const buttonStyle = { padding: '6px 12px', borderRadius: '10px', margin: '0 5px', border: 'none', backgroundColor: '#b11226', color: 'white', cursor: 'pointer' };

  return (
    <div>
      <Header title="Admin Dashboard" role="Admin" />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button style={buttonStyle} onClick={() => navigate('/')}>🏠 Home</button>

        <div style={{ margin: '20px' }}>
          <label>Sort by: </label>
          <select onChange={e => setSortField(e.target.value)}>
            <option value="">None</option>
            <option value="tailor">Tailor</option>
            <option value="dueDate">Due Date</option>
            <option value="status">Status</option>
          </select>
          <select onChange={e => setSortOrder(e.target.value)}>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>

        <button style={buttonStyle} onClick={() => setEditOrder({})}>+ Add Order</button>

        {editOrder !== null &&
          <div style={{ margin: '20px auto', padding: '15px', border: '1px solid #ccc', borderRadius: '10px', background: '#f9f9f9', display: 'inline-block' }}>
            <h3>{editOrder.orderNo ? 'Edit Order' : 'Add Order'}</h3>
            <input placeholder="Order No" value={editOrder.orderNo || newOrder.orderNo} 
              onChange={e => editOrder.orderNo ? setEditOrder({...editOrder, orderNo:e.target.value}) : setNewOrder({...newOrder, orderNo:e.target.value})} />
            <select value={editOrder.type || newOrder.type} 
              onChange={e => editOrder.type ? setEditOrder({...editOrder, type:e.target.value}) : setNewOrder({...newOrder, type:e.target.value})}>
              <option value="stitching">Stitching</option>
              <option value="alteration">Alteration</option>
              <option value="designing">Designing</option>
            </select>
            <input placeholder="Tailor" value={editOrder.tailor || newOrder.tailor}
              onChange={e => editOrder.tailor ? setEditOrder({...editOrder, tailor:e.target.value}) : setNewOrder({...newOrder, tailor:e.target.value})} />
            <input type="date" value={editOrder.dueDate || newOrder.dueDate}
              onChange={e => editOrder.dueDate ? setEditOrder({...editOrder, dueDate:e.target.value}) : setNewOrder({...newOrder, dueDate:e.target.value})} />
            <select value={editOrder.status || newOrder.status}
              onChange={e => editOrder.status ? setEditOrder({...editOrder, status:e.target.value}) : setNewOrder({...newOrder, status:e.target.value})}>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="delivered">Delivered</option>
            </select>
            <div style={{ marginTop: '10px' }}>
              <button style={buttonStyle} onClick={editOrder.orderNo ? saveEdit : addOrder}>Save</button>
              <button style={buttonStyle} onClick={() => setEditOrder(null)}>Cancel</button>
            </div>
          </div>
        }

        {sortedOrders.length === 0 ? <p>No orders yet.</p> :
          <table style={{ width: '95%', margin: '20px auto', borderCollapse: 'collapse', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <thead style={{ backgroundColor: '#b11226', color: 'white' }}>
              <tr>
                <th>Order No</th>
                <th>Type</th>
                <th>Tailor</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map(order => (
                <tr key={order.orderNo} style={{ textAlign: 'center', borderBottom: '1px solid #ccc' }}>
                  <td>{order.orderNo}</td>
                  <td>{order.type}</td>
                  <td>{order.tailor}</td>
                  <td>{new Date(order.dueDate).toLocaleDateString()}</td>
                  <td>{order.status}</td>
                  <td>
                    <button style={buttonStyle} onClick={() => setEditOrder(order)}>Edit</button>
                    <button style={buttonStyle} onClick={() => deleteOrder(order.orderNo)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    </div>
  );
};

export default AdminDashboard;
