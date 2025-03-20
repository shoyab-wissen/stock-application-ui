import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withdrawMoney } from '../redux/transaction/TransactionAction';

function Withdraw() {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        if (parseFloat(amount) > user.balance) {
            setError('Insufficient balance');
            return;
        }

        try {
            await dispatch(withdrawMoney(user.accountNumber, amount));
            setSuccess('Amount withdrawn successfully!');
            setAmount('');
        } catch (err) {
            setError(err.response?.data?.message || 'Withdrawal failed. Please try again.');
        }
    };

    return (
        <div className="card">
            <h1>Withdraw Money</h1>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Amount to Withdraw</label>
                    <input 
                        type="number" 
                        className="form-input"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        min="1"
                        max={user?.balance || 0}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-register">
                    Withdraw Now
                </button>
            </form>

            <div className="info-box" style={{ marginTop: '2rem' }}>
                <h3>Available Balance</h3>
                <p className="balance">₹{user?.balance?.toLocaleString() || '0'}</p>
            </div>
        </div>
    );
}

export default Withdraw;