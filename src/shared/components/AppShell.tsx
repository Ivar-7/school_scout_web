import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

const navigation = [
  { to: '/', label: 'Home' },
  { to: '/auth/login', label: 'Auth' },
  { to: '/schools', label: 'Schools' },
  { to: '/finance/fees', label: 'Finance' },
  { to: '/communication/messages', label: 'Communication' },
  { to: '/applications', label: 'Applications' },
  { to: '/social/reviews', label: 'Social' },
  { to: '/monetization/subscriptions', label: 'Monetization' },
  { to: '/utilities/notifications', label: 'Utilities' },
]

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.16),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(251,146,60,0.12),_transparent_28%),rgb(var(--background))] text-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-700">
              School Finder
            </p>
            <h1 className="mt-1 text-lg font-semibold text-slate-950">Architecture shell</h1>
          </div>

          <nav className="flex flex-wrap gap-2">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  [
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-teal-600 text-white'
                      : 'bg-teal-50 text-teal-800 hover:bg-teal-600 hover:text-white',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  )
}