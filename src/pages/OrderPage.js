import React, { useState, useEffect, useContext } from 'react';
import { LogInContext } from '../contexts/LoginContext';
import '../styles/orderspage.css';
import { useNavigate } from 'react-router-dom';

const UserOrders = () => {
  const { loggedInUser } = useContext(LogInContext);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const navigate = useNavigate();
  const [selectedShipment, setSelectedShipment] = useState(null);

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

  const viewOrderDetails = (orderId) => {
    navigate(`/order/${orderId}`);
  };

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

  const closeDetailsModal = () => {
    setSelectedShipment(null);
  };

  const clearSearch = () => {
    setSearchId('');
    setSearchResult(null);
    setError('');
  };

  const handleTrackOrder = async (order) => {
    try {
      // Ensure the order object is valid and contains an id
      console.log('Order object:', order);
  
      if (!order || !order.id) {
        setError('Invalid order object or missing id.');
        return;
      }
  
      const orderId = order.id; // Use the id from the order object
      const url = `http://localhost:9000/api/shipments/${orderId}`;
      console.log(`Fetching shipment details from URL: ${url}`); // Log the actual request URL
  
      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });
  
      if (!response.ok) {
        if (response.status === 404) {
          setError(`No shipping data available for order ${orderId}`);
          return;
        }
        throw new Error(`Failed to fetch shipment details for order ${orderId}`);
      }
  
      const shipmentData = await response.json();
  
      if (!shipmentData || Object.keys(shipmentData).length === 0) {
        setError(`No shipping data available for order ${orderId}`);
        return;
      }
  
      setSelectedShipment(shipmentData); // Update state with shipment details
      setError('');
    } catch (err) {
      console.error('Error fetching shipment details:', err.message);
      setError('An error occurred while fetching shipment details. Please try again.');
    }
  };  
  
  const handleUpdateOrder = async (order) => {
    const updatedOrder = {
      id: "3", // Ensure this matches an existing order in `orders2`
      customer_id: "678bd3028ba32a4b61bf72d0",
      total_amount: 600,
      status: "pending",
      products: [
        {
          product_id: "6788066ca9678f377e2b9431",
          product_name: "Speaker",
          product_price: 100,
          quantity: 2,
        },
      ],
    };
  
    try {
      // Verify the order exists in the database
      const checkResponse = await fetch(`http://localhost:4050/order/${updatedOrder.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
          Accept: "application/json",
        },
      });
  
      if (!checkResponse.ok) {
        if (checkResponse.status === 404) {
          throw new Error(`Order with ID ${updatedOrder.id} does not exist.`);
        }
        throw new Error("Failed to verify order existence.");
      }
  
      // Proceed with the update
      const response = await fetch(`http://localhost:4050/order`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedInUser.token}`,
        },
        body: JSON.stringify(updatedOrder),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update order: ${response.status} - ${errorText}`);
      }
  
      const result = await response.json();
      console.log("Order updated successfully:", result);
  
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === updatedOrder.id
            ? { ...o, total_amount: updatedOrder.total_amount, status: updatedOrder.status }
            : o
        )
      );
      alert(`Order ${updatedOrder.id} updated successfully!`);
    } catch (err) {
      console.error("Update Order Error:", err.message);
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
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
        <button onClick={clearSearch} className="search-button">
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
                <button className="btn-primary" onClick={() => viewOrderDetails(order.id)}>
                View Details
              </button>
                <button className="btn-primary" onClick={() => handleTrackOrder(order)}>
                  Track Order
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => handleUpdateOrder(order)}
                  disabled={loading || error || !order.id}
                >
                  Update Order
                </button>
              </div>
            ))}
          </div>
          {selectedShipment && (
            <div className="details-modal">
              <div className="modal-content">
                <h2>Shipment Details</h2>
                <p><strong>Order ID:</strong> {selectedShipment.order_id}</p>
                <p><strong>Recipient Name:</strong> {selectedShipment.recipient_name}</p>
                <p><strong>Recipient Email:</strong> {selectedShipment.recipient_email}</p>
                <p><strong>Recipient Phone:</strong> {selectedShipment.recipient_phone}</p>
                <p><strong>Delivery Address:</strong> {selectedShipment.delivery_address}</p>
                <p><strong>City:</strong> {selectedShipment.city}</p>
                <p><strong>Country:</strong> {selectedShipment.country}</p>
                <p><strong>Postal Number:</strong> {selectedShipment.postal_number}</p>
                <p><strong>Delivery Status:</strong> {selectedShipment.delivery_status}</p>
                <p><strong>Tracking Number:</strong> {selectedShipment.tracking_number}</p>
                <p><strong>Weight:</strong> {selectedShipment.weight} kg</p>
                <p><strong>Estimated Cost:</strong> ${selectedShipment.estimated_cost}</p>
                <button className="btn-secondary" onClick={closeDetailsModal}>
                  Close
                </button>
              </div>
            </div>
            )}
              {error && (
            <div className="error-popup">
              <div className="popup-content">
                <p>{error}</p>
                <button className="btn-secondary" onClick={() => setError('')}>
                  Close
                </button>
              </div>
            </div>
          )}

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
