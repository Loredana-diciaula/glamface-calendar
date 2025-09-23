'use client'
type View = 'list' | 'calendar'
type Mode = 'active' | 'archive'

type Props = {
  current: View
  onViewChange: (v: View) => void
  mode: Mode
  onModeChange: (m: Mode) => void
}

const TOKEN = process.env.NEXT_PUBLIC_ICS_SIGNING_SECRET || 'wechselmich123'

export default function TopBar({ current, onViewChange, mode, onModeChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Ansicht: Liste / Kalender */}
      <div className="inline-flex rounded-2xl overflow-hidden border">
        <button
          className={`px-3 py-2 ${current==='list' ? 'bg-black text-white' : 'bg-white'}`}
          onClick={()=>onViewChange('list')}
          type="button"
        >
          Liste
        </button>
        <button
          className={`px-3 py-2 ${current==='calendar' ? 'bg-black text-white' : 'bg-white'}`}
          onClick={()=>onViewChange('calendar')}
          type="button"
        >
          Kalender
        </button>
      </div>

      {/* Modus: Aktiv / Archiv */}
      <div className="inline-flex rounded-2xl overflow-hidden border">
        <button
          className={`px-3 py-2 ${mode==='active' ? 'bg-black text-white' : 'bg-white'}`}
          onClick={()=>onModeChange('active')}
          type="button"
        >
          Aktiv
        </button>
        <button
          className={`px-3 py-2 ${mode==='archive' ? 'bg-black text-white' : 'bg-white'}`}
          onClick={()=>onModeChange('archive')}
          type="button"
        >
          Archiv
        </button>
      </div>

      {/* Export-Menü */}
      <details className="ml-auto">
        <summary className="cursor-pointer px-3 py-2 rounded-2xl bg-black text-white">
          Export
        </summary>
        <div className="mt-2 p-2 bg-white border rounded-2xl shadow text-sm flex flex-col">
          <a
            className="px-3 py-2 hover:bg-gray-100 rounded-2xl"
            href={`/api/export?token=${TOKEN}`}
          >
            CSV – alle Termine
          </a>
          <a
            className="px-3 py-2 hover:bg-gray-100 rounded-2xl"
            href={`/api/export?token=${TOKEN}&scope=active`}
          >
            CSV – nur aktive
          </a>
          <a
            className="px-3 py-2 hover:bg-gray-100 rounded-2xl"
            href={`/api/export?token=${TOKEN}&scope=archived`}
          >
            CSV – nur archivierte
          </a>
        </div>
      </details>
    </div>
  )
}
