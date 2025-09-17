'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Settings(){
  const [feed,setFeed]=useState('')
  useEffect(()=>{ (async()=>{
    const slug = 'mein-team-feed' // TODO: aus DB laden
    setFeed(`${location.origin}/api/ics/${slug}`)
  })() },[])
  return (
    <main className="space-y-3">
      <h1 className="text-2xl font-semibold">Einstellungen</h1>
      <p><b>Privatkalender abonnieren (nur lesen)</b>: Diese URL in Apple Kalender → Kalender abonnieren einfügen:</p>
      <div className="p-3 rounded-2xl bg-white break-all text-black">{feed}</div>
      <p className="opacity-80 text-sm">Alles, was ihr in GlamFace eintragt, erscheint automatisch in euren privaten Kalendern. Umgekehrt wird nichts importiert.</p>
    </main>
  )
}
