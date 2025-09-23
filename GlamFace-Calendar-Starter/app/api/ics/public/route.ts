// GlamFace-Calendar-Starter/app/api/ics/public/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { makeICS } from '@/lib/ics'

// Wichtig: nicht cachen, damit neue Termine schnell am iPhone ankommen
export const revalidate = 0
export const dynamic = 'force-dynamic'

// Welches Team? -> wir nehmen euren bekannten Slug
const FEED_SLUG = 'mein-team-feed'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Team via Slug finden
    const { data: team, error: teamErr } = await supabase
      .from('teams')
      .select('id')
      .eq('ics_feed_slug', FEED_SLUG)
      .single()

    if (teamErr || !team) {
      return new NextResponse('Team not found', { status: 404 })
    }

    // Alle Termine dieses Teams holen (aktive + archivierte, wenn du nur aktive willst: .is('archived_at', null))
    const { data: ap, error: apErr } = await supabase
      .from('appointments')
      .select('*')
      .eq('business_id', team.id)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })

    if (apErr) {
      return new NextResponse('Error fetching appointments', { status: 500 })
    }

    // In ICS-Events umwandeln
    const items = (ap || []).map((a: any) => ({
      title: `${a.customer_name} – ${a.service}`,
      start: new Date(`${a.date}T${a.start_time}`),
      end: new Date(`${a.date}T${a.end_time}`),
      description: [a.phone ? `Tel: ${a.phone}` : '', a.notes || '']
        .filter(Boolean)
        .join('\n'),
    }))

    const ics = await makeICS(items)

    return new NextResponse(ics, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="glamface.ics"',
      },
    })
  } catch (e) {
    return new NextResponse('Internal error', { status: 500 })
  }
}
