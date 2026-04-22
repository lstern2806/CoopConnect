import { createContext, useState, useEffect } from 'react'
import { api } from '../lib/api'

export const AuthContext = createContext(null)

const TOKEN_KEY = 'coopconnect_session'

function saveSession(session) {
  if (session) {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(session))
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

function loadSession() {
  try {
    const raw = localStorage.getItem(TOKEN_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function restoreSession() {
      const stored = loadSession()
      if (!stored?.access_token) {
        setLoading(false)
        return
      }

      try {
        const data = await api('/api/auth/me', { token: stored.access_token })
        setUser(data.user)
        setSession(stored)
      } catch {
        // Token expired — try refresh
        if (stored.refresh_token) {
          try {
            const refreshed = await api('/api/auth/refresh', {
              method: 'POST',
              body: { refresh_token: stored.refresh_token },
            })
            setUser(refreshed.user)
            setSession(refreshed.session)
            saveSession(refreshed.session)
          } catch {
            saveSession(null)
          }
        } else {
          saveSession(null)
        }
      }

      setLoading(false)
    }

    restoreSession()
  }, [])

  async function signUp(email, password) {
    try {
      const data = await api('/api/auth/signup', {
        method: 'POST',
        body: { email, password },
      })
      if (data.session) {
        setUser(data.user)
        setSession(data.session)
        saveSession(data.session)
      }
      return { data, error: null }
    } catch (err) {
      return { data: null, error: { message: err.message } }
    }
  }

  async function signInWithPassword(email, password) {
    try {
      const data = await api('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      setUser(data.user)
      setSession(data.session)
      saveSession(data.session)
      return { data, error: null }
    } catch (err) {
      return { data: null, error: { message: err.message } }
    }
  }

  async function signInWithMagicLink(email) {
    try {
      const data = await api('/api/auth/magic-link', {
        method: 'POST',
        body: { email },
      })
      return { data, error: null }
    } catch (err) {
      return { data: null, error: { message: err.message } }
    }
  }

  async function signOut() {
    setUser(null)
    setSession(null)
    saveSession(null)
    return { error: null }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signInWithPassword,
    signInWithMagicLink,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
