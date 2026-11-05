import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthData, getAuthToken } from '../utils/api';
import './Navbar.css';

function Navbar() {
    const navigate = useNavigate();
    const profileMenuRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getAuthToken()));

    useEffect(() => {
        const syncAuthState = () => {
            setIsAuthenticated(Boolean(getAuthToken()));
            setProfileMenuOpen(false);
        };

        window.addEventListener('storage', syncAuthState);
        window.addEventListener('alcher-auth-changed', syncAuthState);
        return () => {
            window.removeEventListener('storage', syncAuthState);
            window.removeEventListener('alcher-auth-changed', syncAuthState);
        };
    }, []);

    useEffect(() => {
        if (!profileMenuOpen) return undefined;

        const closeOnOutsideClick = (event) => {
            if (!profileMenuRef.current?.contains(event.target)) {
                setProfileMenuOpen(false);
            }
        };
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') setProfileMenuOpen(false);
        };

        document.addEventListener('mousedown', closeOnOutsideClick);
        document.addEventListener('keydown', closeOnEscape);
        return () => {
            document.removeEventListener('mousedown', closeOnOutsideClick);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [profileMenuOpen]);

    const closeMenu = () => setMenuOpen(false);
    const handleLogout = () => {
        clearAuthData();
        setIsAuthenticated(false);
        setProfileMenuOpen(false);
        closeMenu();
        navigate('/', { replace: true });
    };

    const handleBrandClick = (event) => {
        closeMenu();
        if (window.location.pathname === '/') {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <nav className="navbar" aria-label="Main navigation">
            <Link to="/" className="navbar-brand" aria-label="Alcheringa home" onClick={handleBrandClick}>
                <img src="/assets/Alcher_Logo.svg" alt="" className="navbar-logo" />
                <span className="navbar-brand-copy" aria-label="Alcheringa, IIT Guwahati">
                    <span className="navbar-brand-name">Alcheringa</span>
                    <span className="navbar-brand-institute">IIT GUWAHATI</span>
                </span>
            </Link>

            <button
                type="button"
                className="navbar-menu-toggle"
                aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
            >
                <img className="navbar-menu-icon" src="/assets/menu-line.svg" alt="" aria-hidden="true" />
            </button>

            <div className={'navbar-menu ' + (menuOpen ? 'is-open' : '')}>
                {isAuthenticated && (
                    <div className="navbar-mobile-account-actions">
                        <Link to="/profile" onClick={closeMenu}>My Profile</Link>
                        <button type="button" onClick={handleLogout}>Logout</button>
                    </div>
                )}

                <div className="navbar-links">
                    <a href="https://alcheringa.co.in/team" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>About Us</a>
                    <a href="/modules" onClick={closeMenu}>Modules &amp; Competitions</a>
                    <a href="#contact" onClick={closeMenu}>Contact us</a>
                </div>

                <div className={'navbar-actions' + (isAuthenticated ? ' is-authenticated' : '')}>
                    {isAuthenticated ? (
                        <div className="navbar-profile-wrap" ref={profileMenuRef}>
                            <button
                                type="button"
                                className="navbar-profile-button"
                                aria-label="Open profile menu"
                                aria-expanded={profileMenuOpen}
                                aria-haspopup="menu"
                                onClick={() => setProfileMenuOpen((open) => !open)}
                            >
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <circle cx="12" cy="8" r="3.2" />
                                    <path d="M5.5 19c.5-3.2 2.8-5 6.5-5s6 1.8 6.5 5" />
                                </svg>
                            </button>

                            {profileMenuOpen && (
                                <div className="navbar-profile-menu" role="menu">
                                    <Link to="/profile" role="menuitem" onClick={() => setProfileMenuOpen(false)}>
                                        My Profile
                                    </Link>
                                    <button type="button" role="menuitem" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="login-button" onClick={closeMenu}>Login</Link>
                            <Link to="/signup" className="register-button" onClick={closeMenu}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
