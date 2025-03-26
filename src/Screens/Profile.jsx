import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // console.log(user.id);
                
                const response = await axios.get(`http://localhost:9999/registration/api/auth/users/${user.id}`);
                setUserData(response.data);
                console.log(response.data);
                
            } catch (err) {
                setError('Failed to fetch user data');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            fetchUserData();
        } else {
            navigate('/login');
        }
    }, [user, navigate]);

    if (loading) return <div className="profile-loading">Loading...</div>;
    if (error) return <div className="profile-error">{error}</div>;
    if (!userData) return null;

    return (
        <div className="profile-page">
            <div className="profile-card">
                <div className="profile-header">
                    <h2>Profile Information</h2>
                </div>

                <div className="profile-details">
                    <div className="detail-group">
                        <div className="detail-icon">👤</div>
                        <div className="detail-content">
                            <label>Name</label>
                            <div>{userData.name}</div>
                        </div>
                    </div>

                    <div className="detail-group">
                        <div className="detail-icon">📧</div>
                        <div className="detail-content">
                            <label>Email</label>
                            <div>{userData.email}</div>
                        </div>
                    </div>

                    <div className="detail-group">
                        <div className="detail-icon">🏦</div>
                        <div className="detail-content">
                            <label>Account Number</label>
                            <div>{userData.accountNumber}</div>
                        </div>
                    </div>

                    <div className="detail-group">
                        <div className="detail-icon">💰</div>
                        <div className="detail-content">
                            <label>Balance</label>
                            <div>₹{userData.balance.toFixed(2)}</div>
                        </div>
                    </div>

                    <div className="detail-group">
                        <div className="detail-icon">📊</div>
                        <div className="detail-content">
                            <label>Transaction Count</label>
                            <div>{userData.transactionCount}</div>
                        </div>
                    </div>

                    <div className="detail-group">
                        <div className="detail-icon">🪪</div>
                        <div className="detail-content">
                            <label>PAN Card</label>
                            <div>{userData.panCard}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
