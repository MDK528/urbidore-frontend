import { api } from './api'

export const adminGetCategories = () => api.get('/admin/categories')
export const adminCreateCategory = (body) => api.post('/admin/categories', body)
export const adminUpdateCategory = (id, body) => api.patch(`/admin/categories/${id}`, body)
export const adminDeleteCategory = (id) => api.delete(`/admin/categories/${id}`)

export const adminGetServices = () => api.get('/admin/services')
export const adminCreateService = (body) => api.post('/admin/services', body)
export const adminUpdateService = (id, body) => api.patch(`/admin/services/${id}`, body)
export const adminDeleteService = (id) => api.delete(`/admin/services/${id}`)

export const adminGetBookings = () => api.get('/admin/bookings')
export const adminForceCancelBooking = (id) => api.patch(`/admin/bookings/${id}/cancel`)

export const adminVerifyProvider = (id) => api.patch(`/admin/providers/${id}/verify`)