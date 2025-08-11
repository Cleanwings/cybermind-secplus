// app/gate/page.js
'use client'
import { useEffect, useState } from 'react'

export default function GatePage() {
  const [ok, setOk] = useState(false)
  const [quiz, setQuiz] = useState(null)
  const [lab, setLab] = useState(null)

  useEffect(() => {
    const q = Number(localStorage.getItem('cia_quiz_score') || '0')
    const l = localStorage.getItem('cia_lab_passed') === 'true'
    setQuiz(q)
    setLab(l)
    setOk(q >= 80 && l)
  }, [])

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Mastery Gate</h1>
      <p className="mb-2">Quiz score: <b>{quiz ?? '—'}%</b> (need 80%+)</p>
      <p className="mb-4">Lab passed: <b>{lab ? 'Yes' : 'No'}</b></p>
      {ok ? (
        <div className="p-4 border rounded bg-green-50">
          <p className="mb-2">Great job! You unlocked the next lesson.</p>
          <a href="/lesson" className="inline-block mt-2 px-4 py-2 bg-emerald-600 text-white rounded">
            Go to Next Lesson (placeholder)
          </a>
        </div>
      ) : (
        <div className="p-4 border rounded bg-yellow-50">
          <p className="mb-2">You haven’t met the mastery requirements yet.</p>
          <div className="flex gap-3 mt-2">
            <a href="/quiz" className="px-3 py-2 rounded border">Retake Quiz</a>
            <a href="/lab" className="px-3 py-2 rounded border">Retry Lab</a>
          </div>
        </div>
      )}
    </main>
  )
}
