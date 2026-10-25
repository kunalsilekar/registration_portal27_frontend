import React from 'react';
import { Phone } from 'lucide-react';
import './Footer.css';

const stageDesktop = '/assets/state.jpg';
const stageMobile = '/assets/footer_bg_mobile.jpg';
const alcherLogoDesktop = '/assets/alcherLogo.svg';
const alcherLogoMobile = '/assets/alcherLogo_mobile.svg';

/* Desktop Social Icon SVGs (#F5E3CD fill) */
const LinkedInIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <mask id="li-cutout">
      <rect x="1" y="1" width="22" height="22" rx="4.5" fill="#ffffff" />
      <circle cx="6.2" cy="6.2" r="1.5" fill="#000000" />
      <rect x="4.8" y="9.8" width="2.8" height="9.2" rx="0.5" fill="#000000" />
      <path d="M10.2 9.8h2.7v1.4c.5-.9 1.6-1.6 3.1-1.6 2.5 0 3.8 1.6 3.8 4.2V19H17v-4.8c0-1.4-.5-2.2-1.7-2.2-1.1 0-1.8.8-1.8 2.2V19h-2.8V9.8z" fill="#000000" />
    </mask>
    <rect x="1" y="1" width="22" height="22" rx="4.5" fill="#F5E3CD" mask="url(#li-cutout)" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="#F5E3CD" strokeWidth="2.2" />
    <circle cx="12" cy="12" r="4.2" stroke="#F5E3CD" strokeWidth="2.2" />
    <circle cx="17.6" cy="6.4" r="1.3" fill="#F5E3CD" />
  </svg>
);

const XTwitterIcon = () => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="#F5E3CD">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <mask id="fb-cutout">
      <circle cx="12" cy="12" r="11" fill="#ffffff" />
      <path d="M13.2 8.5h2V5.5h-2.6c-2.5 0-3.8 1.5-3.8 3.6V11H6.6v3.2h2.2v7.3h3.5V14.2h2.6l.4-3.2h-3V9.2c0-.7.3-1.2 1.3-1.2z" fill="#000000" />
    </mask>
    <circle cx="12" cy="12" r="11" fill="#F5E3CD" mask="url(#fb-cutout)" />
  </svg>
);

const YouTubeIcon = () => (
  <svg width="25" height="24" viewBox="0 0 24 24">
    <mask id="yt-cutout">
      <rect x="1.5" y="4" width="21" height="16" rx="4.5" fill="#ffffff" />
      <polygon points="10,8.5 15.5,12 10,15.5" fill="#000000" />
    </mask>
    <rect x="1.5" y="4" width="21" height="16" rx="4.5" fill="#F5E3CD" mask="url(#yt-cutout)" />
  </svg>
);

/* Mobile Dark Green Social Icons (#0F3027) matching mobile reference */
const InstagramIconMobile = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="#0F3027" strokeWidth="2.2" />
    <circle cx="12" cy="12" r="4.2" stroke="#0F3027" strokeWidth="2.2" />
    <circle cx="17.6" cy="6.4" r="1.3" fill="#0F3027" />
  </svg>
);

const YouTubeIconMobile = () => (
  <svg width="23" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="1.5" y="4" width="21" height="16" rx="4.5" stroke="#0F3027" strokeWidth="2.2" />
    <polygon points="10,8.5 15.5,12 10,15.5" fill="#0F3027" />
  </svg>
);

const LinkedInIconMobile = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="1.5" y="1.5" width="21" height="21" rx="4" stroke="#0F3027" strokeWidth="2.2" />
    <circle cx="6.5" cy="6.5" r="1.5" fill="#0F3027" />
    <rect x="5.2" y="10" width="2.6" height="8.8" rx="0.5" fill="#0F3027" />
    <path d="M10.4 10h2.6v1.3c.5-.8 1.5-1.5 2.9-1.5 2.4 0 3.6 1.5 3.6 3.9v5.1h-2.6v-4.5c0-1.3-.5-2-1.6-2-1 0-1.7.7-1.7 2v4.5h-2.6v-8.8z" fill="#0F3027" />
  </svg>
);

const XTwitterIconMobile = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#0F3027">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const Footer = () => {
  return (
    <footer
      className="footer-wrapper"
      style={{
        '--footer-bg-desktop': `url(${stageDesktop})`,
        '--footer-bg-mobile': `url(${stageMobile})`
      }}
      id="contact"
    >
      <div className="footer-overlay" />

      {/* =========================================
          DESKTOP LAYOUT (Screens > 768px)
         ========================================= */}
      <div className="footer-content-container footer-desktop-content">
        <div className="footer-main-grid">
          {/* Column 1: Brand & Socials */}
          <div className="footer-brand-col">
            <a href="#home" className="footer-logo-link" aria-label="Alcheringa IIT Guwahati">
              <img
                src={alcherLogoDesktop}
                alt="Alcheringa IIT Guwahati"
                className="footer-alcher-logo"
              />
            </a>

            <div className="footer-social-row">
              <a href="https://www.linkedin.com/company/alcheringaiitguwahati/" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="LinkedIn">
                <LinkedInIcon />
              </a>
              <a href="https://www.instagram.com/alcheringaiitg/" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://x.com/alcheringaiitg" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="X (Twitter)">
                <XTwitterIcon />
              </a>
              <a href="https://www.facebook.com/alcheringaiitg/" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="https://www.youtube.com/@alcheringaiitg" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="YouTube">
                <YouTubeIcon />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-links-col">
            <h4 className="footer-col-heading">Links</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item"><a href="#about">About us</a></li>
              <li className="footer-link-item"><a href="#modules">Modules and Competitions</a></li>
              <li className="footer-link-item"><a href="#testimonials">Testimonials</a></li>
              <li className="footer-link-item"><a href="#faqs">FAQs</a></li>
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div className="footer-contact-col">
            <h4 className="footer-col-heading">Contact Us</h4>
            <div className="footer-contacts-grid">
              <div className="contact-card">
                <span className="contact-name">Sudhanshu Raj</span>
                <span className="contact-role">PR Head</span>
                <a href="tel:+918292967325" className="contact-phone-link">
                  <Phone size={14} />
                  <span>+91 82929 67325</span>
                </a>
              </div>

              <div className="contact-card">
                <span className="contact-name">Sidharth Shukla</span>
                <span className="contact-role">PR Head</span>
                <a href="tel:+917354647811" className="contact-phone-link">
                  <Phone size={14} />
                  <span>+91 73546 47811</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            Alcheringa @ 2027. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <a href="#contact-us">Contact us</a>
            <a href="#feedback">Feedback</a>
            <a href="#privacy">Privacy Policy</a>
          </div>
        </div>
      </div>

      {/* =========================================
          MOBILE LAYOUT (Screens <= 768px)
         ========================================= */}
      <div className="footer-mobile-content">
        {/* Top: Logo + Follow us + 4 Dark Green Icons */}
        <div className="footer-mobile-top">
          <a href="#home" className="footer-mobile-logo-link" aria-label="Alcheringa IIT Guwahati">
            <img
              src={alcherLogoMobile}
              alt="Alcheringa IIT Guwahati"
              className="footer-mobile-logo"
            />
          </a>

          <span className="footer-mobile-follow">Follow us</span>

          <div className="footer-mobile-socials">
            <a href="https://www.instagram.com/alcheringaiitg/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <InstagramIconMobile />
            </a>
            <a href="https://www.youtube.com/@alcheringaiitg" target="_blank" rel="noreferrer" aria-label="YouTube">
              <YouTubeIconMobile />
            </a>
            <a href="https://www.linkedin.com/company/alcheringaiitguwahati/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <LinkedInIconMobile />
            </a>
            <a href="https://x.com/alcheringaiitg" target="_blank" rel="noreferrer" aria-label="X (Twitter)">
              <XTwitterIconMobile />
            </a>
          </div>
        </div>

        {/* Spacer to show the full concert stage & sunset lighting */}
        <div className="footer-mobile-stage-spacer" />

        {/* Bottom: Links & Contacts in the Crowd */}
        <div className="footer-mobile-bottom">
          <h3 className="footer-mobile-title">LINKS</h3>
          <ul className="footer-mobile-links-list">
            <li><a href="#about">About us</a></li>
            <li><a href="#modules">Modules and Competitions</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><a href="#faqs">FAQs</a></li>
          </ul>

          <h3 className="footer-mobile-title contact-title">CONTACT US</h3>
          <div className="footer-mobile-contacts">
            <div className="footer-mobile-contact-card">
              <span className="footer-mobile-contact-name">Sudhanshu Raj</span>
              <span className="footer-mobile-contact-role">PR Head</span>
              <a href="tel:+918292967325" className="footer-mobile-phone-link">
                <Phone size={14} />
                <span>+91 82929 67325</span>
              </a>
            </div>

            <div className="footer-mobile-contact-card">
              <span className="footer-mobile-contact-name">Sidharth Shukla</span>
              <span className="footer-mobile-contact-role">PR Head</span>
              <a href="tel:+917354647811" className="footer-mobile-phone-link">
                <Phone size={14} />
                <span>+91 73546 47811</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
