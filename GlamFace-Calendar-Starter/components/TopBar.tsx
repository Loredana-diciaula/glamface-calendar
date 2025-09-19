'use client'
import { useState } from 'react'

type View = 'list' | 'calendar'
type Mode = 'active' | 'archive'

export default function TopBar({
  current,
  onViewChange,
  mode,
  onModeChange
}: {
  current: View
  onViewChange: (v: View) => void
  mode: Mode
  onModeChange: (m: Mode) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex items-center gap-2 relative">
      {/* Reiter: Liste | Kalender */}
      <button
        className={`flex-1 p-3 rounded-2xl ${current==='list' ? 'bg-black text-white' : 'bg-white text-black'}`}
        onClick={() => onViewChange('list')}
      >Liste</button>
      <button
        className={`flex-1 p-3 rounded-2xl ${current==='calendar' ? 'bg-black text-white' : 'bg-white text-black'}`}
        onClick={() => onViewChange('calendar')}
      >Kalender</button>

      {/* Menü-Button */}
      <button
        className="px-3 py-3 rounded-2xl bg-white text-black"
        onClick={()=>setOpen(v=>!v)}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        Menü ▾
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-12 z-10 w-44 rounded-2xl bg-white text-black shadow-lg overflow-hidden"
          role="menu"
        >
          <button
            className={`w-full text-left px-3 py-2 ${mode==='active'?'bg-black text-white':''}`}
            onClick={()=>{ onModeChange('active'); setOpen(false) }}
            role="menuitem"
          >Aktiv (Standard)</button>
          <button
            className={`w-full text-left px-3 py-2 ${mode==='archive'?'bg-black text-white':''}`}
            onClick={()=>{ onModeChange('archive'); setOpen(false) }}
            role="menuitem"
          >Archiv</button>
          <a
            className="block px-3 py-2 hover:bg-gray-100"
            href="/settings"
            role="menuitem"
            onClick={()=>setOpen(false)}
          >Einstellungen</a>
        </div>
      )}
    </div>
  )
}
