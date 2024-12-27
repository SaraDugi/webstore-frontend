import React from 'react';
import '../styles.css';

const ProductsPage = () => {
  const products = [
    { id: 1, name: 'Product 1', price: '$19.99', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Product 2', price: '$29.99', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Product 3', price: '$39.99', image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Product 4', price: '$49.99', image: 'https://via.placeholder.com/150' },
    { id: 5, name: 'Product 5', price: '$59.99', image: 'https://via.placeholder.com/150' },
    { id: 6, name: 'Product 6', price: '$69.99', image: 'https://via.placeholder.com/150' },
  ];

  return (
    <div className="products-page">
      <h1>Our Products</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.price}</p>
            <button className="add-to-cart">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;