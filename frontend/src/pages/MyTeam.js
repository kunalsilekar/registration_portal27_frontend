import React, { useState, useEffect, useCallback } from "react";
import "./MyTeam.css";
import React, { useState, useEffect, useCallback } from "react";
import "./MyTeam.css";
import defaultPhoto from "../asset/Ppic.png";
import { getAuthToken, mediaUrl } from "../utils/api";

const API_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
const MyTeam = () => {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [fetchError, setFetchError] = useState("");

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    gender: "",
    phone: "",
    college: "",
  });

  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

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
      const genderValue = val.trim().toLowerCase();

      if (genderValue === "") {
        return "Gender is required.";
      }

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

  // HANDLE INPUT CHANGES
  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewMember((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      const message = validateField(name, value);

      setFieldErrors((prev) => ({
        ...prev,
        [name]: message,
      }));
    }
  };

  // HANDLE INPUT BLUR
  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const message = validateField(name, value);

    setFieldErrors((prev) => ({
      ...prev,
      [name]: message,
    }));
  };

  // VALIDATE COMPLETE FORM
  const validateForm = () => {
    const errors = {};

    Object.keys(newMember).forEach((field) => {
      const message = validateField(field, newMember[field]);

      if (message) {
        errors[field] = message;
      }
    });

    setFieldErrors(errors);

    setTouched({
      name: true,
      email: true,
      gender: true,
      phone: true,
      college: true,
    });

    return Object.keys(errors).length === 0;
  };

  // RESET FORM
  const resetForm = () => {
    setNewMember({
      name: "",
      email: "",
      gender: "",
      phone: "",
      college: "",
    });

    setTouched({});
    setFieldErrors({});
  };

  // ADD MEMBER TO BACKEND
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

    const memberData = {
      name: newMember.name.trim(),
      email: newMember.email.trim(),
      gender:
        newMember.gender.trim().toLowerCase() === "male"
          ? "M"
          : newMember.gender.trim().toLowerCase() === "female"
            ? "F"
            : "O",
      phone: `+91${newMember.phone}`,
      collegename: newMember.college.trim(),
    };

    try {
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

      // ADD THE SAVED MEMBER TO THE DISPLAYED LIST
      setMembers((prev) => [...prev, data]);

      resetForm();
      setShowForm(false);
    } catch (error) {
      setApiError(error.message);
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
                {member.img ? (
                  <img src={getMediaUrl(member.img)} alt={member.name} />
                ) : null}
              </div>

              <h4>{member.name}</h4>
              <p>{member.email}</p>
            </div>
          ))
        )}
      </div>

      <div className="add-member-wrapper">
        <button
          className="add-member-btn"
          onClick={() => {
            setApiError("");
            setShowForm(true);
          }}
        >
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
            <h2>ADD NEW TEAM MEMBER</h2>

            {apiError && <p className="field-error">{apiError}</p>}

            <form onSubmit={handleAddMember}>
              <div className="member-form-field">
                <label htmlFor="name">Name of New Member</label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder="Enter member name"
                  value={newMember.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    fieldErrors.name && touched.name
                      ? "invalid-input"
                      : touched.name && !fieldErrors.name
                        ? "valid-input"
                        : ""
                  }
                />

                {touched.name && fieldErrors.name && (
                  <p className="field-error">{fieldErrors.name}</p>
                )}
              </div>

              <div className="member-form-field">
                <label htmlFor="email">Email</label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Enter email"
                  value={newMember.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    fieldErrors.email && touched.email
                      ? "invalid-input"
                      : touched.email && !fieldErrors.email
                        ? "valid-input"
                        : ""
                  }
                />

                {touched.email && fieldErrors.email && (
                  <p className="field-error">{fieldErrors.email}</p>
                )}
              </div>

              <div className="member-form-field">
                <label htmlFor="gender">Gender</label>

                <input
                  id="gender"
                  name="gender"
                  value={newMember.gender}
                  placeholder="Enter Gender"
                  autoComplete="off"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    fieldErrors.gender && touched.gender
                      ? "invalid-input"
                      : touched.gender && !fieldErrors.gender
                        ? "valid-input"
                        : ""
                  }
                />

                {touched.gender && fieldErrors.gender && (
                  <p className="field-error">{fieldErrors.gender}</p>
                )}
              </div>

              <div className="member-form-field">
                <label htmlFor="phone">Phone Number</label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder="Enter 10-digit phone number"
                  value={newMember.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    fieldErrors.phone && touched.phone
                      ? "invalid-input"
                      : touched.phone && !fieldErrors.phone
                        ? "valid-input"
                        : ""
                  }
                />

                {touched.phone && fieldErrors.phone && (
                  <p className="field-error">{fieldErrors.phone}</p>
                )}
              </div>

              <div className="member-form-field">
                <label htmlFor="college-name">College Name</label>

                <input
                  id="college-name"
                  type="text"
                  name="college"
                  autoComplete="organization"
                  placeholder="Enter college name"
                  value={newMember.college}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    fieldErrors.college && touched.college
                      ? "invalid-input"
                      : touched.college && !fieldErrors.college
                        ? "valid-input"
                        : ""
                  }
                />

                {touched.college && fieldErrors.college && (
                  <p className="field-error">{fieldErrors.college}</p>
                )}
              </div>

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
                  {isSubmitting ? "Saving..." : "Done"}
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
