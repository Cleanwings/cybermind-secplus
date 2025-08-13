import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET() {
  const { data: lesson } = await supabase
    .from('lessons')
    .select('id')
    .order('created_at', { ascending: true })
    .limit(1)
    .single()

  if (!lesson) return NextResponse.json({ questions: [] })

  const { data: qs } = await supabase
    .from('quiz_questions')
    .select('id, stem, choices, correct_index, explanation_md, video_url')
    .eq('lesson_id', lesson.id)

  return NextResponse.json({ questions: qs || [] })
}
