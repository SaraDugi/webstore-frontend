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

  const shipments = [
    {
      order_id: '1',
      recipient_name: 'John Doe',
      recipient_email: 'john.doe@example.com',
      recipient_phone: '+1 123 456 7890',
      delivery_address: '123 Main Street, Anytown, USA',
      postal_number: 12345,
      city: 'Anytown',
      delivery_status: 'Delivered',
      tracking_number: 'TRACK12345',
      weight: 2.5,
      estimated_cost: 10.99,
    },
    {
      order_id: '2',
      recipient_name: 'Jane Smith',
      recipient_email: 'jane.smith@example.com',
      recipient_phone: '+1 987 654 3210',
      delivery_address: '456 Elm Street, Othertown, USA',
      postal_number: 54321,
      city: 'Othertown',
      delivery_status: 'In Transit',
      tracking_number: 'TRACK67890',
      weight: 1.2,
      estimated_cost: 7.99,
    },
  ];

  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleTrackOrder = (order) => {
    const shipment = shipments.find((shipment) => shipment.order_id === String(order.id));
    setSelectedOrder({ ...order, shipment });
  };

  return (
    <div className="user-orders">
      <h1>Your Orders</h1>

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

      {selectedOrder && selectedOrder.shipment && (
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
            <h3>Shipment Details</h3>
            <p><strong>Recipient Name:</strong> {selectedOrder.shipment.recipient_name}</p>
            <p><strong>Email:</strong> {selectedOrder.shipment.recipient_email}</p>
            <p><strong>Phone:</strong> {selectedOrder.shipment.recipient_phone}</p>
            <p><strong>Address:</strong> {selectedOrder.shipment.delivery_address}</p>
            <p><strong>City:</strong> {selectedOrder.shipment.city}</p>
            <p><strong>Postal Number:</strong> {selectedOrder.shipment.postal_number}</p>
            <p><strong>Delivery Status:</strong> {selectedOrder.shipment.delivery_status}</p>
            <p><strong>Tracking Number:</strong> {selectedOrder.shipment.tracking_number}</p>
            <p><strong>Weight:</strong> {selectedOrder.shipment.weight} kg</p>
            <p><strong>Estimated Cost:</strong> ${selectedOrder.shipment.estimated_cost}</p>
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