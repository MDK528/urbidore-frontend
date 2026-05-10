import { useState } from 'react'
import { Menu, Bell } from 'lucide-react'
import Sidebar from './Sidebar'
import { useAuth } from '../../context/AuthContext'
import { Button } from '@/components/ui/button'


function Topbar({ onMenuClick, title }) {
  const { user } = useAuth()

  return (
    <header className="h-16 border-b border-white/5 bg-[#0d0d0d] px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">

        <button
          onClick={onMenuClick}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Menu size={18} />
        </button>
        {title && (
          <h1
            className="text-lg font-semibold text-white tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3">

        <Button
          variant="ghost"
          size="icon"
          className="w-9 h-9 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl relative"
        >
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-400 rounded-full" />
        </Button>

        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-white">
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
      </div>
    </header>
  )
}

export default function DashboardLayout({ children, title }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#0d0d0d] overflow-hidden">
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          onMenuClick={() => setMobileOpen(true)}
          title={title}
        />
        <main className="flex-1 overflow-y-auto px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  )
}