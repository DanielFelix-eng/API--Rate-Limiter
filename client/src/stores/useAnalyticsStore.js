import { create } from 'zustand';
import { useKeysStore } from './useKeysStore';

const useAnalyticsStore = create((set, get) => ({
  trendData: [],
  keyComparisonData: [],
  loading: false,

  fetchAnalytics: async () => {
    set({ loading: true });
    try {
      const { keys, usageByKeyId, fetchKeys, fetchUsage } = useKeysStore.getState();
      
      if (keys.length === 0) {
        await fetchKeys();
      }

      // Fetch usage for all active keys
      const activeKeys = keys.filter((k) => k.active);
      await Promise.all(activeKeys.map((key) => {
        if (!usageByKeyId[key._id]) {
          return fetchUsage(key._id);
        }
      }));

      // Generate trend data (mock 12 months since backend only has monthly aggregates)
      const totalUsage = Object.values(usageByKeyId).reduce((sum, u) => sum + (u?.count || 0), 0);
      const avgMonthly = totalUsage / 12 || 0;
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      const trend = months.map((month) => ({
        month,
        requests: Math.round(avgMonthly * (0.5 + Math.random() * 1.2)),
      }));

      // Key comparison - top 10 keys by usage
      const comparison = activeKeys
        .map((key) => ({
          name: key.name || `Key ${key._id.slice(-6)}`,
          requests: usageByKeyId[key._id]?.count || 0,
          capacity: key.capacity,
          refillRate: key.refillRate,
        }))
        .sort((a, b) => b.requests - a.requests)
        .slice(0, 10);

      set({ trendData: trend, keyComparisonData: comparison, loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
    }
  },
}));

export default useAnalyticsStore;
export { useAnalyticsStore };