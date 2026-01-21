import axios from 'axios'

const API_URL = 'http://localhost:8000/api/v1'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken')
  if (token && config.url.includes('/admin/')) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const getServices = () => api.get('/services/listing')
export const getServiceTypes = () => api.get('/services/types')

export const createBooking = (data) => api.post('/bookings/create', data)
export const getBookings = () => api.get('/bookings/listing')

export const adminLogin = (data) => api.post('/admin/login', data)
export const getAdminBookings = () => api.get('/admin/bookings')
export const getBookingStats = () => api.get('/admin/bookings/stats')
export const updateBookingStatus = (id, status) => api.put(`/admin/bookings/${id}/status`, { status })

export default api