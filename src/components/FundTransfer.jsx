import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { transferMoney } from '../redux/transaction/TransactionAction';

function FundTransfer() {
    const [formData, setFormData] = useState({
        receiverAccountNumber: '',
        amount: '',
        remarks: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    const beneficiaries = [
        { id: 1, name: 'John Doe', accountNo: '987654321', bank: 'State Bank' },
        { id: 2, name: 'Jane Smith', accountNo: '987654322', bank: 'City Bank' },
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await dispatch(transferMoney(
                user.accountNumber,
                formData.receiverAccountNumber,
                formData.amount
            )).unwrap();

            setSuccess('Transfer successful!');
            setFormData({ receiverAccountNumber: '', amount: '', remarks: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Transfer failed. Please try again.');
        }
    };

    const handleBeneficiarySelect = (e) => {
        const beneficiary = beneficiaries.find(b => b.accountNo === e.target.value);
        if (beneficiary) {
            setFormData(prev => ({
                ...prev,
                receiverAccountNumber: beneficiary.accountNo
            }));
        }
    };

    return (
        <div className="card transfer-container">
            <h1>Fund Transfer</h1>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="transfer-sections">
                <div className="transfer-form">
                    <h2>Transfer Details</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Select Beneficiary</label>
                            <select 
                                className="form-input"
                                name="receiverAccountNumber"
                                onChange={handleBeneficiarySelect}
                                value={formData.receiverAccountNumber}
                            >
                                <option value="">Select a beneficiary</option>
                                {beneficiaries.map(b => (
                                    <option key={b.id} value={b.accountNo}>
                                        {b.name} - {b.accountNo}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Amount</label>
                            <input 
                                type="number" 
                                name="amount"
                                className="form-input" 
                                placeholder="Enter amount"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                min="1"
                            />
                        </div>

                        <div className="form-group">
                            <label>Remarks</label>
                            <input 
                                type="text" 
                                name="remarks"
                                className="form-input" 
                                placeholder="Add remarks (optional)"
                                value={formData.remarks}
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="btn btn-register">Transfer Now</button>
                    </form>
                </div>

                <div className="quick-transfer">
                    <h2>Quick Transfer</h2>
                    <div className="beneficiary-grid">
                        {beneficiaries.map(beneficiary => (
                            <div 
                                key={beneficiary.id} 
                                className="beneficiary-card card"
                                onClick={() => setFormData(prev => ({
                                    ...prev,
                                    receiverAccountNumber: beneficiary.accountNo
                                }))}
                            >
                                <div className="beneficiary-icon">👤</div>
                                <div className="beneficiary-details">
                                    <h3>{beneficiary.name}</h3>
                                    <p>{beneficiary.accountNo}</p>
                                    <small>{beneficiary.bank}</small>
                                </div>
                            </div>
                        ))}
                        <div className="beneficiary-card card add-beneficiary">
                            <div className="add-icon">+</div>
                            <p>Add New Beneficiary</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FundTransfer;
