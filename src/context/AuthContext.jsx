import { createContext, useContext, useEffect, useState } from 'react'
import { getMe, signOut as apiSignOut, refreshAccessToken } from '../api/auth.api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token =localStorage.getItem('accessToken')

    const initializeAuth = async () => {
      try {
        if (!token) {
          await refreshAccessToken()
        }

        const res = await getMe()

        setUser(res.data.data)
      } catch {
          localStorage.removeItem('accessToken')

          setUser(null)
      } finally {
          setLoading(false)
      }
    }

    if (window.location.pathname !== '/sign-in' && window.location.pathname !== '/sign-up') {
      initializeAuth()
    } else {
      setLoading(false)
    }
}, [])

  const login = (userData, token) => {
    localStorage.setItem('accessToken', token)
    setUser(userData)
  }

  const logout = async () => {
    try { await apiSignOut() } catch (_) {}
    localStorage.removeItem('accessToken')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}