const API_BASE_URL = (
  process.env.REACT_APP_API_BASE_URL
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

// Backwards-compatible alias used by competition and registration pages.
export const getMediaUrl = getApiMediaUrl;
const getTabValue = (key, legacyKeys = []) => {
  const current = sessionStorage.getItem(key);
  if (current) return current;

  for (const legacyKey of legacyKeys) {
    const legacyValue = localStorage.getItem(legacyKey);
    if (legacyValue) {
      sessionStorage.setItem(key, legacyValue);
      localStorage.removeItem(legacyKey);
      return legacyValue;
    }
  }
  return null;
};

export const getAuthToken = () =>
  getTabValue("alcher_token", ["alcher_token", "token", "access_token"]);

let refreshRequest = null;

const refreshAccessToken = async () => {
  const refresh = getTabValue("alcher_refresh_token", ["alcher_refresh_token"]);
  if (!refresh) return { invalid: true };

  if (!refreshRequest) {
    refreshRequest = fetch(`${API_BASE_URL}/api/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    })
      .then(async (response) => {
        if (response.status === 400 || response.status === 401) {
          return { invalid: true };
        }
        if (!response.ok) return { networkError: true };
        const data = await response.json().catch(() => ({}));
        if (!data.access) return { invalid: true };
        sessionStorage.setItem("alcher_token", data.access);
        if (data.refresh) sessionStorage.setItem("alcher_refresh_token", data.refresh);
        return { access: data.access };
      })
      .catch(() => ({ networkError: true }))
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
};

// Refresh an expired access token once, then retry the original request.
export const authenticatedFetch = async (url, options = {}) => {
  const requestWithToken = (token) => {
    const headers = new Headers(options.headers || {});
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(url, { ...options, headers });
  };

  const response = await requestWithToken(getAuthToken());
  if (response.status !== 401) return response;

  const refreshed = await refreshAccessToken();
  if (refreshed.access) return requestWithToken(refreshed.access);
  if (refreshed.invalid) clearAuthData();
  if (refreshed.networkError) {
    throw new Error("Could not refresh your session. Check your connection and try again.");
  }
  return response;
};

export const completeGoogleProfileApi = async (profile) => {
  const token = getAuthToken();
  if (!token)
    throw new Error("Your session expired. Please sign in with Google again.");

  let response;
  try {
    response = await authenticatedFetch(API_BASE_URL + "/api/auth/complete-profile/", {
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
    const raw = getTabValue("alcher_user", ["alcher_user", "user"]);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const setAuthData = (token, user) => {
  if (token) {
    sessionStorage.setItem("alcher_token", token);
  }
  if (user) {
    sessionStorage.setItem("alcher_user", JSON.stringify(user));
  }
  ["alcher_token", "token", "access_token", "alcher_user", "user"].forEach((key) =>
    localStorage.removeItem(key),
  );
  window.dispatchEvent(new Event("alcher-auth-changed"));
};

export const clearAuthData = () => {
  ["alcher_refresh_token", "alcher_token", "token", "access_token", "alcher_user", "user"].forEach((key) => {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  });
  window.dispatchEvent(new Event("alcher-auth-changed"));
};

export const submitUserQueryApi = async (question) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("You must be logged in to submit a query.");
  }

  const response = await authenticatedFetch(`${API_BASE_URL}/api/queries/`, {
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

  const response = await authenticatedFetch(`${API_BASE_URL}/api/queries/`, {
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

/* ========================================================
   COMPETITIONS & MODULES APIS
   ======================================================== */
/**
 * Fetches all competitions or competitions filtered by module slug.
 * Endpoint: GET /api/competitions/?module=<slug>
 */
export const fetchCompetitionsApi = async (moduleQuery = null) => {
  const normalized = moduleQuery ? moduleQuery.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() : '';
  const url = normalized
    ? `${API_BASE_URL}/api/competitions/?module=${encodeURIComponent(normalized)}`
    : `${API_BASE_URL}/api/competitions/`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load competitions (${response.status})`);
  }
  return await response.json();
};

/**
 * Fetches details for a single competition by UUID.
 * Endpoint: GET /api/competitions/<uuid>/
 */
export const fetchCompetitionDetailApi = async (competitionId) => {
  const response = await fetch(`${API_BASE_URL}/api/competitions/${competitionId}/`);
  if (!response.ok) {
    throw new Error(`Failed to load competition details (${response.status})`);
  }
  return await response.json();
};

/* ========================================================
   USER PROFILE & TEAM MANAGEMENT APIS
   ======================================================== */
/**
 * Fetches the logged-in user profile, including team_name.
 * Endpoint: GET /api/profile/
 */
export const fetchProfileApi = async () => {
  const token = getAuthToken();
  if (!token) return null;

  let response;
  try {
    response = await authenticatedFetch(`${API_BASE_URL}/api/profile/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw new Error('Could not reach the backend while loading your profile.');
  }

  if (response.status === 401) {
    clearAuthData();
    throw new Error('Your session has expired. Please log in again.');
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(getApiErrorMessage(data, 'Could not load your profile.'));
  return data;
};
export const fetchMyTeamMembersApi = async () => {
  const token = getAuthToken();
  if (!token) return [];

  let response;
  try {
    response = await authenticatedFetch(`${API_BASE_URL}/api/Participant/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw new Error('Could not reach the backend while loading team members.');
  }

  if (response.status === 401) {
    clearAuthData();
    throw new Error('Your session has expired. Please log in again.');
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(getApiErrorMessage(data, 'Could not load your team members.'));
  return Array.isArray(data) ? data : (data.results || []);
};
export const addTeamMemberApi = async (memberData) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Please log in to save team members.');
  }

  const payload = {
    name: memberData.name,
    email: memberData.email,
    phone: memberData.phone,
    gender: memberData.gender,
    collegename: memberData.collegename,
    city: memberData.city,
    state: memberData.state,
  };

  const response = await authenticatedFetch(`${API_BASE_URL}/api/Participant/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const msg =
      data.error ||
      data.detail ||
      (typeof data === 'object' && Object.values(data).flat().join(', ')) ||
      'Failed to add team member.';
    throw new Error(msg);
  }
  return data;
};

/**
 * Fetches competitions the logged-in user has already registered for.
 * Endpoint: GET /api/my-registered-competitions/
 */
export const fetchMyRegisteredCompetitionsApi = async () => {
  const token = getAuthToken();
  if (!token) return [];

  let response;
  try {
    response = await authenticatedFetch(`${API_BASE_URL}/api/my-registered-competitions/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw new Error('Could not reach the backend while checking your registrations.');
  }

  if (response.status === 401) {
    clearAuthData();
    throw new Error('Your session has expired. Please log in again.');
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(getApiErrorMessage(data, 'Could not load your registrations.'));
  return Array.isArray(data) ? data : [];
};
export const registerCompetitionApi = async (payload) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Please log in to register for this competition.');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const response = await authenticatedFetch(`${API_BASE_URL}/api/register-competition/`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      clearAuthData();
      throw new Error('Your session has expired. Please log in again.');
    }
    const errorMsg =
      data.error ||
      data.detail ||
      (typeof data === 'object' && Object.values(data).flat().join(', ')) ||
      'Failed to submit registration.';
    throw new Error(errorMsg);
  }
  return data;
};
