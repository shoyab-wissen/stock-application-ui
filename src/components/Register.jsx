import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '', // for validation only
        panCard: '',
        dateOfBirth: '',
        accountNumber: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Name is required');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Invalid email format');
            return false;
        }
        if (!formData.password) {
            setError('Password is required');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (!formData.panCard.trim()) {
            setError('PAN Card number is required');
            return false;
        }
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCard)) {
            setError('Invalid PAN Card format (e.g., ABCDE1234F)');
            return false;
        }
        if (!formData.dateOfBirth) {
            setError('Date of Birth is required');
            return false;
        }
        if (!formData.accountNumber.trim()) {
            setError('Account Number is required');
            return false;
        }
        if (!/^\d{6}$/.test(formData.accountNumber)) {
            setError('Account Number must be 6 digits');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            
            const userData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                isActive: true,
                accountNumber: parseInt(formData.accountNumber),
                balance: 10000,
                transactionCount: 0,
                panCard: formData.panCard,
                dateOfBirth: formData.dateOfBirth
            };
            console.log(userData);
            
            const response = await axios.post('http://localhost:8082/api/auth/register', userData);
            
            if (response.data) {
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Create Your Trading Account</h2>
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="accountNumber">Account Number (6 digits)</label>
                        <input
                            type="text"
                            id="accountNumber"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleChange}
                            placeholder="Enter 6-digit account number"
                            pattern="\d{6}"
                            maxLength="6"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="panCard">PAN Card Number</label>
                        <input
                            type="text"
                            id="panCard"
                            name="panCard"
                            value={formData.panCard}
                            onChange={handleChange}
                            placeholder="ABCDE1234F"
                            maxLength="10"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="dateOfBirth">Date of Birth</label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            max={new Date().toISOString().split('T')[0]}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            disabled={loading}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="register-button"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="login-link">
                    Already have an account? <Link to="/login">Login here</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;
