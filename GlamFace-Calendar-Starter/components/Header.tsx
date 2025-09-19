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
          className="h-24 sm:h-28 md:h-32 w-auto object-contain rounded-xl"
          /* h-24 ≈ 96px; wenn du noch größer willst -> h-32 / h-40 */
        />
      ) : (
        <div className="text-2xl font-semibold">GlamFace</div>
      )}
    </header>
  )
}
