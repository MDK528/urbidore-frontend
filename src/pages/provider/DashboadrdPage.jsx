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
  Clock,
  CheckCircle2,
  Loader2,
  Wrench,
  MapPin,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  ShieldX,
  Plus,
} from 'lucide-react'
import {
  getMyProviderProfile,
  toggleAvailability,
  getProviderServices,
  deleteProviderService,
} from '../../api/providers.api'
import { getAllServices } from '../../api/services.api'

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


function ServiceItem({ service, onDelete }) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete(service.serviceId)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
          <Wrench size={14} className="text-amber-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{service.serviceName}</p>
          {service.servicePrice && (
            <p className="text-xs text-zinc-500">${service.servicePrice}</p>
          )}
        </div>
      </div>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-xs text-zinc-500 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-400/5 disabled:opacity-50"
      >
        {deleting ? <Loader2 size={12} className="animate-spin" /> : 'Remove'}
      </button>
    </div>
  )
}


function AddServiceModal({ onClose, onAdd, providerId }) {
  const [allServices, setAllServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(null)

  useEffect(() => {
    getAllServices()
      .then((res) => setAllServices(res.data.data || []))
      .catch(() => setAllServices([]))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async (serviceId) => {
    setAdding(serviceId)
    try {
      await onAdd(serviceId)
    } finally {
      setAdding(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md bg-zinc-950 border border-white/8 rounded-2xl p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3
            className="text-lg font-bold text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Add a Service
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-zinc-500 text-sm py-4">
            <Loader2 size={15} className="animate-spin" />
            Loading services...
          </div>
        ) : allServices.length === 0 ? (
          <p className="text-sm text-zinc-500 py-4">No services available.</p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {allServices.map((s) => (
              <div
                key={s.serviceId}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-zinc-900 border border-white/5"
              >
                <div>
                  <p className="text-sm font-medium text-white">{s.serviceName}</p>
                  {s.servicePrice && (
                    <p className="text-xs text-zinc-500">${s.servicePrice}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAdd(s.serviceId)}
                  disabled={adding === s.serviceId}
                  className="bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-lg text-xs h-7 px-3"
                >
                  {adding === s.serviceId ? (
                    <Loader2 size={11} className="animate-spin" />
                  ) : 'Add'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


export default function ProviderDashboard() {
  const { user } = useAuth()

  const [profile, setProfile] = useState(null)
  const [services, setServices] = useState([])
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [loadingServices, setLoadingServices] = useState(true)
  const [togglingAvail, setTogglingAvail] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    getMyProviderProfile()
      .then((res) => setProfile(res.data.data))
      .catch(() => setProfile(null))
      .finally(() => setLoadingProfile(false))

    if (user?.id) {
      getProviderServices(user.id)
        .then((res) => {
          const data = res.data.data
          setServices(Array.isArray(data) ? data : data ? [data] : [])
        })
        .catch(() => setServices([]))
        .finally(() => setLoadingServices(false))
    }
  }, [user?.id])

  const handleToggleAvailability = async () => {
    setTogglingAvail(true)
    try {
      const res = await toggleAvailability()
      const isAvailable = res.data.data
      setProfile((prev) => ({ ...prev, isAvailable }))
    } finally {
      setTogglingAvail(false)
    }
  }

  const handleDeleteService = async (serviceId) => {
    await deleteProviderService(serviceId)
    setServices((prev) => prev.filter((s) => s.serviceId !== serviceId))
  }

  const handleAddService = async (serviceId) => {
    const { addProviderService } = await import('../../api/providers.api')
    await addProviderService(serviceId)

    if (user?.id) {
      const res = await getProviderServices(user.id)
      const data = res.data.data
      setServices(Array.isArray(data) ? data : data ? [data] : [])
    }
    setShowAddModal(false)
  }

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="max-w-6xl mx-auto space-y-10">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-zinc-500 text-sm">{greeting()},</p>
            <h2
              className="text-3xl font-bold text-white tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {user?.firstName} {user?.lastName}
            </h2>
          </div>

          <div className="flex items-center gap-3 bg-zinc-900 border border-white/6 rounded-2xl px-5 py-3">
            {loadingProfile ? (
              <Loader2 size={15} className="animate-spin text-zinc-500" />
            ) : (
              <>
                <div className="flex items-center gap-2">
                  {profile?.isAvailable ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-zinc-600" />
                  )}
                  <span className="text-sm text-white font-medium">
                    {profile?.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <button
                  onClick={handleToggleAvailability}
                  disabled={togglingAvail}
                  className="text-zinc-400 hover:text-amber-400 transition-colors disabled:opacity-50"
                >
                  {togglingAvail ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : profile?.isAvailable ? (
                    <ToggleRight size={22} className="text-emerald-400" />
                  ) : (
                    <ToggleLeft size={22} />
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {!loadingProfile && profile && !profile.isVerified && (
          <div className="flex items-center gap-3 bg-amber-400/8 border border-amber-400/20 rounded-2xl px-5 py-4">
            <ShieldX size={18} className="text-amber-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white">Verification pending</p>
              <p className="text-xs text-zinc-400 mt-0.5">
                Your profile is under review. You'll be notified once verified.
              </p>
            </div>
          </div>
        )}

        {!loadingProfile && profile?.isVerified && (
          <div className="flex items-center gap-3 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl px-5 py-4">
            <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
            <p className="text-sm font-medium text-white">
              Your profile is verified
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={CalendarDays} label="Total Bookings"  value="0" iconColor="bg-blue-500/10 text-blue-400" />
          <StatCard icon={Clock}        label="In Progress"     value="0" iconColor="bg-purple-500/10 text-purple-400" />
          <StatCard icon={CheckCircle2} label="Completed"       value="0" iconColor="bg-emerald-500/10 text-emerald-400" />
          <StatCard icon={Star}         label="Avg. Rating"     value={profile?.avgRating ?? '—'} iconColor="bg-amber-500/10 text-amber-400" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-zinc-900 border border-white/6 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">Profile</h3>
              <Link to="/provider/profile">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl text-xs gap-1"
                >
                  Edit <ArrowRight size={12} />
                </Button>
              </Link>
            </div>

            {loadingProfile ? (
              <div className="flex items-center gap-2 text-zinc-500 text-sm">
                <Loader2 size={14} className="animate-spin" /> Loading...
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-base font-semibold text-white">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {profile?.firstName} {profile?.lastName}
                    </p>
                    <p className="text-xs text-zinc-500">{profile?.email}</p>
                  </div>
                </div>

                {profile?.bio && (
                  <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3 border-t border-white/5 pt-3">
                    {profile.bio}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 border-t border-white/5 pt-3 text-xs text-zinc-500">
                  {profile?.yearExperience && (
                    <span className="flex items-center gap-1">
                      <Wrench size={11} />
                      {profile.yearExperience} yrs experience
                    </span>
                  )}
                  {profile?.address && (
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />
                      {profile.address}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-zinc-900 border border-white/6 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">My Services</h3>
              <Button
                size="sm"
                onClick={() => setShowAddModal(true)}
                className="bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-xl text-xs h-8 px-3 gap-1"
              >
                <Plus size={13} /> Add
              </Button>
            </div>

            {loadingServices ? (
              <div className="flex items-center gap-2 text-zinc-500 text-sm">
                <Loader2 size={14} className="animate-spin" /> Loading...
              </div>
            ) : services.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center">
                  <Wrench size={15} className="text-zinc-600" />
                </div>
                <p className="text-xs text-zinc-500">No services added yet.</p>
              </div>
            ) : (
              <div>
                {services.map((s) => (
                  <ServiceItem
                    key={s.serviceId}
                    service={s}
                    onDelete={handleDeleteService}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Recent Bookings</h3>
            <Link to="/provider/bookings">
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl gap-1 text-xs"
              >
                View all <ArrowRight size={13} />
              </Button>
            </Link>
          </div>
          <div className="bg-zinc-900 border border-white/6 rounded-2xl">
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-white/6 flex items-center justify-center">
                <CalendarDays size={18} className="text-zinc-600" />
              </div>
              <p className="text-sm text-zinc-500">No bookings yet.</p>
            </div>
          </div>
        </section>

      </div>

      {showAddModal && (
        <AddServiceModal
          providerId={user?.id}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddService}
        />
      )}
    </DashboardLayout>
  )
}