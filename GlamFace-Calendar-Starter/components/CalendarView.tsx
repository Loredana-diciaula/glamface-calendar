'use client'
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay } from 'date-fns'
import { de } from 'date-fns/locale'
import { useMemo, useState } from 'react'
import type { Appt } from '@/app/(dashboard)/page'
import { supabase } from '@/lib/supabaseClient'

type Props = {
  items: Appt[]
  loading: boolean
  onChanged: () => void
  mode: 'active' | 'archive'
  onEdit: (a: Appt) => void
  onCreate: (isoDate: string) => void
  readonly?: boolean
  // Optional: kommen aus page.tsx – wenn nicht da, nehmen wir Fallback unten
  onArchive?: (id: string) => Promise<void>
  onRestore?: (id: string) => Promise<void>
  onHardDelete?: (id: string) => Promise<void>
}

export default function CalendarView({
  items,
  loading,
  mode,
  onEdit,
  onCreate,
  onChanged,
  readonly = false,
  onArchive,
  onRestore,
  onHardDelete,
}: Props) {
  const [month, setMonth] = useState(new Date())
  const [selected, setSelected] = useState<Date | null>(null)

  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfMonth(month),
        end: endOfMonth(month),
      }),
    [month]
  )

  // WICHTIG: NICHT mehr nach status filtern.
  // page.tsx liefert je nach "mode" schon aktive ODER archivierte Items.
  const itemsByDate = (d: Date) => items.filter((i) => i.date === format(d, 'yyyy-MM-dd'))
  const hasItems = (d: Date) => itemsByDate(d).length > 0

  const changeMonth = (delta: number) => {
    const m = new Date(month)
    m.setMonth(m.getMonth() + delta)
    setMonth(m)
    setSelected(null)
  }

  // ---- Archiv/Restore/Delete (mit Fallback direkt auf Supabase) ----
  const archive = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (onArchive) {
      await onArchive(id)
    } else {
      await supabase.from('appointments').update({ archived_at: new Date().toISOString() }).eq('id', id)
    }
    onChanged()
  }

  const restore = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (onRestore) {
      await onRestore(id)
    } else {
      await supabase.from('appointments').update({ archived_at: null }).eq('id', id)
    }
    onChanged()
  }

  const hardDelete = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!confirm('Diesen Termin endgültig löschen? Das kann NICHT rückgängig gemacht werden.')) return
    if (onHardDelete) {
      await onHardDelete(id)
    } else {
      await supabase.from('appointments').delete().eq('id', id)
    }
    onChanged()
  }

  return (
    <section className="space-y-2">
      {loading && <p>Lade…</p>}

      <div className="flex items-center justify-between">
        <button className="p-2" onClick={() => changeMonth(-1)}>
          ←
        </button>
        <div className="font-semibold">{format(month, 'LLLL yyyy', { locale: de })}</div>
        <button className="p-2" onClick={() => changeMonth(1)}>
          →
        </button>
      </div>

      {/* Wochentage */}
      <div className="grid grid-cols-7 text-center opacity-70">
        {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Tage */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const selectedCls = selected && isSameDay(selected, d) ? 'ring-2 ring-black' : ''
          return (
            <div
              key={d.toISOString()}
              className={`relative aspect-square rounded-xl bg-white text-black flex items-center justify-center ${selectedCls}`}
              onClick={() => setSelected(d)}
            >
              <span className="absolute top-1 left-1 text-xs opacity-60">{format(d, 'd')}</span>

              {/* grüner Punkt bei Terminen */}
              {hasItems(d) && <span className="absolute bottom-1 w-2 h-2 rounded-full bg-green-600"></span>}

              {/* neues Plus – nur in aktivem Modus */}
              {!readonly && (
                <button
                  className="absolute right-1 top-1 text-black text-lg leading-none"
                  onClick={(e) => {
                    e.stopPropagation()
                    onCreate(format(d, 'yyyy-MM-dd'))
                  }}
                  title="Neuer Termin"
                >
                  +
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Tagesliste */}
      {selected && (
        <div className="p-3 rounded-2xl bg-white text-black space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">{format(selected, 'EEEE, dd.MM.yyyy', { locale: de })}</div>
            {!readonly && (
              <button
                className="px-3 py-1 rounded-2xl bg-black text-white"
                onClick={() => onCreate(format(selected, 'yyyy-MM-dd'))}
              >
                Neuer Termin
              </button>
            )}
          </div>

          {itemsByDate(selected).length === 0 ? (
            <div className="opacity-70">Keine Termine</div>
          ) : (
            itemsByDate(selected).map((a) => (
              <div
                key={a.id}
                className={`p-2 rounded-xl bg-gray-100 flex items-center justify-between ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
                onClick={() => {
                  if (!readonly) onEdit(a)
                }}
              >
                <div>
                  <div className="font-medium">{a.customer_name}</div>
                  <div className="text-sm opacity-80">{a.service}</div>
                  <div className="text-sm">
                    {a.start_time.substring(0, 5)} – {a.end_time.substring(0, 5)} Uhr
                  </div>
                  {a.phone && <div className="text-sm">☎ {a.phone}</div>}
                  {a.notes && <div className="text-sm">🗒 {a.notes}</div>}
                </div>

                {/* Aktionen rechts */}
                {!readonly ? (
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 rounded-2xl border"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(a)
                      }}
                    >
                      Bearbeiten
                    </button>

                    {mode === 'active' ? (
                      <button className="px-3 py-1 rounded-2xl bg-black text-white" onClick={(e) => archive(a.id, e)}>
                        Archivieren
                      </button>
                    ) : (
                      <>
                        <button className="px-3 py-1 rounded-2xl bg-black text-white" onClick={(e) => restore(a.id, e)}>
                          Wiederherstellen
                        </button>
                        <button className="px-3 py-1 rounded-2xl bg-red-600 text-white" onClick={(e) => hardDelete(a.id, e)}>
                          Endgültig löschen
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  // Falls du im Archiv trotzdem Aktionen willst, readonly=false in page.tsx setzen
                  <div className="flex gap-2">
                    <button className="px-3 py-1 rounded-2xl bg-black text-white" onClick={(e) => restore(a.id, e)}>
                      Wiederherstellen
                    </button>
                    <button className="px-3 py-1 rounded-2xl bg-red-600 text-white" onClick={(e) => hardDelete(a.id, e)}>
                      Endgültig löschen
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </section>
  )
}
