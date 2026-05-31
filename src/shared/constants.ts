/**
 * Shared static constants used across the application.
 * Centralizing these values helps keep configuration and validation rules in one place.
 * This follows the DRY (Don't Repeat Yourself) principle and makes updates easier.
 */
export const STORAGE_KEY = 'socialAidPersistedState'

export const DEFAULT_AI_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
export const DEFAULT_AI_MODEL = 'llama-3.3-70b-versatile'

export const COUNTRIES_ENDPOINT = '/countries'

export const NUMBER_PATTERN = /^\d+$/
export const PHONE_PATTERN = /^\+?\d[\d\s-]{7,}$/
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const NATIONAL_ID_PLACEHOLDER = '123456789'

export const FORM_VALIDATION_MODE = 'onBlur' as const
export const FORM_REVALIDATE_MODE = 'onChange' as const
export const STATE_SYNC_DELAY_MS = 25
export const TOAST_AUTO_CLOSE_MS = 4000
export const DEFAULT_ERROR_MESSAGE = 'An unexpected network error occurred. Please try again.'

export const ASYNC_STATUS = {
  idle: 'idle',
  loading: 'loading',
  succeeded: 'succeeded',
  failed: 'failed',
} as const

export type AsyncStatus = (typeof ASYNC_STATUS)[keyof typeof ASYNC_STATUS]

export const HTML_ENTITY_REPLACEMENTS: ReadonlyArray<[RegExp, string]> = [
  [/&quot;/g, '"'],
  [/&#39;/g, "'"],
  [/&amp;/g, '&'],
  [/&lt;/g, '<'],
  [/&gt;/g, '>'],
]

export const PARSE_AI_QUOTE_REGEX = /["“”]([^"“”]+)["“”]/u
export const PARSE_AI_SINGLE_QUOTE_REGEX = /(?:^|\s)'([^']+)'/
export const PARSE_AI_COLON_SUGGESTION_REGEX = /(?:You could say:|The given description is:|You could try:|consider:\s*)([\s\S]+)/i
export const PARSE_AI_TRIM_REGEX = /^["'“”`\s]+|["'“”`\s]+$/g
export const PARSE_AI_SENTENCE_SPLIT_REGEX = /[.\n]+/
