import React, { useState, useEffect, useContext } from 'react';
import { LogInContext } from '../contexts/LoginContext';
import '../styles/shipmentspage.css';

const ShipmentsPage = () => {
  const { loggedInUser } = useContext(LogInContext);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [deliveryStatus, setDeliveryStatus] = useState('');

  useEffect(() => {
    const fetchShipments = async () => {
      if (!loggedInUser || !loggedInUser.token) {
        setError('You must be logged in to view shipments.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:9000/api/shipments', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized: Missing or invalid token.');
          }
          throw new Error('Failed to fetch shipments. Please try again later.');
        }

        const shipmentsData = await response.json();
        setShipments(shipmentsData || []);
        setError('');
      } catch (err) {
        console.error('Error fetching shipments:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, [loggedInUser]);

  const handleDeleteAllShipments = async () => {
    try {
      const response = await fetch('http://localhost:9000/api/shipments', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete all shipments. Please try again later.');
      }

      setShipments([]);
      setError('');
    } catch (err) {
      console.error('Error deleting all shipments:', err.message);
      setError(err.message);
    }
  };

  const handleDeleteShipment = async (id) => {
    try {
      const response = await fetch(`http://localhost:9000/api/shipments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete shipment. Please try again later.');
      }

      setShipments(shipments.filter((shipment) => shipment.id !== id));
      setError('');
    } catch (err) {
      console.error('Error deleting shipment:', err.message);
      setError(err.message);
    }
  };

  const handleUpdateShipment = async () => {
    if (!deliveryStatus || !selectedShipment) {
      setError('Please select a delivery status.');
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:9000/api/shipments/${selectedShipment.id}/delivery-status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${loggedInUser.token}`,
          },
          body: JSON.stringify({ delivery_status: deliveryStatus }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update the shipment. Please try again later.');
      }

      const timestampResponse = await fetch(
        `http://localhost:9000/api/shipments/${selectedShipment.id}/timestamp`,
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );

      if (!timestampResponse.ok) {
        throw new Error('Failed to update the timestamp.');
      }

      const updatedShipments = shipments.map((shipment) =>
        shipment.id === selectedShipment.id
          ? { ...shipment, delivery_status: deliveryStatus }
          : shipment
      );
      setShipments(updatedShipments);
      setSelectedShipment(null);
      setDeliveryStatus('');
      setError('');
    } catch (err) {
      console.error('Error updating shipment:', err.message);
      setError(err.message);
    }
  };

  const openUpdateModal = (shipment) => {
    setSelectedShipment(shipment);
    setDeliveryStatus(shipment.delivery_status || '');
  };

  const closeUpdateModal = () => {
    setSelectedShipment(null);
    setDeliveryStatus('');
  };

  return (
    <div className="shipments-page">
      <h1>All Shipments</h1>

      <button className="btn-delete" onClick={handleDeleteAllShipments}>
        Delete All Shipments
      </button>

      {loading ? (
        <p>Loading shipments...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : shipments.length === 0 ? (
        <p>No shipments available.</p>
      ) : (
        <>
          <table className="shipments-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Order ID</th>
                <th>Recipient Name</th>
                <th>Recipient Email</th>
                <th>Delivery Address</th>
                <th>City</th>
                <th>Country</th>
                <th>Delivery Status</th>
                <th>Weight (kg)</th>
                <th>Estimated Cost ($)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td>{shipment.id}</td>
                  <td>{shipment.order_id}</td>
                  <td>{shipment.recipient_name}</td>
                  <td>{shipment.recipient_email}</td>
                  <td>{shipment.delivery_address}</td>
                  <td>{shipment.city}</td>
                  <td>{shipment.country}</td>
                  <td>{shipment.delivery_status}</td>
                  <td>{shipment.weight}</td>
                  <td>{shipment.estimated_cost}</td>
                  <td>
                    <button
                      className="btn-primary"
                      onClick={() => openUpdateModal(shipment)}
                    >
                      Update Status
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => handleDeleteShipment(shipment.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {selectedShipment && (
        <div className="moda-shipments">
          <div className="modal-shipping-status">
            <h2>Update Delivery Status</h2>
            <p>
              <strong>Shipment ID:</strong> {selectedShipment.id}
            </p>
            <select
              value={deliveryStatus}
              onChange={(e) => setDeliveryStatus(e.target.value)}
              className="status-dropdown"
            >
              <option value="">Select Status</option>
              <option value="delivered">Delivered</option>
              <option value="in transit">In Transit</option>
              <option value="ready for pick up">Ready for Pick Up</option>
              <option value="shipment handed over">Shipment Handed Over</option>
            </select>
            <div className="modal-actions">
              <button className="btn-primary" onClick={handleUpdateShipment}>
                Save
              </button>
              <button className="btn-secondary" onClick={closeUpdateModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentsPage;
