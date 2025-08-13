'use client'
import { useEffect, useState } from 'react'

export default function QuizPage() {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetch('/api/quiz')
      .then(res => res.json())
      .then(data => setQuestions(data.questions))
  }, [])

  const handleSelect = (qid, index) => {
    setAnswers({ ...answers, [qid]: index })
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  const score = questions.reduce((acc, q) => {
    if (answers[q.id] === q.correct_index) return acc + 1
    return acc
  }, 0)

  return (
    <main className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Quiz</h1>

      {questions.map((q, qi) => (
        <div key={q.id} className="mb-8 p-4 border rounded-lg">
          <p className="font-medium mb-2">Q{qi + 1}. {q.stem}</p>
          <div className="space-y-2">
            {q.choices?.map((choice, ci) => (
              <label key={ci} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  checked={answers[q.id] === ci}
                  onChange={() => handleSelect(q.id, ci)}
                />
                <span>{choice.label}. {choice.text}</span>
              </label>
            ))}
          </div>

          {submitted && (
            <div className="mt-4">
              {answers[q.id] === q.correct_index ? (
                <p className="text-green-600 font-semibold">✅ Correct</p>
              ) : (
                <>
                  <p className="text-red-600 font-semibold">
                    ❌ Incorrect — Correct answer: {q.choices[q.correct_index]?.label}
                  </p>
                  {q.explanation_md && (
                    <p className="mt-2 text-gray-700">{q.explanation_md}</p>
                  )}
                  {q.video_url && (
                    <video
                      className="mt-2 w-full rounded-lg"
                      controls
                      src={q.video_url}
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>
      ))}

      {!submitted && (
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
        >
          Submit
        </button>
      )}

      {submitted && (
        <div className="mt-6 font-bold">
          Score: {score} / {questions.length}
        </div>
      )}
    </main>
  )
}
