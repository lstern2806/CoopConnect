import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import ThemeToggle from './ThemeToggle'

export default function AuthLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nu-gray-100 dark:bg-dark-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-nu-red border-t-transparent" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-nu-gray-100 dark:bg-dark-bg font-body px-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-nu-gray-200 dark:border-dark-border p-8">
        <Outlet />
      </div>
    </div>
  )
}
