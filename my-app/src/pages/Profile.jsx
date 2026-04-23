import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { hasProfanity } from '../lib/profanity'
import { api } from '../lib/api'

const COOP_CYCLES = [
  'Spring 2025', 'Summer 2025', 'Fall 2025',
  'Spring 2026', 'Summer 2026', 'Fall 2026',
  'Spring 2027', 'Summer 2027', 'Fall 2027',
]

const FIELD_LIMITS = {
  full_name: 100,
  major: 100,
  bio: 300,
}

function CharCounter({ value, max }) {
  const len = value?.length || 0
  const near = len > max * 0.8
  const over = len > max
  return (
    <span className={`text-xs ${over ? 'text-red-500 font-semibold' : near ? 'text-nu-orange' : 'text-nu-gray-400 dark:text-dark-muted'}`}>
      {len}/{max}
    </span>
  )
}

export default function Profile() {
  const { user, session } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [profanityWarning, setProfanityWarning] = useState('')
  const [interestInput, setInterestInput] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await api('/api/profiles/me', { token: session.access_token })
        setProfile(data)
      } catch (err) {
        setError('Failed to load profile.')
      }
      setLoading(false)
    }

    if (session) loadProfile()
  }, [session])

  function updateField(field, value) {
    const limit = FIELD_LIMITS[field]
    if (limit && value.length > limit) return

    if (hasProfanity(value)) {
      setProfanityWarning(`Please remove inappropriate language from ${field.replace('_', ' ')}.`)
    } else {
      setProfanityWarning('')
    }

    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  function addInterest() {
    const tag = interestInput.trim()
    if (!tag || tag.length > 50) return
    if (profile.interests?.includes(tag)) return
    if (hasProfanity(tag)) {
      setProfanityWarning('Please remove inappropriate language.')
      return
    }
    setProfanityWarning('')
    setProfile((prev) => ({ ...prev, interests: [...(prev.interests || []), tag] }))
    setInterestInput('')
  }

  function removeInterest(tag) {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.filter((t) => t !== tag),
    }))
  }

  async function handleSave(e) {
    e.preventDefault()
    if (profanityWarning) return

    setMessage('')
    setError('')
    setSaving(true)

    try {
      await api('/api/profiles/me', {
        method: 'PUT',
        token: session.access_token,
        body: {
          full_name: profile.full_name,
          major: profile.major,
          graduation_year: profile.graduation_year,
          coop_cycle: profile.coop_cycle,
          interests: profile.interests,
          bio: profile.bio,
        },
      })
      setMessage('Profile saved!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setError('Failed to save profile.')
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-nu-red border-t-transparent" />
      </div>
    )
  }

  const inputClasses = 'w-full px-4 py-2.5 border border-nu-gray-200 dark:border-dark-border rounded-lg text-nu-black dark:text-dark-text bg-white dark:bg-dark-card placeholder:text-nu-gray-400 dark:placeholder:text-dark-muted focus:outline-none focus:ring-2 focus:ring-nu-red focus:border-transparent'
  const selectClasses = 'w-full px-4 py-2.5 border border-nu-gray-200 dark:border-dark-border rounded-lg text-nu-black dark:text-dark-text bg-white dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-nu-red focus:border-transparent'

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-heading font-bold text-nu-black dark:text-dark-text mb-1">Your Profile</h1>
      <p className="text-nu-gray-500 dark:text-dark-muted mb-8">{user.email}</p>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}
      {message && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm rounded-lg px-4 py-3 mb-4">
          {message}
        </div>
      )}
      {profanityWarning && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
          {profanityWarning}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="full_name" className="text-sm font-medium text-nu-gray-700 dark:text-dark-text">Full Name</label>
            <CharCounter value={profile?.full_name} max={FIELD_LIMITS.full_name} />
          </div>
          <input
            id="full_name"
            type="text"
            value={profile?.full_name || ''}
            onChange={(e) => updateField('full_name', e.target.value)}
            placeholder="Your full name"
            className={`${inputClasses} ${
              hasProfanity(profile?.full_name) ? '!border-red-500 !bg-red-50 dark:!bg-red-900/20' : ''
            }`}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="major" className="text-sm font-medium text-nu-gray-700 dark:text-dark-text">Major</label>
            <CharCounter value={profile?.major} max={FIELD_LIMITS.major} />
          </div>
          <input
            id="major"
            type="text"
            value={profile?.major || ''}
            onChange={(e) => updateField('major', e.target.value)}
            placeholder="e.g. Computer Science"
            className={inputClasses}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="graduation_year" className="block text-sm font-medium text-nu-gray-700 dark:text-dark-text mb-1">
              Graduation Year
            </label>
            <select
              id="graduation_year"
              value={profile?.graduation_year || ''}
              onChange={(e) => updateField('graduation_year', e.target.value ? parseInt(e.target.value) : null)}
              className={selectClasses}
            >
              <option value="">Select year</option>
              {Array.from({ length: 8 }, (_, i) => 2024 + i).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="coop_cycle" className="block text-sm font-medium text-nu-gray-700 dark:text-dark-text mb-1">
              Co-op Cycle
            </label>
            <select
              id="coop_cycle"
              value={profile?.coop_cycle || ''}
              onChange={(e) => updateField('coop_cycle', e.target.value)}
              className={selectClasses}
            >
              <option value="">Select cycle</option>
              {COOP_CYCLES.map((cycle) => (
                <option key={cycle} value={cycle}>{cycle}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="bio" className="text-sm font-medium text-nu-gray-700 dark:text-dark-text">Bio</label>
            <CharCounter value={profile?.bio} max={FIELD_LIMITS.bio} />
          </div>
          <textarea
            id="bio"
            rows={3}
            value={profile?.bio || ''}
            onChange={(e) => updateField('bio', e.target.value)}
            placeholder="Tell us about yourself..."
            className={`${inputClasses} resize-none ${
              hasProfanity(profile?.bio) ? '!border-red-500 !bg-red-50 dark:!bg-red-900/20' : ''
            }`}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-nu-gray-700 dark:text-dark-text">Interests</label>
            <CharCounter value={interestInput} max={50} />
          </div>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
              placeholder="Add an interest and press Enter"
              maxLength={50}
              className={`flex-1 ${inputClasses}`}
            />
            <button
              type="button"
              onClick={addInterest}
              className="px-4 py-2.5 bg-nu-gray-100 dark:bg-dark-card border border-nu-gray-200 dark:border-dark-border rounded-lg text-nu-gray-700 dark:text-dark-text font-medium hover:bg-nu-gray-200 dark:hover:bg-dark-border transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile?.interests?.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-nu-red/10 text-nu-red text-sm rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeInterest(tag)}
                  className="text-nu-red hover:text-nu-red-light"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving || !!profanityWarning}
          className="w-full py-2.5 bg-nu-red text-white font-semibold rounded-lg hover:bg-nu-red-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}
