// lib/archive.ts
import { supabase } from '@/lib/supabaseClient'

export async function archiveAppt(id: string) {
  return supabase.from('appointments')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', id)
}

export async function restoreAppt(id: string) {
  return supabase.from('appointments')
    .update({ archived_at: null })
    .eq('id', id)
}

export async function deleteAppt(id: string) {
  return supabase.from('appointments')
    .delete()
    .eq('id', id)
}
