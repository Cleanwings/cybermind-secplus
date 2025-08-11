// lib/content.js
import { supabase } from './supabaseClient'

// get the first lesson of the secplus course (Module 1 / Lesson 1)
export async function getCiaLesson() {
  const { data, error } = await supabase
    .from('lessons')
    .select(`
      id,
      title,
      content_md,
      module:modules!inner(order_index, course:courses!inner(slug))
    `)
    .eq('module.course.slug', 'secplus')
    .eq('module.order_index', 1)
    .eq('order_index', 1)
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getCiaQuiz() {
  // fetch quiz for the same lesson
  const lesson = await getCiaLesson()
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('id, stem, choices, correct_index, difficulty')
    .eq('lesson_id', lesson.id)
    .order('id', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getCiaLab() {
  const lesson = await getCiaLesson()
  const { data, error } = await supabase
    .from('labs')
    .select('id, title, spec')
    .eq('lesson_id', lesson.id)
    .maybeSingle()

  if (error) throw error
  return data
}
