export default function Footer() {
  return (
    <footer className="bg-white dark:bg-dark-surface border-t border-nu-gray-200 dark:border-dark-border py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-sm text-nu-gray-400 dark:text-dark-muted">
          <span className="font-heading font-bold text-nu-red">NU</span>{' '}
          <span className="font-heading font-semibold text-nu-gray-600 dark:text-dark-text">Co-op Connect</span>
          {' '}&middot;{' '}
          Built for Huskies, by Huskies
        </p>
      </div>
    </footer>
  )
}
