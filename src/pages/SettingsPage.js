import React, { useContext, useState } from 'react';
import { LogInContext } from '../contexts/LoginContext';
import '../styles.css';
import { UsersContext } from '../contexts/UserContext';

const SettingsPage = () => {
  const { loggedInUser } = useContext(LogInContext);
  const { updateRegisteredUser } = useContext(UsersContext);

  const [activeTab, setActiveTab] = useState('user-settings');
  const [editType, setEditType] = useState(null);
  const [address, setAddress] = useState({ address: '', city: '', postalCode: '' });
  const [phone, setPhone] = useState(loggedInUser?.phone || '');
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState(loggedInUser?.paymentMethods || []);
  const [newPaymentMethod, setNewPaymentMethod] = useState('');
  const [selectedPaymentIndex, setSelectedPaymentIndex] = useState(null);
  const [error, setError] = useState('');
  const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);

  const openModal = (type, index = null) => {
    setEditType(type);
    setError(''); // Clear previous errors

    if (type === 'address') {
      if (index !== null) {
        const existingAddress = loggedInUser.addresses[index];
        setAddress({
          address: existingAddress.address || '',
          city: existingAddress.city || '',
          postalCode: existingAddress.postalCode || '',
        });
        setSelectedAddressIndex(index);
      } else {
        setAddress({ address: '', city: '', postalCode: '' });
        setSelectedAddressIndex(null);
      }
    } else if (type === 'phone') {
      setPhone(loggedInUser?.phone || '');
    } else if (type === 'payment') {
      if (index !== null) {
        setNewPaymentMethod(paymentMethods[index] || '');
        setSelectedPaymentIndex(index);
      } else {
        setNewPaymentMethod('');
        setSelectedPaymentIndex(null);
      }
    }
  };

  const closeModal = () => {
    setEditType(null);
    setError('');
  };

  const openProfileEditModal = () => {
    setIsProfileEditModalOpen(true);
  };

  const closeProfileEditModal = () => {
    setIsProfileEditModalOpen(false);
  };

  const handleDeleteProfile = () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      alert('Profile deleted successfully.');
      // Add deletion logic here.
    }
  };

  const handleSave = () => {
    if (editType === 'address') {
      if (!address.address || !address.city || !address.postalCode) {
        setError('All address fields are required.');
        return;
      }
    } else if (editType === 'phone' && !/^\d{10}$/.test(phone)) {
      setError('Phone number must be 10 digits.');
      return;
    } else if (editType === 'payment' && !newPaymentMethod) {
      setError('Payment method cannot be empty.');
      return;
    }

    const updatedUser = { ...loggedInUser };

    if (editType === 'address') {
      if (selectedAddressIndex !== null) {
        updatedUser.addresses[selectedAddressIndex] = address;
      } else {
        updatedUser.addresses = updatedUser.addresses
          ? [...updatedUser.addresses, address]
          : [address];
      }
    } else if (editType === 'phone') {
      updatedUser.phone = phone;
    } else if (editType === 'payment') {
      if (selectedPaymentIndex !== null) {
        paymentMethods[selectedPaymentIndex] = newPaymentMethod;
      } else {
        setPaymentMethods([...paymentMethods, newPaymentMethod]);
      }
      updatedUser.paymentMethods = paymentMethods;
    }

    updateRegisteredUser(updatedUser);
    closeModal();
    alert(`${editType === 'address' ? 'Address' : editType === 'phone' ? 'Phone number' : 'Payment method'} updated.`);
  };

  const handleSetPrimary = (index) => {
    const updatedUser = { ...loggedInUser };
    const selectedAddress = updatedUser.addresses.splice(index, 1)[0];
    updatedUser.addresses = [selectedAddress, ...updatedUser.addresses];
    updateRegisteredUser(updatedUser);
    alert('Primary address updated.');
  };

  const handleSetPrimaryPayment = (index) => {
    const updatedUser = { ...loggedInUser };
    const selectedPayment = paymentMethods.splice(index, 1)[0];
    updatedUser.paymentMethods = [selectedPayment, ...paymentMethods];
    updateRegisteredUser(updatedUser);
    alert('Primary payment method updated.');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'user-settings':
        return (
          <>
            <section className="phone-section">
              <h2>Phone Number</h2>
              {loggedInUser.phone ? (
                <div className="phone-card">
                  <p><strong>{loggedInUser.phone}</strong></p>
                  <button className="btn-secondary" onClick={() => openModal('phone')}>
                    Edit
                  </button>
                </div>
              ) : (
                <>
                  <p>No phone number added yet.</p>
                  <button className="btn-add" onClick={() => openModal('phone')}>
                    Add Phone Number
                  </button>
                </>
              )}
            </section>
            <section className="addresses-section">
              <h2>Addresses</h2>
              {loggedInUser.addresses && loggedInUser.addresses.length > 0 ? (
                loggedInUser.addresses.map((addr, index) => (
                  <div className="address-card" key={index}>
                    <p><strong>{addr.address}</strong></p>
                    <p>{addr.city}</p>
                    <p>{addr.postalCode}</p>
                    <div className="button-row">
                      {index === 0 && <span className="primary-badge">Primary</span>}
                      <button className="btn-secondary" onClick={() => openModal('address', index)}>
                        Edit
                      </button>
                      {index !== 0 && (
                        <button className="btn-secondary" onClick={() => handleSetPrimary(index)}>
                          Set as Primary
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <p>No address added yet.</p>
                  <button className="btn-add" onClick={() => openModal('address')}>
                    Add Address
                  </button>
                </>
              )}
            </section>
          </>
        );

      case 'payment':
        return (
          <section className="payment-section">
            <h2>Payment Methods</h2>
            {paymentMethods.length > 0 ? (
              paymentMethods.map((method, index) => (
                <div className="payment-card" key={index}>
                  <p><strong>{method.type === 'Card' ? method.cardholderName : method.paypalEmail}</strong></p>
                  <div className="button-row">
                    <button className="btn-secondary" onClick={() => openModal('payment', index)}>
                      Edit
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <>
                <p>No payment methods added yet.</p>
                <button className="btn-add" onClick={() => openModal('payment')}>
                  Add Payment Method
                </button>
              </>
            )}
          </section>
        );

      case 'privacy':
        return <p>Privacy settings will be available here.</p>;

      case 'notifications':
        return <p>Notification settings will be available here.</p>;

      default:
        return <p>Invalid tab selected.</p>;
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
            <h1>{loggedInUser.name || loggedInUser.username}</h1>
            <p>{loggedInUser.email || 'example@example.com'}</p>
            <button className="btn-primary" onClick={openProfileEditModal}>Edit Profile</button>
            <button className="btn-danger" onClick={handleDeleteProfile}>Delete Profile</button>
          </div>
        </div>
      </div>
      <div className="profile-right">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'user-settings' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('user-settings')}
          >
            User Settings
          </button>
          <button
            className={`tab ${activeTab === 'payment' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('payment')}
          >
            Payment
          </button>
          <button
            className={`tab ${activeTab === 'privacy' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy
          </button>
          <button
            className={`tab ${activeTab === 'notifications' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
        </div>
        <div className="tab-content">{renderTabContent()}</div>
      </div>
      {editType && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editType === 'address' ? 'Edit Address' : editType === 'phone' ? 'Edit Phone Number' : 'Edit Payment Method'}</h2>
            {error && <p className="error-message">{error}</p>}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              {editType === 'address' && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>{selectedAddressIndex !== null ? 'Edit Address' : 'Add Address'}</h2>
      {error && <p className="error-message">{error}</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <label>
          Address:
          <input
            type="text"
            value={address.address}
            onChange={(e) => setAddress({ ...address, address: e.target.value })}
            required
          />
        </label>
        <label>
          City:
          <input
            type="text"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            required
          />
        </label>
        <label>
          Postal Code:
          <input
            type="text"
            value={address.postalCode}
            onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
            required
          />
        </label>
        <label>
          Country:
          <input
            type="text"
            value={address.country || ''}
            onChange={(e) => setAddress({ ...address, country: e.target.value })}
            required
          />
        </label>
        <div className="modal-buttons">
          <button type="submit" className="btn-primary">Save</button>
          <button type="button" className="btn-secondary" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}

              {editType === 'phone' && (
                <label>
                  Phone Number:
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </label>
              )}
              {editType === 'payment' && (
                <div className="modal-overlay">
                  <div className="modal">
                    <h2>{selectedPaymentIndex !== null ? 'Edit Payment Method' : 'Add Payment Method'}</h2>
                    {error && <p className="error-message">{error}</p>}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                      }}
                    >
                <label>
                  Payment Type:
                  <select
                    value={newPaymentMethod.type}
                    onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, type: e.target.value })}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Card">Card</option>
                    <option value="PayPal">PayPal</option>
                  </select>
                </label>
                {newPaymentMethod.type === 'Card' && (
                <>
                  <label>
                    Cardholder Name:
                    <input
                      type="text"
                      value={newPaymentMethod.cardholderName}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, cardholderName: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Card Number:
                    <input
                      type="text"
                      value={newPaymentMethod.cardNumber}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, cardNumber: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    Expiry Date:
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={newPaymentMethod.expiryDate}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, expiryDate: e.target.value })}
                      required
                    />
                  </label>
                  <label>
                    CVV:
                    <input
                      type="text"
                      value={newPaymentMethod.cvv}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, cvv: e.target.value })}
                      required
                    />
                  </label>
                </>
              )}
              <div className="modal-buttons">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="tabs">{renderTabContent()}</div>
              <div className="modal-buttons">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isProfileEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Profile</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Profile updated successfully.');
                closeProfileEditModal();
              }}
            >
              <label>
                Name:
                <input
                  type="text"
                  defaultValue={loggedInUser.name || loggedInUser.username}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  defaultValue={loggedInUser.email}
                  required
                />
              </label>
              <div className="modal-buttons">
                <button type="submit" className="btn-primary">Save</button>
                <button type="button" className="btn-secondary" onClick={closeProfileEditModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
