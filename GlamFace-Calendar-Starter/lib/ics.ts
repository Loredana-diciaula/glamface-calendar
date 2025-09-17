import { createEvents } from 'ics'
export type IcsItem = { title:string; start:Date; end:Date; description?:string }
export const makeICS = (items:IcsItem[])=> new Promise<string>((resolve,reject)=>{
  const events = items.map(i=>({
    title: i.title,
    start: [i.start.getFullYear(), i.start.getMonth()+1, i.start.getDate(), i.start.getHours(), i.start.getMinutes()],
    end:   [i.end.getFullYear(),   i.end.getMonth()+1,   i.end.getDate(),   i.end.getHours(),   i.end.getMinutes()],
    description: i.description||''
  }))
  createEvents(events, (err, value)=>{ if(err) reject(err); else resolve(value!) })
})
