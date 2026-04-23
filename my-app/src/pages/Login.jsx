import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'

export default function Login() {
  const [mode, setMode] = useState('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)
  const [resending, setResending] = useState(false)
  const { signInWithPassword, signInWithMagicLink } = useAuth()
  const navigate = useNavigate()

  async function handlePasswordLogin(e) {
    e.preventDefault()
    setError('')
    setNeedsConfirmation(false)
    setSubmitting(true)

    const { error } = await signInWithPassword(email, password)
    setSubmitting(false)

    if (error) {
      if (error.message.toLowerCase().includes('confirm your email')) {
        setNeedsConfirmation(true)
      }
      setError(error.message)
    } else {
      navigate('/dashboard')
    }
  }

  async function handleResendConfirmation() {
    setResending(true)
    setMessage('')
    try {
      const data = await api('/api/auth/resend-confirmation', {
        method: 'POST',
        body: { email },
      })
      setMessage(data.message)
      setNeedsConfirmation(false)
      setError('')
    } catch (err) {
      setError(err.message)
    }
    setResending(false)
  }

  async function handleMagicLink(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)

    const { error } = await signInWithMagicLink(email)
    setSubmitting(false)

    if (error) {
      setError(error.message)
    } else {
      setMessage('Check your email for the login link!')
    }
  }

  const inputClasses = 'w-full px-4 py-2.5 border border-nu-gray-200 dark:border-dark-border rounded-lg text-nu-black dark:text-dark-text bg-white dark:bg-dark-card placeholder:text-nu-gray-400 dark:placeholder:text-dark-muted focus:outline-none focus:ring-2 focus:ring-nu-red focus:border-transparent'

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-3xl font-heading font-bold text-nu-black dark:text-dark-text mb-2">Welcome back</h1>
      <p className="text-nu-gray-500 dark:text-dark-muted mb-8">Sign in to your NU Co-op Connect account</p>

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => { setMode('password'); setError(''); setMessage('') }}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'password'
              ? 'bg-nu-red text-white'
              : 'bg-nu-gray-100 dark:bg-dark-card text-nu-gray-600 dark:text-dark-muted hover:bg-nu-gray-200 dark:hover:bg-dark-border'
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => { setMode('magic'); setError(''); setMessage('') }}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            mode === 'magic'
              ? 'bg-nu-red text-white'
              : 'bg-nu-gray-100 dark:bg-dark-card text-nu-gray-600 dark:text-dark-muted hover:bg-nu-gray-200 dark:hover:bg-dark-border'
          }`}
        >
          Magic Link
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
          <p>{error}</p>
          {needsConfirmation && (
            <button
              type="button"
              onClick={handleResendConfirmation}
              disabled={resending}
              className="mt-2 text-nu-red font-medium underline hover:text-nu-red-light disabled:opacity-50"
            >
              {resending ? 'Sending...' : 'Resend confirmation email'}
            </button>
          )}
        </div>
      )}

      {message && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm rounded-lg px-4 py-3 mb-4">
          {message}
        </div>
      )}

      {mode === 'password' ? (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-nu-gray-700 dark:text-dark-text mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@northeastern.edu"
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-nu-gray-700 dark:text-dark-text mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClasses}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-nu-red text-white font-semibold rounded-lg hover:bg-nu-red-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleMagicLink} className="space-y-4">
          <div>
            <label htmlFor="magic-email" className="block text-sm font-medium text-nu-gray-700 dark:text-dark-text mb-1">
              Email
            </label>
            <input
              id="magic-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@northeastern.edu"
              className={inputClasses}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-nu-red text-white font-semibold rounded-lg hover:bg-nu-red-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Sending link...' : 'Send Magic Link'}
          </button>
        </form>
      )}

      <p className="text-center text-sm text-nu-gray-500 dark:text-dark-muted mt-6">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="text-nu-red font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
