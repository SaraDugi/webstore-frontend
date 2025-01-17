import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css';
import { CartContext } from '../contexts/CartContext';

const CartPage = () => {
  const { cart, setCart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity less than 1
    const updatedCart = [...cart];
    updatedCart[index].amount = newQuantity;
    setCart(updatedCart);
  };

  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.amount, 0).toFixed(2);

  const handleCheckout = () => {
    navigate('/checkout'); // Navigate to the checkout page
  };

  return (
    <div className="cart-page">
      <h1 className="cart-title">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="cart-empty-message">Your cart is empty</p>
      ) : (
        <div className="cart-container">
          <ul className="cart-items">
            {cart.map((item, index) => (
              <li key={index} className="cart-item">
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">Price: ${item.price}</p>
                  <div className="quantity-wrapper">
                    <label htmlFor={`quantity-${index}`} className="quantity-label">
                      Quantity:
                    </label>
                    <input
                      id={`quantity-${index}`}
                      type="number"
                      min="1"
                      value={item.amount}
                      onChange={(e) => handleQuantityChange(index, parseInt(e.target.value, 10))}
                      className="quantity-input"
                    />
                  </div>
                </div>
                <button
                  className="btn-danger remove-button"
                  onClick={() => removeFromCart(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <h2>Total: ${calculateTotal()}</h2>
          </div>
          <button onClick={handleCheckout} className="btn-primary checkout-button">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
