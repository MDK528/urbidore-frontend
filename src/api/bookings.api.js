import {api} from './api.js'

export const createBooking = (body) => api.post('/bookings', body)
export const getBookings = () => api.get('/bookings')
export const getBookingById = (id) => api.get(`/bookings/${id}`)
export const updateBookingStatus = (id, status) => api.patch(`/bookings/${id}/status`, { status })