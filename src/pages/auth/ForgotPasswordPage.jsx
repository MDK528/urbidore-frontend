import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../../api/auth.api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await forgotPassword({ email })
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
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

        {!sent ? (
          <>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                <Mail size={18} className="text-amber-400" />
              </div>
              <h1
                className="text-3xl font-bold text-white tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Forgot password?
              </h1>
              <p className="text-zinc-500 text-sm leading-relaxed">
                No worries. Enter your email and we'll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-zinc-300 text-sm">Email address</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  required
                  className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-amber-400/50 focus:ring-amber-400/20 h-11 rounded-xl"
                />
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
                {loading ? 'Sending...' : 'Send reset link'}
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
                Check your inbox
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed">
                We sent a reset link to{' '}
                <span className="text-white font-medium">{email}</span>.
                It expires in 10 minutes.
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => setSent(false)}
              className="text-zinc-400 hover:text-white hover:bg-white/5 text-sm rounded-xl w-full"
            >
              Didn't get it? Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}