import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn, getMe } from '@/api/auth.api'
import { useAuth } from '@/context/AuthContext'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function SignInPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const getDashboard = (role) => {
    if (role === 'provider') return '/provider/dashboard'
    if (role === 'admin') return '/admin'
    return '/dashboard'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await signIn(form)
      const me = await getMe()
      login(me.data.data, res.data.accessToken)
      navigate(getDashboard(me.data.data.role))
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">

      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-zinc-900 border-r border-white/5 p-12">
        <Link to="/">
          <span
            className="text-xl font-bold text-white tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            urbi<span className="text-amber-400">dore</span>
          </span>
        </Link>

        <div className="space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
            <span className="text-2xl">🏠</span>
          </div>
          <h2
            className="text-4xl font-bold text-white leading-tight tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Your home,
            <br />
            <span className="text-amber-400">handled.</span>
          </h2>
          <p className="text-zinc-500 leading-relaxed text-sm max-w-xs">
            Connect with trusted local professionals for any home service.
            Fast booking, verified pros, guaranteed quality.
          </p>
        </div>

        <div className="bg-zinc-800/60 border border-white/5 rounded-2xl p-5 space-y-3">
          <p className="text-sm text-zinc-300 leading-relaxed">
            "Urbidore made it so easy to find a reliable plumber within the hour.
            Absolutely brilliant platform."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-sm">
              👩🏽
            </div>
            <div>
              <p className="text-xs font-medium text-white">Priya M.</p>
              <p className="text-xs text-zinc-500">Customer · London</p>
            </div>
          </div>
        </div>
      </div>


      <div className="flex-1 flex flex-col justify-center items-center px-6 py-16">

        <div className="lg:hidden mb-10">
          <Link to="/">
            <span
              className="text-xl font-bold text-white tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              urbi<span className="text-amber-400">dore</span>
            </span>
          </Link>
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <h1
              className="text-3xl font-bold text-white tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Welcome back
            </h1>
            <p className="text-zinc-500 text-sm">
              Sign in to your Urbidore account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-400 text-sm">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-amber-400/30 focus-visible:border-amber-400/40 h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-400 text-sm">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-amber-400/30 focus-visible:border-amber-400/40 h-11 rounded-xl pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-300 text-black font-semibold h-11 rounded-xl gap-2 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : (
                <>Sign in <ArrowRight size={15} /></>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-500">
            Don't have an account?{' '}
            <Link to="/sign-up" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}