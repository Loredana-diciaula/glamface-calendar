'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ListView from '@/components/ListView'
import CalendarView from '@/components/CalendarView'
import AppointmentForm from '@/components/AppointmentForm'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import ApptModal from '@/components/ApptModal'

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
  archived_at?: string | null
}

export default function Dashboard() {
  const [view, setView] = useState<'list'|'calendar'>('list')
  const [mode, setMode] = useState<'active'|'archive'>('active')
  const [items, setItems] = useState<Appt[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('') // 🔎 Suchtext

  const [modalOpen, setModalOpen] = useState(false)
  const [modalInitial, setModalInitial] = useState<Partial<Appt> | undefined>(undefined)

  // Termine laden (active = ohne Archiv, archive = nur archivierte)
  const load = async ()=>{
    setLoading(true)
    let q = supabase.from('appointments').select('*')
    if (mode === 'archive') q = q.not('archived_at','is', null)
    else q = q.is('archived_at', null)
    const { data } = await q.order('date',{ascending:true}).order('start_time',{ascending:true})
    setItems((data||[]) as any)
    setLoading(false)
  }

  useEffect(()=>{ 
    load()
    const ch = supabase.channel('realtime:appointments')
      .on('postgres_changes', { event: '*', schema:'public', table:'appointments' }, load)
      .subscribe()
    return ()=>{ supabase.removeChannel(ch) }
  },[mode])

  const readonly = mode === 'archive'
  const openEdit = (a: Appt)=>{ if(!readonly){ setModalInitial(a); setModalOpen(true) } }
  const openCreateForDate = (isoDate: string)=>{ if(!readonly){ setModalInitial({ date: isoDate }); setModalOpen(true) } }

  // 🔎 Client-Side-Filter: Name / Telefon / Service
  const q = query.trim().toLowerCase()
  const itemsFiltered = q
    ? items.filter(a =>
        [a.customer_name, a.phone, a.service]
          .map(v => (v||'').toLowerCase())
          .some(v => v.includes(q))
      )
    : items

  return (
    <main className="space-y-4">
      <Header/>

      <TopBar
        current={view}
        onViewChange={setView}
        mode={mode}
        onModeChange={setMode}
        query={query}
        onQueryChange={setQuery}
      />

      {!readonly && <AppointmentForm onSaved={load}/>}

      {view==='list'
        ? <ListView
            items={itemsFiltered}
            onChanged={load}
            loading={loading}
            mode={mode}
            onEdit={openEdit}
            readonly={readonly}
          />
        : <CalendarView
            items={itemsFiltered}
            onChanged={load}
            loading={loading}
            mode={mode}
            onEdit={openEdit}
            onCreate={openCreateForDate}
            readonly={readonly}
          />
      }

      {!readonly && (
        <ApptModal
          open={modalOpen}
          onClose={()=>setModalOpen(false)}
          initial={modalInitial}
          onSaved={load}
        />
      )}
    </main>
  )
}
