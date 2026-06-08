import axios, { AxiosError } from 'axios'
import API_ENDPOINTS from '@/utils/api'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.error('Unauthorized')
    }
    return Promise.reject(error)
  }
)

export default api
