const API_BASE_URL = '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export const apiUtils = {
  // Auth
  login: (formData) =>
    request('/login', {
      method: 'POST',
      body: JSON.stringify(formData),
    }),

  signUp: (formData) =>
    request('/signUp', {
      method: 'POST',
      body: JSON.stringify(formData),
    }),

  logout: () => request('/logout', { method: 'POST' }),

  checkAuth: () => request('/checkAuth', { method: 'GET' }),

  forgotPassword: (formData) =>
    request('/forgotPassword', {
      method: 'POST',
      body: JSON.stringify(formData),
    }),

  resetPassword: (token, formData) =>
    request('/resetPassword', {
      method: 'POST',
      body: JSON.stringify({ token, ...formData }),
    }),

  verifyEmail: (code) =>
    request('/verifyEmail', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),

  resendVerificationEmail: (email) =>
    request('/resendVerification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  // API Keys
  listApiKeys: () => request('/', { method: 'GET' }),

  createApiKey: (formData) =>
    request('/', {
      method: 'POST',
      body: JSON.stringify(formData),
    }),

  deleteApiKey: (keyId) => request(`/${keyId}`, { method: 'DELETE' }),

  getApiKeyUsage: (keyId) => request(`/${keyId}/usage`, { method: 'GET' }),

  // Rate limit check
  checkRateLimit: (apiKey, identifier) =>
    request('/check', {
      method: 'POST',
      headers: { 'x-api-key': apiKey },
      body: JSON.stringify({ identifier }),
    }),
};

export default apiUtils;