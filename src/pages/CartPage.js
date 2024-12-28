import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
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
    cart.reduce((total, item) => total + parseFloat(item.price.replace('$', '')) * item.amount, 0).toFixed(2);

  const handleCheckout = () => {
    navigate('/checkout'); // Navigate to the checkout page
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <ul className="cart-items">
            {cart.map((item, index) => (
              <li key={index} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <p>Price: {item.price}</p>
                  <div className="quantity-wrapper">
                    <label htmlFor={`quantity-${index}`}>Quantity: </label>
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
                <button className="btn-danger" onClick={() => removeFromCart(index)}>
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