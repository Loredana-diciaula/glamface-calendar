import { createEvents, EventAttributes } from 'ics'

export type IcsItem = { title:string; start:Date; end:Date; description?:string }

export const makeICS = (items:IcsItem[]) => new Promise<string>((resolve,reject) => {
  // Hilfsfunktion: macht aus Date ein 5er-Tupel [YYYY, M, D, HH, mm]
  const toDT = (d: Date): [number, number, number, number, number] => ([
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate(),
    d.getHours(),
    d.getMinutes()
  ])

  const events: EventAttributes[] = items.map(i => ({
    title: i.title,
    start: toDT(i.start),
    end: toDT(i.end),
    description: i.description || ''
  }))

  createEvents(events, (err, value) => {
    if (err || !value) return reject(err || new Error('ICS error'))
    resolve(value)
  })
})
