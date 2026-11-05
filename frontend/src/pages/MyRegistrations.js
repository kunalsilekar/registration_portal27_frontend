import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyRegistrations.css";
import { clearAuthData, getAuthToken } from "../utils/api";
const API_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";
/*const dummyRegistrations = [
  {
    id: 1,
    event: {
      event_name: "Robotics Challenge",
      event_desc:
        "Participate in an exciting robotics competition and showcase your engineering skills.",
      prize_worth: "₹50,000",
      image: "/media/robotics.png",
    },
  },
  {
    id: 2,
    event: {
      event_name: "Code Combat",
      event_desc:
        "Test your coding skills and compete with the best programmers.",
      prize_worth: "₹30,000",
      image: "/media/coding.png",
    },
  },
  {
    id: 3,
    event: {
      event_name: "Robo Wars",
      event_desc: "Build your robot and battle against other teams.",
      prize_worth: "₹40,000",
      image: "/media/robowars.png",
    },
  },
  {
    id: 4,
    event: {
      event_name: "Tech Quiz",
      event_desc: "Challenge your technical knowledge and win exciting prizes.",
      prize_worth: "₹20,000",
      image: "/media/quiz.png",
    },
  },
];*/
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
  /*useEffect(() => {
    setRegistrations(dummyRegistrations);
    setLoading(false);
  }, []);*/

  const getImageUrl = (image) => {
    if (!image) return "";

    return image.startsWith("http")
      ? image
      : `${API_URL}${image.startsWith("/") ? "" : "/"}${image}`;
  };

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
                  backgroundImage: `url("${getImageUrl(event.image)}")`,
                  /*backgroundImage: `url(${require("../asset/image.png")})`,*/
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
