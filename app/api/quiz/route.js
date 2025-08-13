import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET() {
  // Pick first lesson (change 'created_at' to 'id' if needed)
  const { data: lesson } = await supabase
    .from('lessons')
    .select('id')
    .order('created_at', { ascending: true })
    .limit(1)
    .single()

  if (!lesson) return NextResponse.json({ questions: [] })

  // Read choices + correct_index from your schema
  const { data: qs, error } = await supabase
    .from('quiz_questions')
    .select('id, stem, choices, correct_index, explanation_md, video_url')
    .eq('lesson_id', lesson.id)

  if (error || !qs?.length) return NextResponse.json({ questions: [] })

  const questions = qs.map(q => {
    // choices is JSON array [{label, text}, ...]
    let options = []
    try {
      const arr = Array.isArray(q.choices) ? q.choices : JSON.parse(q.choices || '[]')
      options = arr.map((c, idx) => ({
        id: `${q.id}-${idx}`,
        label: c.label || String.fromCharCode(65 + idx),
        text: c.text || '',
        is_correct: idx === q.correct_index
      }))
    } catch {
      options = []
    }
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
