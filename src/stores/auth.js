import { defineStore } from 'pinia'
import api from '../services/api'
import router from '../router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    error: null,
    isLoading: false,
  }),

  actions: {
    async login(email, password) {
      this.error = null
      this.isLoading = true

      try {
        const res = await api.post('/auth/login', {
          email,
          password,
        })

        this.token = res.data.token
        this.user = res.data.user

        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))

        router.push('/')
        return true
      } catch (err) {
        if (err.response?.data?.message) {
          this.error = err.response.data.message
        } else {
          this.error = 'Tidak dapat terhubung ke server'
        }

        return false
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.error = null

      localStorage.removeItem('token')
      localStorage.removeItem('user')

      router.push('/login')
    },
  },
})
