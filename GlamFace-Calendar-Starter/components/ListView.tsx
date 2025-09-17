'use client'
import { format, isBefore } from 'date-fns'
import de from 'date-fns/locale/de'
import StatusBadge from './StatusBadge'
import { supabase } from '@/lib/supabaseClient'
import type { Appt } from '@/app/(dashboard)/page'

export default function ListView({items,loading,onChanged}:{items:Appt[],loading:boolean,onChanged:()=>void}){
  const mutate = async (id:string, patch:any)=>{
    const { error } = await supabase.from('appointments').update(patch).eq('id',id); if(!error) onChanged()
  }
  const remove = async (id:string)=>{ if(confirm('Termin löschen?')){ const {error}=await supabase.from('appointments').delete().eq('id',id); if(!error) onChanged() } }

  return (
    <section className="space-y-2">
      {loading && <p>Lade…</p>}
      {items.map(a=>{
        const start = new Date(`${a.date}T${a.start_time}`)
        const past = isBefore(start, new Date())
        return (
          <article key={a.id} className={`p-3 rounded-2xl ${past?'bg-gray-100/70':'bg-white'} text-black`}>
            <div className="flex items-center justify-between">
              <div className="font-medium">{a.customer_name}</div>
              <StatusBadge status={a.status}/>
            </div>
            <div className="text-sm opacity-80">{a.service}</div>
            <div className="text-sm">{format(start,'EEE dd.MM.yyyy HH:mm', {locale:de})} – {a.end_time.substring(0,5)} Uhr</div>
            {a.phone && <div className="text-sm">☎ {a.phone}</div>}
            {a.notes && <div className="text-sm">🗒 {a.notes}</div>}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button className="p-2 bg-black text-white" onClick={()=>mutate(a.id,{status:'abgeschlossen'})}>Als abgeschlossen</button>
              <button className="p-2 bg-gray-800 text-white" onClick={()=>mutate(a.id,{status:'nicht_erschienen'})}>Nicht erschienen</button>
              <button className="p-2 bg-gray-700 text-white" onClick={()=>mutate(a.id,{status:'kurzfristig_abgesagt'})}>Kurzfr. abgesagt</button>
              <button className="p-2 bg-gray-900 text-white" onClick={()=>{
                const d = prompt('Neues Datum (YYYY-MM-DD):', a.date) || a.date
                const s = prompt('Neue Startzeit (HH:MM):', a.start_time) || a.start_time
                const e = prompt('Neue Endzeit (HH:MM):', a.end_time) || a.end_time
                mutate(a.id,{date:d,start_time:s,end_time:e})
              }}>Termin verschieben</button>
              <button className="col-span-2 p-2 bg-white border" onClick={()=>remove(a.id)}>Löschen</button>
            </div>
          </article>
        )
      })}
    </section>
  )
}
