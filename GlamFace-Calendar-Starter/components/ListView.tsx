'use client'
import { format, isBefore } from 'date-fns'
import { de } from 'date-fns/locale'
import { supabase } from '@/lib/supabaseClient'
import StatusBadge from './StatusBadge'
import type { Appt } from '@/app/(dashboard)/page'

type Props = {
  items: Appt[]
  loading: boolean
  onChanged: () => void
  mode: 'active' | 'archive'
  onEdit: (a: Appt) => void
}

export default function ListView({ items, loading, onChanged, mode, onEdit }: Props) {
  const mutate = async (id: string, patch: Partial<Appt>) => {
    const { error } = await supabase.from('appointments').update(patch).eq('id', id)
    if (!error) onChanged()
  }

  const remove = async (id: string) => {
    if (confirm('Termin löschen?')) {
      const { error } = await supabase.from('appointments').delete().eq('id', id)
      if (!error) onChanged()
    }
  }

  const filtered = mode === 'active'
    ? items.filter(a => a.status === 'geplant')
    : items.filter(a => a.status !== 'geplant')

  return (
    <section className="space-y-2">
      {loading && <p>Lade…</p>}

      {filtered.map(a => {
        const start = new Date(`${a.date}T${a.start_time}`)
        const past = isBefore(start, new Date())

        return (
          <article
            key={a.id}
            className={`p-3 rounded-2xl ${past ? 'bg-gray-100/70' : 'bg-white'} text-black`}
            onClick={()=>onEdit(a)}
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">{a.customer_name}</div>
              <StatusBadge status={a.status} />
            </div>

            <div className="text-sm opacity-80">{a.service}</div>
            <div className="text-sm">
              {format(start, 'EEE dd.MM.yyyy HH:mm', { locale: de })} – {a.end_time.substring(0, 5)} Uhr
            </div>
            {a.phone && <div className="text-sm">☎ {a.phone}</div>}
            {a.notes && <div className="text-sm">🗒 {a.notes}</div>}

            <div className="mt-2 grid grid-cols-2 gap-2">
              <button className="p-2 bg-black text-white" onClick={(e)=>{e.stopPropagation(); mutate(a.id, { status: 'abgeschlossen' })}}>Als abgeschlossen</button>
              <button className="p-2 bg-gray-800 text-white" onClick={(e)=>{e.stopPropagation(); mutate(a.id, { status: 'nicht_erschienen' })}}>Nicht erschienen</button>
              <button className="p-2 bg-gray-700 text-white" onClick={(e)=>{e.stopPropagation(); mutate(a.id, { status: 'kurzfristig_abgesagt' })}}>Kurzfr. abgesagt</button>
              <button className="p-2 bg-gray-900 text-white" onClick={(e)=>{e.stopPropagation(); onEdit(a)}}>
                Bearbeiten
              </button>
              <button className="col-span-2 p-2 bg-white border" onClick={(e)=>{e.stopPropagation(); remove(a.id)}}>
                Löschen
              </button>
            </div>
          </article>
        )
      })}
    </section>
  )
}
