import { useNavigate } from 'react-router-dom';

const apiUtils = {
  signUp: async (formData) => {
    const response = await fetch('/api/signUp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      credentials: 'include',
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Sign up failed');
    }
    return data;
  },

  login: async (formData) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      credentials: 'include',
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  },

  verifyEmail: async (code) => {
    const response = await fetch('/api/verifyEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
      credentials: 'include',
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Verification failed');
    }
    return data;
  },

  forgotPassword: async (formData) => {
    const response = await fetch('/api/forgotPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      credentials: 'include',
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Password reset request failed');
    }
    return data;
  },

  resetPassword: async (token, formData) => {
    const response = await fetch(`/api/resetPassword?token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      }),
      credentials: 'include',
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Password reset failed');
    }
    return data;
  },

  googleAuth: async () => {
    // This would typically redirect to Google OAuth
    // For now, we'll simulate it by navigating to a Google auth page
    window.location.href = 'https://accounts.google.com/o/oauth2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:5173/google-auth&response_type=code&scope=openid email profile';
  }
};

export default apiUtils;