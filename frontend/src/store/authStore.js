// ============================================
// frontend/src/store/authStore.js
// ✅ FIXED: Proper token and user handling
// ============================================
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      loading: false,
      error: null,

      // ============================================
      // REGISTER
      // ============================================
      register: async (name, email, password) => {
        set({ loading: true, error: null });
        
        try {
          const res = await axios.post(`${API_URL}/register`, {
            name,
            email,
            password
          });

          // ✅ After successful registration, auto-login
          const { user, token } = res.data;

          set({
            user,
            token,
            loading: false,
            error: null
          });

          return true;
        } catch (error) {
          const errorMessage = 
            error.response?.data?.message || 
            'Registration failed';
          
          set({
            loading: false,
            error: errorMessage
          });

          return false;
        }
      },

      // ============================================
      // LOGIN
      // ============================================
      login: async (email, password) => {
        set({ loading: true, error: null });
        
        try {
          const res = await axios.post(`${API_URL}/login`, {
            email,
            password
          });

          const { user, token } = res.data;

          set({
            user,
            token,
            loading: false,
            error: null
          });

          return true;
        } catch (error) {
          const errorMessage = 
            error.response?.data?.message || 
            'Login failed';
          
          set({
            loading: false,
            error: errorMessage
          });

          return false;
        }
      },

      // ============================================
      // LOGOUT
      // ============================================
      logout: () => {
        set({
          user: null,
          token: null,
          loading: false,
          error: null
        });
      },

      // ============================================
      // CLEAR ERROR
      // ============================================
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token
      })
    }
  )
);