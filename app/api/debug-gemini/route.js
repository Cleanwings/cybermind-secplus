// app/api/debug-gemini/route.js
export const runtime = 'nodejs'   // force Node so env vars are available

export async function GET() {
  const val = process.env.GOOGLE_API_KEY || ''
  return new Response(JSON.stringify({ hasKey: !!val, length: val.length }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

