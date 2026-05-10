import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { verifyEmail } from '../../api/auth.api'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Verification token is missing.')
      return
    }

    verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error')
        setMessage(err.response?.data?.message || 'Invalid or expired token.')
      })
  }, [token])

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="bg-zinc-900 border border-white/8 rounded-2xl p-10 text-center space-y-6">

          {status === 'loading' && (
            <>
              <div className="w-12 h-12 rounded-full bg-zinc-800 border border-white/8 flex items-center justify-center mx-auto">
                <Loader2 size={22} className="text-zinc-400 animate-spin" />
              </div>
              <div className="space-y-2">
                <h2
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Verifying your email
                </h2>
                <p className="text-sm text-zinc-500">Hold on a moment...</p>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 size={22} className="text-emerald-400" />
              </div>
              <div className="space-y-2">
                <h2
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Email verified
                </h2>
                <p className="text-sm text-zinc-500">
                  Your account is now active. You can sign in.
                </p>
              </div>
              <Link to="/sign-in">
                <Button className="bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-xl w-full h-11">
                  Go to sign in
                </Button>
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                <XCircle size={22} className="text-red-400" />
              </div>
              <div className="space-y-2">
                <h2
                  className="text-xl font-bold text-white"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Verification failed
                </h2>
                <p className="text-sm text-zinc-500">{message}</p>
              </div>
              <Link to="/sign-up">
                <Button className="bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-xl w-full h-11">
                  Back to sign up
                </Button>
              </Link>
            </>
          )}

        </div>

        <div className="text-center mt-8">
          <Link
            to="/"
            className="text-lg font-bold text-white tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            urbi<span className="text-amber-400">dore</span>
          </Link>
        </div>
      </div>
    </div>
  )
}