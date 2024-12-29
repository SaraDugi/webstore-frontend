import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import '../styles.css';

const ProductsPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const products = [
    { id: 1, name: 'Product 1', price: '$19.99', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Product 2', price: '$29.99', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Product 3', price: '$39.99', image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Product 4', price: '$49.99', image: 'https://via.placeholder.com/150' },
    { id: 5, name: 'Product 5', price: '$59.99', image: 'https://via.placeholder.com/150' },
    { id: 6, name: 'Product 6', price: '$69.99', image: 'https://via.placeholder.com/150' },
    { id: 7, name: 'Product 7', price: '$79.99', image: 'https://via.placeholder.com/150' },
  ];

  const handleProductClick = (id) => {
    navigate(`/products/${id}`);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="products-page">
      <h1>Products</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => handleProductClick(product.id)}
          >
            <img src={product.image} alt={product.name} />
            <h2>{product.name}</h2>
            <p>{product.price}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product);
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;