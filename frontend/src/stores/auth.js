import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router'  

const API_URL = 'http://localhost:8000/api'

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

        // Save token locally
        localStorage.setItem('token', this.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

        await router.push('/dashboard')
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

        await router.push('/dashboard')
        return { success: true }
      } catch (error) {
        const message =
          error.response?.data?.detail ||
          error.response?.data?.error ||
          'Registration failed'
        return { success: false, error: message }
      }
    },

    // ✅ LOGOUT
    async logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false

      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']

      await router.push('/login')
    },

    // ✅ CHECK AUTH (on reload)
    checkAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
        this.isAuthenticated = true
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } else {
        this.isAuthenticated = false
      }
    },
  },
})
