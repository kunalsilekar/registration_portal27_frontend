import React from 'react';
import './App.css';
import Hero from './sections/Hero';
import FAQSection from './sections/FAQ';
import Footer from './sections/Footer';

function App() {
  return (
    <main className="landing-page">
      {/* Hero Section (includes Navbar parallax) */}
      <Hero />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer Section */}
      <Footer />
    </main>
  );
}

export default App;
