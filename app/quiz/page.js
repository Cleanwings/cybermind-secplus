'use client'
import { useEffect, useState } from 'react'

export default function QuizPage() {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})   // { [questionId]: index }
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetch('/api/quiz')
      .then(res => res.json())
      .then(data => setQuestions(data.questions || []))
      .catch(() => setQuestions([]))
  }, [])

  const handleSelect = (qid, index) => {
    setAnswers(prev => ({ ...prev, [qid]: index }))
  }
  const handleSubmit = () => setSubmitted(true)

  const score = submitted
    ? questions.reduce((acc, q) => acc + ((answers[q.id] === q.correct_index) ? 1 : 0), 0)
    : 0

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Quiz</h1>

      {questions.map((q, qi) => {
        const choices = Array.isArray(q.choices) ? q.choices : []
        return (
          <div key={q.id} className="mb-8 p-4 border rounded-lg">
            <p className="font-medium mb-3">Q{qi + 1}. {q.stem}</p>

            <div className="space-y-2">
              {choices.map((choice, ci) => {
                const label = choice?.label || String.fromCharCode(65 + ci) // A/B/C/D fallback
                const text  = choice?.text ?? choice?.value ?? '(option)'    // text fallback
                return (
                  <label key={`${q.id}-${ci}`} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={answers[q.id] === ci}
                      onChange={() => handleSelect(q.id, ci)}
                    />
                    <span><strong>{label}.</strong> {text}</span>
                  </label>
                )
              })}
            </div>

            {submitted && (
              <div className="mt-4">
                {answers[q.id] === q.correct_index ? (
                  <p className="text-green-600 font-semibold">✅ Correct</p>
                ) : (
                  <>
                    <p className="text-red-600 font-semibold">
                      ❌ Incorrect — Correct answer:{' '}
                      {(() => {
                        const ci = q.correct_index ?? -1
                        const c = choices[ci]
                        const lbl = c?.label || (ci >= 0 ? String.fromCharCode(65 + ci) : '?')
                        return lbl
                      })()}
                    </p>

                    {!!q.explanation_md && (
                      <p className="mt-2 text-gray-700">{q.explanation_md}</p>
                    )}

                    {!!q.video_url && (
                      (q.video_url.includes('youtube.com') || q.video_url.includes('youtu.be')) ? (
                        <iframe
                          className="mt-2 w-full aspect-video rounded"
                          src={q.video_url.replace('watch?v=', 'embed/')}
                          title="Example"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video className="mt-2 w-full rounded" controls src={q.video_url} />
                      )
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )
      })}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
        >
          Submit
        </button>
      ) : (
        <div className="mt-6 font-bold">
          Score: {score} / {questions.length}
        </div>
      )}
    </main>
  )
}
