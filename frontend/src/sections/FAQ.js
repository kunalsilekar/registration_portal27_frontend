import React, { useState } from 'react';
import { Plus, Minus, Send } from 'lucide-react';
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
  const [submitted, setSubmitted] = useState(false);

  const toggleFAQ = (id) => {
    setOpenId((prevId) => (prevId === id ? null : id));
  };

  const handleHelpSubmit = (e) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;
    setSubmitted(true);
    setUserQuestion('');
    setTimeout(() => setSubmitted(false), 4000);
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
                onChange={(e) => setUserQuestion(e.target.value)}
              />
              <button
                type="submit"
                className="faq-help-submit"
                aria-label="Send Question"
              >
                <Send size={15} />
              </button>
            </form>
            {submitted && (
              <p className="faq-help-success">
                ✓ Question received! We'll reply soon.
              </p>
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

