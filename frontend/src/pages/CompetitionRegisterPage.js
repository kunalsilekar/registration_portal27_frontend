import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Users, Link2, ChevronDown, Plus, Check, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../sections/Footer';
import { fetchCompetitionDetailApi, registerCompetitionApi } from '../utils/api';
import { findCompetitionById } from '../utils/mockCompetitions';
import './CompetitionRegisterPage.css';

const bgImage = '/assets/competition_Register_bg.jpg';
const bannerImage = '/assets/form_banner_bg.jpg';
const textureImage = '/assets/texture.png';

const INITIAL_TEAM_MEMBERS = [
  { id: 'm1', name: 'Lorem Ipsum', email: 'loremipsum@gmail.com', phone: '9111000111' },
  { id: 'm2', name: 'Lorem Ipsum', email: 'loremipsum@gmail.com', phone: '9111000111' },
  { id: 'm3', name: 'Lorem Ipsum', email: 'loremipsum@gmail.com', phone: '9111000111' },
  { id: 'm4', name: 'Lorem Ipsum', email: 'loremipsum@gmail.com', phone: '9111000111' },
];

function CompetitionRegisterPage() {
  const { competitionId } = useParams();
  const navigate = useNavigate();

  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [performanceLink, setPerformanceLink] = useState('');
  const [description, setDescription] = useState('');
  const [availableMembers, setAvailableMembers] = useState(INITIAL_TEAM_MEMBERS);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [guidelinesAgreed, setGuidelinesAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Modal State for "Add New Team Member"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    async function loadCompetition() {
      setLoading(true);
      try {
        const data = await fetchCompetitionDetailApi(competitionId);
        if (data && (data.event_name || data.name)) {
          setCompetition(data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.info('Backend unreachable, using mock competition details:', err.message);
      }

      const mock = findCompetitionById(competitionId);
      setCompetition(mock);
      setLoading(false);
    }

    loadCompetition();
  }, [competitionId]);

  const toggleMember = (member) => {
    if (selectedMembers.some((m) => m.id === member.id)) {
      setSelectedMembers(selectedMembers.filter((m) => m.id !== member.id));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleOpenModal = () => {
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberPhone('');
    setModalError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalError('');
  };

  const handleDoneModal = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) {
      setModalError('Please enter member name.');
      return;
    }
    const newMember = {
      id: `member-${Date.now()}`,
      name: newMemberName.trim(),
      email: newMemberEmail.trim() || `${newMemberName.trim().toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      phone: newMemberPhone.trim() || '9111000111',
    };

    setAvailableMembers([newMember, ...availableMembers]);
    setSelectedMembers([newMember, ...selectedMembers]);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!guidelinesAgreed) {
      setErrorMessage('Please agree to the Competition Guidelines before registering.');
      return;
    }

    setSubmitting(true);

    const payload = {
      competition_id: competitionId,
      team_members: selectedMembers.map((m) => m.id),
      team_video: performanceLink,
      description: description,
    };

    try {
      await registerCompetitionApi(payload);
      navigate(`/registration-success/${competitionId}`, { state: { competition } });
    } catch (err) {
      console.info('Simulated submission (backend offline):', payload);
      navigate(`/registration-success/${competitionId}`, { state: { competition } });
    } finally {
      setSubmitting(false);
    }
  };

  const competitionName = competition?.event_name || competition?.name || competition?.competetion || 'COMPETITION NAME';
  const moduleName = competition?.moduleName || competition?.module?.module || competition?.module || 'MODULE';
  const eventDesc =
    competition?.event_desc ||
    competition?.desc ||
    'Bring your best act to the Alcheringa stage and go head to head with teams from 500+ colleges across India.';
  const soloOrGroup = competition?.solo_or_group || 'Group';
  const eventMode = competition?.event_mode || 'On Ground';
  const minMembers = competition?.min_members || 5;
  const maxMembers = competition?.max_members || 10;

  const currentTeamDisplay =
    selectedMembers.length > 0
      ? selectedMembers.map((m) => m.name).join(', ')
      : 'Lorem Ipsum, Lorem Ipsum';

  /* ========================================================
     REUSABLE FIELD RENDERERS (Ensures zero duplicate logic)
     ======================================================== */
  const renderMetaChips = () => (
    <div className="comp-meta-row">
      <div className="comp-meta-chip">
        <MapPin size={18} className="comp-meta-icon" />
        <span className="comp-meta-label">{soloOrGroup}</span>
      </div>
      <div className="comp-meta-chip">
        <Users size={18} className="comp-meta-icon" />
        <span className="comp-meta-label">{eventMode}</span>
      </div>
    </div>
  );

  const renderCurrentTeam = () => (
    <div className="comp-field-group comp-field-current-team">
      <label className="comp-field-label">
        Current Team for {competitionName}
      </label>
      <div className="comp-input-readonly-wrap">
        <input
          type="text"
          readOnly
          value={currentTeamDisplay}
          className="comp-input comp-input-readonly"
        />
      </div>
    </div>
  );

  const renderTeamMembers = () => (
    <div className="comp-field-group comp-field-team-members">
      <label className="comp-field-label">
        Add Team Member (Min. {minMembers} - Max. {maxMembers})
      </label>

      <div className="comp-select-container">
        <button
          type="button"
          className="comp-select-trigger"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
        >
          <span className="comp-select-placeholder">
            {selectedMembers.length === 0
              ? '- Click here to Select -'
              : `${selectedMembers.length} member(s) selected`}
          </span>
          <ChevronDown size={18} className={`comp-chevron ${isDropdownOpen ? 'is-open' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div
            className="comp-select-dropdown"
            style={{ backgroundImage: `url(${process.env.PUBLIC_URL + textureImage})` }}
          >
            {availableMembers.map((member, index) => {
              const isChecked = selectedMembers.some((m) => m.id === member.id);
              return (
                <div
                  key={member.id}
                  className={`comp-member-row ${isChecked || index === 0 ? 'is-active-style' : ''} ${isChecked ? 'is-selected' : ''}`}
                  onClick={() => toggleMember(member)}
                >
                  <div className="comp-member-details">
                    <span className="comp-member-name">{member.name}</span>
                    <span className="comp-member-email">{member.email}</span>
                  </div>
                  <div className="comp-member-plus-icon">
                    {isChecked ? <Check size={18} /> : <Plus size={18} />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedMembers.length > 0 && (
        <div className="comp-selected-chips">
          {selectedMembers.map((m) => (
            <span key={m.id} className="comp-member-chip">
              {m.name}
              <button
                type="button"
                className="comp-chip-remove"
                onClick={() => toggleMember(m)}
                aria-label={`Remove ${m.name}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="comp-add-new-wrap">
        <button
          type="button"
          className="comp-add-new-link"
          onClick={handleOpenModal}
        >
          Add New Team Member? Click here
        </button>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="comp-field-group comp-field-performance">
      <label className="comp-field-label">Previous Performance</label>
      <div className="comp-input-with-icon">
        <input
          type="text"
          placeholder="Lorem Ipsum"
          value={performanceLink}
          onChange={(e) => setPerformanceLink(e.target.value)}
          className="comp-input"
        />
        <Link2 size={18} className="comp-input-right-icon" />
      </div>
    </div>
  );

  const renderDescription = () => (
    <div className="comp-field-group comp-field-description">
      <label className="comp-field-label">Description</label>
      <textarea
        placeholder="Lorem Ipsum"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="comp-textarea"
      />
    </div>
  );

  const renderGuidelines = () => (
    <div className="comp-guidelines-box">
      <h3 className="comp-guidelines-heading">Competition Guidelines</h3>
      <ol className="comp-guidelines-list">
        <li>Complete your profile by filling all the details in the &quot;Profile&quot; tab.</li>
        <li>Add members to your team in the &quot;Members&quot; tab, if required.</li>
        <li>Now, click on the &quot;Competitions&quot; tab to register for the events.</li>
        <li>Select your particular event and hit the &quot;Register&quot; button.</li>
        <li>Select the individuals participating in that event.</li>
        <li>
          Some events will ask for a link to your performance. Upload the video to your Google Drive and paste the
          sharing link.
        </li>
      </ol>

      <div className="comp-guidelines-action">
        <button
          type="button"
          className={`comp-agree-btn ${guidelinesAgreed ? 'is-agreed' : ''}`}
          onClick={() => setGuidelinesAgreed(!guidelinesAgreed)}
        >
          {guidelinesAgreed ? 'Agreed ✓' : 'Agree'}
        </button>
      </div>
    </div>
  );

  const renderSubmit = () => (
    <div className="comp-submit-block">
      <button
        type="submit"
        disabled={submitting}
        className="comp-register-btn"
      >
        {submitting ? 'Registering...' : 'Register'}
      </button>
    </div>
  );

  const renderNote = () => (
    <div className="comp-review-note">
      <strong>Note:</strong>
      <p>
        Our team is currently reviewing your submission. Once it has been successfully verified and approved, you will
        receive a notification via email and SMS.
      </p>
    </div>
  );

  return (
    <div
      className="comp-register-page-wrapper"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL + bgImage})` }}
    >
      {/* Top Navbar */}
      <header className="comp-register-navbar-wrap">
        <Navbar />
      </header>

      {/* Main Container */}
      <main className="comp-register-main">
        {loading ? (
          <div className="comp-register-loading-box">
            <Loader2 className="comp-register-spin" size={40} />
            <p>Loading competition details...</p>
          </div>
        ) : (
          <div
            className="comp-register-card"
            style={{ backgroundImage: `url(${process.env.PUBLIC_URL + textureImage})` }}
          >
            {/* Top Back Navigation Link */}
            <div className="comp-register-top-bar">
              <Link to="/modules" className="comp-register-back-link">
                <ArrowLeft size={16} /> Back to Modules
              </Link>
            </div>

            {/* Top Banner */}
            <div
              className="comp-register-banner"
              style={{ backgroundImage: `url(${process.env.PUBLIC_URL + bannerImage})` }}
            >
              <div className="comp-banner-overlay">
                <div className="comp-banner-content">
                  <h1 className="comp-banner-title">{competitionName.toUpperCase()}</h1>
                  <h2 className="comp-banner-module">{String(moduleName).toUpperCase()}</h2>
                  <p className="comp-banner-desc">{eventDesc}</p>
                </div>
              </div>
            </div>

            {/* Success and Error Alerts */}
            {successMessage && (
              <div className="comp-register-alert comp-register-alert-success">
                <Check size={20} className="comp-alert-icon" />
                <span>{successMessage}</span>
              </div>
            )}
            {errorMessage && (
              <div className="comp-register-alert comp-register-alert-error">
                <AlertCircle size={20} className="comp-alert-icon" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="comp-register-form">
              {/* DESKTOP FORM LAYOUT: Natural 2-Column Flex with exact compact spacing */}
              <div className="comp-form-desktop-layout">
                <div className="comp-form-left-col">
                  {renderMetaChips()}
                  {renderTeamMembers()}
                  {renderPerformance()}
                  {renderDescription()}
                  {renderSubmit()}
                  {renderNote()}
                </div>

                <div className="comp-form-right-col">
                  {renderCurrentTeam()}
                  {renderGuidelines()}
                </div>
              </div>

              {/* MOBILE FORM LAYOUT: Exact 1-Column Skeleton Order */}
              <div className="comp-form-mobile-layout">
                {renderMetaChips()}
                {renderCurrentTeam()}
                {renderTeamMembers()}
                {renderPerformance()}
                {renderDescription()}
                {renderGuidelines()}
                {renderSubmit()}
                {renderNote()}
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Website Footer */}
      <Footer />

      {/* ADD NEW TEAM MEMBER MODAL / BOTTOM SHEET */}
      {isModalOpen && (
        <div className="comp-modal-backdrop" onClick={handleCloseModal}>
          <div
            className="comp-modal-card"
            style={{ backgroundImage: `url(${process.env.PUBLIC_URL + textureImage})` }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top pill drag handle visible on mobile */}
            <div className="comp-modal-drag-handle" />

            <h2 className="comp-modal-title">ADD NEW TEAM MEMBER</h2>

            {modalError && (
              <div className="comp-modal-error-msg">
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleDoneModal} className="comp-modal-form">
              <div className="comp-modal-field">
                <label className="comp-modal-label">Name of New Member</label>
                <input
                  type="text"
                  placeholder="Lorem Ipsum"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  className="comp-modal-input"
                  autoFocus
                />
              </div>

              <div className="comp-modal-field">
                <label className="comp-modal-label">Email</label>
                <input
                  type="email"
                  placeholder="loremipsum@gmail.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="comp-modal-input"
                />
              </div>

              <div className="comp-modal-field">
                <label className="comp-modal-label">Phone Number</label>
                <div className="comp-modal-phone-row">
                  <span className="comp-modal-country-code">+91</span>
                  <input
                    type="tel"
                    placeholder="9111000111"
                    value={newMemberPhone}
                    onChange={(e) => setNewMemberPhone(e.target.value)}
                    className="comp-modal-input comp-modal-phone-input"
                  />
                </div>
              </div>

              <div className="comp-modal-actions">
                <button
                  type="button"
                  className="comp-modal-cancel-btn"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="comp-modal-done-btn"
                >
                  Done
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompetitionRegisterPage;
