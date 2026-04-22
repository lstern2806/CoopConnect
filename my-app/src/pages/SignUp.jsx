import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { signUp } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setSubmitting(true)
    const { error } = await signUp(email, password)
    setSubmitting(false)

    if (error) {
      setError(error.message)
    } else {
      setMessage('Check your email for a confirmation link!')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-3xl font-heading font-bold text-nu-black mb-2">Create your account</h1>
      <p className="text-nu-gray-500 mb-8">Use your Northeastern email to get started</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-4">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-nu-gray-700 mb-1">
            Northeastern Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@northeastern.edu"
            className="w-full px-4 py-2.5 border border-nu-gray-200 rounded-lg text-nu-black placeholder:text-nu-gray-400 focus:outline-none focus:ring-2 focus:ring-nu-red focus:border-transparent"
          />
          <p className="text-xs text-nu-gray-400 mt-1">
            Only @northeastern.edu and @husky.neu.edu emails accepted
          </p>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-nu-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="w-full px-4 py-2.5 border border-nu-gray-200 rounded-lg text-nu-black placeholder:text-nu-gray-400 focus:outline-none focus:ring-2 focus:ring-nu-red focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-nu-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            className="w-full px-4 py-2.5 border border-nu-gray-200 rounded-lg text-nu-black placeholder:text-nu-gray-400 focus:outline-none focus:ring-2 focus:ring-nu-red focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-nu-red text-white font-semibold rounded-lg hover:bg-nu-red-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-nu-gray-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-nu-red font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
