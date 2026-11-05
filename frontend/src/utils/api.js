export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// Configurable login route / URL (can be customized via REACT_APP_LOGIN_URL)
export const LOGIN_URL = process.env.REACT_APP_LOGIN_URL || '/login';

export const redirectToLogin = (returnAnchor = '#faqs') => {
  const currentPath = window.location.pathname + window.location.search + (returnAnchor || '');
  const destination = LOGIN_URL.includes('?')
    ? `${LOGIN_URL}&redirect=${encodeURIComponent(currentPath)}`
    : `${LOGIN_URL}?redirect=${encodeURIComponent(currentPath)}`;
  window.location.href = destination;
};

export const getAuthToken = () => {
  return localStorage.getItem('alcher_token') || localStorage.getItem('token') || localStorage.getItem('access_token') || null;
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('alcher_user') || localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const setAuthData = (token, user) => {
  if (token) {
    localStorage.setItem('alcher_token', token);
  }
  if (user) {
    localStorage.setItem('alcher_user', JSON.stringify(user));
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('alcher_token');
  localStorage.removeItem('token');
  localStorage.removeItem('access_token');
  localStorage.removeItem('alcher_user');
  localStorage.removeItem('user');
};

/**
 * Resolves media URLs returned by the backend.
 * Prepend API_BASE_URL for relative /media/ paths.
 */
export const getMediaUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/assets/')) return url;
  if (url.startsWith('/media/')) return `${API_BASE_URL}${url}`;
  return `${API_BASE_URL}/media/${url.replace(/^\/+/, '')}`;
};

/* ========================================================
   QUERIES APIS
   ======================================================== */
export const submitUserQueryApi = async (question) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('You must be logged in to submit a query.');
  }

  const response = await fetch(`${API_BASE_URL}/api/queries/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ question }),
  });

  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401) {
      clearAuthData();
      throw new Error('Your session has expired. Please log in again.');
    }
    const errorMsg = data.detail || (data.question && data.question[0]) || 'Failed to submit query.';
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
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthData();
    }
    throw new Error('Failed to fetch queries.');
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
  const normalized = moduleQuery ? moduleQuery.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : '';
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

  try {
    const response = await fetch(`${API_BASE_URL}/api/profile/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthData();
      }
      return null;
    }
    return await response.json();
  } catch (err) {
    console.info('Could not reach profile endpoint:', err.message);
    return null;
  }
};

/**
 * Fetches the logged-in user's saved team members from backend.
 * Endpoint: GET /api/Participant/
 */
export const fetchMyTeamMembersApi = async () => {
  const token = getAuthToken();
  if (!token) return [];

  try {
    const response = await fetch(`${API_BASE_URL}/api/Participant/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthData();
      }
      return [];
    }
    const data = await response.json();
    return Array.isArray(data) ? data : (data.results || []);
  } catch (err) {
    console.info('Could not reach Participant endpoint:', err.message);
    return [];
  }
};

/**
 * Adds a new team member to the user's team in the database.
 * Endpoint: POST /api/Participant/
 */
export const addTeamMemberApi = async (memberData) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Please log in to save team members.');
  }

  const payload = {
    name: memberData.name,
    email: memberData.email,
    phone: memberData.phone,
    gender: memberData.gender || 'M',
    collegename: memberData.collegename || 'Alcheringa Participant College',
    city: memberData.city || 'Guwahati',
    state: memberData.state || 'Assam',
  };

  const response = await fetch(`${API_BASE_URL}/api/Participant/`, {
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

  try {
    const response = await fetch(`${API_BASE_URL}/api/my-registered-competitions/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];
  }
};

/**
 * Registers a team for a competition.
 * Endpoint: POST /api/register-competition/
 *
 * Payload:
 * {
 *   competition_id: string,
 *   team_members: string[], // list of member names matched against user.team.members
 *   team_video: string,     // performance URL
 *   description: string     // video description
 * }
 */
export const registerCompetitionApi = async (payload) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Please log in to register for this competition.');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const response = await fetch(`${API_BASE_URL}/api/register-competition/`, {
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
