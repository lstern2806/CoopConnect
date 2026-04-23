import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { hasProfanity } from '../lib/profanity'
import { api } from '../lib/api'

const COOP_CYCLES = [
  'Spring 2025', 'Summer 2025', 'Fall 2025',
  'Spring 2026', 'Summer 2026', 'Fall 2026',
  'Spring 2027', 'Summer 2027', 'Fall 2027',
]

const CULTURE_OPTIONS = [
  'Collaborative', 'Fast-paced', 'Relaxed', 'Mentorship-focused',
  'Startup culture', 'Corporate', 'Remote-friendly', 'Inclusive',
  'Competitive', 'Work-life balance',
]

const FIELD_LIMITS = {
  company_name: 50,
  role_title: 50,
  department: 50,
  description: 2000,
  skills_learned: 100,
  tools_used: 100,
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

export default function ReviewForm() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [profanityWarning, setProfanityWarning] = useState('')
  const [hoverRating, setHoverRating] = useState(0)

  const [form, setForm] = useState({
    company_name: '',
    role_title: '',
    department: '',
    coop_cycle: '',
    overall_rating: 0,
    description: '',
    skills_learned: '',
    tools_used: '',
    culture_tags: [],
    would_recommend: null,
  })

  function updateField(field, value) {
    const limit = FIELD_LIMITS[field]
    if (limit && value.length > limit) return

    if (hasProfanity(value)) {
      setProfanityWarning(`Please remove inappropriate language from ${field.replace('_', ' ')}.`)
    } else {
      setProfanityWarning('')
    }

    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function toggleCultureTag(tag) {
    setForm((prev) => ({
      ...prev,
      culture_tags: prev.culture_tags.includes(tag)
        ? prev.culture_tags.filter((t) => t !== tag)
        : [...prev.culture_tags, tag],
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (profanityWarning) return

    if (!form.company_name || !form.description || !form.overall_rating) {
      setError('Company name, rating, and description are required.')
      return
    }

    setError('')
    setSubmitting(true)

    try {
      await api('/api/reviews', {
        method: 'POST',
        token: session.access_token,
        body: {
          company_name: form.company_name,
          role_title: form.role_title || null,
          department: form.department || null,
          coop_cycle: form.coop_cycle || null,
          overall_rating: form.overall_rating,
          description: form.description,
          skills_learned: form.skills_learned ? form.skills_learned.split(',').map((s) => s.trim()).filter(Boolean) : [],
          tools_used: form.tools_used ? form.tools_used.split(',').map((s) => s.trim()).filter(Boolean) : [],
          culture_tags: form.culture_tags,
          would_recommend: form.would_recommend,
        },
      })
      navigate('/reviews')
    } catch (err) {
      setError(err.message)
    }

    setSubmitting(false)
  }

  const inputClasses = 'w-full px-4 py-2.5 border border-nu-gray-200 dark:border-dark-border rounded-lg text-nu-black dark:text-dark-text bg-white dark:bg-dark-card placeholder:text-nu-gray-400 dark:placeholder:text-dark-muted focus:outline-none focus:ring-2 focus:ring-nu-red focus:border-transparent'
  const selectClasses = 'w-full px-4 py-2.5 border border-nu-gray-200 dark:border-dark-border rounded-lg text-nu-black dark:text-dark-text bg-white dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-nu-red focus:border-transparent'

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-heading font-bold text-nu-black dark:text-dark-text mb-1">Write a Review</h1>
      <p className="text-nu-gray-500 dark:text-dark-muted mb-8">Your review is completely anonymous — no one can trace it back to you.</p>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}
      {profanityWarning && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
          {profanityWarning}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-nu-gray-700 dark:text-dark-text">Company Name *</label>
            <CharCounter value={form.company_name} max={FIELD_LIMITS.company_name} />
          </div>
          <input
            type="text"
            value={form.company_name}
            onChange={(e) => updateField('company_name', e.target.value)}
            placeholder="e.g. Google"
            className={`${inputClasses} ${hasProfanity(form.company_name) ? '!border-red-500 !bg-red-50 dark:!bg-red-900/20' : ''}`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-nu-gray-700 dark:text-dark-text">Role Title</label>
              <CharCounter value={form.role_title} max={FIELD_LIMITS.role_title} />
            </div>
            <input
              type="text"
              value={form.role_title}
              onChange={(e) => updateField('role_title', e.target.value)}
              placeholder="e.g. Marketing Analyst, Research Co-op"
              className={`${inputClasses} ${hasProfanity(form.role_title) ? '!border-red-500 !bg-red-50 dark:!bg-red-900/20' : ''}`}
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-nu-gray-700 dark:text-dark-text">Department</label>
              <CharCounter value={form.department} max={FIELD_LIMITS.department} />
            </div>
            <input
              type="text"
              value={form.department}
              onChange={(e) => updateField('department', e.target.value)}
              placeholder="e.g. Marketing, Finance, Operations"
              className={`${inputClasses} ${hasProfanity(form.department) ? '!border-red-500 !bg-red-50 dark:!bg-red-900/20' : ''}`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-nu-gray-700 dark:text-dark-text mb-1">Co-op Cycle</label>
          <select
            value={form.coop_cycle}
            onChange={(e) => setForm((prev) => ({ ...prev, coop_cycle: e.target.value }))}
            className={selectClasses}
          >
            <option value="">Select cycle</option>
            {COOP_CYCLES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-nu-gray-700 dark:text-dark-text mb-2">Overall Rating *</label>
          <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => {
              const display = hoverRating || form.overall_rating
              const full = display >= star
              const half = !full && display >= star - 0.5
              const isHovering = hoverRating > 0 && hoverRating !== form.overall_rating

              return (
                <div key={star} className="relative w-9 h-9 cursor-pointer transition-transform hover:scale-110">
                  <svg className="absolute inset-0 w-9 h-9 text-nu-gray-200 dark:text-dark-border" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {(full || half) && (
                    <svg className={`absolute inset-0 w-9 h-9 text-nu-orange transition-opacity ${isHovering ? 'opacity-35' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                      <defs>
                        <clipPath id={`form-star-${star}`}>
                          <rect x="0" y="0" width={full ? 20 : 10} height="20" />
                        </clipPath>
                      </defs>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipPath={`url(#form-star-${star})`} />
                    </svg>
                  )}
                  <div
                    className="absolute left-0 top-0 w-1/2 h-full z-10"
                    onMouseEnter={() => setHoverRating(star - 0.5)}
                    onClick={() => setForm((prev) => ({ ...prev, overall_rating: star - 0.5 }))}
                  />
                  <div
                    className="absolute right-0 top-0 w-1/2 h-full z-10"
                    onMouseEnter={() => setHoverRating(star)}
                    onClick={() => setForm((prev) => ({ ...prev, overall_rating: star }))}
                  />
                </div>
              )
            })}
          </div>
          {form.overall_rating > 0 && (
            <p className="text-sm text-nu-gray-500 dark:text-dark-muted mt-1.5">{form.overall_rating} out of 5</p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-nu-gray-700 dark:text-dark-text">Your Review *</label>
            <CharCounter value={form.description} max={FIELD_LIMITS.description} />
          </div>
          <textarea
            rows={6}
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="What was your experience like? What did you learn? Would you recommend this co-op?"
            className={`${inputClasses} resize-none ${hasProfanity(form.description) ? '!border-red-500 !bg-red-50 dark:!bg-red-900/20' : ''}`}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-nu-gray-700 dark:text-dark-text">Skills Learned</label>
            <CharCounter value={form.skills_learned} max={FIELD_LIMITS.skills_learned} />
          </div>
          <input
            type="text"
            value={form.skills_learned}
            onChange={(e) => updateField('skills_learned', e.target.value)}
            placeholder="Comma-separated, e.g. Project Management, Excel, Public Speaking"
            className={`${inputClasses} ${hasProfanity(form.skills_learned) ? '!border-red-500 !bg-red-50 dark:!bg-red-900/20' : ''}`}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-nu-gray-700 dark:text-dark-text">Tools Used</label>
            <CharCounter value={form.tools_used} max={FIELD_LIMITS.tools_used} />
          </div>
          <input
            type="text"
            value={form.tools_used}
            onChange={(e) => updateField('tools_used', e.target.value)}
            placeholder="Comma-separated, e.g. Salesforce, Tableau, Google Suite"
            className={`${inputClasses} ${hasProfanity(form.tools_used) ? '!border-red-500 !bg-red-50 dark:!bg-red-900/20' : ''}`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-nu-gray-700 dark:text-dark-text mb-2">Culture Tags</label>
          <div className="flex flex-wrap gap-2">
            {CULTURE_OPTIONS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleCultureTag(tag)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  form.culture_tags.includes(tag)
                    ? 'bg-nu-purple/10 border-nu-purple text-nu-purple font-medium'
                    : 'border-nu-gray-200 dark:border-dark-border text-nu-gray-500 dark:text-dark-muted hover:border-nu-purple/50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-nu-gray-700 dark:text-dark-text mb-2">Would you recommend this co-op?</label>
          <div className="flex gap-3">
            {[
              { value: true, label: 'Yes' },
              { value: false, label: 'No' },
            ].map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, would_recommend: opt.value }))}
                className={`px-5 py-2 text-sm rounded-lg border transition-colors ${
                  form.would_recommend === opt.value
                    ? opt.value
                      ? 'bg-nu-green/10 border-nu-green text-nu-green font-medium'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-400 text-red-500 font-medium'
                    : 'border-nu-gray-200 dark:border-dark-border text-nu-gray-500 dark:text-dark-muted hover:border-nu-gray-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || !!profanityWarning}
          className="w-full py-2.5 bg-nu-red text-white font-semibold rounded-lg hover:bg-nu-red-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Submit Anonymous Review'}
        </button>
      </form>
    </div>
  )
}
