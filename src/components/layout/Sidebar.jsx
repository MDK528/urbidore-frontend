import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard,
  CalendarDays,
  Star,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Briefcase,
  Users,
  FolderOpen,
  Wrench,
  ChevronRight,
  ToggleLeft,
} from 'lucide-react'


const navItems = {
  customer: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
    { label: 'My Bookings', icon: CalendarDays, to: '/dashboard/bookings' },
    { label: 'Browse Pros', icon: Users, to: '/providers' },
    { label: 'Reviews', icon: Star, to: '/dashboard/reviews' },
    { label: 'Profile', icon: User, to: '/dashboard/profile' },
  ],
  provider: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/provider/dashboard' },
    { label: 'Bookings', icon: CalendarDays, to: '/provider/bookings' },
    { label: 'My Services', icon: Wrench, to: '/provider/services' },
    { label: 'Availability', icon: ToggleLeft, to: '/provider/availability' },
    { label: 'Profile', icon: User, to: '/provider/profile' },
  ],
  admin: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
    { label: 'Providers', icon: Briefcase, to: '/admin/providers' },
    { label: 'Customers', icon: Users, to: '/admin/customers' },
    { label: 'Categories', icon: FolderOpen, to: '/admin/categories' },
    { label: 'Services', icon: Wrench, to: '/admin/services' },
    { label: 'Bookings', icon: CalendarDays, to: '/admin/bookings' },
  ],
}

const bottomItems = [
  { label: 'Settings', icon: Settings, to: '/settings' },
]


const roleMeta = {
  customer: { label: 'Customer', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  provider: { label: 'Provider', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  admin: { label: 'Admin', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
}


function NavItem({ item, collapsed, onClick }) {
  const location = useLocation()
  const isActive = location.pathname === item.to
  const Icon = item.icon

  return (
    <Link
      to={item.to}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
        ${isActive
          ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
          : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
        }
        ${collapsed ? 'justify-center' : ''}
      `}
    >
      <Icon size={17} className="shrink-0" />
      {!collapsed && <span>{item.label}</span>}
      {!collapsed && isActive && (
        <ChevronRight size={13} className="ml-auto text-amber-400/60" />
      )}
    </Link>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const role = user?.role || 'customer'
  const items = navItems[role] || []
  const meta = roleMeta[role]

  const handleLogout = async () => {
    await logout()
    navigate('/sign-in')
  }

  const sidebarContent = (
    <div className={`flex flex-col h-full ${collapsed ? 'w-16' : 'w-60'} transition-all duration-200`}>
      {/* Logo + collapse toggle */}
      <div className={`flex items-center h-16 px-4 border-b border-white/5 shrink-0 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <Link to="/" className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            urbi<span className="text-amber-400">dore</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed((p) => !p)}
          className="hidden lg:flex w-7 h-7 items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Menu size={15} />
        </button>
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="px-4 py-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-semibold text-white shrink-0">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="mt-3">
            <Badge className={`text-xs border rounded-full px-2 py-0.5 font-medium ${meta.color}`}>
              {role === 'admin' && <ShieldCheck size={10} className="mr-1" />}
              {meta.label}
            </Badge>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {items.map((item) => (
          <NavItem
            key={item.to}
            item={item}
            collapsed={collapsed}
            onClick={onMobileClose}
          />
        ))}
      </nav>

      <Separator className="bg-white/5" />

      {/* Bottom items */}
      <div className="px-3 py-3 space-y-1 shrink-0">
        {bottomItems.map((item) => (
          <NavItem
            key={item.to}
            item={item}
            collapsed={collapsed}
            onClick={onMobileClose}
          />
        ))}
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
            text-zinc-400 hover:text-red-400 hover:bg-red-400/5 transition-all duration-150 border border-transparent
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <LogOut size={17} className="shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex h-screen sticky top-0 bg-zinc-950 border-r border-white/5 overflow-hidden shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          {/* Drawer */}
          <aside className="relative z-10 flex bg-zinc-950 border-r border-white/5 h-full">
            <div className="absolute top-4 right-4">
              <button
                onClick={onMobileClose}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5"
              >
                <X size={15} />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}