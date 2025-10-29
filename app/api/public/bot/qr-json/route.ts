import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const base = process.env.BOT_SERVICE_URL || 'http://localhost:4002'
    const url = `${base.replace(/\/$/, '')}/qr.json?${Date.now()}`
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) {
      return NextResponse.json({ ok: false, message: 'QR not available' }, { status: res.status, headers: { 'Cache-Control': 'no-store' } })
    }
    const data = await res.json()
    return NextResponse.json(data, { status: 200, headers: { 'Cache-Control': 'no-store' } })
  } catch (e) {
    return NextResponse.json({ ok: false, message: 'Bot QR unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }
}
