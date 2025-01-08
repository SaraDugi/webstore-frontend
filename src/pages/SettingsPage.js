import React, { useContext, useState , useEffect} from 'react';
import { LogInContext } from '../contexts/LoginContext';
import '../styles.css';
import axios from 'axios';

const SettingsPage = () => {
  const { loggedInUser, handleLogout } = useContext(LogInContext);
  const [error, setError] = useState('');
  const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false); 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isAccountDeactivated, setIsAccountDeactivated] = useState(null);

  const openEditAccountModal = () => {
    setIsEditAccountModalOpen(true);
    setError('');
    setNewEmail(loggedInUser?.email || '');
    setNewPassword('');
    setRepeatPassword('');
    setShowPasswordFields(false);
  };

  const closeEditAccountModal = () => {
    setIsEditAccountModalOpen(false);
    setError('');
  };

  useEffect(() => {
    const fetchAccountStatus = async () => {
      if (!loggedInUser) return;

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
          const user = searchResponse.data.data[0];

          setIsAccountDeactivated(user.deactivated || false);
        }
      } catch (error) {
        console.error('Error fetching account status:', error.message);
        setError('Failed to fetch account status.');
      }
    };

    fetchAccountStatus();
  }, [loggedInUser]);

  const handleEditAccount = async () => {
    if (!newEmail) {
      setError('Please provide a valid email.');
      return;
    }

    let passwordToSend = loggedInUser.currentPassword;

    if (showPasswordFields) {
      if (!newPassword || !repeatPassword) {
        setError('Both password fields are required.');
        return;
      }
      if (newPassword !== repeatPassword) {
        setError('Passwords do not match.');
        return;
      }
      passwordToSend = newPassword;
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

        const payload = {
          email: newEmail,
          password: passwordToSend,
        };

        const updateResponse = await axios.put(
          `http://localhost:5000/users/${userId}/update`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${loggedInUser.token}`,
            },
          }
        );

        if (updateResponse.status === 200) {
          alert('Account updated successfully.');
          if (newEmail) {
            loggedInUser.email = newEmail;
          }
          closeEditAccountModal();
        } else {
          setError('Failed to update account.');
        }
      } else {
        setError('User not found.');
      }
    } catch (error) {
      console.error('Error updating account:', error.message);
      setError('An error occurred while updating your account. Please try again.');
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
          <img
            src="https://via.placeholder.com/100"
            alt="Profile"
            className="avatar"
          />
          <div className="profile-info">
            <p>{loggedInUser.email || 'example@example.com'}</p>
            <button className="btn-primary" onClick={openEditAccountModal}>
              Edit Account
            </button>
            {isAccountDeactivated === null ? (
          <p>Loading account status...</p>
        ) : isAccountDeactivated ? (
          <button className="btn-primary" onClick={handleReactivateAccount}>
            Reactivate Account
          </button>
        ) : (
          <button className="btn-secondary" onClick={handleDeactivateAccount}>
            Deactivate Account
          </button>
        )}
            <button className="btn-danger" onClick={() => setIsDeleteModalOpen(true)}>
              Delete Profile
            </button>
          </div>
        </div>
      </div>

    {/* Deactivate Account Modal */}
    {isDeactivateModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Deactivate Account</h2>
            <p>Are you sure you want to deactivate your account? This action can be undone later.</p>
            <div className="modal-buttons">
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

      {/* Edit Account Modal */}
      {isEditAccountModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Account</h2>
            {error && <p className="error-message">{error}</p>}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditAccount();
              }}
            >
              <label>
                New Email:
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </label>
              <div>
                {!showPasswordFields ? (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowPasswordFields(true)}
                  >
                    Change Password
                  </button>
                ) : (
                  <>
                    <label>
                      New Password:
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </label>
                    <label>
                      Repeat Password:
                      <input
                        type="password"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                      />
                    </label>
                  </>
                )}
              </div>
              <div className="modal-buttons">
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
                <button type="button" className="btn-secondary" onClick={closeEditAccountModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
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