import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../sections/Footer';
import CompetitionCard from '../components/CompetitionCard';
import { fetchCompetitionsApi } from '../utils/api';
import './ModulesPage.css';

const textureImage = '/assets/texture.jpg';

function ModulesPage() {
  const { moduleSlug } = useParams();
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentModuleName, setCurrentModuleName] = useState('');

  const loadCompetitions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchCompetitionsApi(moduleSlug);
      const compList = Array.isArray(data)
        ? data
        : (data.allcomp || data.competitions || []);
      setCompetitions(compList);

      if (data.modules && moduleSlug) {
        const normalized = moduleSlug.replace(/[^a-z0-9]/gi, '').toLowerCase();
        const found = data.modules.find((item) =>
          item.module_query_name_without_spaces_all_small === normalized ||
          (item.module && item.module.toLowerCase().replace(/[^a-z0-9]/g, '') === normalized)
        );
        setCurrentModuleName(found?.module || '');
      } else {
        setCurrentModuleName('');
      }
    } catch (err) {
      setCompetitions([]);
      setCurrentModuleName('');
      setError(err.message || 'Could not load competitions from the backend.');
    } finally {
      setLoading(false);
    }
  }, [moduleSlug]);

  useEffect(() => {
    loadCompetitions();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [loadCompetitions]);

  // Compute centered heading:
  // If specific module is active, display its name; otherwise display "MODULE NAME" matching the reference mockup
  const displayHeading = currentModuleName
    ? currentModuleName.toUpperCase()
    : moduleSlug
    ? moduleSlug.replace(/-/g, ' ').toUpperCase()
    : 'MODULE NAME';

  return (
    <div
      className="modules-page-wrapper"
      style={{ backgroundImage: `url(${textureImage})` }}
    >
      {/* Top Navbar */}
      <header className="modules-navbar-container">
        <Navbar />
      </header>

      {/* Main Content Section */}
      <main className="modules-main-content">
        <div className="modules-heading-block">
          <h1 className="modules-page-title">{displayHeading}</h1>
          <p className="modules-page-subtitle">Pick a competition, check the details and register your team.</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="modules-state-container modules-loading-state" role="status">
            <Loader2 className="modules-spin-icon" size={38} />
            <p className="modules-state-text">Loading competitions...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="modules-state-container modules-error-state" role="alert">
            <AlertCircle size={36} className="modules-error-icon" />
            <h2 className="modules-state-title">Unable to Load Competitions</h2>
            <p className="modules-state-text">{error}</p>
            <button
              type="button"
              className="modules-retry-button"
              onClick={loadCompetitions}
            >
              <RefreshCw size={16} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && competitions.length === 0 && (
          <div className="modules-state-container modules-empty-state">
            <h2 className="modules-state-title">No Competitions Found</h2>
            <p className="modules-state-text">
              There are currently no competitions listed under this section. Please check back soon or explore other modules.
            </p>
            <Link to="/#modules" className="modules-back-link">
              <ArrowLeft size={16} />
              <span>Explore Other Modules</span>
            </Link>
          </div>
        )}

        {/* Competitions Grid (3 Desktop, 2 Tablet, 1 Mobile) */}
        {!loading && !error && competitions.length > 0 && (
          <section className="competitions-grid-section" aria-label="Competitions List">
            <div className="competitions-grid">
              {competitions.map((comp) => (
                <CompetitionCard key={comp.id} competition={comp} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer Section (reused from existing website) */}
      <Footer />
    </div>
  );
}

export default ModulesPage;
