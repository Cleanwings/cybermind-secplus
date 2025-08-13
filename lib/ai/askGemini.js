// lib/ai/askGemini.js
const GEMINI_URL = (model) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GOOGLE_API_KEY}`

export async function askGemini(query, snippets = []) {
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash'

  // Turn snippets into plain text lines
  const joinedSnippets = (snippets || [])
    .map((s, i) => `Snippet ${i + 1}: ${typeof s === 'string' ? s : s.text || ''}`)
    .join('\n')

  const system = [
    'You are a concise Security+ assistant.',
    'Use ONLY the provided snippets for facts.',
    'If uncertain, say what is missing.',
    'Prefer short, direct answers.',
  ].join(' ')

  const user = `
Question: ${query}

Snippets (your only source of truth):
${joinedSnippets || '(none provided)'}
`

  const body = {
    contents: [{ role: 'user', parts: [{ text: `${system}\n\n${user}` }] }],
    generationConfig: { temperature: 0.2 }
  }

  try {
    const res = await fetch(GEMINI_URL(model), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Gemini ${res.status}: ${errText}`)
    }
    const json = await res.json()

    const text =
      json?.candidates?.[0]?.content?.parts?.map(p => p.text).join(' ').trim() ||
      json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''

    // Try to collect any URLs mentioned
    const urlRegex = /\bhttps?:\/\/[^\s)]+/gi
    const textUrls = (text.match(urlRegex) || [])
    const ground = json?.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    const grounded = ground.map(g => g.web?.uri).filter(Boolean)

    const sources = Array.from(new Set([...(grounded || []), ...textUrls]))
    return { text, sources }
  } catch (e) {
    return { text: `Gemini error: ${e.message}`, sources: [] }
  }
}
