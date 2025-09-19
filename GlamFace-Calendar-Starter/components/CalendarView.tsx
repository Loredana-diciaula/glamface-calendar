'use client'
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay } from 'date-fns'
import { de } from 'date-fns/locale'
import type { Appt } from '@/app/(dashboard)/page'
import { useMemo, useState } from 'react'

export default function CalendarView({items,loading,onChanged,mode}:{items:Appt[],loading:boolean,onChanged:()=>void,mode:'active'|'archive'}){
  const [current,setCurrent]=useState(new Date())
  const [selected,setSelected]=useState<Date|null>(null)

  const days = eachDayOfInterval({ start: startOfMonth(current), end: endOfMonth(current) })
  const dayItems = (d:Date)=> items.filter(a=>isSameDay(new Date(`${a.date}T00:00:00`), d))
  const filteredForMode = (list:Appt[]) => mode==='active' ? list.filter(a=>a.status==='geplant') : list.filter(a=>a.status!=='geplant')

  return (
    <section className="space-y-2">
      <div className="flex justify-between items-center">
        <button className="p-2 bg-white text-black rounded-2xl" onClick={()=>setCurrent(new Date(current.getFullYear(), current.getMonth()-1, 1))}>←</button>
        <div className="font-medium">{format(current,'LLLL yyyy', {locale:de})}</div>
        <button className="p-2 bg-white text-black rounded-2xl" onClick={()=>setCurrent(new Date(current.getFullYear(), current.getMonth()+1, 1))}>→</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {['Mo','Di','Mi','Do','Fr','Sa','So'].map(d=>(<div key={d} className="opacity-60">{d}</div>))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map(d=>{
          const list = filteredForMode(dayItems(d))
          const has = list.length>0
          return (
            <button
              key={d.toISOString()}
              onClick={()=> has && setSelected(d)}
              className={`min-h-20 bg-white rounded-2xl p-1 text-black text-left relative ${has?'':'opacity-80'}`}>
              <div className="text-xs font-medium">{format(d,'d')}</div>
              {/* schwarzer Punkt wenn es Termine gibt */}
              {has && <span className="absolute left-1/2 -translate-x-1/2 top-5 h-1.5 w-1.5 rounded-full bg-black" />}
            </button>
          )
        })}
      </div>

      {/* Tagesliste als „Bottom Sheet“ */}
      {selected && (
        <div className="fixed inset-0 bg-black/30" onClick={()=>setSelected(null)}>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 max-h-[70vh] overflow-auto text-black"
               onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">{format(selected,'EEEE, dd.MM.yyyy', {locale:de})}</div>
              <button className="px-3 py-1 bg-black text-white rounded-2xl" onClick={()=>setSelected(null)}>Schließen</button>
            </div>
            <div className="space-y-2">
              {filteredForMode(dayItems(selected)).map(a=>(
                <div key={a.id} className="p-3 bg-gray-100 rounded-2xl">
                  <div className="font-medium">{a.customer_name}</div>
                  <div className="text-sm opacity-80">{a.service}</div>
                  <div className="text-sm">{a.start_time.substring(0,5)} – {a.end_time.substring(0,5)} Uhr</div>
                  {a.phone && <div className="text-sm">☎ {a.phone}</div>}
                  {a.notes && <div className="text-sm">🗒 {a.notes}</div>}
                  <div className="text-xs mt-1 opacity-70">Status: {a.status.replace('_',' ')}</div>
                </div>
              ))}
              {filteredForMode(dayItems(selected)).length===0 && (
                <div className="text-center opacity-70">Keine Termine in diesem Bereich</div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
