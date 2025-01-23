import React, { useContext, useState , useEffect} from 'react';
import { LogInContext } from '../contexts/LoginContext';
import '../styles/settingspage.css';
import axios from 'axios';

const SettingsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { loggedInUser, handleLogout } = useContext(LogInContext);
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [creditCards, setCreditCards] = useState([]);
  const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isAccountDeactivated, setIsAccountDeactivated] = useState(null);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expirationDate: '',
    balance: 0,
    active: true,
  });
  const [newProfileData, setNewProfileData] = useState({
    email: '',
    password: '',
    gender: '',
    birthdate: '',
    zipcode: '',
    address: '',
    country: '',
    telephone: '',
  });  
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [filteredCards, setFilteredCards] = useState(creditCards);

  const openEditAccountModal = () => {
    setIsEditAccountModalOpen(true);
    setError('');
    setNewProfileData(userInfo || {});
  };

  const closeEditAccountModal = () => {
    setIsEditAccountModalOpen(false);
    setError('');
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!loggedInUser || !loggedInUser.id || !loggedInUser.token) {
        setError('User is not logged in.');
        return;
      }
  
      try {
        const response = await axios.get(`http://localhost:5000/users/${loggedInUser.id}`, {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        });
  
        if (response.status === 200 && response.data) {
          setUserInfo(response.data.data);
          setNewProfileData(response.data.data);
          setError('');
        } else {
          setError('Failed to fetch user details.');
        }
      } catch (err) {
        console.error('Error fetching user details:', err.message);
        setError('An error occurred while fetching user details.');
      }
    };

    const fetchCreditCards = async () => {
      if (!loggedInUser) return;
  
      try {
        const response = await axios.get('http://localhost:8080/api/card', {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        });
  
        if (response.status === 200) {
          setCreditCards(response.data.value);
          setFilteredCards(response.data.value);
        } else {
          setError('Failed to fetch credit cards.');
        }
      } catch (error) {
        console.error('Error fetching credit cards:', error.message);
        setError('An error occurred while fetching credit cards.');
      }
    };
    fetchUserDetails();
    fetchCreditCards();
  }, [loggedInUser]);

  const handleSearch = () => {
    const filtered = creditCards.filter((card) =>
      card.cardNumber.includes(searchQuery)
    );
    setFilteredCards(filtered);
  };  

  const handleAddCard = async (e) => {
    e.preventDefault();
  
    if (!newCard.cardNumber || !newCard.expirationDate || newCard.balance < 0) {
      setError('Please fill in all the fields correctly.');
      return;
    }
  
    try {
      const verifyResponse = await axios.post(
        `http://localhost:8080/api/card/${newCard.cardNumber}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );
  
      if (verifyResponse.status === 200 && verifyResponse.data.value) {
        alert('A card with this number already exists.');
        return; 
      }
  
      const payload = {
        id: 0,
        cardHolderId: loggedInUser.id,
        cardNumber: newCard.cardNumber,
        expirationDate: newCard.expirationDate,
        balance: newCard.balance,
        active: newCard.active,
      };
  
      const response = await axios.post('http://localhost:8080/api/card', payload, {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });
  
      if (response.status === 200) {
        alert('Credit card added successfully.');
        setIsAddCardModalOpen(false);
        setNewCard({
          cardNumber: '',
          expirationDate: '',
          balance: 0,
          active: true,
        });
        setCreditCards((prevCards) => [...prevCards, response.data.value]);
      } else {
        setError('Failed to add the credit card.');
      }
    } catch (error) {
      console.error('Error adding credit card:', error.message);
      setError('An error occurred while adding the credit card.');
    }
  };
  
  const openAddCardModal = () => {
    setIsAddCardModalOpen(true);
    setError('');
  };

  const closeAddCardModal = () => {
    setIsAddCardModalOpen(false);
    setError('');
  };

  const handleEditAccount = async () => {
    try {
      if (!loggedInUser || !loggedInUser.token) {
        setError('You need to be logged in to update your profile.');
        return;
      }
  
      const payload = {
        email: newProfileData.email || userInfo.email,
        password: newProfileData.password || '',
        gender: newProfileData.gender || userInfo.gender,
        birthdate: newProfileData.birthdate || userInfo.birthdate,
        zipcode: newProfileData.zipcode || userInfo.zipcode,
        address: newProfileData.address || userInfo.address,
        country: newProfileData.country || userInfo.country,
        telephone: newProfileData.telephone || userInfo.telephone,
      };
  
      if (!payload.email || !payload.birthdate || !payload.telephone) {
        setError('Please fill out all required fields.');
        return;
      }
  
      const userId = loggedInUser.id;
  
      const response = await axios.put(
        `http://localhost:5000/users/${userId}/update`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 200) {
        alert('Profile updated successfully.');
        setUserInfo(payload);
        closeEditAccountModal();
      } else {
        setError('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error.message);
  
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An error occurred while updating your profile. Please try again.');
      }
    }
  };
  
  
  const handleDeleteAllCards = async () => {
    if (!loggedInUser || !loggedInUser.token) {
      setError('You need to log in to perform this action.');
      return;
    }
  
    if (!window.confirm('Are you sure you want to delete all credit cards? This action cannot be undone.')) {
      return;
    }
  
    try {
      const response = await axios.delete('http://localhost:8080/api/card', {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });
  
      if (response.status === 200) {
        alert('All credit cards have been deleted.');
        setCreditCards([]);
      } else {
        setError('Failed to delete all credit cards.');
      }
    } catch (error) {
      console.error('Error deleting all credit cards:', error.message);
      setError('An error occurred while deleting all credit cards. Please try again.');
    }
  };
  

  const handleDeactivateAccount = async () => {
    try {
      const email = loggedInUser.email;

      const searchResponse = await axios.get(
        `http://localhost:5000/users/search/${email}`,
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );

      if (searchResponse.status === 200 && searchResponse.data.data.length > 0) {
        const userId = searchResponse.data.data[0].id;

        const payload = { deactivated: true };
        const deactivateResponse = await axios.patch(
          `http://localhost:5000/users/${userId}/status`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${loggedInUser.token}`,
            },
          }
        );

        if (deactivateResponse.status === 200) {
          alert('Account deactivated successfully. Logging out...');
          setIsAccountDeactivated(true);
          handleLogout();
          window.location.href = '/login';
        }
      }
    } catch (error) {
      console.error('Error deactivating account:', error.message);
      setError('An error occurred while deactivating your account. Please try again.');
    }
  };

  const handleExtendExpiration = async (cardId) => {
    if (!loggedInUser || !loggedInUser.token) {
      setError('You need to log in to perform this action.');
      return;
    }
  
    try {
      const response = await axios.put(
        `http://localhost:8080/api/card/extend/${cardId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );
  
      if (response.status === 200) {
        alert('Expiration date successfully extended.');
        setCreditCards((prevCards) =>
          prevCards.map((card) =>
            card.id === cardId
              ? { ...card, expirationDate: new Date(card.expirationDate).setFullYear(new Date(card.expirationDate).getFullYear() + 1) }
              : card
          )
        );
      } else {
        setError('Failed to extend expiration date.');
      }
    } catch (error) {
      console.error('Error extending expiration date:', error.message);
      setError('An error occurred while extending the expiration date. Please try again.');
    }
  };  

  const handleDeleteProfile = async () => {
    if (!loggedInUser || !loggedInUser.token || !loggedInUser.email) {
      alert('User email or token is missing. Please log in again.');
      return;
    }

    try {
      const email = loggedInUser.email;
      const searchResponse = await axios.get(`http://localhost:5000/users/search/${email}`, {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });

      if (searchResponse.status === 200 && searchResponse.data.data.length > 0) {
        const userId = searchResponse.data.data[0].id;

        const deleteResponse = await axios.delete(`http://localhost:5000/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        });

        if (deleteResponse.status === 200) {
          alert('Profile deleted successfully. You will now be logged out.');
          handleLogout();
          window.location.href = '/login';
        }
      } else {
        alert('User not found. Please check your email.');
      }
    } catch (error) {
      console.error('Error deleting profile:', error.message);
      alert('An error occurred while deleting the profile. Please try again.');
    }
  };

  const handleDeleteCard = async (cardNumber) => {
    if (!loggedInUser || !loggedInUser.token) {
      setError('You need to log in to perform this action.');
      return;
    }
  
    if (!window.confirm(`Are you sure you want to delete the card ending in ${cardNumber.slice(-4)}?`)) return;
  
    try {
      const response = await axios.delete(`http://localhost:8080/api/card/${cardNumber}`, {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });
  
      if (response.status === 200) {
        alert('Card deleted successfully.');
        setCreditCards((prevCards) => prevCards.filter((card) => card.cardNumber !== cardNumber));
      } else {
        setError('Failed to delete the card.');
      }
    } catch (error) {
      console.error('Error deleting card:', error.message);
      setError('An error occurred while deleting the card. Please try again.');
    }
  };
  
  const handleToggleCardStatus = async (cardId, currentStatus) => {
    if (!loggedInUser || !loggedInUser.token) {
      setError('You need to log in to perform this action.');
      return;
    }
  
    try {
      const response = await axios.put(`http://localhost:8080/api/card/active/${cardId}`, {}, {
        headers: {
          Authorization: `Bearer ${loggedInUser.token}`,
        },
      });
  
      if (response.status === 200) {
        alert(`Card status successfully updated to ${!currentStatus ? 'Active' : 'Inactive'}.`);
        setCreditCards((prevCards) =>
          prevCards.map((card) =>
            card.id === cardId ? { ...card, active: !currentStatus } : card
          )
        );
      } else {
        setError('Failed to update card status.');
      }
    } catch (error) {
      console.error('Error updating card status:', error.message);
      setError('An error occurred while updating the card status. Please try again.');
    }
  };
  

  const handleReactivateAccount = async () => {
    try {
      const email = loggedInUser.email;

      const searchResponse = await axios.get(
        `http://localhost:5000/users/search/${email}`,
        {
          headers: {
            Authorization: `Bearer ${loggedInUser.token}`,
          },
        }
      );

      if (searchResponse.status === 200 && searchResponse.data.data.length > 0) {
        const userId = searchResponse.data.data[0].id;

        const payload = { deactivated: false };
        const reactivateResponse = await axios.patch(
          `http://localhost:5000/users/${userId}/status`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${loggedInUser.token}`,
            },
          }
        );

        if (reactivateResponse.status === 200) {
          alert('Account reactivated successfully.');
          setIsAccountDeactivated(false);
        }
      }
    } catch (error) {
      console.error('Error reactivating account:', error.message);
      setError('An error occurred while reactivating your account. Please try again.');
    }
  };

  if (!loggedInUser) return <p>Loading user data...</p>;

  return (
    <div className="user-profile-container">
      <div className="profile-left">
        <div className="profile-card">
          <div className="profile-info">
            {userInfo ? (
              <>
                <h2>User information</h2>
                <p><strong>Email:</strong> {userInfo.email}</p>
                <p><strong>Gender:</strong> {userInfo.gender}</p>
                <p><strong>Birthdate:</strong> {userInfo.birthdate}</p>
                <h2>Contact information</h2>
                <p><strong>Telephone:</strong> {userInfo.telephone}</p>
                <h2>Shipping address</h2>
                <p><strong>Zipcode:</strong> {userInfo.zipcode}</p>
                <p><strong>Address:</strong> {userInfo.address}</p>
                <p><strong>Country:</strong> {userInfo.country}</p>
                
              </>
            ) : (
              <p>{loggedInUser.email || 'example@example.com'}</p>
            )}
            <button className="btn-primary" onClick={openEditAccountModal}>
              Edit Account
            </button>
            {isAccountDeactivated === null ? (
              <button className="btn-secondary" onClick={handleDeactivateAccount}>
                Deactivate Account
              </button>            ) : isAccountDeactivated ? (
              <button className="btn-primary" onClick={handleReactivateAccount}>
                Reactivate Account
              </button>
            ) : (
              <button className="btn-secondary" onClick={handleDeactivateAccount}>
                Deactivate Account
              </button>
            )}
            <button className="btn-delete-" onClick={() => setIsDeleteModalOpen(true)}>
              Delete Profile
            </button>
            <button className="btn-primary" onClick={openAddCardModal}>
              Add New Credit Card
            </button>
          </div>
        </div>
      </div>

      {/* Add Credit Card Modal */}
      {isAddCardModalOpen && (
        <div className="modal-addcard">
          <div className="modal-addc">
            <h2>Add New Credit Card</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleAddCard}>
              <label>
                Card Number:
                <input
                  type="text"
                  value={newCard.cardNumber}
                  onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                  required
                />
              </label>
              <label>
                Expiration Date:
                <input
                  type="date"
                  value={newCard.expirationDate}
                  onChange={(e) => setNewCard({ ...newCard, expirationDate: e.target.value })}
                  required
                />
              </label>
              <label>
                Balance:
                <input
                  type="number"
                  value={newCard.balance}
                  onChange={(e) => setNewCard({ ...newCard, balance: parseFloat(e.target.value) })}
                  required
                />
              </label>
              <label>
                Active:
                <input
                  type="checkbox"
                  checked={newCard.active}
                  onChange={(e) => setNewCard({ ...newCard, active: e.target.checked })}
                />
              </label>
              <div className="modal-buttons">
                <button type="submit" className="btn-primary">
                  Add Card
                </button>
                <button type="button" className="btn-secondary" onClick={closeAddCardModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    {/* Deactivate Account Modal */}
    {isDeactivateModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Deactivate Account</h2>
            <p>Are you sure you want to deactivate your account? This action can be undone later.</p>
            <div className="button-container">
             <button className="btn-secondary" onClick={handleDeactivateAccount}>
                Yes, Deactivate
              </button>
              <button
                className="btn-primary"
                onClick={() => setIsDeactivateModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

<div className="card-section">
<div className="card-header">
  <h2 className="card-title">Your Cards</h2>
  <button className="btn-danger delete-all-button" onClick={handleDeleteAllCards}>
    Delete All Cards
  </button>
</div>

  <div className="action-buttons">
    <div className="search-container">
      <input
        type="text"
        className="search-bar"
        placeholder="Search by Card Number"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className="search-button" onClick={handleSearch}>
        Search
      </button>
      {searchQuery && (
        <button
          className="btn-secondary cancel-search-button"
          onClick={() => {
            setSearchQuery('');
            setFilteredCards(creditCards);
          }}
        >
          Cancel
        </button>
      )}
    </div>
  </div>
  <div className="credit-card-container">
    <div className="credit-card-list">
      {filteredCards.map((card) => (
        <div key={card.id} className="credit-card-item-modern">
          <div className="card-header">
            <p className="card-number">
              <strong>Card Number:</strong>{' '}
              {card.cardNumber.replace(/\d{12}(\d{4})/, '**** **** **** $1')}
            </p>
          </div>
          <div className="card-body">
            <p>
              <strong>Balance:</strong> ${card.balance.toFixed(2)}
            </p>
            <p>
              <strong>Expiration Date:</strong>{' '}
              {new Date(card.expirationDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong> {card.active ? 'Active' : 'Inactive'}
            </p>
          </div>
          <div className="card-actions">
            <button
              className="btn-secondary"
              onClick={() => handleToggleCardStatus(card.cardNumber, card.active)}
            >
              {card.active ? 'Deactivate' : 'Activate'}
            </button>
            <button
              className="btn-danger"
              onClick={() => handleDeleteCard(card.cardNumber)}
            >
              Delete
            </button>
            <button
              className="btn-primary"
              onClick={() => handleExtendExpiration(card.id)}
            >
              Extend Expiration
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
       {/* Edit Account Modal */}
      {isEditAccountModalOpen && (
        <div className="modal-editAccount">
          <div className="modal-editacc">
            <h2>Edit Profile</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={(e) => e.preventDefault()}>
              <label>
                Email:
                <input
                  type="email"
                  value={newProfileData.email}
                  onChange={(e) =>
                    setNewProfileData({ ...newProfileData, email: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  value={newProfileData.password}
                  onChange={(e) =>
                    setNewProfileData({ ...newProfileData, password: e.target.value })
                  }
                />
              </label>
              <label>
                Gender:
                <select
                  value={newProfileData.gender}
                  onChange={(e) =>
                    setNewProfileData({ ...newProfileData, gender: e.target.value })
                  }
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label>
                Birthdate:
                <input
                  type="date"
                  value={newProfileData.birthdate}
                  onChange={(e) =>
                    setNewProfileData({ ...newProfileData, birthdate: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Telephone:
                <input
                  type="text"
                  value={newProfileData.telephone}
                  onChange={(e) =>
                    setNewProfileData({ ...newProfileData, telephone: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Zipcode:
                <input
                  type="text"
                  value={newProfileData.zipcode}
                  onChange={(e) =>
                    setNewProfileData({ ...newProfileData, zipcode: e.target.value })
                  }
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  value={newProfileData.address}
                  onChange={(e) =>
                    setNewProfileData({ ...newProfileData, address: e.target.value })
                  }
                />
              </label>
              <label>
                Country:
                <input
                  type="text"
                  value={newProfileData.country}
                  onChange={(e) =>
                    setNewProfileData({ ...newProfileData, country: e.target.value })
                  }
                />
              </label>
              <div className="modal-buttons">
                <button type="button" className="btn-primary" onClick={handleEditAccount}>
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeEditAccountModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-delete">
          <div className="modal-dele">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete your profile? This action cannot be undone.</p>
            <div className="modal-buttons">
              <button className="btn-danger" onClick={handleDeleteProfile}>
                Yes, Delete
              </button>
              <button className="btn-secondary" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;