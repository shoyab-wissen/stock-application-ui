import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../redux/user/UserAction';

function ChangePassword() {
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [error, setError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const username = location.state?.username; // Retrieve username from ForgotPassword page

    if (!username) {
        navigate('/forgot-password');
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await dispatch(resetPassword(username, formData.password));
            navigate('/login');
        } catch (err) {
            setError('Password reset failed. Try again.');
        }
    };

    return (
        <div className="card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <h1>Reset Password</h1>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input 
                        type="password" 
                        name="password"
                        className="form-input" 
                        placeholder="Enter new password"
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
                <button type="submit" className="btn btn-reset" style={{ width: '100%' }}>
                    Reset Password
                </button>
            </form>
        </div>
    );
}

export default ChangePassword;
