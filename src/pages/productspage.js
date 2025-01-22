import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../contexts/CartContext';
import { LogInContext } from '../contexts/LoginContext';
import '../styles.css';

const ProductsPage = () => {
  const { addToCart } = useContext(CartContext);
  const { loggedInUser } = useContext(LogInContext);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!loggedInUser || !loggedInUser.token) {
        setError('You must be logged in to view products.');
        return;
      }

      try {
        const response = await fetch('http://localhost:5001/catalog/', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        if (Array.isArray(data) && Array.isArray(data[0])) {
          setProducts(data[0]);
        } else {
          setError('Unexpected response format from API.');
        }
      } catch (error) {
        setError('Failed to fetch products. Please try again later.');
        console.error('Error fetching products:', error.message);
      }
    };

    fetchProducts();
  }, [loggedInUser]);

  const handleAddToCart = (product) => {
    addToCart({ id: product._id, ...product, amount: 1 });
    alert(`${product.name} added to cart!`);
  };

  const handleSearch = async () => {
    if (!searchId) {
      setError('Please enter a product ID.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/catalog/${searchId}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setSearchResult(null);
          setError('Product not found.');
        } else {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return;
      }

      const data = await response.json();
      setSearchResult(data);
      setError('');
    } catch (error) {
      setSearchResult(null);
      setError('Failed to fetch the product. Please try again later.');
      console.error('Error searching product:', error.message);
    }
  };

  const handleCancelSearch = () => {
    setSearchResult(null);
    setSearchId('');
    setError('');
  };

  return (
    <div className="products-page">
      <h1>Products</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter Product ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        {searchResult && (
          <button onClick={handleCancelSearch} className="btn-cancel">
            Cancel Search
          </button>
        )}
      </div>
      {error && <p className="search-error">{error}</p>}
      {searchResult ? (
        <div className="product-grid">
          <div className="product-card">
            <h2>{searchResult.name}</h2>
            <p>${searchResult.price}</p>
            <p>{searchResult.description}</p>
            <button
              onClick={() => handleAddToCart(searchResult)}
              className="btn-primary"
            >
              Add to Cart
            </button>
          </div>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <h2>{product.name}</h2>
              <p>${product.price}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                className="btn-primary"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
