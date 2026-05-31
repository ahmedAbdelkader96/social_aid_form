/**
 * Parse raw AI suggestion text into a clean field value.
 * This protects form fields from extra commentary or poorly formatted AI replies.
 */
import { AID_FORM_HELP_FIELD } from '../types/aidFormTypes'
import type { HelpField } from '../types/aidFormTypes'
import {
  PARSE_AI_QUOTE_REGEX,
  PARSE_AI_SINGLE_QUOTE_REGEX,
  PARSE_AI_COLON_SUGGESTION_REGEX,
  PARSE_AI_TRIM_REGEX,
  PARSE_AI_SENTENCE_SPLIT_REGEX,
} from '../../../shared/constants'

export function parseAiSuggestion(helpText: string, field: HelpField): string {
  const appliedText = helpText ?? ''

  if (!appliedText) return ''

  if (field === AID_FORM_HELP_FIELD.employmentCircumstances || field === AID_FORM_HELP_FIELD.financialSituation) {
    // Match double quotes (straight and smart)
    const quoted = appliedText.match(PARSE_AI_QUOTE_REGEX)
    if (quoted && quoted[1]) {
      return quoted[1].trim()
    }

    // Try single quotes but avoid matching contractions like "Here's"
    const single = appliedText.match(PARSE_AI_SINGLE_QUOTE_REGEX)
    if (single && single[1]) {
      return single[1].trim()
    }

    // Look for colon-led suggestions like "You could say:" and take the following clause
    const colonMatch = appliedText.match(PARSE_AI_COLON_SUGGESTION_REGEX)
    if (colonMatch && colonMatch[1]) {
      let candidate = colonMatch[1].trim()
      const qIndex = candidate.indexOf('?')
      if (qIndex !== -1) candidate = candidate.slice(0, qIndex)
      candidate = candidate.replace(PARSE_AI_TRIM_REGEX, '')
      const sentences = candidate.split(PARSE_AI_SENTENCE_SPLIT_REGEX).map(s => s.trim()).filter(Boolean)
      if (sentences.length) return sentences[0]
    }

    // Fallback: remove trailing question parts and take last sentence
    const qIndex2 = appliedText.lastIndexOf('?')
    if (qIndex2 !== -1) {
      const before = appliedText.slice(0, qIndex2 + 1)
      const sentences = before.split(/[.\n]+/).map(s => s.trim()).filter(Boolean)
      if (sentences.length) return sentences[sentences.length - 1]
    }
  }

  return appliedText
}

// Use only the named export to avoid ambiguity between default and named imports.

