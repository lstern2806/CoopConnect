import { useTheme } from '../context/ThemeContext'

const CYCLE = ['light', 'system', 'dark']

const ICONS = {
  light: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 7.66l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  system: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  dark: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.005 9.005 0 0012 21a9.005 9.005 0 008.354-5.646z" />
    </svg>
  ),
}

const LABELS = { light: 'Light', system: 'System', dark: 'Dark' }

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  function cycle() {
    const next = CYCLE[(CYCLE.indexOf(theme) + 1) % CYCLE.length]
    setTheme(next)
  }

  return (
    <button
      onClick={cycle}
      title={`Theme: ${LABELS[theme]}`}
      className="p-2 rounded-lg text-nu-gray-500 dark:text-dark-muted hover:bg-nu-gray-100 dark:hover:bg-dark-card hover:text-nu-black dark:hover:text-dark-text transition-colors"
    >
      {ICONS[theme]}
    </button>
  )
}
