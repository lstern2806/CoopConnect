import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router'

const QUICK_LINKS = [
  { to: '/reviews', label: 'Browse Reviews', emoji: '💬', description: 'Read anonymous co-op reviews from other Huskies' },
  { to: '/tracker', label: 'Application Tracker', emoji: '📋', description: 'Track your co-op applications in a Kanban board' },
  { to: '/networking', label: 'Network', emoji: '🤝', description: 'Connect with alumni and peers who\'ve opted in' },
  { to: '/resources', label: 'Resources', emoji: '📚', description: 'Curated links for interview prep, research, and more' },
]

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-3xl font-heading font-bold text-nu-black mb-1">Welcome back!</h1>
      <p className="text-nu-gray-500 mb-8">{user?.email}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="block p-5 bg-white border border-nu-gray-200 rounded-xl hover:border-nu-red/30 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{link.emoji}</span>
              <h2 className="text-lg font-heading font-bold text-nu-black group-hover:text-nu-red transition-colors">
                {link.label}
              </h2>
            </div>
            <p className="text-sm text-nu-gray-500">{link.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
