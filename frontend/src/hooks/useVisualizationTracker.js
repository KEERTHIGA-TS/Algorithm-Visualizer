// src/hooks/useVisualizationTracker.js - USE historyStore
import { useHistoryStore } from "../store/historyStore";
import { useAuthStore } from "../store/authStore";

export const useVisualizationTracker = () => {
  const saveHistory = useHistoryStore((state) => state.saveHistory);
  const token = useAuthStore((state) => state.token);

  const trackVisualization = async (payload) => {
    if (!token) {
      console.warn("User not logged in. Skipping history save.");
      return;
    }

    await saveHistory(payload); // ✅ Uses historyStore's auto-refresh
  };

  return { trackVisualization };
};
