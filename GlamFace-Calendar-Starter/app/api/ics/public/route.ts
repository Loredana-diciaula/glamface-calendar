
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { makeICS } from '@/lib/ics'

// Falls du später den Feed-Slug ändern willst, kannst du ihn hier zentral setzen.
// Standard: "mein-team-feed" (so heißt er bei dir in der Tabelle "teams")
const DEFAULT_FEED_SLUG = process.env.NEXT_PUBLIC_ICS_DEFAULT_FEED || 'mein-team-feed'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Team anhand des festen Slugs holen (ohne Token, öffentlich)
    const { data: team, error: teamErr } = await supabase
      .from('teams')
      .select('id')
      .eq('ics_feed_slug', DEFAULT_FEED_SLUG)
      .single()

    if (teamErr || !team) {
      return new NextResponse('Team not found', { status: 404 })
    }

    // Alle Termine dieses Teams holen
    const { data: ap, error: apErr } = await supabase
      .from('appointments')
      .select('*')
      .eq('business_id', team.id)

    if (apErr) {
      return new NextResponse('Error fetching appointments', { status: 500 })
    }

    // In ICS-Items umwandeln
    const items = (ap || []).map((a: any) => ({
      title: `${a.customer_name} – ${a.service}`,
      start: new Date(`${a.date}T${a.start_time}`),
      end: new Date(`${a.date}T${a.end_time}`),
      description: [a.phone ? `Tel: ${a.phone}` : '', a.notes || ''].filter(Boolean).join('\n'),
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
