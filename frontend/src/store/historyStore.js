// ============================================
// frontend/src/store/historyStore.js - UPDATED
// ============================================
import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./authStore";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/history`;

export const useHistoryStore = create((set, get) => ({
  recentHistory: [],
  allHistory: [],
  currentReplay: null, // ✅ NEW
  stats: { 
    total: 0, 
    avgSpeed: 0, 
    topAlgo: "None", 
    categories: [] 
  },
  loading: false,
  error: null,

  fetchHistory: async () => {
    const token = useAuthStore.getState().token;
    set({ loading: true, error: null });
    
    try {
      const [resRecent, resStats] = await Promise.all([
        axios.get(`${API_URL}/history/recent`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/history/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      set({
        recentHistory: resRecent.data.recentHistory || [],
        stats: resStats.data,
        loading: false
      });
    } catch (err) {
      console.error("Fetch history error:", err);
      set({ 
        recentHistory: [], 
        stats: { total: 0, avgSpeed: 0, topAlgo: "None", categories: [] },
        loading: false,
        error: err.response?.data?.message || "Failed to fetch history"
      });
    }
  },

  // ✅ NEW: Get specific history for replay
  getHistoryForReplay: async (id) => {
    const token = useAuthStore.getState().token;
    set({ loading: true, error: null });
    
    try {
      const res = await axios.get(`${API_URL}/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({
        currentReplay: res.data.history,
        loading: false
      });
      
      return res.data.history;
    } catch (err) {
      console.error("Get history for replay error:", err);
      set({ 
        loading: false,
        error: err.response?.data?.message || "Failed to fetch replay data"
      });
      return null;
    }
  },

  saveHistory: async (historyData) => {
    const token = useAuthStore.getState().token;
    
    try {
      await axios.post(`${API_URL}/history`, historyData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      get().fetchHistory();
      console.log("✅ History saved & dashboard refreshed");
    } catch (err) {
      console.error("Save history error:", err);
      set({ 
        error: err.response?.data?.message || "Failed to save history" 
      });
    }
  },

  clearError: () => set({ error: null })
}));