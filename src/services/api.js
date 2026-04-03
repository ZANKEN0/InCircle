import axios from 'axios'

const DEFAULT_API_URL = 'http://localhost:3000/api'

export const API_BASE_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_URL).replace(/\/$/, '')
export const UPLOAD_BASE_URL = `${API_BASE_URL.replace(/\/api$/, '')}/uploads`

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }

    return Promise.reject(error)
  },
)

export default api
