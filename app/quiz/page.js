// app/quiz/page.js
'use client'
import { useEffect, useState } from 'react'
import { getCiaQuiz } from '@/lib/content'

export default function QuizPage() {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(true)
  const passMark = 80

  useEffect(() => {
    (async () => {
      const qs = await getCiaQuiz()
      setQuestions(qs)
      setLoading(false)
    })()
  }, [])

  function selectAnswer(qid, idx) {
    setAnswers(a => ({ ...a, [qid]: idx }))
  }

  function grade() {
    if (!questions.length) return
    let correct = 0
    for (const q of questions) {
      if (answers[q.id] === q.correct_index) correct++
    }
    const pct = Math.round((correct / questions.length) * 100)
    setScore(pct)
    // save for mastery gate (local)
    localStorage.setItem('cia_quiz_score', String(pct))
  }

  if (loading) return <main className="p-6">Loading quiz…</main>

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Quiz: CIA Triad</h1>

      {questions.map((q, i) => (
        <div key={q.id} className="mb-6 border rounded p-4">
          <p className="font-medium mb-2">{i + 1}. {q.stem}</p>
          {(q.choices || []).map((choice, idx) => (
            <label key={idx} className="block mb-1">
              <input
                type="radio"
                name={`q-${q.id}`}
                className="mr-2"
                checked={answers[q.id] === idx}
                onChange={() => selectAnswer(q.id, idx)}
              />
              {choice}
            </label>
          ))}
        </div>
      ))}

      <button onClick={grade} className="px-4 py-2 rounded bg-emerald-600 text-white">
        Submit Quiz
      </button>

      {score !== null && (
        <div className="mt-4">
          <p>Your score: <b>{score}%</b></p>
          {score >= passMark ? (
            <a href="/lab" className="inline-block mt-3 px-4 py-2 rounded bg-blue-600 text-white">
              Continue to Lab
            </a>
          ) : (
            <p className="text-red-600 mt-2">Score at least {passMark}% to continue.</p>
          )}
        </div>
      )}
    </main>
  )
}
