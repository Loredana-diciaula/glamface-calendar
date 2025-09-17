'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AppointmentForm({onSaved}:{onSaved:()=>void}){
  const [form,setForm]=useState({customer_name:'',service:'',notes:'',phone:'',date:'',start_time:'',end_time:''})
  const save=async()=>{
    if(!form.date||!form.start_time||!form.end_time||!form.customer_name||!form.service){alert('Bitte Pflichtfelder ausfüllen');return}
    const { error } = await supabase.from('appointments').insert({
      date:form.date,start_time:form.start_time,end_time:form.end_time,
      customer_name:form.customer_name,service:form.service,notes:form.notes,phone:form.phone
    })
    if(error){alert(error.message)} else { setForm({customer_name:'',service:'',notes:'',phone:'',date:'',start_time:'',end_time:''}); onSaved(); }
  }
  return (
    <section className="p-3 bg-white rounded-2xl text-black space-y-2">
      <h2 className="font-medium">Neuer Termin</h2>
      <input placeholder="Name der Kundin" className="w-full p-3 rounded-2xl bg-gray-100" value={form.customer_name} onChange={e=>setForm({...form,customer_name:e.target.value})}/>
      <input placeholder="Behandlung" className="w-full p-3 rounded-2xl bg-gray-100" value={form.service} onChange={e=>setForm({...form,service:e.target.value})}/>
      <textarea placeholder="Sonstiges / Notizen" className="w-full p-3 rounded-2xl bg-gray-100" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/>
      <input placeholder="Telefonnummer" className="w-full p-3 rounded-2xl bg-gray-100" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
      <div className="grid grid-cols-3 gap-2">
        <input type="date" className="p-3 rounded-2xl bg-gray-100" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/>
        <input type="time" className="p-3 rounded-2xl bg-gray-100" value={form.start_time} onChange={e=>setForm({...form,start_time:e.target.value})}/>
        <input type="time" className="p-3 rounded-2xl bg-gray-100" value={form.end_time} onChange={e=>setForm({...form,end_time:e.target.value})}/>
      </div>
      <button onClick={save} className="w-full p-3 bg-black text-white">Speichern</button>
    </section>
  )
}
