import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'

// WICHTIG: keine Konstante "URL" nennen! Sonst überschattet sie die globale URL-Klasse.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SECRET = process.env.NEXT_PUBLIC_ICS_SIGNING_SECRET || 'wechselmich123'

// CSV sicher escapen
function esc(v: any) {
  const s = (v ?? '').toString().replace(/"/g, '""')
  return `"${s}"`
}

export async function GET(req: NextRequest) {
  // Hier bewusst globalThis.URL, damit es garantiert die echte URL-Klasse ist
  const { searchParams } = new globalThis.URL(req.url)

  // Token prüfen
  const token = searchParams.get('token')
  if (!token || token !== SECRET) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  // scope: all | active | archived
  const scope = (searchParams.get('scope') || 'all').toLowerCase()

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
  let q = supabase.from('appointments').select('*')
  if (scope === 'active') q = q.is('archived_at', null)
  else if (scope === 'archived') q = q.not('archived_at', 'is', null)

  const { data, error } = await q
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) {
    return new NextResponse('Error fetching data', { status: 500 })
  }

  const headers = [
    'id','date','start_time','end_time','customer_name','service',
    'phone','notes','status','archived_at'
  ]
  const rows = (data || []).map((a: any) => [
    a.id,a.date,a.start_time,a.end_time,a.customer_name,a.service,
    a.phone,a.notes,a.status,a.archived_at
  ])

  const csv =
    headers.map(esc).join(',') + '\r\n' +
    rows.map(r => r.map(esc).join(',')).join('\r\n')

  const now = new Date().toISOString().replace(/[-:]/g,'').replace(/\..+/,'')
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="glamface_export_${scope}_${now}.csv"`,
    },
  })
}
