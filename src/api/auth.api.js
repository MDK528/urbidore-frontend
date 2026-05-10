import {api} from './api.js'

export const signUp = (body) => api.post('/auth/sign-up', body)
export const signIn = async (body) => {
  const res = await api.post('/auth/sign-in', body)
  localStorage.setItem('accessToken', res.data.data.accessToken)
  return res.data
}
export const signOut = () => api.post('/auth/sign-out')
export const getMe = () => api.get('/auth/get-me')
export const forgotPassword = (body) => api.post('/auth/forgot-password', body)
export const resetPassword = (token, body) => api.patch(`/auth/reset-password?token=${token}`, body)
export const verifyEmail = (token) => api.patch(`/auth/verify-email?token=${token}`)
export const refreshAccessToken = () => api.post('/auth/refresh-accesstoken')