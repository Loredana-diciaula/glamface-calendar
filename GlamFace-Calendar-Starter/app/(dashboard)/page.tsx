'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ListView from '@/components/ListView'
import CalendarView from '@/components/CalendarView'
import AppointmentForm from '@/components/AppointmentForm'
import TopBar from '@/components/TopBar'

export type Appt = {
  id: string
  date: string
  start_time: string
  end_time: string
  customer_name: string
  service: string
  notes?: string
  phone?: string
  status: 'geplant' | 'nicht_erschienen' | 'kurzfristig_abgesagt' | 'abgeschlossen'
}

export default function Dashboard(){
  const [view, setView] = useState<'list'|'calendar'>('list')
  const [items, setItems] = useState<Appt[]>([])
  const [loading, setLoading] = useState(true)

  const load = async ()=>{
    setLoading(true)
    const { data, error } = await supabase.from('appointments').select('*').order('date',{ascending:true}).order('start_time',{ascending:true})
    if(error){ console.error(error) }
    setItems((data||[]) as any)
    setLoading(false)
  }
  useEffect(()=>{ 
    load()
    const ch = supabase.channel('realtime:appointments')
      .on('postgres_changes', { event: '*', schema:'public', table:'appointments' }, load).subscribe()
    return ()=>{ supabase.removeChannel(ch) }
  },[])

  return (
    <main className="space-y-4">
      <TopBar onViewChange={setView} current={view}/>
      <AppointmentForm onSaved={load}/>
      {view==='list' ? (
        <ListView items={items} onChanged={load} loading={loading} />
      ) : (
        <CalendarView items={items} onChanged={load} loading={loading} />
      )}
    </main>
  )
}
