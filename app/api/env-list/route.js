export const runtime = 'nodejs'

export async function GET() {
  const keys = Object.keys(process.env)
    .filter(k => k.includes('GOOGLE') || k.includes('GEMINI'))
    .sort()
  const summary = Object.fromEntries(
    keys.map(k => [k, (process.env[k] ?? '').length])
  )
  return new Response(JSON.stringify(summary, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
