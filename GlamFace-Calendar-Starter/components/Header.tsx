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
    <div className="flex items-center gap-3 mb-2">
      {logo ? (
        <img src={logo} alt="GlamFace" className="h-8 w-auto rounded-xl"/>
      ) : (
        <div className="text-lg font-semibold">GlamFace</div>
      )}
    </div>
  )
}
