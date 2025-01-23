import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../contexts/CartContext';
import { LogInContext } from '../contexts/LoginContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/checkoutpage.css';

const CheckoutPage = () => {
  const { cart } = useContext(CartContext);
  const { loggedInUser } = useContext(LogInContext);
  const navigate = useNavigate();

  const [creditCards, setCreditCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!loggedInUser || !loggedInUser.id || !loggedInUser.token) {
        setError('User is not logged in.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/users/${loggedInUser.id}`, {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        });

        if (response.status === 200 && response.data) {
          setUserInfo(response.data.data);
          setError('');
        } else {
          setError('Failed to fetch user details.');
        }
      } catch (err) {
        console.error('Error fetching user details:', err.message);
        setError('An error occurred while fetching user details.');
      }
    };

    const fetchCreditCards = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/card', {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        });
        if (response.status === 200) {
          setCreditCards(response.data.value || []);
        }
      } catch (err) {
        console.error('Error fetching credit cards:', err.message);
        setError('Failed to fetch credit cards.');
      }
    };

    fetchUserInfo();
    fetchCreditCards();
  }, [loggedInUser]);

  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.amount, 0).toFixed(2);

  const createOrder = async () => {
    const orderPayload = {
      customer_id: loggedInUser.id,
      total_amount: parseFloat(calculateTotal()),
      status: 'open',
      products: cart.map((item) => ({
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.amount,
      })),
    };

    console.log(JSON.stringify(orderPayload, null, 2));

    try {
      const response = await fetch('http://localhost:4050/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${loggedInUser.token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create the order. Server response: ${errorText}`);
      }

      const result = await response.json();
      console.log('Order created successfully:', result);
      return result.order_id;
    } catch (err) {
      console.error('Error creating order:', err.message);
      throw new Error('Failed to create the order. Please try again.');
    }
  };

  const updateCardBalance = async (cardNumber, amount) => {
    const apiPath = `http://localhost:8080/api/card/balance/${cardNumber}/${amount}`;

    try {
      const response = await axios.put(
        apiPath,
        {},
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error('Failed to update card balance.');
      }

      console.log('Card balance updated successfully.');
    } catch (err) {
      console.error('Error updating card balance:', err.message);
      throw new Error('Failed to update the card balance.');
    }
  };

  const verifyShipment = async (orderId) => {
    try {
      const response = await axios.post(
        'http://localhost:9000/api/shipments/verify',
        { order_id: orderId },
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );

      if (response.status === 200 && response.data.exists) {
        return true; // Shipment exists
      }
      return false; // Shipment does not exist
    } catch (err) {
      console.error('Error verifying shipment:', err.message);
      throw new Error('Failed to verify shipment.');
    }
  };

  const handlePay = async () => {
    if (!userInfo?.address || !userInfo?.zipcode || !userInfo?.country || !selectedCard) {
      setError('Please complete all fields and select a credit card before proceeding.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Step 1: Create the order
      const orderId = await createOrder();
      const totalAmount = parseFloat(calculateTotal());

      // Step 2: Verify if a shipment already exists for this order
      const shipmentExists = await verifyShipment(orderId);
      if (shipmentExists) {
        alert(`A shipment already exists for order ${orderId}.`);
        navigate('/payment-history');
        return;
      }

      // Step 3: Update the card balance
      await updateCardBalance(selectedCard, -totalAmount);

      // Step 4: Make the payment
      const paymentPayload = {
        order_id: orderId,
        cardNumber: selectedCard,
        paidDate: new Date().toISOString(),
        amount: totalAmount,
      };

      const paymentResponse = await axios.post('http://localhost:8081/api/payment', paymentPayload, {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });

      if (paymentResponse.status !== 200) {
        throw new Error('Payment could not be processed.');
      }

      // Step 5: Create the shipment with a unique tracking number
      const uniqueTrackingNumber = `TRACK${Date.now()}-${Math.floor(Math.random() * 100000)}`;
      const shipmentPayload = {
        order_id: orderId,
        recipient_name: userInfo.email,
        recipient_email: userInfo.email,
        recipient_phone: userInfo.phone || '1234567890',
        delivery_address: userInfo.address,
        postal_number: userInfo.zipcode,
        city: userInfo.city || 'Unknown City',
        country: userInfo.country,
        delivery_status: 'shipment handed over',
        tracking_number: uniqueTrackingNumber,
        weight: 1.5,
        estimated_cost: 15,
      };

      console.log('Shipment Payload:', JSON.stringify(shipmentPayload, null, 2));

      const shipmentResponse = await axios.post('http://localhost:9000/api/shipments', shipmentPayload, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });

      if (shipmentResponse.status === 201) {
        alert(`Order ${orderId} created, payment processed, and shipment scheduled successfully!`);
        navigate('/payment-history');
      } else {
        throw new Error('Shipment could not be created.');
      }
    } catch (err) {
      console.error('Error in handlePay:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/cart');
  };

  return (
    <div className="checkout-page-container">
      <button className="checkout-back-button" onClick={handleGoBack}>
        Go Back
      </button>

      <h1 className="checkout-page-title">Checkout</h1>
      <div className="checkout-main-content">
        <div className="checkout-cart-summary">
          <h2>Cart Items</h2>
          {cart.map((item, index) => (
            <div key={index} className="checkout-cart-item">
              <p>
                <strong>{item.name}</strong> x {item.amount} - ${item.price.toFixed(2)}
              </p>
            </div>
          ))}
          <h3 className="checkout-cart-total">Total: ${calculateTotal()}</h3>
        </div>

        <div className="checkout-right">
          <div className="checkout-delivery-info">
            <h2>Shipping Address</h2>
            {userInfo?.address ? (
              <div>
                <p><strong>Zipcode:</strong> {userInfo.zipcode}</p>
                <p><strong>Address:</strong> {userInfo.address}</p>
                <p><strong>Country:</strong> {userInfo.country}</p>
              </div>
            ) : (
              <p>No address available. Please update your address in settings.</p>
            )}
          </div>

          <div className="checkout-credit-card-container">
            <h2>Select Credit Card</h2>
            <div className="checkout-credit-card-list">
              {creditCards.length > 0 ? (
                creditCards.map((card) => (
                  <div key={card.cardNumber} className="checkout-credit-card-item">
                    <input
                      type="radio"
                      id={`card-${card.cardNumber}`}
                      name="selectedCard"
                      value={card.cardNumber}
                      checked={selectedCard === card.cardNumber}
                      onChange={(e) => setSelectedCard(e.target.value)}
                    />
                    <label htmlFor={`card-${card.cardNumber}`}>
                      <span>Card ending in {card.cardNumber.slice(-4)}</span>
                      <span>Balance: ${card.balance.toFixed(2)}</span>
                    </label>
                  </div>
                ))
              ) : (
                <p>No credit cards available. Please add one in your settings.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && <p className="checkout-error-message">{error}</p>}
      <button
        className="checkout-pay-button"
        onClick={handlePay}
        disabled={isLoading || !selectedCard}
      >
        {isLoading ? 'Processing...' : 'Pay'}
      </button>
    </div>
  );
};

export default CheckoutPage;
