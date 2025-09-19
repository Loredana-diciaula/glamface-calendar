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
    <header className="py-3 flex items-center justify-center">
      {logo ? (
        <img
          src={logo}
          alt="GlamFace"
          className="h-16 w-auto rounded-xl"   /* <- GRÖßER (h-16≈64px) */
        />
      ) : (
        <div className="text-xl font-semibold">GlamFace</div>
      )}
    </header>
  )
}
