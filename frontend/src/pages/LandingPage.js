import React from 'react';
import LandingScene from '../sections/LandingScene';
import Module from '../sections/modules/Modules';
import AfterMovie from '../sections/AfterMovie/AfterMovie';
import Testimonials from '../sections/Testimonials/Testinomials';
import FAQSection from '../sections/FAQ';
import Footer from '../sections/Footer';

function LandingPage() {
  return (
    <main className="landing-page">
      <LandingScene />
      <Module />
      <AfterMovie />
      <Testimonials />
      <FAQSection />
      <Footer />
    </main>
  );
}

export default LandingPage;