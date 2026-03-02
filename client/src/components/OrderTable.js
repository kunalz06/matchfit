import React from 'react';

const OrderTable = ({ orders, showStatusUpdate = false }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Order No</th>
          <th>Type</th>
          <th>Tailor</th>
          <th>Due Date</th>
          <th>Status</th>
          {showStatusUpdate && <th>Update</th>}
        </tr>
      </thead>
      <tbody>
        {orders.map((order, idx) => (
          <tr key={idx}>
            <td>{order.orderNo}</td>
            <td>{order.type}</td>
            <td>{order.tailor}</td>
            <td>{order.dueDate}</td>
            <td>{order.status}</td>
            {showStatusUpdate && (
              <td>
                <button>Status Update</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderTable;
