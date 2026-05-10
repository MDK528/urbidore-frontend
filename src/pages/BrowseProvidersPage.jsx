import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllProviders } from '../api/providers.api'
import { getAllCategories } from '../api/categories.api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  MapPin,
  Star,
  Wrench,
  ShieldCheck,
  Loader2,
  ArrowRight,
  SlidersHorizontal,
  X,
} from 'lucide-react'


function ProviderCard({ provider }) {
  return (
    <div className="group bg-zinc-900 border border-white/6 rounded-2xl p-5 flex flex-col gap-4 hover:border-amber-400/20 hover:bg-zinc-900/80 transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-base font-semibold text-white shrink-0">
          {provider.firstName?.[0]}{provider.lastName?.[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-white">
              {provider.firstName} {provider.lastName}
            </p>
            {provider.isVerified && (
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs rounded-full px-2 py-0">
                <ShieldCheck size={9} className="mr-1" />Verified
              </Badge>
            )}
          </div>
          {provider.address && (
            <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
              <MapPin size={10} />{provider.address}
            </p>
          )}
        </div>
        {provider.avgRating && (
          <div className="flex items-center gap-1 shrink-0">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-white">{provider.avgRating}</span>
          </div>
        )}
      </div>

      {provider.bio && (
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{provider.bio}</p>
      )}

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          {provider.yearExperience && (
            <span className="flex items-center gap-1">
              <Wrench size={11} />{provider.yearExperience} yrs exp
            </span>
          )}
          {provider.isAvailable !== undefined && (
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${provider.isAvailable ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
              {provider.isAvailable ? 'Available' : 'Unavailable'}
            </span>
          )}
        </div>
        <Link to={`/providers/${provider.providerId}`}>
          <Button
            size="sm"
            className="bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-xl text-xs h-8 px-4 gap-1"
          >
            View <ArrowRight size={11} />
          </Button>
        </Link>
      </div>
    </div>
  )
}


function SkeletonCard() {
  return (
    <div className="bg-zinc-900 border border-white/6 rounded-2xl p-5 space-y-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-zinc-800 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-zinc-800 rounded-full w-32" />
          <div className="h-3 bg-zinc-800 rounded-full w-24" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-zinc-800 rounded-full w-full" />
        <div className="h-3 bg-zinc-800 rounded-full w-3/4" />
      </div>
      <div className="h-8 bg-zinc-800 rounded-xl w-full" />
    </div>
  )
}


export default function BrowseProvidersPage() {
  const [providers, setProviders] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [availableOnly, setAvailableOnly] = useState(false)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    Promise.all([getAllProviders(), getAllCategories()])
      .then(([provRes, catRes]) => {
        setProviders(provRes.data.data || [])
        setCategories(catRes.data.data || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = providers.filter((p) => {
    const name = `${p.firstName} ${p.lastName}`.toLowerCase()
    const matchSearch = name.includes(search.toLowerCase()) ||
      p.address?.toLowerCase().includes(search.toLowerCase()) ||
      p.bio?.toLowerCase().includes(search.toLowerCase())
    const matchAvailable = availableOnly ? p.isAvailable : true
    const matchVerified = verifiedOnly ? p.isVerified : true
    return matchSearch && matchAvailable && matchVerified
  })

  const activeFiltersCount = [availableOnly, verifiedOnly, activeCategory].filter(Boolean).length

  const clearFilters = () => {
    setAvailableOnly(false)
    setVerifiedOnly(false)
    setActiveCategory(null)
    setSearch('')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
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

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">

        <div className="space-y-3">
          <h1
            className="text-4xl md:text-5xl font-bold text-white tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Find a Professional
          </h1>
          <p className="text-zinc-500">
            {loading ? 'Loading...' : `${filtered.length} professional${filtered.length !== 1 ? 's' : ''} available`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Search by name, location, or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 h-11 rounded-xl focus-visible:border-amber-400/40 focus-visible:ring-amber-400/30"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <Button
            variant="ghost"
            onClick={() => setShowFilters((p) => !p)}
            className={`h-11 rounded-xl border gap-2 text-sm px-4 transition-colors ${
              showFilters || activeFiltersCount > 0
                ? 'border-amber-400/30 text-amber-400 bg-amber-400/5'
                : 'border-white/10 text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-400 text-black text-xs flex items-center justify-center font-semibold">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>

        {showFilters && (
          <div className="bg-zinc-900 border border-white/6 rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Filters</h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-zinc-500 hover:text-white transition-colors flex items-center gap-1"
                >
                  <X size={11} /> Clear all
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setAvailableOnly((p) => !p)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                  availableOnly
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-zinc-800 border-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${availableOnly ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                Available now
              </button>

              <button
                onClick={() => setVerifiedOnly((p) => !p)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                  verifiedOnly
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-zinc-800 border-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                <ShieldCheck size={13} />
                Verified only
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/6 flex items-center justify-center">
              <Search size={18} className="text-zinc-600" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-white font-medium">No providers found</p>
              <p className="text-sm text-zinc-500">Try adjusting your search or filters.</p>
            </div>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl text-sm"
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <ProviderCard key={p.providerId} provider={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}