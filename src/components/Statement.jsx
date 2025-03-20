import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStatement } from '../redux/transaction/TransactionAction';

function Statement() {
    const [dateRange, setDateRange] = useState({
        fromDate: '',
        toDate: ''
    });
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    const handleDateChange = (e) => {
        setDateRange({
            ...dateRange,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await dispatch(getStatement(
                user.accountNumber,
                dateRange.fromDate,
                dateRange.toDate
            ));
            setTransactions(response);
        } catch (err) {
            setError('Failed to fetch statement. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card statement-container">
            <h1>Account Statement</h1>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="statement-filters">
                <div className="form-group">
                    <label>From Date</label>
                    <input
                        type="date"
                        name="fromDate"
                        className="form-input"
                        value={dateRange.fromDate}
                        onChange={handleDateChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>To Date</label>
                    <input
                        type="date"
                        name="toDate"
                        className="form-input"
                        value={dateRange.toDate}
                        onChange={handleDateChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-register" disabled={loading}>
                    {loading ? 'Loading...' : 'Get Statement'}
                </button>
            </form>

            {transactions.length > 0 && (
                <div className="statement-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(transaction => (
                                <tr key={transaction.id}>
                                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                    <td>{transaction.description}</td>
                                    <td className={`amount ${transaction.type}`}>
                                        {transaction.type === 'credit' ? '+' : '-'} ₹{transaction.amount.toLocaleString()}
                                    </td>
                                    <td>
                                        <span className={`status-badge ${transaction.type}`}>
                                            {transaction.type}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Statement;
