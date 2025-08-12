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
    .select('id, stem, explanation_md, video_url')
    .eq('lesson_id', lesson.id)

  if (!qs?.length) return NextResponse.json({ questions: [] })

  const { data: options } = await supabase
    .from('quiz_options')
    .select('id, question_id, label, text, is_correct')

  const byQ = {}
  for (const opt of options || []) {
    if (!byQ[opt.question_id]) byQ[opt.question_id] = []
    byQ[opt.question_id].push(opt)
  }

  return NextResponse.json({
    questions: qs.map(q => ({
      ...q,
      options: (byQ[q.id] || []).sort((a, b) => a.label.localeCompare(b.label))
    }))
  })
}
