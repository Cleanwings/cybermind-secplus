// app/api/debug-gemini/route.js
import { NextResponse } from 'next/server'
export async function GET() {
  const val = process.env.GOOGLE_API_KEY || ''
  return NextResponse.json({ hasKey: !!val, length: val.length })
}

