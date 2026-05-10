import {api} from './api.js'

export const createReview = (body) => api.post('/reviews', body)
export const getProviderReviews = (providerId) => api.get(`/reviews/provider/${providerId}`)