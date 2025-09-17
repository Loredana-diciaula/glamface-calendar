'use client'
import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthPage(){
  const [email, setEmail] = useState('')
  const r = useRouter()

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{ if(data.session) r.replace('/') })
  },[])

  const loginWithEmail = async ()=>{
    const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true }})
    if(error){ alert(error.message); return }
    alert('Bitte prüfe dein Postfach und bestätige die Anmeldung. Danach in den Einstellungen Passkey/Face ID hinzufügen.')
  }

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-semibold">GlamFace Login</h1>
      <p>E-Mail eintragen → Login-Link kommt per Mail. Danach in „Einstellungen“ einen Passkey hinzufügen (Face ID).</p>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-Mail" className="w-full p-3 rounded-2xl bg-white text-black"/>
      <div className="grid gap-3">
        <button onClick={loginWithEmail} className="p-3 bg-black text-white">Einloggen</button>
      </div>
    </main>
  )
}
