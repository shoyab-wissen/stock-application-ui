import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { verifyUserForReset } from '../redux/user/UserAction';

function ForgotPassword() {
    const [formData, setFormData] = useState({ username: '', dob: '' });
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

        try {
            const response = await dispatch(verifyUserForReset(formData.username, formData.dob));
            
            if (response.success) {
                navigate('/change-password', { state: { username: formData.username } });
            } else {
                setError('Invalid Username or Date of Birth');
            }
        } catch (err) {
            setError('Something went wrong. Try again.');
        }
    };

    return (
        <div className="card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <h1>Forgot Password</h1>
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
                <button type="submit" className="btn btn-reset" style={{ width: '100%' }}>
                    Verify
                </button>
            </form>
        </div>
    );
}

export default ForgotPassword;