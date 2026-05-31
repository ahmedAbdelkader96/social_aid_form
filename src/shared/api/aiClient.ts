/**
 * Generic AI suggestion client for generating text hints for the form.
 * Keeps prompt construction, request handling, and fallback behavior in one place.
 */
type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }

import { DEFAULT_AI_API_URL, DEFAULT_AI_MODEL, DEFAULT_AI_TIMEOUT, DEFAULT_AI_TEMPERATURE } from '../constants'

const AI_API_URL = typeof import.meta !== 'undefined' && import.meta.env?.VITE_AI_API_URL
  ? String(import.meta.env.VITE_AI_API_URL)
  : DEFAULT_AI_API_URL

const AI_API_KEY = typeof import.meta !== 'undefined' && import.meta.env?.VITE_AI_API_KEY
  ? String(import.meta.env.VITE_AI_API_KEY)
  : undefined

const AI_MODEL = typeof import.meta !== 'undefined' && import.meta.env?.VITE_AI_MODEL
  ? String(import.meta.env.VITE_AI_MODEL)
  : DEFAULT_AI_MODEL

const AI_TIMEOUT = typeof import.meta !== 'undefined' && import.meta.env?.VITE_AI_TIMEOUT
  ? Number(import.meta.env.VITE_AI_TIMEOUT)
  : DEFAULT_AI_TIMEOUT

const AI_TEMPERATURE = typeof import.meta !== 'undefined' && import.meta.env?.VITE_AI_TEMPERATURE
  ? Number(import.meta.env.VITE_AI_TEMPERATURE)
  : DEFAULT_AI_TEMPERATURE

export async function generateAISuggestion(
  field: string,
  currentValues: unknown,
  promptOverride?: string,
): Promise<string> {
  if (!AI_API_KEY) {
    // Fallback to a helpful default when no key is configured
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
    temperature: AI_TEMPERATURE,
  }

  const controller = new AbortController()
  const timeoutMs = AI_TIMEOUT
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  

  try {
    const res = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'aidForm/json',
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    let data: unknown = null

    try {
      data = await res.json()
    } catch {
      data = await res.text().catch(() => null)
    }

    if (!res.ok) {
      console.error('AI request failed', res.status, data)
      return `Suggested response for ${field}. Please provide a clear and honest answer.`
    }

    // Try to extract assistant reply depending on provider shape
    type AIChoice = { message?: { content?: string }; text?: string }
    type AIResponse = { choices?: AIChoice[] }
    const resp = data as AIResponse
    const reply = resp?.choices?.[0]?.message?.content || resp?.choices?.[0]?.text || ''
    return (reply && String(reply).trim()) || `Suggested response for ${field}. Please provide a clear and honest answer.`
  } catch (err: unknown) {
    console.error('AI request error', err)
    return `Suggested response for ${field}. Please provide a clear and honest answer.`
  } finally {
    clearTimeout(timeout)
  }
}


