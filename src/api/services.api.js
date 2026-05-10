import {api} from './api.js'

export const getAllServices = () => api.get('/services')
export const getServiceById = (id) => api.get(`/services/${id}`)
export const createService = (body) => api.post('/services', body)
export const updateService = (id, body) => api.patch(`/services/${id}`, body)
export const deleteService = (id) => api.delete(`/services/${id}`)