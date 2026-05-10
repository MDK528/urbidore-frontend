import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CalendarDays,
  Loader2,
  Plus,
  X,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
} from 'lucide-react'
import { getBookings, createBooking, updateBookingStatus } from '../../api/bookings.api'
import { createReview } from '../../api/reviews.api'
import { getAllProviders } from '../../api/providers.api'
import { getAllServices } from '../../api/services.api'
import { DatePickerTime } from '@/components/ui/date-time-picer'


const statusMeta = {
  requested:   { label: 'Requested',   color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',     icon: Clock },
  confirmed:   { label: 'Confirmed',   color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',   icon: CheckCircle2 },
  in_progress: { label: 'In Progress', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: AlertCircle },
  completed:   { label: 'Completed',   color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
  cancelled:   { label: 'Cancelled',   color: 'bg-red-500/10 text-red-400 border-red-500/20',         icon: XCircle },
}


function CreateBookingModal({ onClose, onCreate }) {
  const [providers, setProviders] = useState([])
  const [services, setServices] = useState([])
  const [form, setForm] = useState({ providerId: '', serviceId: '', scheduledAt: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getAllProviders(), getAllServices()])
      .then(([pRes, sRes]) => {
        setProviders(pRes.data.data || [])
        setServices(sRes.data.data || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))

      getAllServices()
  }, [])

  const handleSubmit = async () => {
    if (!form.providerId || !form.serviceId || !form.scheduledAt) {
      setError('All fields are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onCreate(form)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl p-6 space-y-5 shadow-2xl">
        
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Book a Service
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-zinc-500 text-sm py-6 justify-center">
            <Loader2 size={15} className="animate-spin" /> Loading...
          </div>
        ) : (
          <div className="space-y-4">

            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm">Provider</Label>
              <Select
                value={form.providerId}
                onValueChange={(val) => setForm((p) => ({ ...p, providerId: val }))}
              >
                <SelectTrigger className="w-full bg-zinc-900 border-white/10 text-white h-11 rounded-xl focus-visible:ring-amber-400/40 focus-visable:border-amber-400/40">
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectGroup>
                    <SelectLabel className="text-zinc-500">Providers</SelectLabel>
                    {providers.map((p) => (
                      <SelectItem
                        key={p.providerId}
                        value={p.providerId}
                        className="text-white cursor-pointer"
                      >
                        {p.firstName} {p.lastName}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm">Service</Label>
              <Select
                value={form.serviceId}
                onValueChange={(val) => setForm((p) => ({ ...p, serviceId: val }))}
              >
                <SelectTrigger className="w-full bg-zinc-900 border-white/10 text-white h-11 rounded-xl focus:ring-amber-400/30 focus:border-amber-400/40">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-white/10 text-white">
                  <SelectGroup>
                    <SelectLabel className="text-zinc-500">Services</SelectLabel>
                    {services.map((s) => (
                      <SelectItem
                        key={s.services.serviceId}
                        value={s.services.serviceId}
                        className="text-white  focus:text-white cursor-pointer"
                      >
                        {s.services.serviceName} {s.services.servicePrice ? `— $${s.services.servicePrice}` : ''}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm">Scheduled Date & Time</Label>
              <DatePickerTime form={form} setForm={setForm}/>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button
              onClick={handleSubmit}
              disabled={saving}
              className="w-full bg-amber-400 hover:bg-amber-300 text-black font-semibold h-11 rounded-xl gap-2"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : 'Confirm Booking'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function ReviewModal({ booking, onClose, onSubmit }) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comments, setComments] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSubmit({ bookingId: booking.bookingId, rating, comments })
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-zinc-950 border border-white/8 rounded-2xl p-6 space-y-5 shadow-2xl">

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
            Leave a Review
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-zinc-300 text-sm">Rating</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={28}
                    className={`transition-colors ${
                      star <= (hovered || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-zinc-700'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300 text-sm">Comment (optional)</Label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Share your experience..."
              rows={3}
              maxLength={1000}
              className="w-full bg-zinc-900 border border-white/10 text-white placeholder:text-zinc-600 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-amber-400/40 resize-none"
            />
            <p className="text-xs text-zinc-600 text-right">{comments.length}/1000</p>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={saving || rating === 0}
            className="w-full bg-amber-400 hover:bg-amber-300 text-black font-semibold h-11 rounded-xl gap-2"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : 'Submit Review'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function BookingCard({ booking, onCancel, onReview, cancelling }) {
  const meta = statusMeta[booking.status] || statusMeta.requested
  const StatusIcon = meta.icon
  const canCancel = ['requested', 'confirmed'].includes(booking.status)
  const canReview = booking.status === 'completed'

  return (
    <div className="bg-zinc-900 border border-white/6 rounded-2xl p-5 space-y-4 hover:border-white/10 transition-all duration-150">

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className={`text-xs border rounded-full px-2.5 py-0.5 font-medium ${meta.color}`}>
              <StatusIcon size={10} className="mr-1" />
              {meta.label}
            </Badge>
          </div>
          <p className="text-xs text-zinc-500">
            Booking ID: <span className="text-zinc-400 font-mono">{booking.bookingId.slice(0, 8)}...</span>
          </p>
        </div>
        {booking.bookingPrice && (
          <span className="text-lg font-bold text-white shrink-0">
            ${booking.bookingPrice}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-4 text-xs">
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
          <p className="text-zinc-500">Booked on</p>
          <p className="text-white font-medium">
            {new Date(booking.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {(canCancel || canReview) && (
        <div className="flex items-center gap-2 border-t border-white/5 pt-4">
          {canReview && (
            <Button
              size="sm"
              onClick={() => onReview(booking)}
              className="bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-xl text-xs h-8 px-4 gap-1"
            >
              <Star size={11} /> Review
            </Button>
          )}
          {canCancel && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onCancel(booking.bookingId)}
              disabled={cancelling === booking.bookingId}
              className="text-red-400 hover:text-red-300 hover:bg-red-400/5 rounded-xl text-xs h-8 px-4 border border-red-400/20"
            >
              {cancelling === booking.bookingId ? (
                <Loader2 size={11} className="animate-spin" />
              ) : 'Cancel'}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default function CustomerBookingsPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [reviewBooking, setReviewBooking] = useState(null)
  const [cancelling, setCancelling] = useState(null)
  const [filter, setFilter] = useState('all')

  const fetchBookings = () => {
    setLoading(true)
    getBookings()
      .then((res) => setBookings(res.data.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBookings() }, [])

  const handleCreate = async (form) => {
    await createBooking({
      ...form,
      scheduledAt: new Date(form.scheduledAt).toISOString(),
    })
    fetchBookings()
  }

  const handleCancel = async (bookingId) => {
    setCancelling(bookingId)
    try {
      await updateBookingStatus(bookingId, 'cancelled')
      setBookings((prev) =>
        prev.map((b) => b.bookingId === bookingId ? { ...b, status: 'cancelled' } : b)
      )
    } finally {
      setCancelling(null)
    }
  }

  const handleReview = async (body) => {
    await createReview(body)
  }

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === filter)

  const tabs = ['all', 'requested', 'confirmed', 'in_progress', 'completed', 'cancelled']

  return (
    <DashboardLayout title="My Bookings">
      <div className="max-w-4xl mx-auto space-y-8">

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2
              className="text-3xl font-bold text-white tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              My Bookings
            </h2>
            <p className="text-zinc-500 text-sm">
              {bookings.length} booking{bookings.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <Button
            onClick={() => setShowCreate(true)}
            className="bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-xl gap-2 px-5"
          >
            <Plus size={15} /> Book a service
          </Button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
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
              {tab !== 'all' && (
                <span className="ml-1.5 text-zinc-600">
                  {bookings.filter((b) => b.status === tab).length}
                </span>
              )}
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
              <p className="text-white font-medium">No bookings yet</p>
              <p className="text-sm text-zinc-500">
                {filter === 'all' ? 'Book your first service to get started.' : `No ${statusMeta[filter]?.label.toLowerCase()} bookings.`}
              </p>
            </div>
            {filter === 'all' && (
              <Button
                onClick={() => setShowCreate(true)}
                className="bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-xl gap-2"
              >
                <Plus size={14} /> Book a service
              </Button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((b) => (
              <BookingCard
                key={b.bookingId}
                booking={b}
                onCancel={handleCancel}
                onReview={setReviewBooking}
                cancelling={cancelling}
              />
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateBookingModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}

      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onSubmit={handleReview}
        />
      )}
    </DashboardLayout>
  )
}