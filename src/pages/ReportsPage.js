import React, { useState, useEffect, useContext } from 'react';
import { LogInContext } from '../contexts/LoginContext';
import '../styles/reportspage.css';

const ReportsPage = () => {
  const { loggedInUser } = useContext(LogInContext);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchId, setSearchId] = useState('');
  const [filteredReports, setFilteredReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      if (!loggedInUser || !loggedInUser.token) {
        setError('You must be logged in to view reports.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:4000/reports', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized: Missing or invalid token.');
          }
          throw new Error('Failed to fetch reports. Please try again later.');
        }

        const result = await response.json();
        setReports(result);
        setFilteredReports(result);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [loggedInUser]);

  const handleSearch = () => {
    if (!searchId) {
      setFilteredReports(reports);
      return;
    }

    const searchResults = reports.filter((report) =>
      report.IssueID.toString().includes(searchId) || report.OrderID.toString().includes(searchId)
    );
    setFilteredReports(searchResults);
  };

  const clearSearch = () => {
    setSearchId('');
    setFilteredReports(reports);
  };

  return (
    <div className="reports-container">
      <h1 className="reports-title">Reports</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Issue ID or Order ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="btn-primary">
          Search
        </button>
        <button onClick={clearSearch} className="btn-secondary">
          Clear
        </button>
      </div>

      {isLoading ? (
        <p>Loading reports...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <table className="reports-table">
          <thead>
            <tr>
              <th>Issue ID</th>
              <th>Order ID</th>
              <th>Customer ID</th>
              <th>Issue Type</th>
              <th>Description</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Reported At</th>
              <th>Resolved At</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.IssueID}>
                <td>{report.IssueID}</td>
                <td>{report.OrderID}</td>
                <td>{report.CustomerID}</td>
                <td>{report.IssueType}</td>
                <td>{report.Description}</td>
                <td>{report.Status}</td>
                <td>{report.Priority}</td>
                <td>{new Date(report.ReportedAt).toLocaleString()}</td>
                <td>{report.ResolvedAt ? new Date(report.ResolvedAt).toLocaleString() : 'N/A'}</td>
                <td>{report.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReportsPage;