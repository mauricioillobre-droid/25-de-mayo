'use server'

import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase-server'

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
  frecuencia?: string
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
  const supabase = createSupabaseAdminClient()
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
  especialidadIds: string[],
  opts?: {
    duracion_turno?: number
    edad_minima?: number | null
    edad_maxima?: number | null
    notas?: string
  }
) {
  const supabase = createSupabaseAdminClient()

  const { data: profesional, error: errP } = await supabase
    .from('profesionales')
    .insert({
      nombre,
      duracion_turno: opts?.duracion_turno ?? 30,
      edad_minima: opts?.edad_minima ?? null,
      edad_maxima: opts?.edad_maxima ?? null,
      notas: opts?.notas ?? null,
    })
    .select('id')
    .single()
  if (errP || !profesional) throw new Error(errP?.message ?? 'Error al crear profesional')

  if (especialidadIds.length > 0) {
    const { error: errE } = await supabase.from('profesional_especialidades').insert(
      especialidadIds.map((especialidad_id) => ({
        profesional_id: profesional.id,
        especialidad_id,
      }))
    )
    if (errE) throw new Error(errE.message)
  }
}

export async function toggleProfesionalActivo(
  profesionalId: string,
  activo: boolean
) {
  const supabase = createSupabaseAdminClient()
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
    .select('dia_semana, hora_inicio, hora_fin, activo, frecuencia')
    .eq('profesional_id', profesionalId)
    .order('dia_semana')
  if (error) return []
  return (data ?? []) as DisponibilidadDia[]
}

export async function guardarDisponibilidad(
  profesionalId: string,
  dias: DisponibilidadDia[]
) {
  const supabase = createSupabaseAdminClient()
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
      frecuencia: d.frecuencia ?? 'semanal',
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
  const supabase = createSupabaseAdminClient()
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
  const supabase = createSupabaseAdminClient()
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

export async function eliminarProfesional(id: string) {
  const supabase = createSupabaseAdminClient()
  try {
    const { error: e1 } = await supabase
      .from('disponibilidad_base')
      .delete()
      .eq('profesional_id', id)
    if (e1) throw new Error(`Error al eliminar disponibilidad: ${e1.message}`)

    const { error: e2 } = await supabase
      .from('profesional_especialidades')
      .delete()
      .eq('profesional_id', id)
    if (e2) throw new Error(`Error al eliminar especialidades: ${e2.message}`)

    // Nullify FK in turnos so existing appointments don't block the delete
    const { error: e3 } = await supabase
      .from('turnos')
      .update({ profesional_id: null })
      .eq('profesional_id', id)
    if (e3) throw new Error(`Error al desvincular turnos: ${e3.message}`)

    const { error: e4 } = await supabase
      .from('profesionales')
      .delete()
      .eq('id', id)
    if (e4) throw new Error(`Error al eliminar profesional: ${e4.message}`)
  } catch (err) {
    throw err instanceof Error ? err : new Error('Error desconocido al eliminar profesional')
  }
}

export async function crearTurnoManual(data: {
  nombre: string
  telefono: string
  especialidadId: string
  profesionalId: string
  fecha: string
  horaInicio: string
  coberturaMedica: string
}) {
  const supabase = createSupabaseAdminClient()
  const { data: prof } = await supabase
    .from('profesionales')
    .select('duracion_turno')
    .eq('id', data.profesionalId)
    .single()
  const duracion = (prof as any)?.duracion_turno ?? 30
  const [h, m] = data.horaInicio.split(':').map(Number)
  const endMin = h * 60 + m + duracion
  const endH = Math.floor(endMin / 60).toString().padStart(2, '0')
  const endM = (endMin % 60).toString().padStart(2, '0')
  const { error } = await supabase.from('turnos').insert({
    profesional_id: data.profesionalId,
    especialidad_id: data.especialidadId,
    fecha: data.fecha,
    hora_inicio: data.horaInicio + ':00',
    hora_fin: `${endH}:${endM}:00`,
    paciente_nombre: data.nombre,
    paciente_telefono: data.telefono,
    estado: 'confirmado',
    cobertura_medica: data.coberturaMedica,
  })
  if (error) throw new Error(error.message)
}

export async function getTurnosEsteMes(): Promise<number> {
  const supabase = await createSupabaseServerClient()
  const now = new Date()
  const firstDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const lastDayStr = `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`
  const { count } = await supabase
    .from('turnos')
    .select('id', { count: 'exact', head: true })
    .gte('fecha', firstDay)
    .lte('fecha', lastDayStr)
  return count ?? 0
}

export async function getTotalPacientes(): Promise<number> {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('turnos')
    .select('paciente_telefono')
  if (!data) return 0
  const unique = new Set(data.map((t: { paciente_telefono: string }) => t.paciente_telefono))
  return unique.size
}
