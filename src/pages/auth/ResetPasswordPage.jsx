import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../../api/auth.api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, KeyRound, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (!token) {
      setError('Reset token is missing. Please use the link from your email.')
      return
    }
    setLoading(true)
    try {
      await resetPassword(token, { newPassword: form.newPassword, confirmPassword: form.confirmPassword })
      setSuccess(true)
      setTimeout(() => navigate('/sign-in'), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired token')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="text-center space-y-4">
          <p className="text-zinc-400">Invalid reset link.</p>
          <Link to="/forgot-password">
            <Button className="bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-xl">
              Request a new one
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md space-y-8">
        <Link
          to="/sign-in"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Back to sign in
        </Link>

        {!success ? (
          <>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                <KeyRound size={18} className="text-amber-400" />
              </div>
              <h1
                className="text-3xl font-bold text-white tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Set new password
              </h1>
              <p className="text-zinc-500 text-sm">
                Must be at least 6 characters.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="space-y-2">
                <Label className="text-zinc-300 text-sm">New password</Label>
                <div className="relative">
                  <Input
                    type={showPass ? 'text' : 'password'}
                    name="newPassword"
                    placeholder="••••••••"
                    value={form.newPassword}
                    onChange={handleChange}
                    required
                    className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-amber-400/50 focus:ring-amber-400/20 h-11 rounded-xl pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300 text-sm">Confirm password</Label>
                <div className="relative">
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-amber-400/50 focus:ring-amber-400/20 h-11 rounded-xl pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-400 hover:bg-amber-300 text-black font-semibold h-11 rounded-xl"
              >
                {loading ? 'Updating...' : 'Reset password'}
              </Button>
            </form>
          </>
        ) : (
          <div className="bg-zinc-900 border border-white/8 rounded-2xl p-8 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 size={22} className="text-emerald-400" />
            </div>
            <div className="space-y-2">
              <h2
                className="text-xl font-bold text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Password updated
              </h2>
              <p className="text-sm text-zinc-500">
                Redirecting you to sign in...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}