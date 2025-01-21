import React, { useContext, useEffect, useState } from 'react';
import { LogInContext } from '../../contexts/LoginContext';
import '../styles.css';

const UsersPage = () => {
  const { loggedInUser } = useContext(LogInContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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
        setUsers(result.data || []); // Assume the response contains a `data` array
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [loggedInUser]);

  return (
    <div className="users-page">
      <h1>All Users</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
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
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.gender}</td>
                <td>{user.birthdate}</td>
                <td>{user.zipcode}</td>
                <td>{user.address}</td>
                <td>{user.country}</td>
                <td>{user.telephone}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersPage;