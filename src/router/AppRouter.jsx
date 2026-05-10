import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import LandingPage from '@/pages/LandingPage'
import SignInPage from '@/pages/auth/SignInPage'
import SignUpPage from '@/pages/auth/SignUpPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage'
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage'
import CustomerDashboard from '@/pages/customer/DashboadrdPage'
import CustomerProfilePage from '@/pages/customer/ProfilePage'
import CustomerBookingsPage from '@/pages/customer/BookingPages'
import ProviderDashboard from '@/pages/provider/DashboadrdPage'
import ProviderProfilePage from '@/pages/provider/ProfilePage'
import ProviderDetailPage from '@/pages/ProviderDetailPage'
import ProviderBookingsPage from '@/pages/provider/BookingPages'
import AdminDashboard from '@/pages/admin/DashboadrdPage'
import AdminBookingsPage from '@/pages/admin/BookingsPage'
import BrowseProvidersPage from '@/pages/BrowseProvidersPage'


const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="h-screen flex items-center justify-center text-sm text-zinc-400">Loading...</div>
  if (!user) return <Navigate to="/sign-in" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to={getDashboard(user.role)} replace />
  return children
}

const getDashboard = (role) => {
  if (role === 'provider') return '/provider/dashboard'
  if (role === 'admin') return '/admin'
  return '/dashboard'
}

const AppRouter = () => (
  <BrowserRouter>
    <Routes>

      <Route path="/" element={<LandingPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/providers" element={<BrowseProvidersPage />} />
      <Route path="/providers/:id" element={<ProviderDetailPage />} />
      
      <Route path="/sign-in" element={<GuestRoute><SignInPage /></GuestRoute>} />
      <Route path="/sign-up" element={<GuestRoute><SignUpPage /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />

      <Route path="/dashboard" element={<ProtectedRoute roles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
      <Route path="/dashboard/profile" element={<ProtectedRoute roles={['customer']}><CustomerProfilePage /></ProtectedRoute>}/>
      <Route path="/provider/dashboard" element={<ProtectedRoute roles={['provider']}><ProviderDashboard /></ProtectedRoute>} />
      <Route path="/provider/profile" element={<ProtectedRoute roles={['provider']}><ProviderProfilePage /></ProtectedRoute>}/>
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/bookings" element={<ProtectedRoute roles={['admin']}><AdminBookingsPage /></ProtectedRoute>} />
      <Route path="/dashboard/bookings" element={<ProtectedRoute roles={['customer']}><CustomerBookingsPage /></ProtectedRoute>} />
      <Route path="/provider/bookings" element={<ProtectedRoute roles={['provider']}><ProviderBookingsPage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
)

export default AppRouter