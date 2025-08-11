import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <section className="max-w-4xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Cybermind <span className="text-emerald-600">AI</span> Security+ Coach
        </h1>
        <p className="mt-4 text-gray-600">
          AI-assisted coaching, performance-based labs, and mastery gates — no fluff.
        </p>
        
        <div className="mt-8 flex gap-3">
          <a href="/lesson" className="px-4 py-2 rounded-lg border hover:bg-gray-50">
            Open Lesson
          </a>
          <a href="/quiz" className="px-4 py-2 rounded-lg border hover:bg-gray-50">
            Take Quiz
          </a>
          <a href="/lab" className="px-4 py-2 rounded-lg border hover:bg-gray-50">
            Do Lab
          </a>
          <a href="/gate" className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:opacity-90">
            Mastery Gate
          </a>
        </div>
      </section>
    </main>
  )
}

