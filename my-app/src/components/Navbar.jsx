import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import ThemeToggle from './ThemeToggle'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/tracker', label: 'Tracker' },
  { to: '/networking', label: 'Network' },
  { to: '/resources', label: 'Resources' },
]

export default function Navbar() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
  }

  return (
    <nav className="bg-white dark:bg-dark-surface border-b border-nu-gray-200 dark:border-dark-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-heading font-bold text-nu-red">NU</span>
            <span className="text-xl font-heading font-bold text-nu-black dark:text-dark-text">Co-op Connect</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === link.to
                    ? 'bg-nu-red/10 text-nu-red'
                    : 'text-nu-gray-600 dark:text-dark-muted hover:bg-nu-gray-100 dark:hover:bg-dark-card hover:text-nu-black dark:hover:text-dark-text'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/profile"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                location.pathname === '/profile'
                  ? 'bg-nu-red/10 text-nu-red'
                  : 'text-nu-gray-600 dark:text-dark-muted hover:bg-nu-gray-100 dark:hover:bg-dark-card'
              }`}
            >
              Profile
            </Link>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 rounded-full bg-nu-red text-white text-sm font-bold flex items-center justify-center"
              >
                {user?.email?.[0]?.toUpperCase() || '?'}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card border border-nu-gray-200 dark:border-dark-border rounded-lg shadow-lg py-1 z-50">
                  <p className="px-4 py-2 text-xs text-nu-gray-400 dark:text-dark-muted truncate">{user?.email}</p>
                  <hr className="border-nu-gray-100 dark:border-dark-border" />
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-nu-gray-700 dark:text-dark-text hover:bg-nu-gray-100 dark:hover:bg-dark-border"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-nu-gray-600 dark:text-dark-muted hover:text-nu-black dark:hover:text-dark-text"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-nu-gray-100 dark:border-dark-border">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded-lg ${
                  location.pathname === link.to
                    ? 'bg-nu-red/10 text-nu-red'
                    : 'text-nu-gray-600 dark:text-dark-muted hover:bg-nu-gray-100 dark:hover:bg-dark-card'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/profile"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-nu-gray-600 dark:text-dark-muted hover:bg-nu-gray-100 dark:hover:bg-dark-card rounded-lg"
            >
              Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-3 py-2 text-sm font-medium text-nu-gray-600 dark:text-dark-muted hover:bg-nu-gray-100 dark:hover:bg-dark-card rounded-lg"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
