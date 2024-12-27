import React, { useState } from 'react';
import '../styles.css';

const UserOrders = () => {
  const orders = [
    {
      id: 1,
      date: '2024-01-01',
      total: '$49.99',
      status: 'Delivered',
      tracking: ['Order Placed', 'Processed', 'Shipped', 'Delivered'],
    },
    {
      id: 2,
      date: '2024-01-15',
      total: '$29.99',
      status: 'In Transit',
      tracking: ['Order Placed', 'Processed', 'Shipped'],
    },
    {
      id: 3,
      date: '2024-02-01',
      total: '$19.99',
      status: 'Processing',
      tracking: ['Order Placed', 'Processed'],
    },
  ];

  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleTrackOrder = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="user-orders">
      <h1>Your Orders</h1>

      {/* Orders List */}
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Date:</strong> {order.date}</p>
            <p><strong>Total:</strong> {order.total}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <button className="btn-primary" onClick={() => handleTrackOrder(order)}>
              Track Order
            </button>
          </div>
        ))}
      </div>

      {/* Order Tracking Modal */}
      {selectedOrder && (
        <div className="tracking-modal">
          <div className="modal-content">
            <h2>Tracking Order #{selectedOrder.id}</h2>
            <ul className="tracking-steps">
              {selectedOrder.tracking.map((step, index) => (
                <li key={index} className={index + 1 === selectedOrder.tracking.length ? 'active-step' : ''}>
                  {step}
                </li>
              ))}
            </ul>
            <button className="btn-secondary" onClick={() => setSelectedOrder(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrders;