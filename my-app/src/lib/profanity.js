import filter from 'leo-profanity'

export function hasProfanity(text) {
  if (!text) return false
  return filter.check(text)
}

export function cleanText(text) {
  if (!text) return ''
  return filter.clean(text)
}
