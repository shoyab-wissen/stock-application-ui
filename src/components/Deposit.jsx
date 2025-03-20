import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { depositMoney } from '../redux/transaction/TransactionAction';

function Deposit() {
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

        try {
            await dispatch(depositMoney(user.accountNumber, amount));
            setSuccess('Amount deposited successfully!');
            setAmount('');
        } catch (err) {
            setError(err.response?.data?.message || 'Deposit failed. Please try again.');
        }
    };

    return (
        <div className="card">
            <h1>Deposit Money</h1>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Amount to Deposit</label>
                    <input 
                        type="number" 
                        className="form-input"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        min="1"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-register">
                    Deposit Now
                </button>
            </form>

            <div className="info-box" style={{ marginTop: '2rem' }}>
                <h3>Current Balance</h3>
                <p className="balance">₹{user?.balance?.toLocaleString() || '0'}</p>
            </div>
        </div>
    );
}

export default Deposit;