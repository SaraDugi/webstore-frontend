import React from 'react';
import '../styles.css';

const UserProfile = () => {
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 123 456 7890',
    address: '123 Main Street, Anytown, USA',
    orders: [
      { id: 1, date: '2024-01-01', total: '$49.99', status: 'Delivered' },
      { id: 2, date: '2024-01-15', total: '$29.99', status: 'In Transit' },
      { id: 3, date: '2024-02-01', total: '$19.99', status: 'Processing' },
    ],
  };

  return (
    <div className="user-profile">
      <h1>User Profile</h1>

      <section className="profile-section">
        <h2>Profile Information</h2>
        <div className="profile-details">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Address:</strong> {user.address}</p>
          <button className="edit-button">Edit Profile</button>
        </div>
      </section>

      <section className="order-history">
        <h2>Order History</h2>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {user.orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.date}</td>
                <td>{order.total}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="account-settings">
        <h2>Account Settings</h2>
        <button className="settings-button">Change Password</button>
        <button className="settings-button">Delete Account</button>
      </section>
    </div>
  );
};

export default UserProfile;
