import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Wrench,
  Zap,
  ShieldCheck,
  Star,
  MapPin,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

const categories = [
  { icon: '🔧', label: 'Plumbing', count: '120+ pros' },
  { icon: '⚡', label: 'Electrical', count: '98+ pros' },
  { icon: '🏠', label: 'Cleaning', count: '200+ pros' },
  { icon: '🌿', label: 'Gardening', count: '75+ pros' },
  { icon: '🎨', label: 'Painting', count: '60+ pros' },
  { icon: '❄️', label: 'HVAC', count: '45+ pros' },
]

const steps = [
  {
    num: '01',
    title: 'Browse Services',
    desc: 'Explore categories and find exactly the service you need.',
  },
  {
    num: '02',
    title: 'Pick a Pro',
    desc: 'Review profiles, ratings, and experience before choosing.',
  },
  {
    num: '03',
    title: 'Book & Relax',
    desc: 'Schedule instantly. Track progress from your dashboard.',
  },
]

const stats = [
  { value: '2,400+', label: 'Verified Pros' },
  { value: '18,000+', label: 'Jobs Completed' },
  { value: '4.9', label: 'Avg. Rating' },
  { value: '50+', label: 'Cities Covered' },
]

function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span
            className="text-xl font-bold text-white tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            urbi<span className="text-amber-400">dore</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {['Services', 'How it works', 'For Pros'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/sign-in">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-white/5">
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
  )
}


function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0a]">

      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(circle, #71717a 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-20 grid md:grid-cols-2 gap-16 items-center">

        <div className="space-y-8">
          <Badge className="inline-flex items-center gap-1.5 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded-full px-3 py-1 text-xs font-medium">
            <Sparkles size={11} />
            Local services, reimagined
          </Badge>

          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Your home,
            <br />
            <span className="text-amber-400">handled.</span>
          </h1>

          <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
            Connect with trusted local professionals for any home service.
            Fast booking, verified pros, guaranteed quality.
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <Link to="/sign-up">
              <Button
                size="lg"
                className="bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-full px-7 gap-2"
              >
                Book a service <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/sign-up?role=provider">
              <Button
                size="lg"
                variant="ghost"
                className="text-zinc-300 hover:text-white hover:bg-white/5 rounded-full px-7 gap-2"
              >
                Join as a pro <ChevronRight size={16} />
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex -space-x-2">
              {['🧑🏽', '👩🏻', '👨🏿', '👩🏼'].map((e, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm"
                >
                  {e}
                </div>
              ))}
            </div>
            <div className="text-sm text-zinc-400">
              <span className="text-white font-medium">2,400+</span> verified pros ready
            </div>
          </div>
        </div>

        <div className="relative hidden md:flex justify-center">
          <div className="relative w-full max-w-sm">
            {/* Main card */}
            <div className="bg-zinc-900 border border-white/8 rounded-2xl p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">Nearby Pros</span>
                <Badge className="bg-emerald-500/15 text-emerald-400 border-0 text-xs rounded-full">
                  Live
                </Badge>
              </div>

              {[
                { name: 'Marcus J.', service: 'Plumber', rating: 4.9, dist: '0.4 mi' },
                { name: 'Aisha K.', service: 'Electrician', rating: 4.8, dist: '0.7 mi' },
                { name: 'Leo R.', service: 'Cleaner', rating: 5.0, dist: '1.1 mi' },
              ].map((pro) => (
                <div key={pro.name} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-base font-semibold text-white">
                    {pro.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{pro.name}</p>
                    <p className="text-xs text-zinc-500">{pro.service}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-white flex items-center gap-1 justify-end">
                      <Star size={10} className="fill-amber-400 text-amber-400" />
                      {pro.rating}
                    </p>
                    <p className="text-xs text-zinc-500 flex items-center gap-1">
                      <MapPin size={9} />
                      {pro.dist}
                    </p>
                  </div>
                </div>
              ))}

              <Button className="w-full bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-xl text-sm">
                See all pros near you
              </Button>
            </div>

            <div className="absolute -top-4 -right-4 bg-zinc-900 border border-white/8 rounded-xl px-3 py-2 flex items-center gap-2 shadow-xl">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span className="text-xs text-white font-medium">Verified & insured</span>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-zinc-900 border border-white/8 rounded-xl px-3 py-2 flex items-center gap-2 shadow-xl">
              <Zap size={14} className="text-amber-400" />
              <span className="text-xs text-white font-medium">Instant booking</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


function StatsBar() {
  return (
    <section className="bg-zinc-900/50 border-y border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div key={s.label} className="text-center space-y-1">
            <p
              className="text-3xl font-bold text-white"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {s.value}
            </p>
            <p className="text-sm text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#0a0a0a] py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <Badge className="bg-white/5 text-zinc-400 border border-white/10 rounded-full text-xs px-3 py-1">
            Simple process
          </Badge>
          <h2
            className="text-4xl md:text-5xl font-bold text-white tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Three steps to done
          </h2>
          <p className="text-zinc-500 max-w-md mx-auto">
            From browsing to booked in under two minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">

          {steps.map((step) => (
            <div
              key={step.num}
              className="group relative bg-zinc-900/60 border border-white/6 rounded-2xl p-8 hover:border-amber-400/20 hover:bg-zinc-900 transition-all duration-300"
            >
              <span
                className="text-5xl font-bold text-white/5 group-hover:text-amber-400/10 transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {step.num}
              </span>
              <h3 className="mt-3 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


function Categories() {
  return (
    <section id="services" className="bg-zinc-900/30 py-28 px-6 border-y border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <Badge className="bg-white/5 text-zinc-400 border border-white/10 rounded-full text-xs px-3 py-1">
              What we offer
            </Badge>
            <h2
              className="text-4xl md:text-5xl font-bold text-white tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Every service,
              <br />
              one platform.
            </h2>
          </div>
          <Link to="/sign-up">
            <Button
              variant="ghost"
              className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-full gap-2 shrink-0"
            >
              Browse all <ArrowRight size={14} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.label}
              className="group bg-zinc-900 border border-white/6 rounded-2xl p-6 flex items-center gap-4 hover:border-amber-400/20 hover:bg-zinc-800/80 transition-all duration-200 cursor-pointer"
            >
              <span className="text-3xl">{cat.icon}</span>
              <div>
                <p className="font-medium text-white text-sm">{cat.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{cat.count}</p>
              </div>
              <ChevronRight
                size={14}
                className="text-zinc-600 group-hover:text-amber-400 ml-auto transition-colors"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── For Pros CTA ─────────────────────────────────────────────────────────────

function ForPros() {
  return (
    <section id="for-pros" className="bg-[#0a0a0a] py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="relative bg-zinc-900 border border-white/8 rounded-3xl p-10 md:p-16 overflow-hidden">
          {/* Background glow */}
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <Badge className="bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded-full text-xs px-3 py-1">
                For professionals
              </Badge>
              <h2
                className="text-4xl md:text-5xl font-bold text-white tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Grow your
                <br />
                business with us.
              </h2>
              <p className="text-zinc-400 leading-relaxed">
                Join thousands of professionals already earning more with Urbidore.
                Set your schedule, manage bookings, and get paid — all in one place.
              </p>
              <Link to="/sign-up?role=provider">
                <Button
                  size="lg"
                  className="bg-amber-400 hover:bg-amber-300 text-black font-semibold rounded-full px-7 gap-2 mt-2"
                >
                  <Wrench size={16} />
                  Apply as a pro
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Zap size={18} className="text-amber-400" />, title: 'Instant payouts', desc: 'Get paid right after job completion.' },
                { icon: <ShieldCheck size={18} className="text-emerald-400" />, title: 'Verified badge', desc: 'Build trust with a verified profile.' },
                { icon: <Star size={18} className="text-blue-400" />, title: 'Review system', desc: 'Earn ratings that bring more clients.' },
                { icon: <MapPin size={18} className="text-rose-400" />, title: 'Local reach', desc: 'Get discovered by customers near you.' },
              ].map((f) => (
                <div
                  key={f.title}
                  className="bg-zinc-800/60 border border-white/5 rounded-xl p-4 space-y-2"
                >
                  {f.icon}
                  <p className="text-sm font-medium text-white">{f.title}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-zinc-900/40 border-t border-white/5 px-6 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <span
          className="text-lg font-bold text-white tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          urbi<span className="text-amber-400">dore</span>
        </span>

        <div className="flex items-center gap-6 text-sm text-zinc-500">
          {['Privacy', 'Terms', 'Support', 'About'].map((item) => (
            <a key={item} href="#" className="hover:text-white transition-colors">
              {item}
            </a>
          ))}
        </div>

        <p className="text-xs text-zinc-600">
          © {new Date().getFullYear()} Urbidore. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <Navbar />
      <Hero />
      <StatsBar />
      <HowItWorks />
      <Categories />
      <ForPros />
      <Footer />
    </div>
  )
}