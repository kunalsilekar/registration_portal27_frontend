import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { clearAuthData, getAuthToken, getStoredUser } from '../utils/api';
import './Navbar.css';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(getAuthToken()));
    const [user, setUser] = useState(() => getStoredUser());

    useEffect(() => {
        const syncAuthState = () => {
            setIsAuthenticated(Boolean(getAuthToken()));
            setUser(getStoredUser());
            setProfileOpen(false);
        };

        window.addEventListener('storage', syncAuthState);
        window.addEventListener('alcher-auth-changed', syncAuthState);
        return () => {
            window.removeEventListener('storage', syncAuthState);
            window.removeEventListener('alcher-auth-changed', syncAuthState);
        };
    }, []);

    const closeMenu = () => setMenuOpen(false);
    const signOut = () => {
        clearAuthData();
        setIsAuthenticated(false);
        setUser(null);
        setProfileOpen(false);
        closeMenu();
    };

    const displayName = user?.full_name || user?.name || user?.email || 'Your account';

    return (
        <nav className="navbar" aria-label="Main navigation">
            <div className="navbar-brand">
                <img src="/assets/Alcher_Logo.svg" alt="" className="navbar-logo" />
                <span className="navbar-brand-copy" aria-label="Alcheringa, IIT Guwahati">
                    <span className="navbar-brand-name">Alcheringa</span>
                    <span className="navbar-brand-institute">IIT GUWAHATI</span>
                </span>
            </div>

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
                <div className="navbar-links">
                    <a href="https://alcheringa.co.in/team" onClick={closeMenu}>About Us</a>
                    <a href="#modules" onClick={closeMenu}>Modules &amp; Competitions</a>
                    <a href="#contact" onClick={closeMenu}>Contact us</a>
                </div>

                <div className="navbar-actions">
                    {isAuthenticated ? (
                        <div className="navbar-profile-wrap">
                            <button
                                type="button"
                                className="navbar-profile-button"
                                aria-label="Open account menu"
                                aria-expanded={profileOpen}
                                aria-haspopup="menu"
                                onClick={() => setProfileOpen((open) => !open)}
                            >
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <circle cx="12" cy="8" r="3.2" />
                                    <path d="M5.5 19c.5-3.2 2.8-5 6.5-5s6 1.8 6.5 5" />
                                </svg>
                            </button>
                            {profileOpen && (
                                <div className="navbar-profile-menu" role="menu">
                                    <span className="navbar-profile-name">{displayName}</span>
                                    <button type="button" role="menuitem" onClick={signOut}>Sign out</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="login-button" onClick={closeMenu}>Login</Link>
                    )}
                    <a href="#modules" className="register-button" onClick={closeMenu}>Register</a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

