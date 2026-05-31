/**
 * Decode HTML-escaped text safely in browser and server environments.
 * Useful when converting API or AI responses into user-facing strings.
 */
import { HTML_ENTITY_REPLACEMENTS } from '../constants'

export function htmlDecode(input: string | undefined | null): string {
  if (!input) return ''
  const s = String(input)
  if (typeof document !== 'undefined') {
    const txt = document.createElement('textarea')
    txt.innerHTML = s
    return txt.value
  }
  // fallback simple replacements for common entities
  return HTML_ENTITY_REPLACEMENTS.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), s)
}

export default htmlDecode
