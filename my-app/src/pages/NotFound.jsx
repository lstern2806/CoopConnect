import { Link } from 'react-router'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-nu-gray-100 font-body">
      <div className="text-center">
        <h1 className="text-6xl font-heading font-bold text-nu-red mb-4">404</h1>
        <p className="text-lg text-nu-gray-500 mb-6">Page not found</p>
        <Link
          to="/dashboard"
          className="px-6 py-2.5 bg-nu-red text-white font-semibold rounded-lg hover:bg-nu-red-light transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
