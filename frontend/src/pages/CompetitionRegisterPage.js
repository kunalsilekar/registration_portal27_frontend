import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Users, Link2, ChevronDown, Plus, Check, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../sections/Footer';
import {
  fetchCompetitionDetailApi,
  registerCompetitionApi,
  fetchProfileApi,
  fetchMyTeamMembersApi,
  fetchMyRegisteredCompetitionsApi,
  getMediaUrl,
  getStoredUser,
} from '../utils/api';
import './CompetitionRegisterPage.css';

const bgImage = '/assets/competition_Register_bg.jpg';
const textureImage = '/assets/texture.png';

function CompetitionRegisterPage() {
  const { competitionId } = useParams();
  const navigate = useNavigate();

  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileTeamName, setProfileTeamName] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [performanceLink, setPerformanceLink] = useState('');
  const [description, setDescription] = useState('');
  const [availableMembers, setAvailableMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [guidelinesAgreed, setGuidelinesAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Modal State for "Add New Team Member"
  const storedUser = getStoredUser() || {};

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    async function loadData() {
      setLoading(true);
      setErrorMessage(null);

      try {
        const data = await fetchCompetitionDetailApi(competitionId);
        if (!data || !(data.event_name || data.name)) throw new Error('The backend did not return this competition.');
        setCompetition(data);
      } catch (err) {
        setCompetition(null);
        setErrorMessage(err.message || 'Could not load competition details from the backend.');
        setLoading(false);
        return;
      }

      try {
        const profile = await fetchProfileApi();
        if (profile) {
          setProfileData(profile);
          setProfileTeamName(profile.team_name || '');
        }
      } catch (err) {
        setProfileData(null);
      }

      try {
        const members = await fetchMyTeamMembersApi();
        setAvailableMembers(Array.isArray(members) ? members : []);
      } catch (err) {
        setErrorMessage(err.message || 'Could not load your saved team members.');
      }

      try {
        const registeredList = await fetchMyRegisteredCompetitionsApi();
        const isRegistered = registeredList.some(
          (registration) => String(registration.event?.id || registration.event) === String(competitionId)
        );
        setAlreadyRegistered(isRegistered);
      } catch (err) {
        setErrorMessage(err.message || 'Could not check your competition registrations.');
      }

      setLoading(false);
    }
    loadData();
  }, [competitionId]);

  const toggleMember = (member) => {
    if (selectedMembers.some((m) => m.id === member.id)) {
      setSelectedMembers(selectedMembers.filter((m) => m.id !== member.id));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleOpenModal = () => {
    navigate('/profile', { state: { activeTab: 'team' } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (alreadyRegistered) {
      setErrorMessage('You have already registered for this competition.');
      return;
    }

    if (!guidelinesAgreed) {
      setErrorMessage('Please agree to the Competition Guidelines before registering.');
      return;
    }

    const isSoloCompetition = String(competition?.solo_or_group || '').trim().toLowerCase().includes('solo');
    if (!isSoloCompetition) {
      const selectedCount = selectedMembers.length;
      const minimum = Number(competition?.min_members);
      const maximum = Number(competition?.max_members);

      if (Number.isFinite(minimum) && minimum > 0 && selectedCount < minimum) {
        setErrorMessage(`Select at least ${minimum} team member${minimum === 1 ? '' : 's'} to register.`);
        return;
      }

      if (Number.isFinite(maximum) && maximum > 0 && selectedCount > maximum) {
        setErrorMessage(`You can select no more than ${maximum} team member${maximum === 1 ? '' : 's'}.`);
        return;
      }
    }

    setSubmitting(true);

    const participantName =
      profileData?.fullname || profileData?.name ||
      storedUser.fullname || storedUser.name || '';

    if (isSoloCompetition && !participantName.trim()) {
      setErrorMessage('Your profile name is missing. Complete your profile before registering.');
      setSubmitting(false);
      return;
    }

    // Solo events register the signed-in user as the participant automatically.
    const memberNames = isSoloCompetition
      ? [participantName.trim()]
      : selectedMembers.map((m) => m.name.trim());

    const payload = {
      competition_id: competitionId,
      team_members: memberNames,
      team_video: performanceLink,
      description: description,
    };

    try {
      await registerCompetitionApi(payload);
      navigate(`/registration-success/${competitionId}`, { state: { competition } });
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const competitionName = competition?.event_name || competition?.name || competition?.competetion || '';
  const moduleName = competition?.moduleName || competition?.module?.module || competition?.module || '';
  const eventDesc =
    competition?.event_desc || competition?.desc || 'Competition details are not available.';
  const soloOrGroup = competition?.solo_or_group || 'Not specified';
  const eventMode = competition?.event_mode || 'Not specified';
  const minMembers = competition?.min_members ?? 0;
  const maxMembers = competition?.max_members ?? 0;
  const isSoloCompetition = String(soloOrGroup).trim().toLowerCase().includes('solo');
  const participantName =
    profileData?.fullname || profileData?.name ||
    storedUser.fullname || storedUser.name || '';

  const currentTeamDisplay = isSoloCompetition
    ? participantName || 'Your profile name is unavailable'
    : selectedMembers.length > 0
      ? selectedMembers.map((member) => member.name).join(', ')
      : (profileTeamName || 'Team information unavailable');

  /* ========================================================
     REUSABLE FIELD RENDERERS (Ensures zero duplicate logic)
     ======================================================== */
  const renderMetaChips = () => (
    <div className="comp-meta-row">
      <div className="comp-meta-chip">
        <MapPin size={18} className="comp-meta-icon" />
        <span className="comp-meta-label">
          {String(eventMode).trim().toLowerCase() === 'true' ? 'On Ground' : 'Online'}
        </span>
      </div>
      <div className="comp-meta-chip">
        <Users size={18} className="comp-meta-icon" />
        <span className="comp-meta-label">{soloOrGroup}</span>
      </div>
    </div>
  );

  const renderCurrentTeam = () => (
    <div className="comp-field-group comp-field-current-team">
      <label className="comp-field-label">
        {isSoloCompetition ? 'Participant' : `Current Team for ${competitionName}`}
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
          placeholder="Paste a link"
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
        placeholder="Add a description"
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
        disabled={submitting || alreadyRegistered}
        className="comp-register-btn"
      >
        {alreadyRegistered
          ? 'Already Registered ✓'
          : submitting
            ? 'Registering...'
            : 'Register'}
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
        ) : !competition ? (
          <div className="comp-register-loading-box" role="alert">
            <AlertCircle size={32} />
            <p>{errorMessage || 'This competition could not be loaded from the backend.'}</p>
            <Link to="/modules" className="comp-register-back-link">Back to Modules</Link>
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
              style={{
                backgroundImage: competition?.image
                  ? `url("${getMediaUrl(competition.image)}"), url("/assets/form_banner_bg.jpg")`
                  : `url("/assets/form_banner_bg.jpg")`,
              }}
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
            {errorMessage && (
              <div className="comp-register-alert comp-register-alert-error">
                <AlertCircle size={20} className="comp-alert-icon" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="comp-register-form">
              {/* DESKTOP FORM LAYOUT: Natural 2-Column Flex with exact compact spacing */}
              <div className={`comp-form-desktop-layout${isSoloCompetition ? ' is-solo' : ''}`}>
                <div className="comp-form-left-col">
                  {renderMetaChips()}
                  {!isSoloCompetition && renderTeamMembers()}
                  {isSoloCompetition && renderCurrentTeam()}
                  {renderPerformance()}
                  {renderDescription()}
                  {renderSubmit()}
                  {renderNote()}
                </div>

                <div className="comp-form-right-col">
                  {!isSoloCompetition && renderCurrentTeam()}
                  {renderGuidelines()}
                </div>
              </div>

              {/* MOBILE FORM LAYOUT: Exact 1-Column Skeleton Order */}
              <div className="comp-form-mobile-layout">
                {renderMetaChips()}
                {!isSoloCompetition && renderCurrentTeam()}
                {!isSoloCompetition && renderTeamMembers()}
                {isSoloCompetition && renderCurrentTeam()}
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
    </div>
  );
}

export default CompetitionRegisterPage;
