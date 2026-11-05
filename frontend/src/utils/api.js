const API_BASE_URL = (
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000"
).replace(/\/+$/, "");

// Configurable login route / URL (can be customized via REACT_APP_LOGIN_URL)
export const LOGIN_URL = process.env.REACT_APP_LOGIN_URL || "/login";

export const redirectToLogin = (returnAnchor = "#faqs") => {
  const currentPath =
    window.location.pathname + window.location.search + (returnAnchor || "");
  const destination = LOGIN_URL.includes("?")
    ? `${LOGIN_URL}&redirect=${encodeURIComponent(currentPath)}`
    : `${LOGIN_URL}?redirect=${encodeURIComponent(currentPath)}`;
  window.location.href = destination;
};

const getApiErrorMessage = (data, fallback) => {
  if (data?.detail) return data.detail;
  if (data && typeof data === "object") {
    for (const [field, value] of Object.entries(data)) {
      const message = Array.isArray(value) ? value[0] : value;
      if (typeof message === "string")
        return field === "non_field_errors" ? message : `${field}: ${message}`;
    }
  }
  return fallback;
};

const postJson = async (path, payload, fallback) => {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new Error(
      "Could not reach the backend. Make sure the Django server is running.",
    );
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(getApiErrorMessage(data, fallback));
  return data;
};

export const registerApi = (data) =>
  postJson(
    "/api/register/",
    data,
    "Registration failed. Please check your details.",
  );

export const loginApi = (email, password) =>
  postJson(
    "/login/",
    { email, password },
    "Sign in failed. Please check your details.",
  );

export const requestPasswordResetApi = (email) =>
  postJson(
    "/api/forgot-password/",
    { email },
    "Could not send the reset code.",
  );

export const verifyOtpApi = (email, otp) =>
  postJson(
    "/api/verify-otp/",
    { email, otp },
    "The code is invalid or has expired.",
  );

export const confirmPasswordResetApi = (token, password, confirmPassword) =>
  postJson(
    "/api/reset-password-confirm/",
    {
      token,
      password,
      confirm_password: confirmPassword,
    },
    "Could not reset the password.",
  );

export const googleLoginApi = async (idToken) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/google/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: idToken }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || "Google sign-in failed. Please try again.");
  }

  return data;
};
export const getExploreModulesApi = async () => {
  let response;
  try {
    response = await fetch(API_BASE_URL + "/api/competitions/");
  } catch (error) {
    throw new Error("Could not reach the backend while loading modules.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      getApiErrorMessage(data, "Could not load modules and competitions."),
    );
  }
  if (!Array.isArray(data.modules) || !Array.isArray(data.allcomp)) {
    throw new Error("The backend returned an unexpected modules response.");
  }
  return data;
};
export const getApiMediaUrl = (path) => {
  if (typeof path !== "string" || !path.trim()) return "";
  try {
    return new URL(path, API_BASE_URL + "/").toString();
  } catch (error) {
    return "";
  }
};
export const getAuthToken = () => {
  return (
    localStorage.getItem("alcher_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    null
  );
};

export const completeGoogleProfileApi = async (profile) => {
  const token = getAuthToken();
  if (!token)
    throw new Error("Your session expired. Please sign in with Google again.");

  let response;
  try {
    response = await fetch(API_BASE_URL + "/api/auth/complete-profile/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(profile),
    });
  } catch (error) {
    throw new Error("Could not reach the backend. Please try again.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      getApiErrorMessage(data, "Could not save your profile details."),
    );
  }
  return data;
};
export const getStoredUser = () => {
  try {
    const raw =
      localStorage.getItem("alcher_user") || localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const setAuthData = (token, user) => {
  if (token) {
    localStorage.setItem("alcher_token", token);
  }
  if (user) {
    localStorage.setItem("alcher_user", JSON.stringify(user));
  }
  window.dispatchEvent(new Event("alcher-auth-changed"));
};

export const clearAuthData = () => {
  localStorage.removeItem("alcher_refresh_token");
  localStorage.removeItem("alcher_token");
  localStorage.removeItem("token");
  localStorage.removeItem("access_token");
  localStorage.removeItem("alcher_user");
  localStorage.removeItem("user");
};

export const submitUserQueryApi = async (question) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("You must be logged in to submit a query.");
  }

  const response = await fetch(`${API_BASE_URL}/api/queries/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ question }),
  });

  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      clearAuthData();
      throw new Error("Your session has expired. Please log in again.");
    }
    const errorMsg =
      data.detail ||
      (data.question && data.question[0]) ||
      "Failed to submit query.";
    throw new Error(errorMsg);
  }

  return data;
};

export const getMyQueriesApi = async () => {
  const token = getAuthToken();
  if (!token) {
    return [];
  }

  const response = await fetch(`${API_BASE_URL}/api/queries/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthData();
    }
    throw new Error("Failed to fetch queries.");
  }

  return await response.json();
};
