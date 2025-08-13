'use client'
import { useEffect, useState } from 'react'

export default function QuizPage() {
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})   // { [questionId]: optionId }
  const [result, setResult] = useState(null)   // { score, total, perQuestion: [...] }

  useEffect(() => {
    fetch('/api/quiz')
      .then(r => r.json())
      .then(data => {
        setQuestions(data.questions || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  function choose(qid, oid) {
    setAnswers(prev => ({ ...prev, [qid]: oid }))
  }

  function grade() {
    const per = questions.map(q => {
      const chosen = answers[q.id]
      const correctOpt = (q.options || []).find(o => o.is_correct)
      const isCorrect = chosen === correctOpt?.id
      return {
        questionId: q.id,
        question: q.stem || q.prompt || '',
        isCorrect,
        chosenText: (q.options || []).find(o => o.id === chosen)?.text || '(no answer)',
        correctText: correctOpt?.text || '(none)',
        explanation_md: q.explanation_md || '',
        video_url: q.video_url || null
      }
    })
    const score = per.filter(p => p.isCorrect).length
    setResult({ score, total: questions.length, perQuestion: per })
  }

  if (loading) return <main className="p-6">Loading quiz…</main>

  if (result) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Your Results</h1>
        <p className="mt-1">Score: {result.score} / {result.total}</p>

        <div className="mt-6" style={{ display: 'grid', gap: 16 }}>
          {result.perQuestion.map((p, i) => (
            <div key={p.questionId} style={{ border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
              <div style={{ fontWeight: 'bold' }}>
                Q{i + 1}. {p.question} {p.isCorrect ? '✅' : '❌'}
              </div>

              {!p.isCorrect && (
                <div style={{ marginTop: 8 }}>
                  <div><strong>Your answer:</strong> {p.chosenText}</div>
                  <div><strong>Correct answer:</strong> {p.correctText}</div>
                  {p.explanation_md && (
                    <div style={{ marginTop: 8 }}>
                      <strong>Why:</strong> {p.explanation_md}
                    </div>
                  )}
                  {p.video_url && (
                    <div style={{ marginTop: 10 }}>
                      <strong>Watch example:</strong>
                      <div style={{ marginTop: 6 }}>
                        {(p.video_url.includes('youtube.com') || p.video_url.includes('youtu.be')) ? (
                          <iframe
                            width="560" height="315"
                            src={p.video_url.replace('watch?v=', 'embed/')}
                            title="Example"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video controls width="560" src={p.video_url} />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {p.isCorrect && (
                <div style={{ marginTop: 8, color: '#128a12' }}>
                  Nicely done — that’s correct.
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="mt-6 px-4 py-2 rounded" onClick={() => setResult(null)}>
          Retake Quiz
        </button>
      </main>
    )
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Quiz — Module 1</h1>
      <div className="mt-4" style={{ display: 'grid', gap: 16 }}>
        {questions.map((q, idx) => (
          <div key={q.id} style={{ border: '1px solid #eee', padding: 12, borderRadius: 8 }}>
            <div style={{ fontWeight: 'bold' }}>Q{idx + 1}. {q.stem || q.prompt}</div>
            <div style={{ marginTop: 8 }}>
              {(q.options || []).sort((a, b) => a.label.localeCompare(b.label)).map(opt => (
                <label key={opt.id} style={{ display: 'block', cursor: 'pointer', marginBottom: 4 }}>
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    checked={answers[q.id] === opt.id}
                    onChange={() => choose(q.id, opt.id)}
                    style={{ marginRight: 8 }}
                  />
                  <strong>{opt.label}.</strong> {opt.text}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="mt-6 px-4 py-2 rounded bg-emerald-600 text-white" onClick={grade}>
        Submit
      </button>
    </main>
  )
}
