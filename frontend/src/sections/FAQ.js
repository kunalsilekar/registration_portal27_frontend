import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Minus, Send, Loader2, ChevronDown, ChevronUp, MessageSquareCheck } from 'lucide-react';
import { getAuthToken, submitUserQueryApi, getMyQueriesApi, redirectToLogin } from '../utils/api';
import './FAQ.css';

const textureImage = '/assets/texture.jpg';

const FAQ_DATA = [
  {
    id: 1,
    question: "How do I register for a competition?",
    answer:
      "Create an account, pick your module, choose the competition and fill in your team details. You’ll get a confirmation mail with your Alcher ID."
  },
  {
    id: 2,
    question: "Is there a registration fee?",
    answer:
      "[TBD: free / ₹X per participant / ₹X per team]. Some competitions have online prelims; finalists are invited to IIT Guwahati."
  },
  {
    id: 3,
    question: "Will accommodation be provided?",
    answer:
      "Yes, outstation participants can book on-campus accommodation for ₹[TBD], with slots on a first-come basis. Book early."
  },
  {
    id: 4,
    question: "Can I register for more than one competition?",
    answer:
      "Absolutely. Just watch out for schedule clashes, which we list on each competition page."
  },
  {
    id: 5,
    question: "When does registration close?",
    answer:
      "Registrations close on [TBD date], and prelim deadlines vary by competition. Check the rulebook on each page."
  }
];

const FAQSection = () => {
  const [openId, setOpenId] = useState(1);
  const [userQuestion, setUserQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loginPrompt, setLoginPrompt] = useState(false);

  // User queries list & state
  const [myQueries, setMyQueries] = useState([]);
  const [showMyQueries, setShowMyQueries] = useState(true);
  const [loadingQueries, setLoadingQueries] = useState(false);

  const isLoggedIn = !!getAuthToken();

  // Restore pending question from sessionStorage if user just returned from login
  useEffect(() => {
    const pending = sessionStorage.getItem('pending_faq_query');
    if (pending) {
      setUserQuestion(pending);
    }
  }, []);

  const fetchUserQueries = useCallback(async () => {
    if (!getAuthToken()) {
      setMyQueries([]);
      return;
    }
    setLoadingQueries(true);
    try {
      const data = await getMyQueriesApi();
      setMyQueries(data);
    } catch (err) {
      // Non-critical background fetch error
    } finally {
      setLoadingQueries(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserQueries();
    } else {
      setMyQueries([]);
    }
  }, [isLoggedIn, fetchUserQueries]);

  const toggleFAQ = (id) => {
    setOpenId((prevId) => (prevId === id ? null : id));
  };

  const handleHelpSubmit = async (e) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    // Check if user is logged in
    if (!getAuthToken()) {
      sessionStorage.setItem('pending_faq_query', userQuestion.trim());
      setLoginPrompt(true);
      setError('');
      return;
    }

    setSubmitting(true);
    setError('');
    setSubmitted(false);
    setLoginPrompt(false);

    try {
      await submitUserQueryApi(userQuestion.trim());
      setSubmitting(false);
      setSubmitted(true);
      setUserQuestion('');
      sessionStorage.removeItem('pending_faq_query');
      fetchUserQueries();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setSubmitting(false);
      if (err.message && err.message.toLowerCase().includes('log in')) {
        sessionStorage.setItem('pending_faq_query', userQuestion.trim());
        setLoginPrompt(true);
      } else {
        setError(err.message || 'Failed to submit query. Please try again.');
        setTimeout(() => setError(''), 5000);
      }
    }
  };

  return (
    <section
      className="faq-section-wrapper"
      id="faqs"
      style={{ backgroundImage: `url(${textureImage})` }}
    >
      <div className="faq-container">
        {/* Left Column: Heading + Subheading + Still Got Questions Box */}
        <div className="faq-left-col">
          <h1 className="faq-title">FAQ'S</h1>
          <h2 className="faq-subtitle">
            Clear Answers for<br />your Questions
          </h2>

          <div className="faq-help-card">
            <h3 className="faq-help-title">Still Got Questions?</h3>
            <p className="faq-help-desc">
              Drop your question here and we'll reach out to you via mail
            </p>

            <form className="faq-help-form" onSubmit={handleHelpSubmit}>
              <input
                type="text"
                className="faq-help-input"
                placeholder="Ask Your Question here"
                value={userQuestion}
                maxLength={400}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length <= 400) {
                    setUserQuestion(val);
                  }
                  if (error) setError('');
                  if (loginPrompt) setLoginPrompt(false);
                }}
                disabled={submitting}
              />
              <button
                type="submit"
                className="faq-help-submit"
                aria-label="Send Question"
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 size={15} className="spin-icon" />
                ) : (
                  <Send size={15} />
                )}
              </button>
            </form>

            {/* Prompt when unauthenticated user attempts to submit */}
            {loginPrompt && (
              <div className="faq-help-login-prompt">
                <span>Please log in to submit your query.</span>
                <button
                  type="button"
                  className="faq-help-login-btn"
                  onClick={() => {
                    sessionStorage.setItem('pending_faq_query', userQuestion.trim());
                    redirectToLogin('#faqs');
                  }}
                >
                  Login
                </button>
              </div>
            )}

            {submitted && (
              <p className="faq-help-success">
                ✓ Question received! We'll reply soon.
              </p>
            )}

            {error && (
              <p className="faq-help-error">
                {error}
              </p>
            )}

            {/* User's Query History & Admin Answers */}
            {isLoggedIn && myQueries.length > 0 && (
              <div className="faq-my-queries-section">
                <button
                  type="button"
                  className="faq-my-queries-toggle"
                  onClick={() => setShowMyQueries(!showMyQueries)}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MessageSquareCheck size={14} /> My Submitted Queries ({myQueries.length})
                  </span>
                  {showMyQueries ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {showMyQueries && (
                  <div className="faq-my-queries-list">
                    {loadingQueries ? (
                      <p className="faq-queries-empty">Loading your queries...</p>
                    ) : (
                      myQueries.map((q) => (
                        <div key={q.id} className="faq-query-item">
                          <div className="faq-query-header">
                            <h5 className="faq-query-question">{q.question}</h5>
                            <span className={`faq-query-status-badge ${(q.status || 'pending').toLowerCase()}`}>
                              {q.status}
                            </span>
                          </div>
                          {q.answer ? (
                            <div className="faq-query-answer-box">
                              <span className="faq-query-answer-label">Admin Answer:</span>
                              <p className="faq-query-answer-text">{q.answer}</p>
                            </div>
                          ) : (
                            <span className="faq-query-awaiting">
                              Awaiting response from admin
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Accordion List */}
        <div className="faq-right-col">
          <div className="faq-accordion-list">
            {FAQ_DATA.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className={`faq-item ${isOpen ? 'expanded' : 'collapsed'}`}
                  onClick={() => !isOpen && toggleFAQ(item.id)}
                >
                  <div className="faq-item-header">
                    <h4 className="faq-question">{item.question}</h4>
                    {!isOpen && (
                      <span className="faq-icon-collapsed">
                        <Plus size={16} strokeWidth={2.4} />
                      </span>
                    )}
                  </div>

                  {isOpen && (
                    <div className="faq-answer-content">
                      <p className="faq-answer-text">{item.answer}</p>
                      <div className="faq-expanded-footer">
                        <button
                          type="button"
                          className="faq-icon-expanded"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFAQ(item.id);
                          }}
                          aria-label="Collapse answer"
                        >
                          <Minus size={16} strokeWidth={2.8} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
