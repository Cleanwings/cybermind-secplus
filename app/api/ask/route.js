import { askGemini } from '../../../lib/ai/askGemini'
// app/api/ask/route.js
import { NextResponse } from 'next/server'

// Test in browser: /api/ask?query=Your+question
export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query') || ''
  if (!query.trim()) {
    return NextResponse.json({ error: 'Add ?query=your question' }, { status: 400 })
  }
  const { text, sources } = await askGemini(query, [])
  return NextResponse.json({ text, sources })
}

export async function POST(req) {
  const { query, snippets = [] } = await req.json().catch(() => ({ }))
  if (!query?.trim()) {
    return NextResponse.json({ error: 'Missing "query" in JSON body' }, { status: 400 })
  }
  const { text, sources } = await askGemini(query, snippets)
  return NextResponse.json({ text, sources })
}
