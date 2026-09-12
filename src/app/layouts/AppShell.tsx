import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Sun, Moon, LogOut, Bell } from 'lucide-react'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { useTheme } from '../../shared/hooks/useTheme'
import { useNotifications } from '../../features/utilities/hooks/useUtilities'

const PUBLIC_NAV = [
  { to: '/', label: 'Home' },
  { to: '/schools', label: 'Schools' },
  { to: '/finance/fees', label: 'Finance' },
  { to: '/social/reviews', label: 'Social' },
]

const AUTH_NAV = [
  { to: '/applications', label: 'Applications' },
  { to: '/communication/messages', label: 'Messages' },
  { to: '/communication/visits', label: 'Visits' },
  { to: '/utilities/shortlists', label: 'Shortlist' },
  { to: '/monetization/subscriptions', label: 'Subscription' },
]

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { isAuthenticated, profile, signOut } = useAuth()
  const { effectiveTheme, setPreference } = useTheme()
  const { unreadCount } = useNotifications()
  const navigate = useNavigate()

  const navigation = isAuthenticated ? [...PUBLIC_NAV, ...AUTH_NAV] : PUBLIC_NAV

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-surface/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-strong">
                Elimu Connect
              </p>
              <h1 className="mt-1 text-lg font-semibold text-foreground">Find the right school</h1>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  [
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand text-white'
                      : 'bg-brand-soft text-brand-strong hover:bg-brand hover:text-white',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}

            {isAuthenticated && profile?.role === 'school' && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  [
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand text-white'
                      : 'bg-brand-soft text-brand-strong hover:bg-brand hover:text-white',
                  ].join(' ')
                }
              >
                Dashboard
              </NavLink>
            )}

            {isAuthenticated && (
              <NavLink
                to="/utilities/notifications"
                aria-label="Notifications"
                className="relative rounded-full border border-border p-2 text-foreground transition-colors hover:bg-background"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </NavLink>
            )}

            <button
              type="button"
              onClick={() => setPreference(effectiveTheme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="rounded-full border border-border p-2 text-foreground transition-colors hover:bg-background"
            >
              {effectiveTheme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background"
              >
                <LogOut className="h-4 w-4" />
                {profile?.displayName ?? 'Sign out'}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/auth/login"
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background"
                >
                  Sign in
                </NavLink>
                <NavLink
                  to="/auth/register"
                  className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
                >
                  Register
                </NavLink>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  )
}
