// app/lesson/page.js
import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify' // tiny sanitizer for SSR
import { getCiaLesson } from '@/lib/content'

export const dynamic = 'force-dynamic'

export default async function LessonPage() {
  const lesson = await getCiaLesson()
  const html = DOMPurify.sanitize(marked.parse(lesson.content_md || ''))

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>
      <article
        className="prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <div className="mt-8 flex gap-3">
        <a href="/quiz" className="px-4 py-2 rounded-lg bg-emerald-600 text-white">Take Quiz</a>
      </div>
    </main>
  )
}
