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
  readonly?: boolean
  // Optional: wenn vorhanden, werden diese verwendet (von page.tsx übergeben)
  onArchive?: (id: string) => Promise<void>
  onRestore?: (id: string) => Promise<void>
  onHardDelete?: (id: string) => Promise<void>
}

export default function ListView({
  items,
  loading,
  onChanged,
  mode,
  onEdit,
  readonly = false,
  onArchive,
  onRestore,
  onHardDelete,
}: Props) {
  // Falls kein Callback aus page.tsx kommt, direkt Supabase nutzen (Fallback).
  const mutate = async (id: string, patch: Partial<Appt>) => {
    const { error } = await supabase.from('appointments').update(patch).eq('id', id)
    if (!error) onChanged()
  }

  const hardDeleteDirect = async (id: string) => {
    const { error } = await supabase.from('appointments').delete().eq('id', id)
    if (!error) onChanged()
  }

  const archive = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (onArchive) { await onArchive(id); return }
    await mutate(id, { archived_at: new Date().toISOString() } as any)
  }
  const restore = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (onRestore) { await onRestore(id); return }
    await mutate(id, { archived_at: null } as any)
  }
  const hardDelete = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!confirm('Diesen Termin endgültig löschen? Das kann NICHT rückgängig gemacht werden.')) return
    if (onHardDelete) { await onHardDelete(id); return }
    await hardDeleteDirect(id)
  }

  // Wichtig: NICHT mehr nach status filtern. page.tsx liefert je nach "mode" bereits aktive/archivierte Items.
  const list = items || []

  return (
    <section className="space-y-2">
      {loading && <p>Lade…</p>}

      {list.map((a) => {
        const start = new Date(`${a.date}T${a.start_time}`)
        const past = isBefore(start, new Date())

        return (
          <article
            key={a.id}
            className={`p-3 rounded-2xl ${past ? 'bg-gray-100/70' : 'bg-white'} text-black ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
            onClick={() => {
              if (!readonly) onEdit(a)
            }}
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

            {!readonly && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                {/* deine bisherigen Status-Aktionen */}
                <button
                  className="p-2 bg-black text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    mutate(a.id, { status: 'abgeschlossen' } as any)
                  }}
                  type="button"
                >
                  Als abgeschlossen
                </button>
                <button
                  className="p-2 bg-gray-800 text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    mutate(a.id, { status: 'nicht_erschienen' } as any)
                  }}
                  type="button"
                >
                  Nicht erschienen
                </button>
                <button
                  className="p-2 bg-gray-700 text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    mutate(a.id, { status: 'kurzfristig_abgesagt' } as any)
                  }}
                  type="button"
                >
                  Kurzfr. abgesagt
                </button>
                <button
                  className="p-2 bg-gray-900 text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(a)
                  }}
                  type="button"
                >
                  Bearbeiten
                </button>

                {/* NEU: Archiv / Restore / Endgültig löschen */}
                {mode === 'active' ? (
                  <button className="col-span-2 p-2 bg-black text-white" onClick={(e) => archive(a.id, e)} type="button">
                    Archivieren
                  </button>
                ) : (
                  <>
                    <button className="p-2 bg-black text-white" onClick={(e) => restore(a.id, e)} type="button">
                      Wiederherstellen
                    </button>
                    <button className="p-2 bg-red-600 text-white" onClick={(e) => hardDelete(a.id, e)} type="button">
                      Endgültig löschen
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Falls du im Archiv wirklich gar keine Klicks willst, reicht readonly=true in page.tsx */}
            {readonly && mode === 'archive' && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <button className="p-2 bg-black text-white" onClick={(e) => restore(a.id, e)} type="button">
                  Wiederherstellen
                </button>
                <button className="p-2 bg-red-600 text-white" onClick={(e) => hardDelete(a.id, e)} type="button">
                  Endgültig löschen
                </button>
              </div>
            )}
          </article>
        )
      })}
    </section>
  )
}
