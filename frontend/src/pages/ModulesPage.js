import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, RefreshCw, ArrowLeft, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../sections/Footer';
import CompetitionCard from '../components/CompetitionCard';
import { fetchCompetitionsApi } from '../utils/api';
import './ModulesPage.css';

const textureImage = '/assets/texture.jpg';
const normalizeModuleName = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const getCompetitionModuleName = (competition) => {
  const module = competition?.module;
  if (module && typeof module === 'object') {
    return module.module_query_name_without_spaces_all_small || module.module || module.name || '';
  }
  return competition?.module_query_name_without_spaces_all_small ||
    competition?.module_name || competition?.moduleName || module || '';
};

function ModulesPage() {
  const { moduleSlug } = useParams();
  const navigate = useNavigate();
  const [competitions, setCompetitions] = useState([]);
  const [modules, setModules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modeFilter, setModeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentModuleName, setCurrentModuleName] = useState('');

  const loadCompetitions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Use the backend's module query parameter, then apply the same module
      // match locally to keep the list consistent with the selected filter.
      const data = await fetchCompetitionsApi(moduleSlug);
      const compList = Array.isArray(data)
        ? data
        : (data.allcomp || data.competitions || []);
      setCompetitions(compList);
      setModules(Array.isArray(data.modules) ? data.modules : []);

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
      setModules([]);
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

  const normalizedModuleSlug = normalizeModuleName(moduleSlug);
  const selectedModule = modules.find((item) =>
    normalizeModuleName(item.module_query_name_without_spaces_all_small || item.module) === normalizedModuleSlug
  );
  const selectedModuleQuery = moduleSlug
    ? selectedModule?.module_query_name_without_spaces_all_small || moduleSlug
    : 'all';

  const normalizedSearch = normalizeModuleName(searchTerm);
  const filteredCompetitions = competitions.filter((competition) => {
    const competitionModuleSlug = normalizeModuleName(getCompetitionModuleName(competition));
    const moduleMatches = !normalizedModuleSlug ||
      competitionModuleSlug === normalizedModuleSlug ||
      (selectedModule?.id && String(competition.module?.id) === String(selectedModule.id));
    const rawMode = String(competition.event_mode || '').trim().toLowerCase();
    const isOnline = rawMode === 'true' || rawMode === '1' || rawMode === 'online';
    const isOffline = rawMode === 'false' || rawMode === '0' || rawMode === 'offline';
    const modeMatches =
      modeFilter === 'all' ||
      (modeFilter === 'online' && isOnline) ||
      (modeFilter === 'offline' && isOffline);
    const competitionName =
      competition.event_name || competition.name || competition.competetion || competition.title || '';
    const searchMatches = !normalizedSearch || [competitionName, getCompetitionModuleName(competition)]
      .some((value) => normalizeModuleName(value).includes(normalizedSearch));

    return moduleMatches && modeMatches && searchMatches;
  });

  const handleModuleChange = (event) => {
    const nextModule = event.target.value;
    navigate(nextModule === 'all' ? '/modules' : '/modules/' + nextModule);
  };

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

        {!loading && !error && modules.length > 0 && (
          <section className="modules-filter-bar" aria-label="Filter competitions">
            <label className="modules-filter-module">
              <span>Module</span>
              <select value={selectedModuleQuery} onChange={handleModuleChange} aria-label="Filter by module">
                <option value="all">All Modules</option>
                {modules.map((module) => (
                  <option key={module.id} value={module.module_query_name_without_spaces_all_small}>
                    {module.module}
                  </option>
                ))}
              </select>
            </label>

            <label className="modules-filter-search">
              <Search size={18} aria-hidden="true" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search competitions..."
                aria-label="Search competitions"
              />
            </label>

            <div className="modules-mode-tabs" role="group" aria-label="Filter by event mode">
              {['all', 'online', 'offline'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={modeFilter === mode ? 'is-active' : ''}
                  aria-pressed={modeFilter === mode}
                  onClick={() => setModeFilter(mode)}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </section>
        )}

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

        {!loading && !error && competitions.length > 0 && filteredCompetitions.length === 0 && (
          <div className="modules-state-container modules-empty-state">
            <h2 className="modules-state-title">No Matching Competitions</h2>
            <p className="modules-state-text">Try a different search or filter.</p>
          </div>
        )}

        {/* Competitions Grid (3 Desktop, 2 Tablet, 1 Mobile) */}
        {!loading && !error && filteredCompetitions.length > 0 && (
          <section className="competitions-grid-section" aria-label="Competitions List">
            <div className="competitions-grid">
              {filteredCompetitions.map((comp) => (
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
