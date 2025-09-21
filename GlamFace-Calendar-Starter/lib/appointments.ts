// lib/appointments.ts
import { supa } from './supa'

export async function archiveAppointment(id: string) {
  return supa.from('appointments')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', id)
}

export async function restoreAppointment(id: string) {
  return supa.from('appointments')
    .update({ archived_at: null })
    .eq('id', id)
}

export async function deleteAppointment(id: string) {
  return supa.from('appointments')
    .delete()
    .eq('id', id)
}
