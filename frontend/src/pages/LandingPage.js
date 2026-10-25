import React from 'react';
import Hero from '../sections/Hero';
import About from '../sections/About/About';
import Module from '../sections/modules/Modules';
import AfterMovie from '../sections/AfterMovie/AfterMovie';
import Testimonials from '../sections/Testimonials/Testinomials';

function LandingPage() {
  return (
    <main className="landing-page">
      <Hero />
      <About />
      <Module />
      <AfterMovie />
      <Testimonials />
    </main>
  );
}

export default LandingPage;