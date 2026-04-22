import { Link } from 'react-router'

export default function Landing() {
  return (
    <div className="min-h-screen bg-nu-black font-body">
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl sm:text-6xl font-heading font-bold text-white mb-4">
          NU <span className="text-nu-red-light">Co-op Connect</span>
        </h1>
        <p className="text-lg text-nu-gray-400 max-w-xl mx-auto mb-10">
          Your personal hub for the co-op journey. Anonymous reviews, alumni networking,
          application tracking, and curated resources — all in one place.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/signup"
            className="px-6 py-3 bg-nu-red text-white font-semibold rounded-lg hover:bg-nu-red-light transition-colors"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 border border-nu-gray-600 text-nu-gray-400 font-semibold rounded-lg hover:border-nu-gray-400 hover:text-white transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
