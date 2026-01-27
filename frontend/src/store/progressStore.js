// ============================================
// frontend/src/store/progressStore.js
// ============================================
import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./authStore";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/progress`;

export const useProgressStore = create((set) => ({
  // State
  progress: {
    totals: { visualizationsCompleted: 0, totalTimeSpent: 0 },
    categories: { sorting: 0, graphs: 0, structures: 0 },
    algorithms: {}
  },
  detailedStats: null,
  loading: false,
  error: null,

  // ============================================
  // Fetch Progress
  // ============================================
  fetchProgress: async () => {
    const token = useAuthStore.getState().token;
    set({ loading: true, error: null });
    
    try {
      const res = await axios.get(`${API_URL}/progress`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set({ 
        progress: res.data,
        loading: false 
      });
    } catch (err) {
      console.error("Fetch progress error:", err);
      set({ 
        loading: false,
        error: err.response?.data?.message || "Failed to fetch progress" 
      });
    }
  },

  // ============================================
  // Fetch Detailed Stats
  // ============================================
  fetchDetailedStats: async () => {
    const token = useAuthStore.getState().token;
    set({ loading: true, error: null });
    
    try {
      const res = await axios.get(`${API_URL}/progress/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set({ 
        detailedStats: res.data,
        loading: false 
      });
    } catch (err) {
      console.error("Fetch detailed stats error:", err);
      set({ 
        loading: false,
        error: err.response?.data?.message || "Failed to fetch stats" 
      });
    }
  },

  // ============================================
  // Clear Error
  // ============================================
  clearError: () => set({ error: null })
}));