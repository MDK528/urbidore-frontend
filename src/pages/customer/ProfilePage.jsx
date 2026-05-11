import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Save, User, MapPin } from 'lucide-react'
import { getMe } from '../../api/auth.api'

const inputClass =
  'bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 focus-visible:border-amber-400/40 focus-visible:ring-amber-400/30 h-11 rounded-xl'

export default function CustomerProfilePage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    address: '',
    avatarUrl: '',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getMe()
      .then((res) => {
        const d = res.data.data
        setForm({
          firstName: d.firstName || '',
          lastName: d.lastName || '',
          phone: d.phone || '',
          gender: d.gender || '',
          address: d.address || '',
          avatarUrl: d.avatar || '',
        })
      })
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setSuccess(false)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      await updateMe(form)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Profile">
        <div className="flex items-center gap-2 text-zinc-500 text-sm pt-10">
          <Loader2 size={15} className="animate-spin" /> Loading profile...
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-2xl mx-auto space-y-8">

        <div className="space-y-1">
          <h2
            className="text-3xl font-bold text-white tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            My Profile
          </h2>
          <p className="text-zinc-500 text-sm">
            Manage your personal information.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl font-bold text-white shrink-0">
            {form.firstName?.[0]}{form.lastName?.[0]}
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              {form.firstName} {form.lastName}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">Customer account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="bg-zinc-900 border border-white/6 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <User size={15} className="text-zinc-400" />
              <h3 className="text-sm font-semibold text-white">Personal Information</h3>
            </div>
            <Separator className="bg-white/5" />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300 text-sm">First name</Label>
                <Input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300 text-sm">Last name</Label>
                <Input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm">Phone</Label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 234 567 8900"
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm">Gender</Label>
              <Select
                value={form.gender}
                onValueChange={(val) => {
                  setForm((prev) => ({ ...prev, gender: val }))
                  setSuccess(false)
                }}
              >
                <SelectTrigger className="w-[49%] bg-zinc-900 border-white/10 text-white text-sm h-11 rounded-xl px-3  focus-visible:ring-amber-400/40 focus-visible:border-amber-400/40">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border border-white/10 text-white">
                    <SelectGroup>
                      <SelectLabel className="text-zinc-500">Gender</SelectLabel>
                      <SelectItem value="male" className="text-white cursor-pointer">Male</SelectItem>
                      <SelectItem value="female" className="text-white cursor-pointer">Female</SelectItem>
                    </SelectGroup>
                  </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm">Avatar URL</Label>
              <Input
                name="avatarUrl"
                value={form.avatarUrl}
                onChange={handleChange}
                placeholder="https://..."
                className={inputClass}
              />
            </div>
          </div>

          <div className="bg-zinc-900 border border-white/6 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={15} className="text-zinc-400" />
              <h3 className="text-sm font-semibold text-white">Location</h3>
            </div>
            <Separator className="bg-white/5" />

            <div className="space-y-2">
              <Label className="text-zinc-300 text-sm">Address</Label>
              <Input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="123 Main St, City"
                className={inputClass}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-xl px-4 py-3">
              Profile updated successfully.
            </p>
          )}

          <Button
            type="submit"
            disabled={saving}
            className="w-full bg-amber-400 hover:bg-amber-300 text-black font-semibold h-11 rounded-xl gap-2"
          >
            {saving ? (
              <><Loader2 size={15} className="animate-spin" /> Saving...</>
            ) : (
              <><Save size={15} /> Save Changes</>
            )}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  )
}