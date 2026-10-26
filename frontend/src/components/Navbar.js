import React from 'react';
import './Navbar.css';
import { redirectToLogin } from '../utils/api';

function Navbar() {
  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="navbar-brand">
        <img
          src="/assets/Alcher_Logo.svg"
          alt="Alcheringa IIT Guwahati"
          className="navbar-logo"
        />
      </div>

      {/* Centre: Navigation links */}
      <div className="navbar-links">
        <a href="#about">About Us</a>
        <a href="#modules">Modules &amp; Competitions</a>
        <a href="#contact">Contact us</a>
      </div>

      {/* Right: Login */}
      <div className="navbar-actions">
        <button
          type="button"
          className="login-button"
          onClick={() => redirectToLogin('#faqs')}
        >
          Login
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
