import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    return (
        <nav className="navbar" aria-label="Main navigation">
            <div className="navbar-brand">
                <img
                    src="/assets/Alcher_Logo.svg"
                    alt=""
                    className="navbar-logo"
                />
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
                <img
                    className="navbar-menu-icon"
                    src="/assets/menu-line.svg"
                    alt=""
                    aria-hidden="true"
                />
            </button>

            <div className={"navbar-menu " + (menuOpen ? 'is-open' : '')}>
                <div className="navbar-links">
                    <a href="#about" onClick={closeMenu}>About us</a>
                    <a href="#modules" onClick={closeMenu}>Modules &amp; Competitions</a>
                    <a href="#contact" onClick={closeMenu}>Contact us</a>
                </div>

                <Link
                    to="/login"
                    className="login-button"
                    onClick={closeMenu}
                >
                    Login
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;

