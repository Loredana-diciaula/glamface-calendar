import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { makeICS } from '@/lib/ics'

export async function GET(req: NextRequest, { params }:{ params:{ feed:string }}) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // 1) Feed-Slug aus der URL (geheimer Name)
  const feedSlug = params.feed

  // 2) Team anhand des Slugs finden
  const { data: team, error: teamErr } = await supabase
    .from('teams')
    .select('id')
    .eq('ics_feed_slug', feedSlug)
    .single()

  if (teamErr || !team) {
    return new NextResponse('Not found', { status: 404 })
  }

  // 3) Termine laden: NUR aktive (nicht archivierte)
  const { data: ap, error: apErr } = await supabase
    .from('appointments')
    .select('*')
    .eq('business_id', team.id)
    .is('archived_at', null)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })

  if (apErr) {
    return new NextResponse('Error fetching data', { status: 500 })
  }

  // 4) In ICS-Items umwandeln
  const items = (ap || []).map((a: any) => ({
    title: `${a.customer_name || 'Kunde'} – ${a.service || 'Termin'}`,
    start: new Date(`${a.date}T${a.start_time || '00:00'}`),
    end: new Date(`${a.date}T${a.end_time || '00:00'}`),
    description: [a.phone ? `Tel: ${a.phone}` : '', a.notes || '']
      .filter(Boolean)
      .join('\n'),
  }))

  // 5) ICS generieren
  const ics = await makeICS(items)

  return new NextResponse(ics, {
    status: 200,
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  })
}
