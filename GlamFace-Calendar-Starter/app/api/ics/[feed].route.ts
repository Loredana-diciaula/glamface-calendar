import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { makeICS } from '@/lib/ics'

export async function GET(req: NextRequest, { params }:{ params:{ feed:string }}){
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const feedSlug = params.feed
  const { data: team } = await supabase.from('teams').select('id').eq('ics_feed_slug', feedSlug).single()
  if(!team) return new NextResponse('Not found', { status:404 })
  const { data: ap } = await supabase.from('appointments').select('*').eq('business_id', team.id)
  const items = (ap||[]).map((a:any)=>({
    title: `${a.customer_name} – ${a.service}`,
    start: new Date(`${a.date}T${a.start_time}`),
    end: new Date(`${a.date}T${a.end_time}`),
    description: [a.phone ? `Tel: ${a.phone}` : '', a.notes||''].filter(Boolean).join('\n')
  }))
  const ics = await makeICS(items)
  return new NextResponse(ics, { status:200, headers:{ 'Content-Type':'text/calendar; charset=utf-8' }})
}
