import React from 'react'
import Hero from '../sections/Hero'
import Module from '../sections/modules/Modules'
import Testimonials from  "../sections/Testimonials/Testinomials"
import AfterMovie from '../sections/AfterMovie/AfterMovie'

function LandingPage() {
  return (
    <main className='landing-page' >
      <Hero />
      <Module/>
      <AfterMovie/>
      <Testimonials/>
    </main>
  )
}

export default LandingPage