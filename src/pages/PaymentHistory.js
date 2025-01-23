import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { LogInContext } from '../contexts/LoginContext';
import '../styles/paymenthistory.css';

const PaymentHistory = () => {
  const { loggedInUser } = useContext(LogInContext);
  const [payments, setPayments] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [isStatisticsModalOpen, setIsStatisticsModalOpen] = useState(false);

  const fetchPayments = async () => {
    if (!loggedInUser || !loggedInUser.token) {
      setError('You must be logged in to view payment history.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:8081/api/payment', {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });

      if (response.status === 200) {
        const paymentsData = response.data.value;
        setPayments(paymentsData);
      } else {
        setError('Failed to fetch payment history.');
      }
    } catch (err) {
      console.error('Error fetching payments:', err.message);
      setError('An error occurred while fetching payment history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    if (!loggedInUser || !loggedInUser.token) {
      setError('You must be logged in to view statistics.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/api/payment/user/statistic', {}, {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });

      if (response.status === 200) {
        setStatistics(response.data.value); // Extract statistics from "value"
      } else {
        setError('Failed to fetch statistics.');
      }
    } catch (err) {
      console.error('Error fetching statistics:', err.message);
      setError('An error occurred while fetching statistics. Please try again later.');
    }
  };

  const searchPayment = async () => {
    if (!searchQuery) {
      setError('Please enter a credit card number.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8081/api/payment/${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });

      if (response.status === 200) {
        setSearchResult(response.data);
        setError(null);
      } else {
        setSearchResult(null);
        setError('Payment details not found for the provided credit card number.');
      }
    } catch (err) {
      console.error('Error searching payment:', err.message);
      setSearchResult(null);
      setError('An error occurred while searching for the payment. Please try again later.');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResult(null);
    setError(null);
  };

  const deletePayment = async (cardNumber) => {
    if (!loggedInUser || !loggedInUser.token) {
      setError('You must be logged in to perform this action.');
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the payment record for card number ending in ${cardNumber.slice(-4)}? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:8081/api/payment/${cardNumber}`, {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });

      if (response.status === 200) {
        alert('The payment record has been successfully deleted.');
        setPayments((prevPayments) =>
          prevPayments.filter((payment) => payment.cardNumber !== cardNumber)
        );
      } else {
        setError('Failed to delete the payment record.');
      }
    } catch (err) {
      console.error('Error deleting payment:', err.message);
      setError('An error occurred while deleting the payment. Please try again later.');
    }
  };

  const deleteAllPayments = async () => {
    if (!loggedInUser || !loggedInUser.token) {
      setError('You must be logged in to perform this action.');
      return;
    }

    const confirmDelete = window.confirm(
      'Are you sure you want to delete all payment records? This action cannot be undone.'
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete('http://localhost:8081/api/payment', {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });

      if (response.status === 200) {
        alert('All payment records have been successfully deleted.');
        setPayments([]);
      } else {
        setError('Failed to delete all payment records.');
      }
    } catch (err) {
      console.error('Error deleting payments:', err.message);
      setError('An error occurred while deleting payments. Please try again later.');
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchStatistics();
  }, [loggedInUser]);

  const openStatisticsModal = () => {
    setIsStatisticsModalOpen(true);
  };

  const closeStatisticsModal = () => {
    setIsStatisticsModalOpen(false);
  };

  if (loading) {
    return <div>Loading payment history...</div>;
  }

  return (
    <div className="payment-history">
      <h1>Payment History</h1>
      <div className="content-container">
        {/* Table Section */}
        <div className="table-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Enter Credit Card Number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={searchPayment} className="btn-primary">
              Search
            </button>
            {searchResult && (
              <button onClick={clearSearch} className="btn-secondary">
                Clear Search
              </button>
            )}
          </div>
          <div className="table-header">
            <button className="btn-danger delete-all-button" onClick={deleteAllPayments}>
              Delete All Payments
            </button>
            <button className="btn-primary" onClick={openStatisticsModal}>
              View Statistics
            </button>
          </div>
          {payments.length > 0 ? (
            <table className="payment-table">
              <thead>
                <tr>
                  <th>Card Number</th>
                  <th>Order ID</th>
                  <th>Paid Date</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.cardNumber}>
                    <td>{payment.cardNumber.replace(/\d{12}(\d{4})/, '**** **** **** $1')}</td>
                    <td>{payment.order_id}</td>
                    <td>{new Date(payment.paidDate).toLocaleDateString()}</td>
                    <td>${payment.amount.toFixed(2)}</td>
                    <td>
                      <button
                        className="btn-danger delete-button"
                        onClick={() => deletePayment(payment.cardNumber)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No payments found.</p>
          )}
        </div>
      </div>
      {isStatisticsModalOpen && statistics && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Statistics</h2>
            <p><strong>Total Amount Spent:</strong> ${statistics.totalSpentMoney.toFixed(2)}</p>
            <p><strong>Number of Payments:</strong> {statistics.numberOfPayments}</p>
            <p><strong>Breakdown by Card:</strong></p>
            <ul>
              {Object.entries(statistics.spentMoneyByCard).map(([cardNumber, amount]) => (
                <li key={cardNumber}>
                  Card ending in {cardNumber.slice(-4)}: ${amount.toFixed(2)}
                </li>
              ))}
            </ul>
            <button className="btn-secondary" onClick={closeStatisticsModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;