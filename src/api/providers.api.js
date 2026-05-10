import {api} from './api.js'

export const getAllProviders = () => api.get('/providers')
export const getProviderById = (id) => api.get(`/providers/${id}`)
export const getProviderServices = (id) => api.get(`/providers/${id}/service`)
export const getMyProviderProfile = () => api.get('/providers/me')
export const updateMyProviderProfile = (body) => api.patch('/providers/me', body)
export const toggleAvailability = () => api.patch('/providers/me/availabiltiy')
export const addProviderService = (serviceId) => api.post('/providers/me/services', { serviceId })
export const deleteProviderService = (serviceId) => api.delete(`/providers/me/${serviceId}`)
export const verifyProvider = (id) => api.patch(`/providers/${id}/verify`)