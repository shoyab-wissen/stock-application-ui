import React from 'react';
import './Profile.css';

function Profile() {
  // This should come from your auth context/state management
  const user = {
    username: "JohnDoe",
    email: "john.doe@example.com",
    joinDate: "January 2024",
    totalTrades: 45,
    portfolioValue: "$12,450.75"
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>Profile</h1>
      </div>
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-info">
            <h2>{user.username}</h2>
            <p className="email">{user.email}</p>
            <p className="join-date">Member since: {user.joinDate}</p>
          </div>
          <div className="profile-stats">
            <div className="stat-item">
              <h3>Total Trades</h3>
              <p>{user.totalTrades}</p>
            </div>
            <div className="stat-item">
              <h3>Portfolio Value</h3>
              <p>{user.portfolioValue}</p>
            </div>
          </div>
          <div className="profile-actions">
            <button className="edit-profile-btn">Edit Profile</button>
            <button className="change-password-btn">Change Password</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;