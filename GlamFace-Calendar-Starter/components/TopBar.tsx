'use client'
export default function TopBar({current,onViewChange}:{current:'list'|'calendar',onViewChange:(v:'list'|'calendar')=>void}){
  return (
    <header className="flex items-center gap-2">
      <button className={`flex-1 p-3 ${current==='list'?'bg-black text-white':'bg-white text-black'}`} onClick={()=>onViewChange('list')}>Liste</button>
      <button className={`flex-1 p-3 ${current==='calendar'?'bg-black text-white':'bg-white text-black'}`} onClick={()=>onViewChange('calendar')}>Kalender</button>
    </header>
  )
}
