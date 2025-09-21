'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ListView from '@/components/ListView'
import CalendarView from '@/components/CalendarView'
import AppointmentForm from '@/components/AppointmentForm'
import TopBar from '@/components/TopBar'
import Header from '@/components/Header'
import ApptModal from '@/components/ApptModal'
import { archiveAppt, restoreAppt, deleteAppt } from '@/lib/archive'

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

export default function Dashboard(){
  const [view, setView] = useState<'list'|'calendar'>('list')
  const [mode, setMode] = useState<'active'|'archive'>('active') // Standard: Aktiv
  const [items, setItems] = useState<Appt[]>([])
  const [loading, setLoading] = useState(true)

  // Modal-State
  const [modalOpen, setModalOpen] = useState(false)
  const [modalInitial, setModalInitial] = useState<Partial<Appt> | undefined>(undefined)

  const load = async ()=>{
    setLoading(true)
    let query = supabase.from('appointments').select('*')

    if (mode === 'archive') {
      query = query.not('archived_at','is', null)
    } else {
      query = query.is('archived_at', null)
    }

    const { data } = await query
      .order('date',{ascending:true})
      .order('start_time',{ascending:true})

    setItems((data||[]) as any)
    setLoading(false)
  }

  useEffect(()=>{ 
    load()
    const ch = supabase.channel('realtime:appointments')
      .on('postgres_changes', { event: '*', schema:'public', table:'appointments' }, load).subscribe()
    return ()=>{ supabase.removeChannel(ch) }
  },[mode])

  const readonly = mode === 'archive'

  const openEdit = (a: Appt)=>{ if(!readonly){ setModalInitial(a); setModalOpen(true) } }
  const openCreateForDate = (isoDate: string)=>{ if(!readonly){ setModalInitial({ date: isoDate }); setModalOpen(true) } }

  return (
    <main className="space-y-4">
      <Header/>
      <TopBar current={view} onViewChange={setView} mode={mode} onModeChange={setMode} />

      {!readonly && <AppointmentForm onSaved={load}/>}

      {view==='list'
        ? <ListView
            items={items}
            onChanged={load}
            loading={loading}
            mode={mode}
            onEdit={openEdit}
            readonly={readonly}
            onArchive={async(id:string)=>{ await archiveAppt(id); load() }}
            onRestore={async(id:string)=>{ await restoreAppt(id); load() }}
            onHardDelete={async(id:string)=>{
              if(!confirm('Diesen Termin endgültig löschen? Das kann NICHT rückgängig gemacht werden.')) return
              await deleteAppt(id); load()
            }}
          />
        : <CalendarView
            items={items}
            onChanged={load}
            loading={loading}
            mode={mode}
            onEdit={openEdit}
            onCreate={openCreateForDate}
            readonly={readonly}
            onArchive={async(id:string)=>{ await archiveAppt(id); load() }}
            onRestore={async(id:string)=>{ await restoreAppt(id); load() }}
            onHardDelete={async(id:string)=>{
              if(!confirm('Diesen Termin endgültig löschen?')) return
              await deleteAppt(id); load()
            }}
          />
      }

      {!readonly && (
        <ApptModal open={modalOpen} onClose={()=>setModalOpen(false)} initial={modalInitial} onSaved={load}/>
      )}
    </main>
  )
}
