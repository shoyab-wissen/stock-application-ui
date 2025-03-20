import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getRecentTransactions } from '../redux/transaction/TransactionAction';

function NetBanking() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { recentTransactions } = useSelector(state => state.transaction);
    const user = useSelector(state => state.user);

    useEffect(() => {
        dispatch(getRecentTransactions(user.accountNumber)).catch(error => {
            console.error('Failed to fetch transactions:', error);
        });
    }, [dispatch, user.accountNumber]);

    const features = [
        { title: 'Balance Enquiry', path: '/balance', icon: '💰' },
        { title: 'Deposit', path: '/deposit', icon: '⬆️' },
        { title: 'Withdraw', path: '/withdraw', icon: '⬇️' },
        { title: 'Fund Transfer', path: '/transfer', icon: '↗️' },
        { title: 'Statement', path: '/statement', icon: '📄' },
        { title: 'Bill Payment', path: '/bills', icon: '📱' }
    ];

    if (!recentTransactions) {
        return <div>Loading...</div>;
    }

    return (
        <div className="netbanking-page">
            <h1>Welcome, {user?.name || 'User'}</h1>
            <div className="balance-card card">
                <h3>Current Balance</h3>
                <h2>₹{user?.balance?.toLocaleString() || '0'}</h2>
            </div>

            <div className="dashboard-grid">
                {features.map((feature, index) => (
                    <div 
                        key={index} 
                        className="card dashboard-card"
                        onClick={() => navigate(feature.path)}
                    >
                        <div className="feature-icon">{feature.icon}</div>
                        <h3>{feature.title}</h3>
                    </div>
                ))}
            </div>

            <div className="card recent-activity">
                <h2>Recent Activity</h2>
                {/* <div className="activity-list">
                    {recentTransactions.length > 0 ? (
                        recentTransactions.map((transaction, index) => (
                            <div key={index} className="activity-item">
                                <div className="activity-icon">
                                    {transaction.type === 'CREDIT' ? '↙️' : '↗️'}
                                </div>
                                <div className="activity-details">
                                    <div className="activity-title">{transaction.description}</div>
                                    <div className="activity-time">
                                        {new Date(transaction.timestamp).toLocaleString()}
                                    </div>
                                </div>
                                <div className={`activity-amount ${transaction.type.toLowerCase()}`}>
                                    {transaction.type === 'CREDIT' ? '+' : '-'} ₹{transaction.amount.toLocaleString()}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-transactions">No recent transactions</div>
                    )}
                </div> */}
            </div>
        </div>
    );
}

export default NetBanking;
