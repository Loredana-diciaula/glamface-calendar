'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

const FEED_SLUG = 'mein-team-feed'

export default function LogoUpload(){
  const [file,setFile]=useState<File|null>(null)
  const [logoUrl,setLogoUrl]=useState<string>('')

  useEffect(()=>{ (async()=>{
    const { data } = await supabase.from('teams').select('logo_url').eq('ics_feed_slug', FEED_SLUG).single()
    setLogoUrl(data?.logo_url || '')
  })() },[])

  const upload=async()=>{
    if(!file) return
    const path = `logo-${Date.now()}.png`
    const up = await supabase.storage.from('logos').upload(path, file, { upsert:false })
    if(up.error){ alert(up.error.message); return }
    const pub = supabase.storage.from('logos').getPublicUrl(path).data.publicUrl
    await supabase.from('teams').update({ logo_url: pub }).eq('ics_feed_slug', FEED_SLUG)
    setLogoUrl(pub)
    alert('Logo aktualisiert ✅')
  }

  return (
    <div className="p-3 bg-white rounded-2xl text-black space-y-3">
      <div className="font-medium">Logo</div>
      {logoUrl && <img src={logoUrl} alt="Logo" className="h-14 w-auto rounded-xl" />}
      <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
      <button className="p-2 bg-black text-white rounded-2xl" onClick={upload}>Hochladen & Speichern</button>
    </div>
  )
}
