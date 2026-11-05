import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyProfile.css";
import MyTeam from "./MyTeam";
import Registrations from "./MyRegistrations";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";
import { clearAuthData, getAuthToken } from "../utils/api";

const API_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const defaultDetails = {
  name: "",
  phone: "",
  alcherId: "",
  gender: "",
  altPhone: "",
  team: "",
  college: "",
  city: "",
  state: "",
  img: "",
  email: "",
};

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("registrations");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [details, setDetails] = useState(defaultDetails);
  const [originalDetails, setOriginalDetails] = useState(defaultDetails);

  const [touched, setTouched] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});

  const fields = [
    {
      label: "Full Name",
      name: "name",
      placeholder: "Enter your full name",
      required: true,
    },
    {
      label: "Phone Number",
      name: "phone",
      placeholder: "Enter your phone number",
      phone: true,
      required: true,
    },
    {
      label: "Gender",
      name: "gender",
      placeholder: "Enter your gender",
    },
    {
      label: "Alternative Phone Number",
      name: "altPhone",
      placeholder: "Enter alternative phone number",
      phone: true,
    },
    {
      label: "Team Name",
      name: "team",
      placeholder: "Enter your team name",
    },
    {
      label: "College",
      name: "college",
      placeholder: "Enter your college name",
    },
    {
      label: "City",
      name: "city",
      placeholder: "Enter your city",
      required: true,
    },
    {
      label: "State",
      name: "state",
      placeholder: "Enter your state",
    },
  ];
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success]);

  // Get JWT token from localStorage
  const getToken = () => {
    return getAuthToken();
  };

  // Convert Django field names into React field names
  const mapProfileData = (user) => ({
    name: user.fullname || "",
    alcherId: user.alcherid || "",
    phone: (user.phone_number || "").replace(/^\+91/, ""),
    altPhone: (user.alternate_phone || "").replace(/^\+91/, ""),
    gender:
      user.gender === "M"
        ? "Male"
        : user.gender === "F"
          ? "Female"
          : user.gender === "O"
            ? "Other"
            : "",
    team: user.team_name || "",
    college: user.collegename || "",
    city: user.city || "",
    state: user.state || "",
    img: user.img || "",
    email: user.email || "",
  });

  // Fetch profile when the page loads
  useEffect(() => {
    const fetchProfile = async () => {
      const token = getToken();

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await fetch(`${API_URL}/profile/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          clearAuthData();
          navigate("/login", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to fetch profile details.");
        }

        const data = await response.json();
        const profileData = mapProfileData(data);

        setDetails(profileData);
        setOriginalDetails(profileData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Validate individual fields

  const validateField = (name, value) => {
    const val = value.trim();

    // FULL NAME
    if (name === "name") {
      if (val === "") return "Full name is required.";
      if (val.length < 5) {
        return "Name must contain at least 5 characters.";
      }
      if (!/^[a-zA-Z\s]+$/.test(val)) {
        return "Name should contain only alphabets.";
      }
    }

    // PHONE NUMBER
    if (name === "phone") {
      if (val === "") return "Phone number is required.";
      if (!/^\d{10}$/.test(val)) {
        return "Enter a valid 10-digit phone number.";
      }
    }

    // GENDER
    if (name === "gender" && val !== "") {
      if (!/^(male|female|other|m|f|o)$/i.test(val)) {
        return "Enter Male, Female or Other.";
      }
    }

    // ALTERNATIVE PHONE
    if (name === "altPhone" && val !== "") {
      if (!/^\d{10}$/.test(val)) {
        return "Enter a valid 10-digit alternative number.";
      }
    }

    // TEAM NAME
    if (name === "team" && val !== "") {
      if (val.length < 3) {
        return "Team name must contain at least 3 characters.";
      }
    }

    // COLLEGE
    if (name === "college" && val !== "") {
      if (!/^[a-zA-Z\s.,'-]+$/.test(val)) {
        return "College name should contain valid characters.";
      }
    }

    // CITY
    if (name === "city") {
      if (val === "") return "City is required.";
      if (!/^[a-zA-Z\s.'-]+$/.test(val)) {
        return "Enter a valid city name.";
      }
    }

    // STATE
    if (name === "state" && val !== "") {
      if (!/^[a-zA-Z\s.'-]+$/.test(val)) {
        return "Enter a valid state name.";
      }
    }

    return "";
  };

  // Validate the entire form
  const validateForm = () => {
    const errors = {};

    fields.forEach((field) => {
      const message = validateField(field.name, details[field.name]);

      if (message) {
        errors[field.name] = message;
      }
    });

    setFieldErrors(errors);

    // Mark all fields as touched so errors become visible
    setTouched(
      fields.reduce((acc, field) => {
        acc[field.name] = true;
        return acc;
      }, {}),
    );

    return Object.keys(errors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Revalidate a field after it has been touched
    if (touched[name]) {
      const message = validateField(name, value);

      setFieldErrors((prev) => ({
        ...prev,
        [name]: message,
      }));
    }

    setError("");
    setSuccess("");
  };

  // Validate when user leaves an input
  const handleBlur = (e) => {
    if (!isEditing) return;
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

  // Handle Edit button
  const handleEdit = () => {
    setOriginalDetails({ ...details });
    setIsEditing(true);
    setError("");
    setSuccess("");
    setFieldErrors({});
    setTouched({});
  };

  // Handle Cancel button
  const handleCancel = () => {
    setDetails({ ...originalDetails });
    setIsEditing(false);
    setTouched({});
    setFieldErrors({});
    setError("");
    setSuccess("");
  };

  // Convert backend errors into readable messages
  const getBackendError = (errorData) => {
    return Object.entries(errorData)
      .map(([field, message]) => {
        const readableMessage = Array.isArray(message)
          ? message.join(", ")
          : typeof message === "string"
            ? message
            : JSON.stringify(message);

        return `${field}: ${readableMessage}`;
      })
      .join(" | ");
  };

  // Save updated profile to Django
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setError("Please correct the highlighted fields.");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = getToken();

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const formData = new FormData();
      const genderValue = details.gender.trim().toLowerCase();

      const genderCode =
        {
          male: "M",
          female: "F",
          other: "O",
          m: "M",
          f: "F",
          o: "O",
        }[genderValue] || "";

      formData.append("fullname", details.name);
      formData.append("gender", genderCode);
      formData.append("phone_number", "+91" + details.phone);

      if (details.altPhone.trim() !== "") {
        formData.append("alternate_phone", "+91" + details.altPhone);
      }
      formData.append("collegename", details.college);
      formData.append("city", details.city);
      formData.append("state", details.state);
      formData.append("team_name", details.team);

      const response = await fetch(`${API_URL}/auth/edit-profile/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.status === 401) {
        clearAuthData();
        navigate("/login", { replace: true });
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          getBackendError(errorData) ||
            "Something went wrong. Please try again.",
        );
      }

      const data = await response.json();

      if (data.user) {
        const updatedProfile = mapProfileData(data.user);

        setDetails(updatedProfile);
        setOriginalDetails(updatedProfile);
      }

      setIsEditing(false);
      setTouched({});
      setFieldErrors({});
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Loading screen
  /*if (isLoading) {
    return <div className="profile-loading">Loading profile...</div>;
  }*/

  return (
    <div className="bg">
      <div className="navbar-slot">
        <Navbar />
      </div>

      <div className="welcome-section">
        <h1>WELCOME {details.name || "NAME"}</h1>
        <p>Alcher ID #{details.alcherId || "00000000"}</p>
      </div>
      <div className="profile-content">
        {/* LEFT PROFILE SECTION */}
        <div className="pi">
          <img
            src={
              details.img
                ? details.img.startsWith("http")
                  ? details.img
                  : `${API_URL}/${details.img.replace(/^\/+/, "")}`
                : require("../asset/Ppic.png")
            }
            alt="Profile"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = require("../asset/Ppic.png");
            }}
          />

          <div className="profile-info">
            <h2>{details.name || "Your Name"}</h2>
            <p className="email-id">{details.email || "Your Email"}</p>
            <p className="team-name">Team - {details.team || "Not assigned"}</p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div
          className={`right-section ${activeTab === "team" ? "team-view" : ""}`}
        >
          {/* TABS */}
          {/* TABS */}
          <div className="tabs">
            <div
              className={`tab ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              My Profile
            </div>

            <div
              className={`tab ${activeTab === "registrations" ? "active" : ""}`}
              onClick={() => setActiveTab("registrations")}
            >
              My Registrations
            </div>

            <div
              className={`tab ${activeTab === "team" ? "active" : ""}`}
              onClick={() => setActiveTab("team")}
            >
              Team Members
            </div>
          </div>

          {/* PROFILE FORM */}
          {activeTab === "profile" && (
            <div className="prt prt-profile">
              <form className="profile-form" onSubmit={handleSubmit}>
                {fields.map((field) => (
                  <div className="form-field" key={field.name}>
                    <label htmlFor={field.name}>
                      {field.label}
                      {field.required && (
                        <span className="required-star"> *</span>
                      )}
                    </label>

                    {field.phone ? (
                      <div className="phone-input">
                        <div className="country-code">+91</div>

                        <input
                          type="tel"
                          id={field.name}
                          name={field.name}
                          placeholder={field.placeholder}
                          value={details[field.name]}
                          autoComplete={field.name === "phone" ? "tel" : "off"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          readOnly={!isEditing}
                          className={
                            fieldErrors[field.name] && touched[field.name]
                              ? "invalid-input"
                              : touched[field.name] && !fieldErrors[field.name]
                                ? "valid-input"
                                : ""
                          }
                        />
                      </div>
                    ) : (
                      <input
                        id={field.name}
                        type="text"
                        name={field.name}
                        placeholder={field.placeholder}
                        value={details[field.name]}
                        autoComplete={
                          field.name === "name"
                            ? "name"
                            : field.name === "phone"
                              ? "tel"
                              : field.name === "college"
                                ? "organization"
                                : field.name === "city"
                                  ? "address-level2"
                                  : field.name === "state"
                                    ? "address-level1"
                                    : "off"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        readOnly={!isEditing}
                        className={
                          !isEditing
                            ? "readonly-input"
                            : fieldErrors[field.name] && touched[field.name]
                              ? "invalid-input"
                              : touched[field.name] && !fieldErrors[field.name]
                                ? "valid-input"
                                : ""
                        }
                      />
                    )}

                    {isEditing && fieldErrors[field.name] && (
                      <p className="field-error">{fieldErrors[field.name]}</p>
                    )}
                  </div>
                ))}

                <div className="form-bottom">
                  {/* ERROR AND SUCCESS MESSAGES */}
                  {isEditing && (
                    <button type="button" className="upload-image-button">
                      Update Profile Image
                    </button>
                  )}

                  <div className="form-message">
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                  </div>

                  {/* BUTTONS */}
                  <div className="form-actions">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          className="cancel-button"
                          disabled={isSaving}
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                        <button type="submit" disabled={isSaving}>
                          {isSaving ? "Saving..." : "Confirm"}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="edit-button"
                        onClick={handleEdit}
                      >
                        Edit Details
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}

          {activeTab === "registrations" && (
            <div className="prt prt-registrations">
              <Registrations />
            </div>
          )}

          {activeTab === "team" && (
            <div className="prt prt-team">
              <MyTeam />
            </div>
          )}
        </div>
      </div>
      <div className="profile-footer">
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
