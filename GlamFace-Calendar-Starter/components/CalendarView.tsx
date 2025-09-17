'use client'
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay } from 'date-fns'
import { de } from 'date-fns/locale'
import type { Appt } from '@/app/(dashboard)/page'
import { useState } from 'react'

export default function CalendarView({items,loading,onChanged}:{items:Appt[],loading:boolean,onChanged:()=>void}){
  const [current,setCurrent]=useState(new Date())
  const days = eachDayOfInterval({ start: startOfMonth(current), end: endOfMonth(current) })
  const dayItems = (d:Date)=>items.filter(a=>isSameDay(new Date(`${a.date}T00:00:00`), d))
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
          const list = dayItems(d)
          return (
            <div key={d.toISOString()} className="min-h-24 bg-white rounded-2xl p-1 text-black">
              <div className="text-xs font-medium">{format(d,'d')}</div>
              <div className="space-y-1">
                {list.map(a=> (
                  <div key={a.id} className="text-[11px] rounded-lg px-1 py-0.5 bg-gray-100">
                    {a.start_time.substring(0,5)} {a.customer_name}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
