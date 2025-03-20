import { useSelector } from 'react-redux';

function Profile() {
    const user = useSelector(state => state.user);

    return (
        <div className="profile-page">
            <div className="card profile-card">
                <div className="profile-header">
                    <h1>Profile Details</h1>
                </div>

                <div className="profile-details">
                    <div className="detail-group">
                        <div className="detail-icon">👤</div>
                        <div className="detail-content">
                            <label>Account Number</label>
                            <p>{user.accountNumber}</p>
                        </div>
                    </div>
                    <div className="detail-group">
                        <div className="detail-icon">📝</div>
                        <div className="detail-content">
                            <label>Full Name</label>
                            <p>{user.name}</p>
                        </div>
                    </div>
                    <div className="detail-group">
                        <div className="detail-icon">📧</div>
                        <div className="detail-content">
                            <label>Email Address</label>
                            <p>{user.email}</p>
                        </div>
                    </div>
                    <div className="detail-group">
                        <div className="detail-icon">📱</div>
                        <div className="detail-content">
                            <label>Phone Number</label>
                            <p>{user.phone || 'Not provided'}</p>
                        </div>
                    </div>
                    <div className="detail-group">
                        <div className="detail-icon">🏠</div>
                        <div className="detail-content">
                            <label>Address</label>
                            <p>{user.address || 'Not provided'}</p>
                        </div>
                    </div>
                    <div className="detail-group">
                        <div className="detail-icon">💰</div>
                        <div className="detail-content">
                            <label>Current Balance</label>
                            <p>₹{user.balance?.toLocaleString() || '0'}</p>
                        </div>
                    </div>
                    <div className="detail-group">
                        <div className="detail-icon">📊</div>
                        <div className="detail-content">
                            <label>Total Transactions</label>
                            <p>{user.transactionCount || 0}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
