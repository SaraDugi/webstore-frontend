import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LogInContext } from '../contexts/LoginContext';
import '../styles/orderdetailspage.css';

const OrderDetails = () => {
  const { orderId } = useParams(); // Extract the orderId from the route parameters
  const { loggedInUser } = useContext(LogInContext);
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!loggedInUser || !loggedInUser.token) {
        setError('You must be logged in to view order details.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:4050/ordersWithProducts`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order details.');
        }

        const data = await response.json();

        // Extract the order matching the provided orderId
        const matchedOrder = data.flat().filter((order) => order.order_id === orderId);

        if (matchedOrder.length > 0) {
          setOrderDetails(matchedOrder);
          setError('');
        } else {
          setError('Order not found.');
        }
      } catch (err) {
        console.error('Fetch Order Details Error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [loggedInUser, orderId]);

  return (
    <div className="order-details">
      <button onClick={() => navigate('/orders')} className="btn-back">Go Back</button>

      {loading ? (
        <p>Loading order details...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : orderDetails.length > 0 ? (
        <div className="order-card">
          <h2>Order #{orderDetails[0].order_id}</h2>
          <p><strong>Customer ID:</strong> {orderDetails[0].customer_id}</p>
          <p><strong>Total Amount:</strong> ${orderDetails[0].total_amount}</p>
          <p><strong>Status:</strong> {orderDetails[0].status}</p>
          <h3>Products:</h3>
          <ul>
            {orderDetails.map((product, index) => (
              <li key={index}>
                {product.product_name} - ${product.product_price} x {product.quantity}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Order not found.</p>
      )}
    </div>
  );
};

export default OrderDetails;
