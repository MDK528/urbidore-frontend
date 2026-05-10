import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  Briefcase,
  Wrench,
  FolderKanban,
  ShieldCheck,
  ShieldX,
  Loader2,
  Search,
  Plus,
  Trash2,
  Pencil,
  X,
  Check,
  XCircle,
  Clock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { getAllProviders } from '../../api/providers.api'
import {
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminGetServices,
  adminCreateService,
  adminDeleteService,
  adminGetBookings,
  adminForceCancelBooking,
  adminVerifyProvider,
} from '../../api/admin.api'

// ─── Status config ────────────────────────────────────────────────────────────

const statusMeta = {
  requested:   { label: 'Requested',   color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',        icon: Clock },
  confirmed:   { label: 'Confirmed',   color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',      icon: CheckCircle2 },
  in_progress: { label: 'In Progress', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',   icon: AlertCircle },
  completed:   { label: 'Completed',   color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle2 },
  cancelled:   { label: 'Cancelled',   color: 'bg-red-500/10 text-red-400 border-red-500/20',            icon: XCircle },
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

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

function SectionHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      {action}
    </div>
  )
}

// ─── Providers Section ────────────────────────────────────────────────────────

function ProvidersSection({ providers, loading, onVerify }) {
  const [search, setSearch] = useState('')
  const [verifying, setVerifying] = useState(null)

  const filtered = providers.filter((p) =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase())
  )

  const handleVerify = async (id) => {
    setVerifying(id)
    try { await onVerify(id) }
    finally { setVerifying(null) }
  }

  return (
    <div className="bg-zinc-900 border border-white/6 rounded-2xl p-6 space-y-4">
      <SectionHeader title="Providers" />
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
        <Input
          placeholder="Search providers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-zinc-800 border-white/10 text-white placeholder:text-zinc-600 h-9 rounded-xl text-sm focus-visible:border-amber-400/40"
        />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-zinc-500 text-sm py-4">
          <Loader2 size={14} className="animate-spin" /> Loading...
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-zinc-500 py-4 text-center">No providers found.</p>
      ) : (
        <div className="divide-y divide-white/5">
          {filtered.slice(0, 6).map((p) => (
            <div key={p.providerId} className="flex items-center gap-3 py-3">
              <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-white shrink-0">
                {p.firstName?.[0]}{p.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{p.firstName} {p.lastName}</p>
                <p className="text-xs text-zinc-500 truncate">{p.email}</p>
              </div>
              <Button
                size="sm"
                onClick={() => handleVerify(p.providerId)}
                disabled={verifying === p.providerId}
                className={`rounded-lg text-xs h-7 px-3 shrink-0 font-semibold gap-1 ${
                  p.isVerified
                    ? 'bg-zinc-800 hover:bg-red-400/10 text-zinc-400 hover:text-red-400 border border-white/10 hover:border-red-400/20'
                    : 'bg-amber-400 hover:bg-amber-300 text-black'
                }`}
              >
                {verifying === p.providerId ? (
                  <Loader2 size={11} className="animate-spin" />
                ) : p.isVerified ? (
                  <><ShieldX size={11} /> Unverify</>
                ) : (
                  <><ShieldCheck size={11} /> Verify</>
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Categories Section ───────────────────────────────────────────────────────

function CategoriesSection({ categories, loading, onCreate, onUpdate, onDelete }) {
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const handleCreate = async () => {
    if (!newName.trim()) return
    setSaving(true)
    try {
      await onCreate({ categoryName: newName, categoryDescription: newDesc || undefined })
      setNewName(''); setNewDesc(''); setAdding(false)
    } finally { setSaving(false) }
  }

  const handleUpdate = async (id) => {
    setSaving(true)
    try {
      await onUpdate(id, { categoryName: editName, categoryDescription: editDesc || undefined })
      setEditingId(null)
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    try { await onDelete(id) }
    finally { setDeletingId(null) }
  }

  return (
    <div className="bg-zinc-900 border border-white/6 rounded-2xl p-6 space-y-4">
      <SectionHeader
        title="Categories"
        action={
          <Button size="sm" onClick={() => setAdding(true)}
            className="bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-xl text-xs h-8 px-3 gap-1">
            <Plus size={13} /> New
          </Button>
        }
      />

      {adding && (
        <div className="bg-zinc-800/60 border border-white/5 rounded-xl p-4 space-y-3">
          <Input placeholder="Category name" value={newName} onChange={(e) => setNewName(e.target.value)}
            className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 h-9 rounded-lg text-sm focus-visible:border-amber-400/40" />
          <Input placeholder="Description (optional)" value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
            className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 h-9 rounded-lg text-sm focus-visible:border-amber-400/40" />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleCreate} disabled={saving || !newName.trim()}
              className="bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-lg text-xs h-8 px-4">
              {saving ? <Loader2 size={11} className="animate-spin" /> : 'Save'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setAdding(false); setNewName(''); setNewDesc('') }}
              className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg text-xs h-8 px-3">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-zinc-500 text-sm py-4">
          <Loader2 size={14} className="animate-spin" /> Loading...
        </div>
      ) : categories.length === 0 ? (
        <p className="text-sm text-zinc-500 py-4 text-center">No categories yet.</p>
      ) : (
        <div className="divide-y divide-white/5">
          {categories.map((cat) => (
            <div key={cat.categoryId} className="py-3">
              {editingId === cat.categoryId ? (
                <div className="space-y-2">
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)}
                    className="bg-zinc-800 border-white/10 text-white h-8 rounded-lg text-sm focus-visible:border-amber-400/40" />
                  <Input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Description"
                    className="bg-zinc-800 border-white/10 text-white placeholder:text-zinc-600 h-8 rounded-lg text-sm focus-visible:border-amber-400/40" />
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(cat.categoryId)} disabled={saving}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20">
                      {saving ? <Loader2 size={11} className="animate-spin" /> : <Check size={12} />}
                    </button>
                    <button onClick={() => setEditingId(null)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-zinc-800 border border-white/5 text-zinc-400 hover:text-white">
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{cat.categoryName}</p>
                    {cat.categoryDescription && (
                      <p className="text-xs text-zinc-500 truncate">{cat.categoryDescription}</p>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => { setEditingId(cat.categoryId); setEditName(cat.categoryName); setEditDesc(cat.categoryDescription || '') }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(cat.categoryId)} disabled={deletingId === cat.categoryId}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/5 disabled:opacity-50">
                      {deletingId === cat.categoryId ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={13} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Services Section ─────────────────────────────────────────────────────────

function ServicesSection({ services, categories, loading, onCreate, onDelete }) {
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ categoryId: '', serviceName: '', serviceDescription: '', servicePrice: '' })
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    if (!form.serviceName.trim() || !form.categoryId || !form.servicePrice || !form.serviceDescription.trim()) {
      setError('All fields are required.'); return
    }
    setSaving(true); setError('')
    try {
      await onCreate(form)
      setForm({ categoryId: '', serviceName: '', serviceDescription: '', servicePrice: '' })
      setAdding(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create service.')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    try { await onDelete(id) }
    finally { setDeletingId(null) }
  }

  return (
    <div className="bg-zinc-900 border border-white/6 rounded-2xl p-6 space-y-4">
      <SectionHeader
        title="Services"
        action={
          <Button size="sm" onClick={() => setAdding(true)}
            className="bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-xl text-xs h-8 px-3 gap-1">
            <Plus size={13} /> New
          </Button>
        }
      />

      {adding && (
        <div className="bg-zinc-800/60 border border-white/5 rounded-xl p-4 space-y-3">
          <Select value={form.categoryId} onValueChange={(val) => setForm((p) => ({ ...p, categoryId: val }))}>
            <SelectTrigger className="bg-zinc-900 border-white/10 text-white h-9 rounded-lg text-sm focus:ring-amber-400/30 focus:border-amber-400/40">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10 text-white">
              <SelectGroup>
                <SelectLabel className="text-zinc-500">Categories</SelectLabel>
                {categories.map((c) => (
                  <SelectItem key={c.categoryId} value={c.categoryId}
                    className="text-white focus:bg-white/5 focus:text-white cursor-pointer">
                    {c.categoryName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input placeholder="Service name" value={form.serviceName}
            onChange={(e) => setForm((p) => ({ ...p, serviceName: e.target.value }))}
            className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 h-9 rounded-lg text-sm focus-visible:border-amber-400/40" />
          <Input placeholder="Description (min 10 characters)" value={form.serviceDescription}
            onChange={(e) => setForm((p) => ({ ...p, serviceDescription: e.target.value }))}
            className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 h-9 rounded-lg text-sm focus-visible:border-amber-400/40" />
          <Input placeholder="Price (e.g. 49.99)" value={form.servicePrice}
            onChange={(e) => setForm((p) => ({ ...p, servicePrice: e.target.value }))}
            className="bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 h-9 rounded-lg text-sm focus-visible:border-amber-400/40" />
          {error && (
            <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>
          )}
          <div className="flex gap-2">
            <Button size="sm" onClick={handleCreate} disabled={saving}
              className="bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-lg text-xs h-8 px-4">
              {saving ? <Loader2 size={11} className="animate-spin" /> : 'Save'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setAdding(false); setError('') }}
              className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg text-xs h-8 px-3">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-zinc-500 text-sm py-4">
          <Loader2 size={14} className="animate-spin" /> Loading...
        </div>
      ) : services.length === 0 ? (
        <p className="text-sm text-zinc-500 py-4 text-center">No services yet.</p>
      ) : (
        <div className="divide-y divide-white/5">
          {services.map((s) => (
            <div key={s.serviceId} className="flex items-center gap-3 py-3">
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                <Wrench size={13} className="text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{s.serviceName}</p>
                <p className="text-xs text-zinc-500">{s.servicePrice ? `$${s.servicePrice}` : 'No price set'}</p>
              </div>
              <button onClick={() => handleDelete(s.serviceId)} disabled={deletingId === s.serviceId}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/5 shrink-0 disabled:opacity-50">
                {deletingId === s.serviceId ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={13} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Bookings Section ─────────────────────────────────────────────────────────

function BookingsSection({ bookings, loading, onForceCancel }) {
  const [cancelling, setCancelling] = useState(null)

  const handleCancel = async (id) => {
    setCancelling(id)
    try { await onForceCancel(id) }
    finally { setCancelling(null) }
  }

  return (
    <div className="bg-zinc-900 border border-white/6 rounded-2xl p-6 space-y-4">
      <SectionHeader title="All Bookings" />

      {loading ? (
        <div className="flex items-center gap-2 text-zinc-500 text-sm py-4">
          <Loader2 size={14} className="animate-spin" /> Loading...
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-sm text-zinc-500 py-4 text-center">No bookings yet.</p>
      ) : (
        <div className="divide-y divide-white/5">
          {bookings.map((b) => {
            const meta = statusMeta[b.status] || statusMeta.requested
            const StatusIcon = meta.icon
            const canCancel = !['completed', 'cancelled'].includes(b.status)
            return (
              <div key={b.bookingId} className="flex items-center gap-3 py-3">
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-xs font-mono text-zinc-400">#{b.bookingId.slice(0, 8)}</p>
                  <p className="text-xs text-zinc-500">
                    {new Date(b.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <Badge className={`text-xs border rounded-full px-2.5 py-0.5 font-medium shrink-0 ${meta.color}`}>
                  <StatusIcon size={10} className="mr-1" />{meta.label}
                </Badge>
                {b.bookingPrice && (
                  <span className="text-sm font-semibold text-white shrink-0">${b.bookingPrice}</span>
                )}
                {canCancel && (
                  <button onClick={() => handleCancel(b.bookingId)} disabled={cancelling === b.bookingId}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/5 shrink-0 disabled:opacity-50">
                    {cancelling === b.bookingId ? <Loader2 size={11} className="animate-spin" /> : <XCircle size={13} />}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [providers, setProviders] = useState([])
  const [categories, setCategories] = useState([])
  const [services, setServices] = useState([])
  const [bookings, setBookings] = useState([])
  const [loadingProviders, setLoadingProviders] = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingServices, setLoadingServices] = useState(true)
  const [loadingBookings, setLoadingBookings] = useState(true)

  useEffect(() => {
    getAllProviders()
      .then((res) => setProviders(res.data.data || []))
      .catch(() => setProviders([]))
      .finally(() => setLoadingProviders(false))

    adminGetCategories()
      .then((res) => setCategories(res.data.data || []))
      .catch(() => setCategories([]))
      .finally(() => setLoadingCategories(false))

    adminGetServices()
      .then((res) => setServices(res.data.data || []))
      .catch(() => setServices([]))
      .finally(() => setLoadingServices(false))

    adminGetBookings()
      .then((res) => setBookings(res.data.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoadingBookings(false))
  }, [])

  const handleVerifyProvider = async (id) => {
    const res = await adminVerifyProvider(id)
    const updated = res.data.data
    setProviders((prev) =>
      prev.map((p) => p.providerId === updated.providerId ? { ...p, isVerified: updated.isVerified } : p)
    )
  }

  const handleCreateCategory = async (body) => {
    const res = await adminCreateCategory(body)
    setCategories((prev) => [...prev, res.data.data])
  }

  const handleUpdateCategory = async (id, body) => {
    const res = await adminUpdateCategory(id, body)
    setCategories((prev) => prev.map((c) => c.categoryId === id ? res.data.data : c))
  }

  const handleDeleteCategory = async (id) => {
    await adminDeleteCategory(id) // 204 no body
    setCategories((prev) => prev.filter((c) => c.categoryId !== id))
  }

  const handleCreateService = async (body) => {
    const res = await adminCreateService(body)
    setServices((prev) => [...prev, res.data.data])
  }

  const handleDeleteService = async (id) => {
    await adminDeleteService(id) // 204 no body
    setServices((prev) => prev.filter((s) => s.serviceId !== id))
  }

  const handleForceCancel = async (id) => {
    await adminForceCancelBooking(id)
    setBookings((prev) =>
      prev.map((b) => b.bookingId === id ? { ...b, status: 'cancelled' } : b)
    )
  }

  return (
    <DashboardLayout title="Admin">
      <div className="max-w-6xl mx-auto space-y-10">

        <div className="space-y-1">
          <p className="text-zinc-500 text-sm">Platform overview</p>
          <h2 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Admin Dashboard
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Briefcase}   label="Total Providers" value={loadingProviders  ? '—' : providers.length}                          iconColor="bg-amber-500/10 text-amber-400" />
          <StatCard icon={ShieldCheck} label="Verified"        value={loadingProviders  ? '—' : providers.filter((p) => p.isVerified).length} iconColor="bg-emerald-500/10 text-emerald-400" />
          <StatCard icon={FolderKanban} label="Categories"     value={loadingCategories ? '—' : categories.length}                         iconColor="bg-blue-500/10 text-blue-400" />
          <StatCard icon={Wrench}      label="Services"        value={loadingServices   ? '—' : services.length}                           iconColor="bg-purple-500/10 text-purple-400" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ProvidersSection providers={providers} loading={loadingProviders} onVerify={handleVerifyProvider} />
          <CategoriesSection
            categories={categories} loading={loadingCategories}
            onCreate={handleCreateCategory} onUpdate={handleUpdateCategory} onDelete={handleDeleteCategory}
          />
        </div>

        <ServicesSection
          services={services} categories={categories} loading={loadingServices}
          onCreate={handleCreateService} onDelete={handleDeleteService}
        />

        <BookingsSection bookings={bookings} loading={loadingBookings} onForceCancel={handleForceCancel} />

      </div>
    </DashboardLayout>
  )
}