'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LogoUpload(){
  const [file,setFile]=useState<File|null>(null)
  const upload=async()=>{
    if(!file) return
    const { data, error } = await supabase.storage.from('logos').upload(`logo-${Date.now()}.png`, file)
    if(error){ alert(error.message) } else {
      const { data:pub } = supabase.storage.from('logos').getPublicUrl(data.path)
      alert('Logo gespeichert: '+pub.publicUrl)
    }
  }
  return (
    <div className="p-3 bg-white rounded-2xl text-black space-y-2">
      <div className="font-medium">Logo hochladen</div>
      <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
      <button className="p-2 bg-black text-white" onClick={upload}>Hochladen</button>
    </div>
  )
}
