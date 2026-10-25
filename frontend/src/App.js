import './App.css';
import FAQSection from './sections/FAQ';
import Footer from './sections/Footer';
import LandingScene from './sections/LandingScene';

function App() {
  return (
    <main className="landing-page">
      <Hero />
      <FAQSection />
      <Footer />
      <LandingScene />
    </main>
  );
}

export default App;
