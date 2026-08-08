import { create } from 'zustand';
import apiUtils from '../utils/apiUtils';

const useKeysStore = create((set, get) => ({
  keys: [],
  loading: false,
  error: null,
  usageByKeyId: {},

  fetchKeys: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiUtils.listApiKeys();
      set({ keys: Array.isArray(data) ? data : [], loading: false });
    } catch (err) {
      set({ error: err.message, keys: [], loading: false });
    }
  },

  createKey: async (formData) => {
    set({ loading: true, error: null });
    try {
      const data = await apiUtils.createApiKey(formData);
      const normalizedKey = { ...data, _id: data._id || data.id };
      set((state) => ({
        keys: [normalizedKey, ...state.keys],
        loading: false,
      }));
      return normalizedKey;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  revokeKey: async (keyId) => {
    set({ loading: true, error: null });
    try {
      await apiUtils.deleteApiKey(keyId);
      set((state) => {
        const nextUsage = { ...state.usageByKeyId };
        delete nextUsage[keyId];
        return {
          keys: state.keys.filter((k) => k._id !== keyId),
          usageByKeyId: nextUsage,
          loading: false,
        };
      });
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  fetchUsage: async (keyId) => {
    try {
      const data = await apiUtils.getApiKeyUsage(keyId);
      set((state) => ({
        usageByKeyId: { ...state.usageByKeyId, [keyId]: data },
      }));
      return data;
    } catch (err) {
      set({ error: err.message });
      throw err;
    }
  },
}));

export default useKeysStore;
export { useKeysStore };