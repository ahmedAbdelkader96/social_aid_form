// Global API infrastructure.
// Contains shared HTTP and OpenAI client adapters used by feature services.

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }

const OPENAI_API_URL = typeof import.meta !== 'undefined' && import.meta.env?.VITE_OPENAI_API_URL
  ? String(import.meta.env.VITE_OPENAI_API_URL)
  : 'https://api.groq.com/openai/v1/chat/completions'

const OPENAI_API_KEY = typeof import.meta !== 'undefined' && import.meta.env?.VITE_OPENAI_API_KEY
  ? String(import.meta.env.VITE_OPENAI_API_KEY)
  : undefined

export async function generateOpenAISuggestion(
  field: string,
  currentValues: unknown,
  promptOverride?: string,
): Promise<string> {
  if (!OPENAI_API_KEY) {
    // Fallback to a helpful default when no key is configured
    return `Suggested response for ${field}. Please provide a clear and honest answer.`
  } 

  const systemMessage: ChatMessage = {
    role: 'system',
    content:
      'You are a supportive assistant for a social aid application form. When asked for a field suggestion, respond only with the text to insert into that field. Do not ask questions, do not include any extra commentary, and do not offer follow-up options.',
  }

  const defaultUserContent = `Provide a concise answer for the field '${field}' based on the applicant's current values: ${JSON.stringify(
    currentValues || {},
  )}. Return only the suggested response text for this field, with no questions or additional explanation.`

  const userMessage: ChatMessage = {
    role: 'user',
    content: promptOverride ? String(promptOverride) : defaultUserContent,
  }

  const body = {
    model: 'llama-3.3-70b-versatile',
    messages: [systemMessage, userMessage],
    max_tokens: 220,
    temperature: 0.8,
  }

  const controller = new AbortController()
  const timeoutMs = 8000
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  

  try {
    const res = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    let data: any = null

    try {
      data = await res.json()
    } catch (e) {
      data = await res.text().catch(() => null)
    }

    if (!res.ok) {
      console.error('OpenAI request failed', res.status, data)
      return `Suggested response for ${field}. Please provide a clear and honest answer.`
    }

    // Try to extract assistant reply depending on provider shape
    const reply = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || ''
    return (reply && String(reply).trim()) || `Suggested response for ${field}. Please provide a clear and honest answer.`
  } catch (err: any) {
    console.error('OpenAI request error', err)
    return `Suggested response for ${field}. Please provide a clear and honest answer.`
  } finally {
    clearTimeout(timeout)
  }
}

