'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'

export interface TurnoCompleto {
  id: string
  hora_inicio: string
  hora_fin: string
  estado: 'confirmado' | 'cancelado' | 'ausente' | 'completado'
  paciente_nombre: string
  paciente_telefono: string
  especialidades: { nombre: string } | null
  profesionales: { nombre: string } | null
}

export interface ProfesionalCompleto {
  id: string
  nombre: string
  activo: boolean
  profesional_especialidades: {
    especialidades: { id: string; nombre: string }
  }[]
}

export interface DisponibilidadDia {
  dia_semana: number
  hora_inicio: string
  hora_fin: string
  activo: boolean
}

export interface BloqueoCompleto {
  id: string
  profesional_id: string | null
  fecha_inicio: string
  fecha_fin: string
  hora_inicio: string | null
  hora_fin: string | null
  motivo: string | null
  profesionales: { nombre: string } | null
}

export async function getTurnosDelDia(fecha: string): Promise<TurnoCompleto[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('turnos')
    .select(
      'id, hora_inicio, hora_fin, estado, paciente_nombre, paciente_telefono, especialidades(nombre), profesionales(nombre)'
    )
    .eq('fecha', fecha)
    .order('hora_inicio')
  if (error) return []
  return (data ?? []) as unknown as TurnoCompleto[]
}

export async function actualizarEstadoTurno(
  turnoId: string,
  estado: TurnoCompleto['estado']
) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('turnos')
    .update({ estado })
    .eq('id', turnoId)
  if (error) throw new Error(error.message)
}

export async function getProfesionalesCompleto(): Promise<ProfesionalCompleto[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('profesionales')
    .select(
      'id, nombre, activo, profesional_especialidades(especialidades(id, nombre))'
    )
    .order('nombre')
  if (error) return []
  return (data ?? []) as unknown as ProfesionalCompleto[]
}

export async function crearProfesional(
  nombre: string,
  especialidadIds: string[]
) {
  const supabase = await createSupabaseServerClient()

  const { data: profesional, error: errP } = await supabase
    .from('profesionales')
    .insert({ nombre })
    .select('id')
    .single()
  if (errP || !profesional) throw new Error(errP?.message ?? 'Error')

  if (especialidadIds.length > 0) {
    await supabase.from('profesional_especialidades').insert(
      especialidadIds.map((especialidad_id) => ({
        profesional_id: profesional.id,
        especialidad_id,
      }))
    )
  }
}

export async function toggleProfesionalActivo(
  profesionalId: string,
  activo: boolean
) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase
    .from('profesionales')
    .update({ activo })
    .eq('id', profesionalId)
  if (error) throw new Error(error.message)
}

export async function getDisponibilidadBase(profesionalId: string): Promise<DisponibilidadDia[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('disponibilidad_base')
    .select('dia_semana, hora_inicio, hora_fin, activo')
    .eq('profesional_id', profesionalId)
    .order('dia_semana')
  if (error) return []
  return (data ?? []) as DisponibilidadDia[]
}

export async function guardarDisponibilidad(
  profesionalId: string,
  dias: DisponibilidadDia[]
) {
  const supabase = await createSupabaseServerClient()
  // Delete existing and replace
  await supabase
    .from('disponibilidad_base')
    .delete()
    .eq('profesional_id', profesionalId)

  const rows = dias
    .filter((d) => d.activo)
    .map((d) => ({
      profesional_id: profesionalId,
      dia_semana: d.dia_semana,
      hora_inicio: d.hora_inicio,
      hora_fin: d.hora_fin,
      activo: true,
    }))

  if (rows.length > 0) {
    const { error } = await supabase.from('disponibilidad_base').insert(rows)
    if (error) throw new Error(error.message)
  }
}

export async function getBloqueos(): Promise<BloqueoCompleto[]> {
  const supabase = await createSupabaseServerClient()
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('bloqueos')
    .select('id, profesional_id, fecha_inicio, fecha_fin, hora_inicio, hora_fin, motivo, profesionales(nombre)')
    .gte('fecha_fin', today)
    .order('fecha_inicio')
  if (error) return []
  return (data ?? []) as unknown as BloqueoCompleto[]
}

export async function crearBloqueo(data: {
  profesional_id: string | null
  fecha_inicio: string
  fecha_fin: string
  hora_inicio: string | null
  hora_fin: string | null
  motivo: string
}) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('bloqueos').insert({
    profesional_id: data.profesional_id || null,
    fecha_inicio: data.fecha_inicio,
    fecha_fin: data.fecha_fin,
    hora_inicio: data.hora_inicio || null,
    hora_fin: data.hora_fin || null,
    motivo: data.motivo,
  })
  if (error) throw new Error(error.message)
}

export async function eliminarBloqueo(id: string) {
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.from('bloqueos').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function getEspecialidadesAdmin() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('especialidades')
    .select('id, nombre')
    .eq('activo', true)
    .order('nombre')
  return data ?? []
}
