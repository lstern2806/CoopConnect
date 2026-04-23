import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import ReviewCard from '../components/ReviewCard'
import Modal from '../components/Modal'

const COOP_CYCLES = [
  'Spring 2025', 'Summer 2025', 'Fall 2025',
  'Spring 2026', 'Summer 2026', 'Fall 2026',
  'Spring 2027', 'Summer 2027', 'Fall 2027',
]

const PAGE_SIZE = 10

export default function Reviews() {
  const { session } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [cycleFilter, setCycleFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selectedReview, setSelectedReview] = useState(null)

  useEffect(() => {
    fetchReviews()
  }, [session])

  useEffect(() => {
    setPage(1)
  }, [search, ratingFilter, cycleFilter])

  async function fetchReviews() {
    setLoading(true)
    try {
      const data = await api('/api/reviews', { token: session.access_token })
      setReviews(data)
    } catch (err) {
      console.error('Failed to load reviews')
    }
    setLoading(false)
  }

  const filtered = reviews.filter((r) => {
    if (ratingFilter && Math.ceil(r.overall_rating) !== parseInt(ratingFilter)) return false
    if (cycleFilter && r.coop_cycle !== cycleFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        r.company_name.toLowerCase().includes(q) ||
        r.role_title?.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      )
    }
    return true
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const selectClasses = 'px-3 py-2 border border-nu-gray-200 dark:border-dark-border rounded-lg text-sm text-nu-black dark:text-dark-text bg-white dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-nu-red focus:border-transparent'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-nu-black dark:text-dark-text">Co-op Reviews</h1>
          <p className="text-nu-gray-500 dark:text-dark-muted text-sm mt-1">Anonymous reviews from fellow Huskies</p>
        </div>
        <Link
          to="/reviews/new"
          className="px-4 py-2.5 bg-nu-red text-white font-semibold rounded-lg hover:bg-nu-red-light transition-colors text-sm"
        >
          Write a Review
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search company, role, or keyword..."
          className="flex-1 px-4 py-2.5 border border-nu-gray-200 dark:border-dark-border rounded-lg text-nu-black dark:text-dark-text bg-white dark:bg-dark-card placeholder:text-nu-gray-400 dark:placeholder:text-dark-muted focus:outline-none focus:ring-2 focus:ring-nu-red focus:border-transparent"
        />
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className={selectClasses}
        >
          <option value="">All Ratings</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
          ))}
        </select>
        <select
          value={cycleFilter}
          onChange={(e) => setCycleFilter(e.target.value)}
          className={selectClasses}
        >
          <option value="">All Cycles</option>
          {COOP_CYCLES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-nu-red border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-nu-gray-400 dark:text-dark-muted text-lg mb-2">No reviews found</p>
          <p className="text-nu-gray-400 dark:text-dark-muted text-sm">
            {reviews.length === 0
              ? 'Be the first to share your co-op experience!'
              : 'Try adjusting your filters.'}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginated.map((review) => (
              <ReviewCard key={review.id} review={review} onClick={() => setSelectedReview(review)} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-2 text-sm font-medium rounded-lg border border-nu-gray-200 dark:border-dark-border text-nu-gray-600 dark:text-dark-muted hover:bg-nu-gray-100 dark:hover:bg-dark-card disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                    p === page
                      ? 'bg-nu-red text-white'
                      : 'border border-nu-gray-200 dark:border-dark-border text-nu-gray-600 dark:text-dark-muted hover:bg-nu-gray-100 dark:hover:bg-dark-card'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 text-sm font-medium rounded-lg border border-nu-gray-200 dark:border-dark-border text-nu-gray-600 dark:text-dark-muted hover:bg-nu-gray-100 dark:hover:bg-dark-card disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}

          <p className="text-center text-xs text-nu-gray-400 dark:text-dark-muted mt-3">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} review{filtered.length !== 1 ? 's' : ''}
          </p>
        </>
      )}
      <Modal
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        title={selectedReview?.company_name}
      >
        {selectedReview && <ReviewDetail review={selectedReview} />}
      </Modal>
    </div>
  )
}

function ReviewDetail({ review }) {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          {review.role_title && (
            <p className="text-sm text-nu-gray-500 dark:text-dark-muted">{review.role_title}</p>
          )}
          {review.department && (
            <p className="text-sm text-nu-gray-500 dark:text-dark-muted">{review.department}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => {
              const full = review.overall_rating >= star
              const half = !full && review.overall_rating >= star - 0.5
              return (
                <div key={star} className="relative w-5 h-5">
                  <svg className="absolute inset-0 w-5 h-5 text-nu-gray-200 dark:text-dark-border" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {(full || half) && (
                    <svg className="absolute inset-0 w-5 h-5 text-nu-orange" fill="currentColor" viewBox="0 0 20 20">
                      <defs>
                        <clipPath id={`detail-star-${star}`}>
                          <rect x="0" y="0" width={full ? 20 : 10} height="20" />
                        </clipPath>
                      </defs>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipPath={`url(#detail-star-${star})`} />
                    </svg>
                  )}
                </div>
              )
            })}
          </div>
          <span className="text-sm font-medium text-nu-gray-500 dark:text-dark-muted">
            {review.overall_rating} / 5
          </span>
        </div>
      </div>

      <p className="text-sm text-nu-gray-700 dark:text-dark-text leading-relaxed whitespace-pre-line break-words">
        {review.description}
      </p>

      {review.skills_learned?.length > 0 && (
        <div>
          <p className="text-xs font-medium text-nu-gray-500 dark:text-dark-muted mb-1.5">Skills Learned</p>
          <div className="flex flex-wrap gap-1.5 overflow-hidden">
            {review.skills_learned.map((skill) => (
              <span key={skill} className="px-2.5 py-0.5 bg-nu-green/10 text-nu-green text-xs rounded-full font-medium break-all">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {review.tools_used?.length > 0 && (
        <div>
          <p className="text-xs font-medium text-nu-gray-500 dark:text-dark-muted mb-1.5">Tools Used</p>
          <div className="flex flex-wrap gap-1.5 overflow-hidden">
            {review.tools_used.map((tool) => (
              <span key={tool} className="px-2.5 py-0.5 bg-nu-orange/10 text-nu-orange text-xs rounded-full font-medium break-all">
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      {review.culture_tags?.length > 0 && (
        <div>
          <p className="text-xs font-medium text-nu-gray-500 dark:text-dark-muted mb-1.5">Culture</p>
          <div className="flex flex-wrap gap-1.5 overflow-hidden">
            {review.culture_tags.map((tag) => (
              <span key={tag} className="px-2.5 py-0.5 bg-nu-purple/10 text-nu-purple text-xs rounded-full font-medium break-all">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-nu-gray-400 dark:text-dark-muted pt-3 border-t border-nu-gray-100 dark:border-dark-border">
        <span>{review.display_name}</span>
        <div className="flex items-center gap-3">
          {review.coop_cycle && <span>{review.coop_cycle}</span>}
          {review.would_recommend !== null && (
            <span className={review.would_recommend ? 'text-nu-green' : 'text-red-500'}>
              {review.would_recommend ? 'Recommends' : 'Does not recommend'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
