import React, { useEffect, useState } from 'react';
import '../styles/dashboardpage.css';

const DashboardPage = () => {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('http://localhost:28763/logs');

        if (!response.ok) {
          throw new Error(`Error fetching logs: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setLogs(data);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }

    setSortConfig({ key, direction });

    const sortedLogs = [...logs].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    setLogs(sortedLogs);
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch('http://localhost:28770/statistics');

      if (!response.ok) {
        throw new Error(`Error fetching statistics: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setStatistics(data);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const openPopup = async () => {
    await fetchStatistics();
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setStatistics(null);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <button className="stats-button" onClick={openPopup}>
        View Shipping Statistics
      </button>
      {isLoading ? (
        <p>Loading logs...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <table className="logs-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>
                ID {getSortIndicator('id')}
              </th>
              <th onClick={() => handleSort('timestamp')}>
                Timestamp {getSortIndicator('timestamp')}
              </th>
              <th onClick={() => handleSort('method')}>
                Method {getSortIndicator('method')}
              </th>
              <th onClick={() => handleSort('endpoint')}>
                Endpoint {getSortIndicator('endpoint')}
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.method}</td>
                <td>{log.endpoint}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isPopupOpen && statistics && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Statistics</h2>
            <p><strong>Total Shipments:</strong> {statistics.total_shipments}</p>
            <p><strong>Delivered Shipments:</strong> {statistics.delivered_shipments}</p>
            <p><strong>In Transit Shipments:</strong> {statistics.in_transit_shipments}</p>
            <p><strong>Ready for Pickup:</strong> {statistics.ready_for_pickup}</p>
            <h3>Top Countries:</h3>
            <ul>
              {Object.entries(statistics.top_countries || {}).map(([country, count]) => (
                <li key={country}>
                  {country}: {count}
                </li>
              ))}
            </ul>
            <button className="close-popup-button" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;