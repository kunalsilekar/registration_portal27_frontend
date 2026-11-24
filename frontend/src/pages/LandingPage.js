import React from 'react';
import LandingScene from '../sections/LandingScene';
import Module from '../sections/modules/Modules';
import AfterMovie from '../sections/AfterMovie/AfterMovie';
import Testimonials from '../sections/Testimonials/Testinomials';
import FAQSection from '../sections/FAQ';
import Footer from '../sections/Footer';
import Navbar from '../components/Navbar';

function LandingPage() {
  return (
    <main className="landing-page">
      <div className="landing-navbar-fixed"><Navbar /></div>
      <div className="about-modules-wrapper">
        <LandingScene />
        <Module />
      </div>
      <AfterMovie />
      <Testimonials />
      <FAQSection />
      <Footer />
    </main>
  );
}

export default LandingPage;
