import {api} from './api.js'

export const getAllCategories = () => api.get('/categories')
export const getCategoryById = (id) => api.get(`/categories/${id}`)
export const createCategory = (body) => api.post('/categories', body)
export const updateCategory = (id, body) => api.patch(`/categories/${id}`, body)
export const deleteCategory = (id) => api.delete(`/categories/${id}`)