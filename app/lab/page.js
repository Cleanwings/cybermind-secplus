// app/lab/page.js
'use client'
import { useEffect, useState } from 'react'
import { getCiaLab } from '@/lib/content'

export default function LabPage() {
  const [lab, setLab] = useState(null)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)

  useEffect(() => {
    (async () => {
      const data = await getCiaLab()
      setLab(data)
    })()
  }, [])

  function choose(i, val) {
    setAnswers(a => ({ ...a, [i]: val }))
  }

  function grade() {
    if (!lab?.spec?.tasks) return
    let correct = 0
    lab.spec.tasks.forEach((t, i) => {
      if ((answers[i] || '') === t.answer) correct++
    })
    const pass = correct >= (lab.spec.passScore || lab.spec.tasks.length)
    setResult({ correct, total: lab.spec.tasks.length, pass })
    // save for mastery gate (local)
    localStorage.setItem('cia_lab_passed', pass ? 'true' : 'false')
  }

  if (!lab) return <main className="p-6">Loading lab…</main>

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Lab: {lab.title}</h1>

      {lab.spec?.tasks?.map((t, i) => (
        <div key={i} className="mb-6 border rounded p-4">
          <p className="font-medium mb-2">{i + 1}. {t.prompt}</p>
          {t.options.map((opt) => (
            <label key={opt} className="block mb-1">
              <input
                type="radio"
                name={`t-${i}`}
                className="mr-2"
                checked={answers[i] === opt}
                onChange={() => choose(i, opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}

      <button onClick={grade} className="px-4 py-2 rounded bg-emerald-600 text-white">
        Submit Lab
      </button>

      {result && (
        <div className="mt-4">
          <p>Correct: {result.correct} / {result.total}</p>
          {result.pass ? (
            <a href="/gate" className="inline-block mt-3 px-4 py-2 rounded bg-blue-600 text-white">
              Continue
            </a>
          ) : (
            <p className="text-red-600 mt-2">Keep trying until you pass the lab.</p>
          )}
        </div>
      )}
    </main>
  )
}
