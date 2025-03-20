import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../redux/user/UserAction';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        pancard: '',
        dob: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Username validation
        if (!formData.username.trim()) {
            setError('Username is required');
            return;
        }

        // Password validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        // PAN card validation
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pancard)) {
            setError('Invalid PAN Card number');
            return;
        }

        if (!formData.dob) {
            setError('Date of Birth is required');
            return;
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            await dispatch(registerUser(
                formData.username, 
                formData.pancard, 
                formData.dob, 
                formData.password,
                { signal: controller.signal }
            ));

            clearTimeout(timeoutId);
            navigate('/login');
        } catch (err) {
            if (err.name === 'AbortError') {
                setError('Request timed out. Please try again.');
            } else {
                setError(err.response?.data?.message || 'Registration failed. Please try again.');
            }
        }
    };

    return (
        <div className="card" style={{ maxWidth: '500px', margin: '2rem auto' }}>
            <h1>Create Your Stock Market Account</h1>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Username</label>
                    <input 
                        type="text" 
                        name="username"
                        className="form-input" 
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">PAN Card Number</label>
                    <input 
                        type="text" 
                        name="pancard"
                        className="form-input" 
                        placeholder="Enter your PAN card number"
                        value={formData.pancard}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input 
                        type="date" 
                        name="dob"
                        className="form-input" 
                        value={formData.dob}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input 
                        type="password" 
                        name="password"
                        className="form-input" 
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input 
                        type="password" 
                        name="confirmPassword"
                        className="form-input" 
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-register" style={{ width: '100%' }}>
                    Create Account
                </button>
            </form>
        </div>
    );
}

export default Register;
