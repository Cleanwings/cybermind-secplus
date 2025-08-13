import { askGemini } from '../../../lib/ai/askGemini'
// app/api/quiz/route.js
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET() {
  // Get first lesson (change 'created_at' to 'id' if your schema lacks created_at)
  const { data: lesson } = await supabase
    .from('lessons')
    .select('id')
    .order('created_at', { ascending: true })
    .limit(1)
    .single()

  if (!lesson) return NextResponse.json({ questions: [] })

  // Pull quiz rows from your schema with choices + correct_index
  const { data: rows, error } = await supabase
    .from('quiz_questions')
    .select('id, stem, choices, correct_index, explanation_md, video_url')
    .eq('lesson_id', lesson.id)

  if (error || !rows?.length) return NextResponse.json({ questions: [] })

  const questions = rows.map((q) => {
    // Normalize/parse choices from JSONB or text; fallback to []
    let arr
    try {
      arr = Array.isArray(q.choices) ? q.choices : JSON.parse(q.choices || '[]')
    } catch {
      arr = []
    }

    // Ensure choices have label + text. If missing, fill with sensible defaults.
    const options = arr.map((c, idx) => {
      const label = c?.label || String.fromCharCode(65 + idx) // A/B/C/D
      const text =
        c?.text ??
        c?.value ??
        c?.option ??
        c?.title ??
        c?.content ??
        `Option ${label}`

      return {
        id: `${q.id}-${idx}`,
        label,
        text,
        is_correct: idx === q.correct_index
      }
    })

    return {
      id: q.id,
      stem: q.stem,
      explanation_md: q.explanation_md || '',
      video_url: q.video_url || null,
      correct_index: typeof q.correct_index === 'number' ? q.correct_index : null,
      choices: options // send normalized choices to the UI
    }
  })

  return NextResponse.json({ questions })
}
