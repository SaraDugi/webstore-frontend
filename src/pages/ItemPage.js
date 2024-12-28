import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import '../styles.css';

const ItemPage = ({ products }) => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const product = products.find((item) => item.id === parseInt(id, 10));

  if (!product) {
    return <p className="error-message">Product not found.</p>;
  }

  const handleAddToCart = () => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="item-page">
      <div className="item-container">
        <img src={product.image} alt={product.name} className="item-image" />
        <div className="item-details">
          <h1 className="item-title">{product.name}</h1>
          <p className="item-price">{product.price}</p>
          <p className="item-description">
            Discover the amazing features of {product.name}. Designed with top-quality materials, this product
            ensures both durability and style, making it a perfect choice for your needs.
          </p>
          <button onClick={handleAddToCart} className="btn-primary">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemPage;