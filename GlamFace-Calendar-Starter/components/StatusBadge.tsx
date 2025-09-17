export default function StatusBadge({status}:{status:string}){
  const map:any={
    geplant:'bg-white text-black',
    nicht_erschienen:'bg-gray-300 text-black',
    kurzfristig_abgesagt:'bg-gray-300 text-black',
    abgeschlossen:'bg-gray-200 text-black'
  }
  return <span className={`px-2 py-1 rounded-2xl text-xs ${map[status]||'bg-white'}`}>{status.replace('_',' ')}</span>
}
