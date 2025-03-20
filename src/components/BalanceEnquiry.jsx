import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBalance } from '../redux/transaction/TransactionAction';

function BalanceEnquiry() {
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const transaction = useSelector(state => state.transaction);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                await dispatch(getBalance(user.accountNumber));
            } catch (err) {
                setError('Failed to fetch balance. Please try again.');
            }
        };

        fetchBalance();
    }, [dispatch, user.accountNumber]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="card">
            <h1>Balance Enquiry</h1>
            {error && <div className="error-message">{error}</div>}
            {transaction.message && (
                <div className={`message ${transaction.status === 'SUCCESS' ? 'success-message' : 'error-message'}`}>
                    {transaction.message}
                </div>
            )}
            
            <div style={{ marginTop: '2rem' }}>
                <div className="balance-info">
                    <div>
                        <h3>Current Balance</h3>
                        <p>Last updated: {new Date().toLocaleString()}</p>
                    </div>
                    <div className="balance-amount">
                        ₹{transaction.balance?.toLocaleString() || '0'}
                    </div>
                </div>

                {transaction.recentTransactions?.length > 0 && (
                    <div className="recent-transactions" style={{ marginTop: '2rem' }}>
                        <h3>Recent Transactions</h3>
                        <div className="transaction-list">
                            {transaction.recentTransactions.map((tx) => (
                                <div key={tx.transactionId} className="transaction-item">
                                    <div className="transaction-info">
                                        <span className={`transaction-type ${tx.transactionType.toLowerCase()}`}>
                                            {tx.transactionType}
                                        </span>
                                        <span className="transaction-date">
                                            {tx.transactionDate}
                                        </span>
                                    </div>
                                    <div className="transaction-details">
                                        <p className="transaction-description">{tx.description}</p>
                                        <p className={`transaction-amount ${tx.transactionType.toLowerCase()}`}>
                                            {tx.transactionType === 'Deposit' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="transaction-status">
                                        <span className={`status-badge ${tx.status.toLowerCase()}`}>
                                            {tx.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BalanceEnquiry;
