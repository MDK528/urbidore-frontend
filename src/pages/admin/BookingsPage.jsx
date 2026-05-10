import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Loader2,
  Search,
  XCircle,
  Clock,
  AlertCircle,
  CheckCircle2,
  ThumbsUp,
  Play,
  X,
  CalendarDays,
} from 'lucide-react'
import {
  adminGetBookings,
  adminForceCancelBooking,
} from '../../api/admin.api'
import { updateBookingStatus } from '../../api/bookings.api'

const statusMeta = {
  requested:   { label: 'Requested',   color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',        icon: Clock },
  confirmed:   { label: 'Confirmed',   color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',      icon: CheckCircle2 },
  in_progress: { label: 'In Progress', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',   icon: AlertCircle },
  completed:   { label: 'Completed',   color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
  cancelled:   { label: 'Cancelled',   color: 'bg-red-500/10 text-red-400 border-red-500/20',            icon: XCircle },
}

const adminTransitions = {
  requested:   [
    { status: 'confirmed',   label: 'Confirm',   icon: ThumbsUp,      color: 'bg-amber-400 hover:bg-amber-300 text-black' },
    { status: 'cancelled',   label: 'Cancel',    icon: XCircle,       color: 'text-red-400 hover:text-red-300 hover:bg-red-400/5 border border-red-400/20' },
  ],
  confirmed:   [
    { status: 'in_progress', label: 'Start',     icon: Play,          color: 'bg-purple-500 hover:bg-purple-400 text-white' },
    { status: 'cancelled',   label: 'Cancel',    icon: XCircle,       color: 'text-red-400 hover:text-red-300 hover:bg-red-400/5 border border-red-400/20' },
  ],
  in_progress: [
    { status: 'completed',   label: 'Complete',  icon: CheckCircle2,  color: 'bg-emerald-500 hover:bg-emerald-400 text-white' },
    { status: 'cancelled',   label: 'Cancel',    icon: XCircle,       color: 'text-red-400 hover:text-red-300 hover:bg-red-400/5 border border-red-400/20' },
  ],
  completed:  [],
  cancelled:  [],
}

const tabs = ['all', 'requested', 'confirmed', 'in_progress', 'completed', 'cancelled']

function BookingRow({ booking, onUpdate, updating }) {
  const meta = statusMeta[booking.status] || statusMeta.requested
  const StatusIcon = meta.icon
  const transitions = adminTransitions[booking.status] || []

  return (
    <div className="bg-zinc-900 border border-white/6 rounded-2xl p-5 space-y-4 hover:border-white/10 transition-all duration-150">

      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="space-y-1">
          <Badge className={`text-xs border rounded-full px-2.5 py-0.5 font-medium ${meta.color}`}>
            <StatusIcon size={10} className="mr-1" />
            {meta.label}
          </Badge>
          <p className="text-xs font-mono text-zinc-500">
            #{booking.bookingId.slice(0, 8)}
          </p>
        </div>
        {booking.bookingPrice && (
          <span className="text-lg font-bold text-white">${booking.bookingPrice}</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-3 text-xs">
        <div className="space-y-0.5">
          <p className="text-zinc-500">Scheduled</p>
          <p className="text-white font-medium">
            {new Date(booking.scheduledAt).toLocaleString([], {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </p>
        </div>
        <div className="space-y-0.5">
          <p className="text-zinc-500">Created</p>
          <p className="text-white font-medium">
            {new Date(booking.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {transitions.length > 0 && (
        <div className="flex items-center gap-2 border-t border-white/5 pt-3 flex-wrap">
          {transitions.map((t) => {
            const TIcon = t.icon
            const isUpdating = updating === `${booking.bookingId}-${t.status}`
            return (
              <Button
                key={t.status}
                size="sm"
                variant={t.color.includes('bg-') ? 'default' : 'ghost'}
                onClick={() => onUpdate(booking.bookingId, t.status)}
                disabled={!!updating}
                className={`rounded-xl text-xs h-8 px-4 gap-1.5 font-semibold ${t.color}`}
              >
                {isUpdating
                  ? <Loader2 size={11} className="animate-spin" />
                  : <><TIcon size={11} /> {t.label}</>
                }
              </Button>
            )
          })}
        </div>
      )}
    </div>
  )
}


export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    adminGetBookings()
      .then((res) => setBookings(res.data.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [])

  const handleUpdate = async (bookingId, status) => {
    const key = `${bookingId}-${status}`
    setUpdating(key)
    try {
      if (status === 'cancelled') {
        await adminForceCancelBooking(bookingId)
      } else {
        await updateBookingStatus(bookingId, status)
      }
      setBookings((prev) =>
        prev.map((b) => b.bookingId === bookingId ? { ...b, status } : b)
      )
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(null)
    }
  }

  const counts = tabs.reduce((acc, tab) => {
    acc[tab] = tab === 'all' ? bookings.length : bookings.filter((b) => b.status === tab).length
    return acc
  }, {})

  const filtered = bookings.filter((b) => {
    const matchFilter = filter === 'all' || b.status === filter
    const matchSearch = search
      ? b.bookingId.toLowerCase().includes(search.toLowerCase())
      : true
    return matchFilter && matchSearch
  })

  return (
    <DashboardLayout title="Bookings">
      <div className="max-w-5xl mx-auto space-y-8">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2
              className="text-3xl font-bold text-white tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Manage Bookings
            </h2>
            <p className="text-zinc-500 text-sm">
              {bookings.length} booking{bookings.length !== 1 ? 's' : ''} total
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Search by booking ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 h-10 rounded-xl text-sm focus-visible:border-amber-400/40"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {['requested', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((s) => {
              const m = statusMeta[s]
              const Icon = m.icon
              return (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`bg-zinc-900 border rounded-2xl p-4 text-left transition-all duration-150 ${
                    filter === s ? 'border-amber-400/20' : 'border-white/6 hover:border-white/10'
                  }`}
                >
                  <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    {counts[s]}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
                    <Icon size={10} /> {m.label}
                  </p>
                </button>
              )
            })}
          </div>
        )}

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                filter === tab
                  ? 'bg-amber-400/10 text-amber-400 border-amber-400/20'
                  : 'bg-zinc-900 text-zinc-400 border-white/6 hover:text-white hover:border-white/10'
              }`}
            >
              {tab === 'all' ? 'All' : statusMeta[tab]?.label}
              <span className="ml-1.5 text-zinc-600">{counts[tab]}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-zinc-500 text-sm py-10 justify-center">
            <Loader2 size={15} className="animate-spin" /> Loading bookings...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/6 flex items-center justify-center">
              <CalendarDays size={18} className="text-zinc-600" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-white font-medium">No bookings found</p>
              <p className="text-sm text-zinc-500">
                {filter === 'all' ? 'No bookings yet.' : `No ${statusMeta[filter]?.label.toLowerCase()} bookings.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((b) => (
              <BookingRow
                key={b.bookingId}
                booking={b}
                onUpdate={handleUpdate}
                updating={updating}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}