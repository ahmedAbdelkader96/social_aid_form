/**
 * Generic AI suggestion client for generating text hints for the form.
 * Keeps prompt construction, request handling, and fallback behavior in one place.
 */
type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }

import axios from 'axios'
import { DEFAULT_AI_API_URL, DEFAULT_AI_MODEL } from '../constants'
import { normalizeAxiosError } from '../errors'

const AI_API_URL = typeof import.meta !== 'undefined' && import.meta.env?.VITE_AI_API_URL
  ? String(import.meta.env.VITE_AI_API_URL)
  : DEFAULT_AI_API_URL

const AI_API_KEY = typeof import.meta !== 'undefined' && import.meta.env?.VITE_AI_API_KEY
  ? String(import.meta.env.VITE_AI_API_KEY)
  : undefined

const AI_MODEL = typeof import.meta !== 'undefined' && import.meta.env?.VITE_AI_MODEL
  ? String(import.meta.env.VITE_AI_MODEL)
  : DEFAULT_AI_MODEL


export async function generateAISuggestion(
  field: string,
  currentValues: unknown,
  promptOverride?: string,
): Promise<string> {
  if (!AI_API_KEY) {
    return `Suggested response for ${field}. Please provide a clear and honest answer.`
  }

  const systemMessage: ChatMessage = {
    role: 'system',
    content:
      'You are a supportive assistant for a social aid aidForm form. When asked for a field suggestion, respond only with the text to insert into that field. Do not ask questions, do not include any extra commentary, and do not offer follow-up options.',
  }

  const defaultUserContent = `Provide a concise answer for the field '${field}' based on the applicant's current values: ${JSON.stringify(
    currentValues || {},
  )}. Return only the suggested response text for this field, with no questions or additional explanation.`

  const userMessage: ChatMessage = {
    role: 'user',
    content: promptOverride ? String(promptOverride) : defaultUserContent,
  }

  const body = {
    model: AI_MODEL,
    messages: [systemMessage, userMessage],
    max_tokens: 220,
  }

  try {
    const response = await axios.post(AI_API_URL, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_API_KEY}`,
      },
    })

    type AIChoice = { message?: { content?: string }; text?: string }
    type AIResponse = { choices?: AIChoice[] }
    const resp = response.data as AIResponse
    const reply = resp?.choices?.[0]?.message?.content || resp?.choices?.[0]?.text || ''
    return (reply && String(reply).trim()) || `Suggested response for ${field}. Please provide a clear and honest answer.`
  } catch (error: unknown) {
    const apiError = normalizeAxiosError(error)
    console.error('AI request error', apiError)
    throw new Error(apiError.message, { cause: error })
  }
}


