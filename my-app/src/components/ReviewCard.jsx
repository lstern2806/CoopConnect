const DESC_LIMIT = 300

export default function ReviewCard({ review, onClick }) {
  const isLong = review.description.length > DESC_LIMIT

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-dark-surface border border-nu-gray-200 dark:border-dark-border rounded-xl p-5 overflow-hidden cursor-pointer hover:border-nu-red/30 dark:hover:border-nu-red/30 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="text-lg font-heading font-bold text-nu-black dark:text-dark-text truncate">
            {review.company_name}
          </h3>
          {review.role_title && (
            <p className="text-sm text-nu-gray-500 dark:text-dark-muted truncate">{review.role_title}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => {
              const full = review.overall_rating >= star
              const half = !full && review.overall_rating >= star - 0.5
              return (
                <div key={star} className="relative w-4 h-4">
                  <svg className="absolute inset-0 w-4 h-4 text-nu-gray-200 dark:text-dark-border" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {(full || half) && (
                    <svg className="absolute inset-0 w-4 h-4 text-nu-orange" fill="currentColor" viewBox="0 0 20 20">
                      <defs>
                        <clipPath id={`card-star-${review.id}-${star}`}>
                          <rect x="0" y="0" width={full ? 20 : 10} height="20" />
                        </clipPath>
                      </defs>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipPath={`url(#card-star-${review.id}-${star})`} />
                    </svg>
                  )}
                </div>
              )
            })}
          </div>
          <span className="text-xs font-medium text-nu-gray-500 dark:text-dark-muted">
            {review.overall_rating} / 5
          </span>
        </div>
      </div>

      <p className="text-sm text-nu-gray-700 dark:text-dark-text leading-relaxed mb-3 break-words">
        {isLong ? `${review.description.slice(0, DESC_LIMIT).trimEnd()}...` : review.description}
      </p>

      {review.culture_tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3 overflow-hidden">
          {review.culture_tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-nu-purple/10 text-nu-purple text-xs rounded-full font-medium break-all">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-nu-gray-400 dark:text-dark-muted pt-2 border-t border-nu-gray-100 dark:border-dark-border">
        <span>{review.display_name}</span>
        <div className="flex items-center gap-3">
          {review.coop_cycle && <span>{review.coop_cycle}</span>}
          {review.would_recommend !== null && (
            <span>{review.would_recommend ? 'Recommends' : 'Does not recommend'}</span>
          )}
        </div>
      </div>
    </div>
  )
}
