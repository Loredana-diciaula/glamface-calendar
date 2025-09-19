'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const LogoUpload = dynamic(()=>import('@/components/LogoUpload'), { ssr:false })

export default function Settings(){
  const [feed,setFeed]=useState('')

  useEffect(()=>{
    const slug = 'mein-team-feed'
    setFeed(`${location.origin}/api/ics/${slug}`)
  },[])

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-semibold">Einstellungen</h1>

      <section className="space-y-2">
        <div className="font-medium">Privatkalender abonnieren (nur lesen)</div>
        <div className="p-3 rounded-2xl bg-white break-all text-black">{feed}</div>
        <div className="text-sm opacity-75">
          iPhone: Einstellungen → Kalender → Accounts → Account hinzufügen → Andere → Kalenderabo hinzufügen → Link einfügen.
        </div>
      </section>

      <LogoUpload />
    </main>
  )
}
