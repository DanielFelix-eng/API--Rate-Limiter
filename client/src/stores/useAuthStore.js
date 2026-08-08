import { create } from 'zustand';
import apiUtils from '../utils/apiUtils';

const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,

  fetchUser: async () => {
    try {
      const data = await apiUtils.checkAuth();
      set({ user: data.user || data, error: null });
    } catch {
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  login: async (formData) => {
    const data = await apiUtils.login(formData);
    set({ user: data.user || data });
    return data;
  },

  signup: async (formData) => {
    const data = await apiUtils.signUp(formData);
    return data;
  },

  logout: async () => {
    await apiUtils.logout();
    set({ user: null });
  },

  verifyEmail: async (code) => {
    return apiUtils.verifyEmail(code);
  },

  resendVerificationEmail: async (email) => {
    return apiUtils.resendVerificationEmail(email);
  },

  forgotPassword: async (formData) => {
    return apiUtils.forgotPassword(formData);
  },

  resetPassword: async (token, formData) => {
    return apiUtils.resetPassword(token, formData);
  },
}));

export default useAuthStore;
export { useAuthStore };