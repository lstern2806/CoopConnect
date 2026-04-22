import { createContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export const AuthContext = createContext(null)

const NU_DOMAINS = ['northeastern.edu', 'husky.neu.edu']

function isNuEmail(email) {
  const domain = email.split('@')[1]?.toLowerCase()
  return NU_DOMAINS.includes(domain)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function signUp(email, password) {
    if (!isNuEmail(email)) {
      return { error: { message: 'Only @northeastern.edu and @husky.neu.edu emails are allowed.' } }
    }
    const { data, error } = await supabase.auth.signUp({ email, password })
    return { data, error }
  }

  async function signInWithPassword(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  async function signInWithMagicLink(email) {
    if (!isNuEmail(email)) {
      return { error: { message: 'Only @northeastern.edu and @husky.neu.edu emails are allowed.' } }
    }
    const { data, error } = await supabase.auth.signInWithOtp({ email })
    return { data, error }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
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
