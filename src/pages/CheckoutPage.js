import React, { useContext, useState } from 'react';
import { CartContext } from '../contexts/CartContext';
import '../styles.css';

const CheckoutPage = () => {
  const { cart } = useContext(CartContext);
  const [addressPopup, setAddressPopup] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    recipient_name: '',
    recipient_email: '',
    recipient_phone: '',
    delivery_address: '',
    postal_number: '',
    city: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('');

  const calculateTotal = () =>
    cart.reduce((total, item) => total + parseFloat(item.price.replace('$', '')) * item.amount, 0).toFixed(2);

  const handlePlaceOrder = () => {
    if (!savedAddress || !paymentMethod) {
      alert('Please provide a delivery address and select a payment method.');
      return;
    }

    alert(`Order placed successfully!\n
      Address: ${JSON.stringify(savedAddress, null, 2)}\n
      Payment Method: ${paymentMethod}`);
  };

  const handleSaveAddress = () => {
    // Validate inputs
    const { recipient_name, recipient_email, recipient_phone, delivery_address, postal_number, city } = newAddress;
    if (!recipient_name || !recipient_email || !recipient_phone || !delivery_address || !postal_number || !city) {
      alert('Please fill in all fields.');
      return;
    }

    setSavedAddress(newAddress);
    setAddressPopup(false);
  };

  const handleEditAddress = () => {
    setAddressPopup(true);
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="order-summary">
        <h2>Order Summary</h2>
        <ul className="cart-items">
          {cart.map((item, index) => (
            <li key={index} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <p>Price: {item.price}</p>
                <p>Quantity: {item.amount}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="cart-total">
          <h2>Total: ${calculateTotal()}</h2>
        </div>
      </div>

      <div className="checkout-details">
        <h2>Delivery Address</h2>
        {savedAddress ? (
          <div className="address-summary">
            <p>
              <strong>Name:</strong> {savedAddress.recipient_name}
            </p>
            <p>
              <strong>Email:</strong> {savedAddress.recipient_email}
            </p>
            <p>
              <strong>Phone:</strong> {savedAddress.recipient_phone}
            </p>
            <p>
              <strong>Address:</strong> {savedAddress.delivery_address}
            </p>
            <p>
              <strong>Postal Code:</strong> {savedAddress.postal_number}
            </p>
            <p>
              <strong>City:</strong> {savedAddress.city}
            </p>
            <button className="btn-secondary" onClick={handleEditAddress}>
              Edit Address
            </button>
          </div>
        ) : (
          <button className="btn-primary" onClick={() => setAddressPopup(true)}>
            Add Address
          </button>
        )}

        <h2>Payment Method</h2>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="payment-method-select"
        >
          <option value="">Select a payment method</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
          <option value="PayPal">PayPal</option>
          <option value="Cash on Delivery">Cash on Delivery</option>
        </select>
      </div>

      <button onClick={handlePlaceOrder} className="btn-primary place-order-button">
        Place Order
      </button>

      {addressPopup && (
        <div className="address-popup">
          <div className="popup-content">
            <h2>Enter Delivery Address</h2>
            <label>
              Recipient Name
              <input
                type="text"
                value={newAddress.recipient_name}
                onChange={(e) => setNewAddress({ ...newAddress, recipient_name: e.target.value })}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={newAddress.recipient_email}
                onChange={(e) => setNewAddress({ ...newAddress, recipient_email: e.target.value })}
              />
            </label>
            <label>
              Phone
              <input
                type="text"
                value={newAddress.recipient_phone}
                onChange={(e) => setNewAddress({ ...newAddress, recipient_phone: e.target.value })}
              />
            </label>
            <label>
              Address
              <input
                type="text"
                value={newAddress.delivery_address}
                onChange={(e) => setNewAddress({ ...newAddress, delivery_address: e.target.value })}
                rows="3"
              />
            </label>
            <label>
                Postal Code
                <input
                    type="number"
                    value={newAddress.postal_number}
                    onChange={(e) => {
                    const value = Math.max(0, e.target.value);
                    setNewAddress({ ...newAddress, postal_number: value });
                    }}
                />
                </label>
            <label>
              City
              <input
                type="text"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              />
            </label>
            <div className="popup-actions">
              <button className="btn-primary" onClick={handleSaveAddress}>
                Save Address
              </button>
              <button className="btn-danger" onClick={() => setAddressPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;