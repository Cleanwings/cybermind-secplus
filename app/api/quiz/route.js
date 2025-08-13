import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET() {
  // Pick first lesson
  const { data: lesson } = await supabase
    .from('lessons')
    .select('id')
    .order('created_at', { ascending: true })
    .limit(1)
    .single()

  if (!lesson) return NextResponse.json({ questions: [] })

  // Read your schema (JSON choices + correct_index)
  const { data: qs } = await supabase
    .from('quiz_questions')
    .select('id, stem, choices, correct_index, explanation_md, video_url')
    .eq('lesson_id', lesson.id)

  if (!qs?.length) return NextResponse.json({ questions: [] })

  const questions = qs.map(q => {
    // Normalize choices: it can be JSONB (object) or text (stringified JSON)
    let arr
    try {
      arr = Array.isArray(q.choices) ? q.choices : JSON.parse(q.choices || '[]')
    } catch {
      arr = []
    }

    // Determine the correct index:
    // 1) prefer correct_index if present
    // 2) otherwise find any item with is_correct === true
    let correctIndex =
      typeof q.correct_index === 'number' && !Number.isNaN(q.correct_index)
        ? q.correct_index
        : (arr.findIndex(c => c?.is_correct === true))

    if (correctIndex < 0) correctIndex = null

    // Build options with robust text detection
    const options = arr.map((c, idx) => ({
      id: `${q.id}-${idx}`,
      label: c?.label || String.fromCharCode(65 + idx), // A/B/C/D
      // try multiple possible keys for the visible text
      text: c?.text ?? c?.value ?? c?.option ?? c?.title ?? c?.content ?? '',
      is_correct: correctIndex === idx
    }))

    return {
      id: q.id,
      stem: q.stem,
      explanation_md: q.explanation_md || '',
      video_url: q.video_url || null,
      options
    }
  })

  return NextResponse.json({ questions })
}
