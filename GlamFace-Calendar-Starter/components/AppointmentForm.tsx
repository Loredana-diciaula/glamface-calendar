'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AppointmentForm({ onSaved }: { onSaved: () => void }) {
  const [customer_name,setCustomer] = useState('')
  const [service,setService] = useState('')
  const [notes,setNotes] = useState('')
  const [phone,setPhone] = useState('')
  const [date,setDate] = useState('')
  const [start_time,setStart] = useState('')
  const [end_time,setEnd] = useState('')
  const [saving,setSaving] = useState(false)

  const save = async ()=>{
    if(!customer_name || !service || !date || !start_time || !end_time){
      alert('Bitte Name, Behandlung, Datum und Uhrzeit ausfüllen.')
      return
    }
    setSaving(true)
    const { error } = await supabase.from('appointments').insert([{
      customer_name, service, notes, phone, date, start_time, end_time
    }])
    setSaving(false)
    if(error){ alert(error.message); return }
    setCustomer(''); setService(''); setNotes(''); setPhone('');
    setDate(''); setStart(''); setEnd('');
    onSaved()
  }

  return (
    <section className="p-3 bg-white rounded-2xl text-black space-y-3">
      <div className="grid grid-cols-1 gap-2">
        <label className="block">
          <span className="text-sm opacity-70">Name der Kundin</span>
          <input className="w-full p-3 bg-gray-100 rounded-2xl"
            placeholder="z. B. Maria Muster"
            value={customer_name} onChange={e=>setCustomer(e.target.value)} />
        </label>

        <label className="block">
          <span className="text-sm opacity-70">Behandlung</span>
          <input className="w-full p-3 bg-gray-100 rounded-2xl"
            placeholder="z. B. Wimpern"
            value={service} onChange={e=>setService(e.target.value)} />
        </label>

        <label className="block">
          <span className="text-sm opacity-70">Sonstiges / Notizen</span>
          <textarea className="w-full p-3 bg-gray-100 rounded-2xl"
            placeholder="Besondere Hinweise…"
            value={notes} onChange={e=>setNotes(e.target.value)} />
        </label>

        <label className="block">
          <span className="text-sm opacity-70">Telefonnummer</span>
          <input className="w-full p-3 bg-gray-100 rounded-2xl"
            placeholder="+49…"
            value={phone} onChange={e=>setPhone(e.target.value)} />
        </label>

        <div className="grid grid-cols-3 gap-2">
          <label className="block">
            <span className="text-sm opacity-70">Datum</span>
            <input type="date" className="w-full p-3 bg-gray-100 rounded-2xl"
              value={date} onChange={e=>setDate(e.target.value)} />
          </label>

          <label className="block">
            <span className="text-sm opacity-70">Uhrzeit von</span>
            <input type="time" className="w-full p-3 bg-gray-100 rounded-2xl"
              value={start_time} onChange={e=>setStart(e.target.value)} />
          </label>

          <label className="block">
            <span className="text-sm opacity-70">bis</span>
            <input type="time" className="w-full p-3 bg-gray-100 rounded-2xl"
              value={end_time} onChange={e=>setEnd(e.target.value)} />
          </label>
        </div>
      </div>

      <button
        className="w-full p-3 bg-black text-white rounded-2xl disabled:opacity-50"
        onClick={save} disabled={saving}
      >
        {saving ? 'Speichere…' : 'Speichern'}
      </button>
    </section>
  )
}
