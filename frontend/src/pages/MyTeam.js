import React, { useState, useEffect, useCallback } from "react";
import "./MyTeam.css";
import defaultPhoto from "../asset/Ppic.png";
import { getAuthToken, getMediaUrl } from "../utils/api";

const API_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const createEmptyMember = () => ({
  id: `${Date.now()}-${Math.random()}`,
  name: "",
  email: "",
  gender: "",
  phone: "",
  college: "",
});

const MyTeam = () => {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [fetchError, setFetchError] = useState("");

  // Multiple forms
  const [newMembers, setNewMembers] = useState([]);
  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [openGenderId, setOpenGenderId] = useState(null);

  // FETCH EXISTING TEAM MEMBERS
  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setFetchError("");

    const token = getAuthToken();

    if (!token) {
      setFetchError("Authentication token not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/Participant/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error(
            "Session expired or authentication failed. Please log in again.",
          );
        }

        throw new Error(data?.detail || "Failed to fetch team members.");
      }

      if (!Array.isArray(data)) {
        throw new Error("Invalid response received from server.");
      }

      setMembers(data);
    } catch (error) {
      setFetchError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // VALIDATE INDIVIDUAL FIELDS
  const validateField = (name, value) => {
    const val = value.trim();

    if (name === "name") {
      if (val === "") return "Name is required.";
      if (val.length < 3) return "Name must contain at least 3 characters.";
    }

    if (name === "email") {
      if (val === "") return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        return "Enter a valid email address.";
      }
    }

    if (name === "gender") {
      const genderValue = val.toLowerCase();

      if (genderValue === "") return "Gender is required.";

      if (!["male", "female", "other"].includes(genderValue)) {
        return "Enter Male, Female, or Other.";
      }
    }

    if (name === "phone") {
      if (val === "") return "Phone number is required.";
      if (!/^\d{10}$/.test(val)) {
        return "Enter a valid 10-digit phone number.";
      }
    }

    if (name === "college") {
      if (val === "") return "College name is required.";
    }

    return "";
  };

  // UPDATE A PARTICULAR MEMBER'S FIELD
  const handleChange = (memberId, field, value) => {
    setNewMembers((prev) =>
      prev.map((member) =>
        member.id === memberId ? { ...member, [field]: value } : member,
      ),
    );

    if (touched[memberId]?.[field]) {
      const message = validateField(field, value);

      setFieldErrors((prev) => ({
        ...prev,
        [memberId]: {
          ...prev[memberId],
          [field]: message,
        },
      }));
    }
  };

  // HANDLE INPUT BLUR
  const handleBlur = (memberId, field, value) => {
    setTouched((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [field]: true,
      },
    }));

    const message = validateField(field, value);

    setFieldErrors((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [field]: message,
      },
    }));
  };

  // VALIDATE ALL MEMBER FORMS
  const validateForm = () => {
    const errors = {};
    const allTouched = {};
    let isValid = true;

    newMembers.forEach((member) => {
      errors[member.id] = {};
      allTouched[member.id] = {};

      ["name", "email", "gender", "phone", "college"].forEach((field) => {
        const message = validateField(field, member[field]);

        errors[member.id][field] = message;
        allTouched[member.id][field] = true;

        if (message) {
          isValid = false;
        }
      });
    });

    setFieldErrors(errors);
    setTouched(allTouched);

    return isValid;
  };

  // ADD ANOTHER MEMBER FORM
  const handleAddAnother = () => {
    setNewMembers((prev) => [...prev, createEmptyMember()]);
    setApiError("");
    setOpenGenderId(null);
  };

  // REMOVE A MEMBER FORM
  const handleRemoveMember = (memberId) => {
    setNewMembers((prev) => prev.filter((member) => member.id !== memberId));

    setTouched((prev) => {
      const updated = { ...prev };
      delete updated[memberId];
      return updated;
    });

    setFieldErrors((prev) => {
      const updated = { ...prev };
      delete updated[memberId];
      return updated;
    });

    if (openGenderId === memberId) {
      setOpenGenderId(null);
    }
  };

  // RESET ALL FORMS
  const resetForm = () => {
    setNewMembers([]);
    setTouched({});
    setFieldErrors({});
    setOpenGenderId(null);
  };

  // ADD ALL MEMBERS TO BACKEND
  const handleAddMember = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const token = getAuthToken();

    if (!token) {
      setApiError("Authentication token not found. Please log in again.");
      return;
    }

    setIsSubmitting(true);
    setApiError("");

    const remainingMembers = [...newMembers];
    const savedMembers = [];

    try {
      // Submit one member at a time
      while (remainingMembers.length > 0) {
        const currentMember = remainingMembers[0];

        const memberData = {
          name: currentMember.name.trim(),
          email: currentMember.email.trim(),
          gender:
            currentMember.gender.trim().toLowerCase() === "male"
              ? "M"
              : currentMember.gender.trim().toLowerCase() === "female"
                ? "F"
                : "O",
          phone: `+91${currentMember.phone}`,
          collegename: currentMember.college.trim(),
        };

        const response = await fetch(`${API_URL}/Participant/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(memberData),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error(
              "Session expired or authentication failed. Please log in again.",
            );
          }

          const errorMessage = data
            ? Object.entries(data)
                .map(([field, messages]) => {
                  const message = Array.isArray(messages)
                    ? messages.join(", ")
                    : messages;

                  return `${field}: ${message}`;
                })
                .join(" | ")
            : "Failed to add team member.";

          throw new Error(errorMessage);
        }

        savedMembers.push(data);
        remainingMembers.shift();
      }

      // Add successfully saved members to the displayed list
      setMembers((prev) => [...prev, ...savedMembers]);

      resetForm();
      setShowForm(false);
    } catch (error) {
      // Keep unsaved forms so the user can correct or retry them
      setMembers((prev) => [...prev, ...savedMembers]);
      setNewMembers(remainingMembers);
      setApiError(
        savedMembers.length > 0
          ? `${savedMembers.length} member(s) added successfully. Remaining forms were not saved. ${error.message}`
          : error.message,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // CANCEL ADD MEMBER
  const handleCancel = () => {
    resetForm();
    setApiError("");
    setShowForm(false);
  };

  // OPEN FORM
  const handleOpenForm = () => {
    setApiError("");
    setNewMembers([createEmptyMember()]);
    setShowForm(true);
  };

  return (
    <div className="myteam-container">
      <div className="team-members-list">
        {loading ? (
          <div className="team-loading">
            <div className="team-spinner"></div>
            <p>Loading team members...</p>
          </div>
        ) : fetchError ? (
          <p className="field-error">{fetchError}</p>
        ) : members.length === 0 ? (
          <p>No team members added yet.</p>
        ) : (
          members.map((member) => (
            <div className="member-card" key={member.id}>
              <div className="member-image">
                <img
                  src={member.img ? getMediaUrl(member.img) : defaultPhoto}
                  alt={member.name}
                />
              </div>

              <h4>{member.name}</h4>
              <p>{member.email}</p>
            </div>
          ))
        )}
      </div>

      <div className="add-member-wrapper">
        <button className="add-member-btn" onClick={handleOpenForm}>
          Add More Members
        </button>

        {!loading && fetchError && (
          <button className="retry-btn" onClick={fetchMembers}>
            Retry
          </button>
        )}
      </div>

      {apiError && !showForm && <p className="field-error">{apiError}</p>}

      {showForm && (
        <div className="member-modal-overlay">
          <div className="member-modal">
            <div className="member-modal-heading">
              <h2>ADD NEW TEAM MEMBERS</h2>

              <button
                type="button"
                className="add-another-member-btn"
                onClick={handleAddAnother}
                disabled={isSubmitting}
                title="Add another member"
              >
                +
              </button>
            </div>

            {apiError && <p className="field-error">{apiError}</p>}

            <form onSubmit={handleAddMember}>
              {newMembers.map((member, index) => {
                const memberErrors = fieldErrors[member.id] || {};
                const memberTouched = touched[member.id] || {};

                return (
                  <div className="member-form-section" key={member.id}>
                    <div className="member-form-section-heading">
                      <h3>Member {index + 1}</h3>

                      {newMembers.length > 1 && (
                        <button
                          type="button"
                          className="remove-member-btn"
                          onClick={() => handleRemoveMember(member.id)}
                          disabled={isSubmitting}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="member-form-field">
                      <label htmlFor={`name-${member.id}`}>
                        Name of New Member
                      </label>

                      <input
                        id={`name-${member.id}`}
                        type="text"
                        name="name"
                        autoComplete="name"
                        placeholder="Enter member name"
                        value={member.name}
                        onChange={(e) =>
                          handleChange(member.id, "name", e.target.value)
                        }
                        onBlur={(e) =>
                          handleBlur(member.id, "name", e.target.value)
                        }
                        className={
                          memberErrors.name && memberTouched.name
                            ? "invalid-input"
                            : memberTouched.name && !memberErrors.name
                              ? "valid-input"
                              : ""
                        }
                      />

                      {memberTouched.name && memberErrors.name && (
                        <p className="field-error">{memberErrors.name}</p>
                      )}
                    </div>

                    <div className="member-form-field">
                      <label htmlFor={`email-${member.id}`}>Email</label>

                      <input
                        id={`email-${member.id}`}
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder="Enter email"
                        value={member.email}
                        onChange={(e) =>
                          handleChange(member.id, "email", e.target.value)
                        }
                        onBlur={(e) =>
                          handleBlur(member.id, "email", e.target.value)
                        }
                        className={
                          memberErrors.email && memberTouched.email
                            ? "invalid-input"
                            : memberTouched.email && !memberErrors.email
                              ? "valid-input"
                              : ""
                        }
                      />

                      {memberTouched.email && memberErrors.email && (
                        <p className="field-error">{memberErrors.email}</p>
                      )}
                    </div>

                    <div className="member-form-field">
                      <label htmlFor={`gender-${member.id}`}>Gender</label>

                      <div className="gender-dropdown">
                        <button
                          type="button"
                          id={`gender-${member.id}`}
                          className={`gender-dropdown-btn ${
                            memberErrors.gender && memberTouched.gender
                              ? "invalid-input"
                              : memberTouched.gender && !memberErrors.gender
                                ? "valid-input"
                                : ""
                          }`}
                          onClick={() =>
                            setOpenGenderId((prev) =>
                              prev === member.id ? null : member.id,
                            )
                          }
                        >
                          <span>{member.gender || "Select Gender"}</span>
                          <span className="gender-arrow">
                            {openGenderId === member.id ? "▲" : "▼"}
                          </span>
                        </button>

                        {openGenderId === member.id && (
                          <div className="gender-dropdown-menu">
                            {["Male", "Female", "Other"].map((gender) => (
                              <button
                                type="button"
                                key={gender}
                                onClick={() => {
                                  handleChange(member.id, "gender", gender);
                                  handleBlur(member.id, "gender", gender);
                                  setOpenGenderId(null);
                                }}
                              >
                                {gender}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {memberTouched.gender && memberErrors.gender && (
                        <p className="field-error">{memberErrors.gender}</p>
                      )}
                    </div>

                    <div className="member-form-field">
                      <label htmlFor={`phone-${member.id}`}>Phone Number</label>

                      <input
                        id={`phone-${member.id}`}
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        placeholder="Enter 10-digit phone number"
                        value={member.phone}
                        onChange={(e) =>
                          handleChange(member.id, "phone", e.target.value)
                        }
                        onBlur={(e) =>
                          handleBlur(member.id, "phone", e.target.value)
                        }
                        className={
                          memberErrors.phone && memberTouched.phone
                            ? "invalid-input"
                            : memberTouched.phone && !memberErrors.phone
                              ? "valid-input"
                              : ""
                        }
                      />

                      {memberTouched.phone && memberErrors.phone && (
                        <p className="field-error">{memberErrors.phone}</p>
                      )}
                    </div>

                    <div className="member-form-field">
                      <label htmlFor={`college-${member.id}`}>
                        College Name
                      </label>

                      <input
                        id={`college-${member.id}`}
                        type="text"
                        name="college"
                        autoComplete="organization"
                        placeholder="Enter college name"
                        value={member.college}
                        onChange={(e) =>
                          handleChange(member.id, "college", e.target.value)
                        }
                        onBlur={(e) =>
                          handleBlur(member.id, "college", e.target.value)
                        }
                        className={
                          memberErrors.college && memberTouched.college
                            ? "invalid-input"
                            : memberTouched.college && !memberErrors.college
                              ? "valid-input"
                              : ""
                        }
                      />

                      {memberTouched.college && memberErrors.college && (
                        <p className="field-error">{memberErrors.college}</p>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="member-form-actions">
                <button
                  type="button"
                  className="member-cancel-btn"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="member-done-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Add Members"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTeam;
