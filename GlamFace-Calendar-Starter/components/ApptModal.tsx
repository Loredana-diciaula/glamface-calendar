'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Appt } from '@/app/(dashboard)/page'

export default function ApptModal({
  open, onClose, initial, onSaved
}: {
  open: boolean
  onClose: () => void
  initial?: Partial<Appt>   // wenn id vorhanden => Edit, sonst Create
  onSaved: () => void
}) {
  const [customer_name,setCustomer] = useState(initial?.customer_name || '')
  const [service,setService] = useState(initial?.service || '')
  const [notes,setNotes] = useState(initial?.notes || '')
  const [phone,setPhone] = useState(initial?.phone || '')
  const [date,setDate] = useState(initial?.date || '')
  const [start_time,setStart] = useState(initial?.start_time || '')
  const [end_time,setEnd] = useState(initial?.end_time || '')
  const [saving,setSaving] = useState(false)

  useEffect(()=>{
    setCustomer(initial?.customer_name || '')
    setService(initial?.service || '')
    setNotes(initial?.notes || '')
    setPhone(initial?.phone || '')
    setDate(initial?.date || '')
    setStart(initial?.start_time || '')
    setEnd(initial?.end_time || '')
  },[initial,open])

  if(!open) return null

  const save = async ()=>{
    if(!customer_name || !service || !date || !start_time || !end_time){
      alert('Bitte Name, Behandlung, Datum und Uhrzeit ausfüllen.')
      return
    }
    setSaving(true)
    const fields = { customer_name, service, notes, phone, date, start_time, end_time }
    let error
    if (initial?.id) {
      ;({ error } = await supabase.from('appointments').update(fields).eq('id', initial.id))
    } else {
      ;({ error } = await supabase.from('appointments').insert([fields]))
    }
    setSaving(false)
    if(error){ alert(error.message); return }
    onSaved(); onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="w-[92%] max-w-md bg-white text-black rounded-2xl p-4 space-y-3">
        <div className="text-lg font-semibold">
          {initial?.id ? 'Termin bearbeiten' : 'Neuen Termin anlegen'}
        </div>

        <label className="block">
          <span className="text-sm opacity-70">Name der Kundin</span>
          <input className="w-full p-3 bg-gray-100 rounded-2xl" value={customer_name} onChange={e=>setCustomer(e.target.value)} />
        </label>

        <label className="block">
          <span className="text-sm opacity-70">Behandlung</span>
          <input className="w-full p-3 bg-gray-100 rounded-2xl" value={service} onChange={e=>setService(e.target.value)} />
        </label>

        <label className="block">
          <span className="text-sm opacity-70">Sonstiges / Notizen</span>
          <textarea className="w-full p-3 bg-gray-100 rounded-2xl" value={notes} onChange={e=>setNotes(e.target.value)} />
        </label>

        <label className="block">
          <span className="text-sm opacity-70">Telefonnummer</span>
          <input className="w-full p-3 bg-gray-100 rounded-2xl" value={phone} onChange={e=>setPhone(e.target.value)} />
        </label>

        <div className="grid grid-cols-3 gap-2">
          <label className="block">
            <span className="text-sm opacity-70">Datum</span>
            <input type="date" className="w-full p-3 bg-gray-100 rounded-2xl" value={date} onChange={e=>setDate(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm opacity-70">von</span>
            <input type="time" className="w-full p-3 bg-gray-100 rounded-2xl" value={start_time} onChange={e=>setStart(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm opacity-70">bis</span>
            <input type="time" className="w-full p-3 bg-gray-100 rounded-2xl" value={end_time} onChange={e=>setEnd(e.target.value)} />
          </label>
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 p-3 bg-gray-200 rounded-2xl">Abbrechen</button>
          <button onClick={save} className="flex-1 p-3 bg-black text-white rounded-2xl" disabled={saving}>
            {saving ? 'Speichere…' : 'Speichern'}
          </button>
        </div>
      </div>
    </div>
  )
}
