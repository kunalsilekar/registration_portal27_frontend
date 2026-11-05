import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyRegistrations.css";
import { clearAuthData, getAuthToken, getMediaUrl } from "../utils/api";
const API_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
const Registrations = () => {
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRegistrations = useCallback(async () => {
    const token = getAuthToken();

    if (!token) {
      setError("Please log in to view your registrations.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/my-registered-competitions/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 401) {
        clearAuthData();
        navigate("/login", { replace: true });
        return;
      }

      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Server returned an invalid response. Status: ${response.status}`,
        );
      }

      if (!response.ok) {
        throw new Error(
          data.detail ||
            `Unable to fetch registrations. Status: ${response.status}`,
        );
      }

      setRegistrations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);
  return (
    <div className="registrations-container">
      <div className="registrations-grid">
        {loading ? (
          <div className="registrations-message">
            Loading your registrations...
          </div>
        ) : error ? (
          <div className="registrations-message">
            <p>{error}</p>

            <button
              type="button"
              className="registration-retry-btn"
              onClick={fetchRegistrations}
            >
              Retry
            </button>
          </div>
        ) : registrations.length === 0 ? (
          <div className="registrations-message">
            <p>You haven't registered for any competitions yet.</p>
          </div>
        ) : (
          registrations.slice(0, 4).map((registration) => {
            const event = registration.event || {};

            return (
              <div
                className="registration-card"
                key={registration.id}
                style={{
                  backgroundImage: `url("${getMediaUrl(event.image)}")`,
                }}
              >
                <div className="registration-card-content">
                  <h2>{event.event_name}</h2>

                  <p>{event.event_desc}</p>

                  <h3>Prize - {event.prize_worth}</h3>

                  <button type="button" className="view-application-btn">
                    <span className="application-arrow">›</span>

                    <span>View Application</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="explore-more-wrapper">
        <button
          className="explore-more-btn"
          onClick={() => navigate("/#modules")}
        >
          Explore More
        </button>
      </div>
    </div>
  );
};

export default Registrations;
