import React, { useState, useEffect, useContext } from 'react';
import { LogInContext } from '../contexts/LoginContext';
import '../styles/orderspage.css';

const UserOrders = () => {
  const { loggedInUser } = useContext(LogInContext);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!loggedInUser || !loggedInUser.token) {
        setError('You must be logged in to view your orders.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:4050/orders', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized: Missing or invalid token.');
          }
          throw new Error('Failed to fetch orders. Please try again later.');
        }

        const textResponse = await response.text();
        try {
          const result = JSON.parse(textResponse);
          console.log('Fetched Orders:', result);
          setOrders(result || []);
        } catch (parseError) {
          console.error('JSON Parsing Error:', parseError.message, 'Response:', textResponse);
          throw new Error('Response is not valid JSON.');
        }
        setError('');
      } catch (err) {
        console.error('Fetch Orders Error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [loggedInUser]);

  const handleSearch = async () => {
    if (!searchId) {
      setError('Please enter an order ID to search.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:4050/order/${searchId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Order not found.');
        }
        throw new Error('Failed to fetch order. Please try again later.');
      }

      const textResponse = await response.text();
      try {
        const result = JSON.parse(textResponse);
        setSearchResult(result); // Display the searched order
        setError('');
      } catch (parseError) {
        console.error('JSON Parsing Error:', parseError.message, 'Response:', textResponse);
        throw new Error('Response is not valid JSON.');
      }
    } catch (err) {
      console.error('Search Order Error:', err.message);
      setError(err.message);
    }
  };

  const clearSearch = () => {
    setSearchId('');
    setSearchResult(null);
    setError('');
  };

  const handleTrackOrder = (order) => {
    setSelectedOrder(order); // Set the selected order details
  };

  const handleUpdateOrder = async (order) => {
    const updatedOrder = {
      id: order.id,
      customer_id: order.customer_id,
      total_amount: 700, // Example updated value
      status: 'shipped', // Example updated status
      products: [
        {
          product_id: '6788066ca9678f377e2b9431',
          product_name: 'Updated Speaker',
          product_price: 120,
          quantity: 1,
        },
      ],
    };

    try {
      const response = await fetch(`http://localhost:4050/order`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${loggedInUser.token}`,
        },
        body: JSON.stringify(updatedOrder),
      });

      const textResponse = await response.text();
      try {
        const result = JSON.parse(textResponse);
        console.log('Order updated:', result);

        // Update the local state with the updated order
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.id === order.id
              ? { ...o, total_amount: updatedOrder.total_amount, status: updatedOrder.status }
              : o
          )
        );
        alert(`Order ${order.id} updated successfully!`);
      } catch (parseError) {
        console.error('JSON Parsing Error:', parseError.message, 'Response:', textResponse);
        throw new Error('Response is not valid JSON.');
      }
    } catch (err) {
      console.error('Update Order Error:', err.message);
      setError(err.message);
    }
  };

  return (
    <div className="user-orders">
      <h1>Your Orders</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="btn-primary">
          Search
        </button>
        <button onClick={clearSearch} className="btn-secondary">
          Clear
        </button>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <div className="orders-list">
            {(searchResult ? [searchResult] : orders).map((order) => (
              <div key={order.id} className="order-card">
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Date:</strong> {new Date(order.order_date).toLocaleString()}</p>
                <p><strong>Total Amount:</strong> ${order.total_amount}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <button className="btn-primary" onClick={() => handleTrackOrder(order)}>
                  Track Order
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => handleUpdateOrder(order)}
                >
                  Update Order
                </button>
              </div>
            ))}
          </div>

          {selectedOrder && (
            <div className="tracking-modal">
              <div className="modal-content">
                <h2>Tracking Order #{selectedOrder.id}</h2>
                <p><strong>Customer ID:</strong> {selectedOrder.customer_id}</p>
                <p><strong>Date:</strong> {new Date(selectedOrder.order_date).toLocaleString()}</p>
                <p><strong>Total Amount:</strong> ${selectedOrder.total_amount}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
                <button className="btn-secondary" onClick={() => setSelectedOrder(null)}>
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserOrders;
