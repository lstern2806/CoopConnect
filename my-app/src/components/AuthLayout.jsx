import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export default function AuthLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nu-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-nu-red border-t-transparent" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-nu-gray-100 font-body px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-nu-gray-200 p-8">
        <Outlet />
      </div>
    </div>
  )
}
