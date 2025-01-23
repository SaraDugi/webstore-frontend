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
  const [editingReport, setEditingReport] = useState(null);

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

  const handleEditClick = (report) => {
    setEditingReport(report);
  };

  const handleUpdate = async (updatedReport) => {
    try {
      const response = await fetch(`http://localhost:4000/report`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${loggedInUser.token}`,
        },
        body: JSON.stringify(updatedReport),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        setReports((prev) =>
          prev.map((r) => (r.IssueID === updatedReport.Report_id ? { ...r, ...updatedReport } : r))
        );
        setFilteredReports((prev) =>
          prev.map((r) => (r.IssueID === updatedReport.Report_id ? { ...r, ...updatedReport } : r))
        );
      } else {
        alert(result.message || 'Failed to update the report.');
      }
    } catch (err) {
      alert('An error occurred while updating the report.');
    } finally {
      setEditingReport(null);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedReport = {
      Report_id: editingReport.IssueID,
      Status: formData.get('Status'),
      ResolvedAt: formData.get('ResolvedAt'),
      Priority: formData.get('Priority'),
    };
    handleUpdate(updatedReport);
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
              <th>Actions</th>
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
                <td>
                  <button onClick={() => handleEditClick(report)} className="btn-primary">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingReport && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Report</h2>
            <form onSubmit={handleFormSubmit}>
              <label>
                Status:
                <input type="text" name="Status" defaultValue={editingReport.Status} required />
              </label>
              <label>
                Resolved At:
                <input
                  type="datetime-local"
                  name="ResolvedAt"
                  defaultValue={
                    editingReport.ResolvedAt
                      ? new Date(editingReport.ResolvedAt).toISOString().slice(0, 16)
                      : ''
                  }
                />
              </label>
              <label>
                Priority:
                <select name="Priority" defaultValue={editingReport.Priority}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </label>
              <button type="submit" className="btn-primary">
                Update
              </button>
              <button
                type="button"
                onClick={() => setEditingReport(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
