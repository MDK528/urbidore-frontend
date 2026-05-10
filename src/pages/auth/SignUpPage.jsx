import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUp } from '@/api/auth.api'
import { Eye, EyeOff, ArrowRight, User, Briefcase } from 'lucide-react'

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  gender: 'male',
  role: 'customer',
  address: '',
  avatarUrl: '',
}

export default function SignUpPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1) // 1 = role select, 2 = form

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const selectRole = (role) => {
    setForm((prev) => ({ ...prev, role }))
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signUp(form)
      navigate('/sign-in', { state: { message: 'Account created! Check your email to verify.' } })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Sign up failed')
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
            <span className="text-2xl">✨</span>
          </div>
          <h2
            className="text-4xl font-bold text-white leading-tight tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Join thousands
            <br />
            <span className="text-amber-400">already here.</span>
          </h2>
          <p className="text-zinc-500 leading-relaxed text-sm max-w-xs">
            Whether you need a service or provide one — Urbidore is built for you.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { value: '2,400+', label: 'Verified Pros' },
            { value: '18k+', label: 'Jobs Done' },
            { value: '4.9★', label: 'Avg Rating' },
            { value: 'Free', label: 'To join' },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-zinc-800/60 border border-white/5 rounded-xl p-4 space-y-1"
            >
              <p
                className="text-xl font-bold text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {s.value}
              </p>
              <p className="text-xs text-zinc-500">{s.label}</p>
            </div>
          ))}
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

        <div className="w-full max-w-sm">

          {step === 1 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h1
                  className="text-3xl font-bold text-white tracking-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Create account
                </h1>
                <p className="text-zinc-500 text-sm">How will you be using Urbidore?</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => selectRole('customer')}
                  className="w-full group bg-zinc-900 border border-white/8 hover:border-amber-400/30 hover:bg-zinc-800 rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 text-left"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <User size={20} className="text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm">I need a service</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Book local professionals for home services</p>
                  </div>
                  <ArrowRight size={15} className="text-zinc-600 group-hover:text-amber-400 transition-colors" />
                </button>

                <button
                  onClick={() => selectRole('provider')}
                  className="w-full group bg-zinc-900 border border-white/8 hover:border-amber-400/30 hover:bg-zinc-800 rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 text-left"
                >
                  <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Briefcase size={20} className="text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm">I provide services</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Join as a professional and grow your business</p>
                  </div>
                  <ArrowRight size={15} className="text-zinc-600 group-hover:text-amber-400 transition-colors" />
                </button>
              </div>

              <p className="text-center text-sm text-zinc-500">
                Already have an account?{' '}
                <Link to="/sign-in" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-7">
              <div className="space-y-2">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 mb-1"
                >
                  ← Back
                </button>
                <h1
                  className="text-3xl font-bold text-white tracking-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {form.role === 'provider' ? 'Join as a pro' : 'Create account'}
                </h1>
                <p className="text-zinc-500 text-sm">
                  Signing up as a{' '}
                  <span className="text-amber-400 font-medium capitalize">{form.role}</span>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs">First name</Label>
                    <Input
                      name="firstName"
                      placeholder="John"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-amber-400/30 focus-visible:border-amber-400/40 h-10 rounded-xl text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs">Last name</Label>
                    <Input
                      name="lastName"
                      placeholder="Doe"
                      value={form.lastName}
                      onChange={handleChange}
                      className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-amber-400/30 focus-visible:border-amber-400/40 h-10 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs">Email</Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-amber-400/30 focus-visible:border-amber-400/40 h-10 rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs">Phone</Label>
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="+1 555 000 0000"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-amber-400/30 focus-visible:border-amber-400/40 h-10 rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs">Address</Label>
                  <Input
                    name="address"
                    placeholder="123 Main St, City"
                    value={form.address}
                    onChange={handleChange}
                    className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-amber-400/30 focus-visible:border-amber-400/40 h-10 rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs">Gender</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['male', 'female'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, gender: g }))}
                        className={`h-10 rounded-xl border text-sm font-medium capitalize transition-all ${
                          form.gender === g
                            ? 'bg-amber-400/10 border-amber-400/40 text-amber-400'
                            : 'bg-zinc-900 border-white/10 text-zinc-400 hover:border-white/20'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-400 text-xs">Password</Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPass ? 'text' : 'password'}
                      placeholder="Min. 6 characters"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-amber-400/30 focus-visible:border-amber-400/40 h-10 rounded-xl text-sm pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
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
                  className="w-full bg-amber-400 hover:bg-amber-300 text-black font-semibold h-11 rounded-xl gap-2 disabled:opacity-50 mt-1"
                >
                  {loading ? 'Creating account...' : (
                    <>Create account <ArrowRight size={15} /></>
                  )}
                </Button>
              </form>

              <p className="text-center text-xs text-zinc-600 leading-relaxed">
                By creating an account you agree to our{' '}
                <a href="#" className="text-zinc-400 hover:text-white transition-colors">Terms</a>
                {' '}and{' '}
                <a href="#" className="text-zinc-400 hover:text-white transition-colors">Privacy Policy</a>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}