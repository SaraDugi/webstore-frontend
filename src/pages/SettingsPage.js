import React from 'react';
import '../styles.css';

const SettingsPage = () => {
  return (
    <div className="settings-page">
      <h1 className="settings-title">Account Settings</h1>

      <section className="settings-section">
        <h2 className="section-title">Personal Information</h2>
        <form className="settings-form">
          <label className="settings-label">
            Name:
            <input type="text" defaultValue="John Doe" className="settings-input" />
          </label>
          <label className="settings-label">
            Email:
            <input type="email" defaultValue="john.doe@example.com" className="settings-input" />
          </label>
          <label className="settings-label">
            Phone:
            <input type="tel" defaultValue="+1 123 456 7890" className="settings-input" />
          </label>
          <button type="submit" className="btn-primary">Save Changes</button>
        </form>
      </section>

      <section className="settings-section">
        <h2 className="section-title">Security</h2>
        <button className="btn-secondary">Change Password</button>
        <button className="btn-danger">Delete Account</button>
      </section>

      <section className="settings-section">
        <h2 className="section-title">Notifications</h2>
        <form className="settings-form">
          <label className="settings-checkbox">
            <input type="checkbox" defaultChecked /> Email Notifications
          </label>
          <label className="settings-checkbox">
            <input type="checkbox" /> SMS Notifications
          </label>
          <label className="settings-checkbox">
            <input type="checkbox" defaultChecked /> App Notifications
          </label>
          <button type="submit" className="btn-primary">Update Preferences</button>
        </form>
      </section>
    </div>
  );
};

export default SettingsPage;