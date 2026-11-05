import React from 'react';
import Footer from './Footer';
import './Common_Background.css';

function CommonBackground({ children, className = "", showFooter = true }) {
  return (
    <main className={`common-background-page ${className}`}>
      <div className="common-background-content">{children}</div>
      {showFooter && <Footer />}
    </main>
  );
}

export default CommonBackground;


