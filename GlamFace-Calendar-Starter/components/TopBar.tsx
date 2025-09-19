'use client'
type View = 'list' | 'calendar'

export default function TopBar({
  current,
  onViewChange,
}: {
  current: View
  onViewChange: (v: View) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        className={`flex-1 p-3 rounded-2xl ${current==='list' ? 'bg-black text-white' : 'bg-white text-black'}`}
        onClick={() => onViewChange('list')}
      >
        Liste
      </button>
      <button
        className={`flex-1 p-3 rounded-2xl ${current==='calendar' ? 'bg-black text-white' : 'bg-white text-black'}`}
        onClick={() => onViewChange('calendar')}
      >
        Kalender
      </button>
      <a
        href="/settings"
        className="ml-auto px-3 py-3 rounded-2xl bg-white text-black"
        aria-label="Einstellungen"
        title="Einstellungen"
      >
        ⚙︎
      </a>
    </div>
  )
}
