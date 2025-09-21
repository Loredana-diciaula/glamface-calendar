'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
const FEED_SLUG='mein-team-feed'

export default function Header(){
  const [logo,setLogo]=useState<string>('')

  useEffect(()=>{ (async()=>{
    const { data } = await supabase.from('teams').select('logo_url').eq('ics_feed_slug', FEED_SLUG).single()
    setLogo(data?.logo_url || '')
  })() },[])

  return (
    <header className="py-4 flex items-center justify-center">
      {logo ? (
        <img
          src={logo}
          alt="GlamFace"
          className="h-32 sm:h-36 md:h-40 w-auto object-contain rounded-xl"
          /* h-32 ≈ 128px, bei Bedarf auf h-40/h-48 erhöhen */
        />
      ) : (
        <div className="text-2xl font-semibold">GlamFace</div>
      )}
    </header>
  )
}
