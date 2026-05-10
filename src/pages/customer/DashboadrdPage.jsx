import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  CalendarDays,
  Star,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Wrench,
  MapPin,
  LayoutGrid,
} from 'lucide-react'
import { getAllProviders } from '../../api/providers.api'
import { getAllCategories } from '../../api/categories.api'


const statusMeta = {
  requested:   { label: 'Requested',   color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  confirmed:   { label: 'Confirmed',   color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  in_progress: { label: 'In Progress', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  completed:   { label: 'Completed',   color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  cancelled:   { label: 'Cancelled',   color: 'bg-red-500/10 text-red-400 border-red-500/20' },
}


function StatCard({ icon: Icon, label, value, iconColor }) {
  return (
    <div className="bg-zinc-900 border border-white/6 rounded-2xl p-6 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColor}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          {value}
        </p>
        <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
      </div>
    </div>
  )
}


function ProviderCard({ provider }) {
  return (
    <div className="bg-zinc-900 border border-white/6 rounded-2xl p-5 flex flex-col gap-4 hover:border-amber-400/20 transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-semibold text-white shrink-0">
          {provider.firstName?.[0]}{provider.lastName?.[0]}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white truncate">
            {provider.firstName} {provider.lastName}
          </p>
          {provider.address && (
            <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
              <MapPin size={10} />
              {provider.address}
            </p>
          )}
        </div>
        {provider.isVerified && (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs rounded-full shrink-0">
            Verified
          </Badge>
        )}
      </div>

      {provider.bio && (
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{provider.bio}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          {provider.yearExperience && (
            <span className="flex items-center gap-1">
              <Wrench size={11} />
              {provider.yearExperience}yr exp
            </span>
          )}
          {provider.avgRating && (
            <span className="flex items-center gap-1">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              {provider.avgRating}
            </span>
          )}
        </div>
        <Link to={`/providers/${provider.providerId}`}>
          <Button
            size="sm"
            className="bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-xl text-xs h-8 px-4"
          >
            View
          </Button>
        </Link>
      </div>
    </div>
  )
}


function CategoryPill({ category }) {
  return (
    <Link to={`/providers?category=${category.categoryId}`}>
      <div className="bg-zinc-900 border border-white/6 rounded-xl px-4 py-3 hover:border-amber-400/20 hover:bg-zinc-800 transition-all duration-150 cursor-pointer text-center">
        <p className="text-sm font-medium text-white">{category.categoryName}</p>
        {category.categoryDescription && (
          <p className="text-xs text-zinc-500 mt-0.5 truncate">{category.categoryDescription}</p>
        )}
      </div>
    </Link>
  )
}


function EmptyState({ icon: Icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/6 flex items-center justify-center">
        <Icon size={18} className="text-zinc-600" />
      </div>
      <p className="text-sm text-zinc-500">{message}</p>
    </div>
  )
}


export default function CustomerDashboard() {
  const { user } = useAuth()

  const [providers, setProviders] = useState([])
  const [categories, setCategories] = useState([])
  const [loadingProviders, setLoadingProviders] = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(true)

  useEffect(() => {
    getAllProviders()
      .then((res) => setProviders(res.data.data || []))
      .catch(() => setProviders([]))
      .finally(() => setLoadingProviders(false))

    getAllCategories()
      .then((res) => setCategories(res.data.data || []))
      .catch(() => setCategories([]))
      .finally(() => setLoadingCategories(false))
  }, [])

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="max-w-6xl mx-auto space-y-10">

        <div className="space-y-1">
          <p className="text-zinc-500 text-sm">{greeting()},</p>
          <h2
            className="text-3xl font-bold text-white tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {user?.firstName} {user?.lastName}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={CalendarDays} label="Total Bookings"    value="0"  iconColor="bg-blue-500/10 text-blue-400" />
          <StatCard icon={Clock}        label="In Progress"       value="0"  iconColor="bg-purple-500/10 text-purple-400" />
          <StatCard icon={CheckCircle2} label="Completed"         value="0"  iconColor="bg-emerald-500/10 text-emerald-400" />
          <StatCard icon={Star}         label="Reviews Given"     value="0"  iconColor="bg-amber-500/10 text-amber-400" />
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Browse by Category</h3>
          </div>

          {loadingCategories ? (
            <div className="flex items-center gap-2 text-zinc-500 text-sm py-4">
              <Loader2 size={15} className="animate-spin" />
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <EmptyState icon={LayoutGrid} message="No categories available yet." />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {categories.map((cat) => (
                <CategoryPill key={cat.categoryId} category={cat} />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Available Professionals</h3>
            <Link to="/providers">
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl gap-1 text-xs"
              >
                See all <ArrowRight size={13} />
              </Button>
            </Link>
          </div>

          {loadingProviders ? (
            <div className="flex items-center gap-2 text-zinc-500 text-sm py-4">
              <Loader2 size={15} className="animate-spin" />
              Loading providers...
            </div>
          ) : providers.length === 0 ? (
            <EmptyState icon={Users} message="No providers available yet." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {providers.slice(0, 6).map((p) => (
                <ProviderCard key={p.providerId} provider={p} />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Recent Bookings</h3>
            <Link to="/dashboard/bookings">
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl gap-1 text-xs"
              >
                View all <ArrowRight size={13} />
              </Button>
            </Link>
          </div>

          <div className="bg-zinc-900 border border-white/6 rounded-2xl overflow-hidden">
            <EmptyState icon={CalendarDays} message="No bookings yet. Book your first service above." />
          </div>
        </section>

      </div>
    </DashboardLayout>
  )
}