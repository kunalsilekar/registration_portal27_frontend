import React from 'react';
import Footer from './Footer';
import './Common_Background.css';

function CommonBackground({ children }) {
  return (
    <main className="common-background-page">
      <div className="common-background-content">{children}</div>
      <Footer />
    </main>
  );
}

export default CommonBackground;
