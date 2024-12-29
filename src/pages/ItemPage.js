import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import '../styles.css';

const ItemPage = ({ products }) => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  // Safely find the product
  const product = products?.find((item) => item.id === parseInt(id, 10));

  if (!product) {
    return (
      <div className="error-message-container">
        <p className="error-message">Product not found. Please check the URL or return to the product listing.</p>
        <button className="btn-secondary" onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="item-page">
      <div className="item-container">
        <div className="item-image-wrapper">
          <img src={product.image} alt={product.name} className="item-image" />
        </div>
        <div className="item-details">
          <h1 className="item-title">{product.name}</h1>
          <p className="item-price">Price: {product.price}</p>
          <p className="item-description">
            Discover the amazing features of {product.name}. Designed with top-quality materials, this product
            ensures both durability and style, making it a perfect choice for your needs.
          </p>
          <div className="item-specifications">
            <h3>Specifications:</h3>
            <ul>
              <li>High-quality materials</li>
              <li>Designed for durability</li>
              <li>Available in multiple colors</li>
              <li>1-year warranty included</li>
            </ul>
          </div>
          <button onClick={handleAddToCart} className="btn-primary">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
