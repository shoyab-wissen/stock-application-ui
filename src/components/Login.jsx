import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../redux/user/UserAction';

function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/portfolio";

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
            const response = await dispatch(loginUser(formData.username, formData.password));
            
            if (response && response.username) {
                navigate(from, { replace: true });
            } else {
                setError('Invalid response from server');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Invalid username or password');
        }
    };

    return (
        <div className="card" style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <h1>Login to Stock Market</h1>
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
                    <label className="form-label">Password</label>
                    <input 
                        type="password" 
                        name="password"
                        className="form-input" 
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-register" style={{ width: '100%' }}>
                    Login
                </button>
            </form>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
            </div>
        </div>
    );
}

export default Login;
