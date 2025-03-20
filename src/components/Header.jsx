import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/user/UserAction';

function Header() {
    const location = useLocation();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    
    const handleLogout = () => {
        dispatch(logoutUser());
    };
    
    return (
        <header className="header">
            <div className="logo">
                <Link to="/">OurBank</Link>
            </div>
            <nav className="nav-menu">
                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
                <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
                <Link to="/services" className={location.pathname === '/services' ? 'active' : ''}>Services</Link>
                <Link to="/netbanking" className={location.pathname === '/netbanking' ? 'active' : ''}>Net Banking</Link>
                <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
            </nav>
            <div className="auth-buttons">
                {user && user.accountNumber ? (
                    <>
                        <Link to="/profile" className="user-profile">
                            <span className="user-name">👤 {user.name}</span>
                        </Link>
                        <button onClick={handleLogout} className="btn btn-logout">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-login">Login</Link>
                        <Link to="/register" className="btn btn-register">Register</Link>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;
