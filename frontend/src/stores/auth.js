// src/stores/auth.js
import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated,
  },

  actions: {
    // ✅ LOGIN
    async login(credentials) {
      try {
        const { data } = await axios.post(`${API_URL}/auth/login/`, credentials)

        this.token = data.access
        this.user = data.user
        this.isAuthenticated = true

        localStorage.setItem('token', this.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

        return { success: true }
      } catch (error) {
        const message =
          error.response?.data?.detail ||
          error.response?.data?.error ||
          'Login failed'
        return { success: false, error: message }
      }
    },

    // ✅ REGISTER
    async register(userData) {
      try {
        const { data } = await axios.post(`${API_URL}/auth/register/`, userData)

        this.token = data.access
        this.user = data.user
        this.isAuthenticated = true

        localStorage.setItem('token', this.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

        return { success: true }
      } catch (error) {
        const message =
          error.response?.data?.username?.[0] ||
          error.response?.data?.email?.[0] ||
          error.response?.data?.error ||
          'Registration failed'
        return { success: false, error: message }
      }
    },

    // ✅ LOGOUT
    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']

      // Do redirect in the component that calls logout:
      // const router = useRouter(); router.push('/auth/login')
    },

    // ✅ CHECK AUTH STATE (call once at app boot)
    checkAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
        this.isAuthenticated = true
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        this.fetchUser().catch(() => {})
      } else {
        this.isAuthenticated = false
        this.user = null
        delete axios.defaults.headers.common['Authorization']
      }
    },

    // 🔹 Load current user profile from backend
    async fetchUser() {
      if (!this.token) return
      try {
        // Adjust URL to your backend: /auth/profile/ or /auth/me/ etc.
        const { data } = await axios.get(`${API_URL}/auth/profile/`)
        this.user = data
        return { success: true }
      } catch (error) {
        console.error('Failed to fetch user profile', error)
        return { success: false }
      }
    },

    // 🔹 Update profile (name, email)
    async updateProfile(payload) {
      try {
        // Adjust URL + payload according to your backend
        const { data } = await axios.put(`${API_URL}/auth/profile/`, payload)
        this.user = data
        return { success: true }
      } catch (error) {
        const message =
          error.response?.data?.detail ||
          error.response?.data?.error ||
          'Failed to update profile'
        return { success: false, error: message }
      }
    },

    // 🔹 Change password
    async changePassword({ currentPassword, newPassword }) {
      try {
        // Adjust URL + field names according to backend
        await axios.post(`${API_URL}/auth/change-password/`, {
          current_password: currentPassword,
          new_password: newPassword,
        })
        return { success: true }
      } catch (error) {
        const message =
          error.response?.data?.detail ||
          error.response?.data?.error ||
          'Failed to update password'
        return { success: false, error: message }
      }
    },
  },
})