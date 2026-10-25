import Hero from './sections/Hero';
import './App.css';
import FAQSection from './sections/FAQ';
import Footer from './sections/Footer';

function App() {
  return (
    <main className="landing-page">
      <Hero />
      <FAQSection />
      <Footer />
    </main>
  );
}

export default App;
