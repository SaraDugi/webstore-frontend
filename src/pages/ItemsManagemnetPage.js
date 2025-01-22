import React, { useContext, useEffect, useState } from 'react';
import { LogInContext } from '../contexts/LoginContext';
import '../styles.css';

const ItemManagementPage = () => {
  const { loggedInUser } = useContext(LogInContext);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch inventory data on mount
  useEffect(() => {
    const fetchItems = async () => {
      if (!loggedInUser || !loggedInUser.token) {
        setError('You must be logged in to view items.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8001/inventory/', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized: Missing or invalid token.');
          }
          throw new Error('Failed to fetch items. Please try again later.');
        }

        const result = await response.json();
        console.log('Fetched Inventory:', result); // Debug log
        setItems(result.data || []); // Assuming `data` contains the inventory array
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [loggedInUser]);

  return (
    <div className="item-management-page">
      <h1 className="page-title">Item Management</h1>
      {loading ? (
        <p className="loading-message">Loading items...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="items-table-container">
          <table className="items-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id || 'N/A'}</td>
                  <td>{item.name || 'N/A'}</td>
                  <td>{item.category || 'N/A'}</td>
                  <td>{item.stock || 'N/A'}</td>
                  <td>{item.price || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ItemManagementPage;