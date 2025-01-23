import React, { useContext, useEffect, useState } from 'react';
import { LogInContext } from '../contexts/LoginContext';
import '../styles/usermanagment.css';

const UsersPage = () => {
  const { loggedInUser } = useContext(LogInContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      if (!loggedInUser || !loggedInUser.token) {
        setError('You must be logged in to view users.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/users/', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized: Missing or invalid token.');
          }
          throw new Error('Failed to fetch users. Please try again later.');
        }

        const result = await response.json();
        console.log('Fetched Users:', result); // Debug log
        setUsers(result.data || []);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [loggedInUser]);

  // Handle user search by email
  const handleSearch = async () => {
    if (!searchEmail) {
      setError('Please enter an email to search.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/users/search/${searchEmail}`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Missing or invalid token.');
        }
        if (response.status === 404) {
          throw new Error('User not found.');
        }
        throw new Error('Failed to fetch user. Please try again later.');
      }

      const result = await response.json();
      console.log('Search Result:', result); // Debug log
      setSearchResult(result.data ? [result.data] : []);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  // Clear search results and reset to all users
  const clearSearch = () => {
    setSearchEmail('');
    setSearchResult(null);
    setError('');
  };

  // Delete a user
  const deleteUser = async (userId) => {
    if (!loggedInUser || !loggedInUser.token) {
      setError('You must be logged in to perform this action.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Missing or invalid token.');
        }
        if (response.status === 404) {
          throw new Error('User not found.');
        }
        throw new Error('Failed to delete user. Please try again later.');
      }

      const result = await response.json();
      console.log('Delete Response:', result); // Debug log

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  // Toggle a user's status (activate/deactivate)
  const toggleUserStatus = async (userId, currentStatus) => {
    if (!loggedInUser || !loggedInUser.token) {
      setError('You must be logged in to perform this action.');
      return;
    }

    const newStatus = !currentStatus; // Toggle the status

    try {
      const response = await fetch(`http://localhost:5000/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${loggedInUser.token}`,
        },
        body: JSON.stringify({ deactivated: newStatus }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Missing or invalid token.');
        }
        if (response.status === 404) {
          throw new Error('User not found.');
        }
        throw new Error('Failed to update user status. Please try again later.');
      }

      const result = await response.json();
      console.log('Status Update Response:', result);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, deactivated: newStatus } : user
        )
      );
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="users-page">
      <h1 className="users-title">All Users</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
        {searchResult && (
          <button onClick={clearSearch} className="clear-button">
            Clear
          </button>
        )}
      </div>
      {loading ? (
        <p className="loading-message">Loading users...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Birthdate</th>
                <th>Zipcode</th>
                <th>Address</th>
                <th>Country</th>
                <th>Telephone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(searchResult || users).map((user) => (
                <tr key={user.id}>
                  <td>{user.id || 'N/A'}</td>
                  <td>{user.email || 'N/A'}</td>
                  <td>{user.gender || 'N/A'}</td>
                  <td>{user.birthdate || 'N/A'}</td>
                  <td>{user.zipcode || 'N/A'}</td>
                  <td>{user.address || 'N/A'}</td>
                  <td>{user.country || 'N/A'}</td>
                  <td>{user.telephone || 'N/A'}</td>
                  <td>{user.role || 'N/A'}</td>
                  <td>{user.deactivated ? 'Inactive' : 'Active'}</td>
                  <td>
                    <button
                      className={`status-button ${
                        user.deactivated ? 'activate' : 'deactivate'
                      }`}
                      onClick={() =>
                        toggleUserStatus(user.id, user.deactivated || false)
                      }
                    >
                      {user.deactivated ? 'Activate' : 'Deactivate'}
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => deleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersPage;