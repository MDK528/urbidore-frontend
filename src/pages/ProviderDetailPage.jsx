import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProviderById, getProviderServices } from '../api/providers.api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  MapPin,
  Star,
  Wrench,
  ShieldCheck,
  ShieldX,
  Clock,
  Loader2,
  Mail,
  Phone,
} from 'lucide-react'


function Skeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="bg-zinc-900 border border-white/6 rounded-2xl p-8 space-y-5">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-full bg-zinc-800 shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-zinc-800 rounded-full w-48" />
            <div className="h-3.5 bg-zinc-800 rounded-full w-32" />
            <div className="h-3 bg-zinc-800 rounded-full w-24" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-zinc-800 rounded-full w-full" />
          <div className="h-3 bg-zinc-800 rounded-full w-4/5" />
          <div className="h-3 bg-zinc-800 rounded-full w-3/5" />
        </div>
      </div>
    </div>
  )
}

function ServiceCard({ service }) {
  return (
    <div className="bg-zinc-900 border border-white/6 rounded-xl p-4 flex items-center gap-3 hover:border-amber-400/20 transition-all duration-150">
      <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
        <Wrench size={15} className="text-amber-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{service.serviceName}</p>
        {service.serviceDescription && (
          <p className="text-xs text-zinc-500 truncate mt-0.5">{service.serviceDescription}</p>
        )}
      </div>
      {service.servicePrice && (
        <span className="text-sm font-semibold text-white shrink-0">
          ${service.servicePrice}
        </span>
      )}
    </div>
  )
}

export default function ProviderDetailPage() {
  const { id } = useParams()

  const [provider, setProvider] = useState(null)
  const [services, setServices] = useState([])
  const [loadingProvider, setLoadingProvider] = useState(true)
  const [loadingServices, setLoadingServices] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    getProviderById(id)
      .then((res) => setProvider(res.data.data))
      .catch(() => setError('Provider not found.'))
      .finally(() => setLoadingProvider(false))

    getProviderServices(id)
      .then((res) => {
        const data = res.data.data
        setServices(Array.isArray(data) ? data : data ? [data] : [])
      })
      .catch(() => setServices([]))
      .finally(() => setLoadingServices(false))
  }, [id])

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="text-lg font-bold text-white tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            urbi<span className="text-amber-400">dore</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/sign-in">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl">
                Sign in
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button size="sm" className="bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-full px-5">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        <Link
          to="/providers"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back to providers
        </Link>

        {error && (
          <div className="bg-red-400/10 border border-red-400/20 rounded-2xl px-5 py-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {loadingProvider && !error && <Skeleton />}

        {!loadingProvider && provider && (
          <div className="space-y-6">

            <div className="bg-zinc-900 border border-white/6 rounded-2xl p-8 space-y-6">

              <div className="flex flex-col sm:flex-row items-start gap-5">

                <div className="w-20 h-20 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-2xl font-bold text-white shrink-0">
                  {provider.firstName?.[0]}{provider.lastName?.[0]}
                </div>


                <div className="flex-1 min-w-0 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1
                        className="text-2xl font-bold text-white tracking-tight"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {provider.firstName} {provider.lastName}
                      </h1>
                      {provider.isVerified ? (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs rounded-full">
                          <ShieldCheck size={10} className="mr-1" /> Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-zinc-800 text-zinc-500 border-zinc-700 text-xs rounded-full">
                          <ShieldX size={10} className="mr-1" /> Unverified
                        </Badge>
                      )}
                    </div>

                    {provider.address && (
                      <p className="text-sm text-zinc-500 flex items-center gap-1.5">
                        <MapPin size={13} /> {provider.address}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {provider.isAvailable !== undefined && (
                      <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border font-medium ${
                        provider.isAvailable
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${provider.isAvailable ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                        {provider.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    )}
                    {provider.yearExperience && (
                      <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border bg-zinc-800 text-zinc-400 border-zinc-700 font-medium">
                        <Wrench size={11} /> {provider.yearExperience} yrs experience
                      </span>
                    )}
                    {provider.avgRating && (
                      <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border bg-amber-500/10 text-amber-400 border-amber-500/20 font-medium">
                        <Star size={11} className="fill-amber-400" /> {provider.avgRating} rating
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {provider.bio && (
                <div className="border-t border-white/5 pt-5 space-y-2">
                  <h2 className="text-sm font-semibold text-white">About</h2>
                  <p className="text-sm text-zinc-400 leading-relaxed">{provider.bio}</p>
                </div>
              )}

              <div className="border-t border-white/5 pt-5 grid sm:grid-cols-2 gap-3">
                {provider.email && (
                  <div className="flex items-center gap-3 bg-zinc-800/60 border border-white/5 rounded-xl px-4 py-3">
                    <Mail size={14} className="text-zinc-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-500">Email</p>
                      <p className="text-sm text-white truncate">{provider.email}</p>
                    </div>
                  </div>
                )}
                {provider.phone && (
                  <div className="flex items-center gap-3 bg-zinc-800/60 border border-white/5 rounded-xl px-4 py-3">
                    <Phone size={14} className="text-zinc-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-500">Phone</p>
                      <p className="text-sm text-white truncate">{provider.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-zinc-900 border border-white/6 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-white">Services Offered</h2>

              {loadingServices ? (
                <div className="flex items-center gap-2 text-zinc-500 text-sm py-2">
                  <Loader2 size={14} className="animate-spin" /> Loading services...
                </div>
              ) : services.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2">
                  <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center">
                    <Wrench size={15} className="text-zinc-600" />
                  </div>
                  <p className="text-xs text-zinc-500">No services listed yet.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {services.map((s) => (
                    <ServiceCard key={s.serviceId} service={s} />
                  ))}
                </div>
              )}
            </div>

            <div className="bg-zinc-900 border border-white/6 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-base font-semibold text-white">
                  Ready to book {provider.firstName}?
                </h2>
                <p className="text-sm text-zinc-500 flex items-center gap-1.5">
                  <Clock size={12} /> Sign in to schedule a service instantly.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link to="/sign-in">
                  <Button
                    variant="ghost"
                    className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl border border-white/10"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link to="/sign-up">
                  <Button className="bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-xl px-6">
                    Book now
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}