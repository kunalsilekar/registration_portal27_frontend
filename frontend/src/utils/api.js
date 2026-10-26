const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

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
