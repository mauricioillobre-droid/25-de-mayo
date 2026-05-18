'use server'

import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabase-server'

export interface EspecialidadDB {
  id: string
  nombre: string
  duracion_turno: number
}

export interface ProfesionalDB {
  id: string
  nombre: string
}

export interface SlotConProfesional {
  hora: string
  profesionalId: string
}

export interface CrearTurnoData {
  profesionalId: string
  especialidadId: string
  fecha: string
  horaInicio: string
  pacienteNombre: string
  pacienteTelefono: string
}

export async function getEspecialidades(): Promise<EspecialidadDB[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('especialidades')
    .select('id, nombre, duracion_turno')
    .eq('activo', true)
    .order('nombre')
  if (error) return []
  return data ?? []
}

export async function getProfesionalesByEspecialidad(
  especialidadId: string
): Promise<ProfesionalDB[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('profesional_especialidades')
    .select('profesionales!inner(id, nombre, activo)')
    .eq('especialidad_id', especialidadId)
  if (error || !data) return []
  return (data as any[])
    .map((row) => row.profesionales)
    .filter((p) => p.activo)
}

export async function getSlotsDisponibles(
  profesionalId: string,
  fecha: string
): Promise<string[]> {
  const supabase = await createSupabaseServerClient()
  const date = new Date(fecha + 'T12:00:00')
  const jsDay = date.getDay() // 0=Dom, 1=Lun, ..., 6=Sab

  // schema: dia_semana 0=Lun … 5=Sab; Dom no existe
  if (jsDay === 0) return []
  const diaSemana = jsDay - 1
  const semanaMes = Math.ceil(date.getDate() / 7)

  const [{ data: profesional }, { data: disponibilidad }] = await Promise.all([
    supabase
      .from('profesionales')
      .select('duracion_turno')
      .eq('id', profesionalId)
      .single(),
    supabase
      .from('disponibilidad_base')
      .select('hora_inicio, hora_fin, frecuencia')
      .eq('profesional_id', profesionalId)
      .eq('dia_semana', diaSemana)
      .eq('activo', true),
  ])

  if (!disponibilidad || disponibilidad.length === 0) return []

  const duracion: number = (profesional as any)?.duracion_turno ?? 30

  const frecuenciaValida = (frecuencia: string | null): boolean => {
    const f = frecuencia ?? 'semanal'
    if (f === 'semanal') return true
    if (f === 'quincenal_1') return semanaMes === 1 || semanaMes === 3
    if (f === 'quincenal_2') return semanaMes === 2 || semanaMes === 4
    if (f === 'mensual_1') return semanaMes === 1
    if (f === 'mensual_2') return semanaMes === 2
    if (f === 'mensual_3') return semanaMes === 3
    if (f === 'mensual_4') return semanaMes === 4
    return true
  }

  const slots: string[] = []
  for (const d of disponibilidad) {
    if (!frecuenciaValida((d as any).frecuencia)) continue
    const [sh, sm] = d.hora_inicio.split(':').map(Number)
    const [eh, em] = d.hora_fin.split(':').map(Number)
    let cur = sh * 60 + sm
    const end = eh * 60 + em
    while (cur + duracion <= end) {
      const h = Math.floor(cur / 60).toString().padStart(2, '0')
      const m = (cur % 60).toString().padStart(2, '0')
      slots.push(`${h}:${m}`)
      cur += duracion
    }
  }

  // Remove already-booked slots
  const { data: turnosReservados } = await supabase
    .from('turnos')
    .select('hora_inicio')
    .eq('profesional_id', profesionalId)
    .eq('fecha', fecha)
    .neq('estado', 'cancelado')

  const booked = new Set(
    (turnosReservados ?? []).map((t: any) => t.hora_inicio.substring(0, 5))
  )

  // Remove blocked slots
  const { data: bloqueos } = await supabase
    .from('bloqueos')
    .select('hora_inicio, hora_fin')
    .or(`profesional_id.eq.${profesionalId},profesional_id.is.null`)
    .lte('fecha_inicio', fecha)
    .gte('fecha_fin', fecha)

  const isBlocked = (slot: string): boolean => {
    if (!bloqueos) return false
    const slotMin =
      parseInt(slot.split(':')[0]) * 60 + parseInt(slot.split(':')[1])
    for (const b of bloqueos) {
      if (!b.hora_inicio || !b.hora_fin) return true
      const bs =
        parseInt(b.hora_inicio.split(':')[0]) * 60 +
        parseInt(b.hora_inicio.split(':')[1])
      const be =
        parseInt(b.hora_fin.split(':')[0]) * 60 +
        parseInt(b.hora_fin.split(':')[1])
      if (slotMin >= bs && slotMin < be) return true
    }
    return false
  }

  // If today, only return future slots
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const isToday = fecha === todayStr
  const nowMin = today.getHours() * 60 + today.getMinutes()

  return slots.filter((slot) => {
    if (booked.has(slot)) return false
    if (isBlocked(slot)) return false
    if (isToday) {
      const slotMin =
        parseInt(slot.split(':')[0]) * 60 + parseInt(slot.split(':')[1])
      if (slotMin <= nowMin) return false
    }
    return true
  })
}

export async function getSlotsParaEspecialidad(
  especialidadId: string,
  fecha: string
): Promise<SlotConProfesional[]> {
  const profesionales = await getProfesionalesByEspecialidad(especialidadId)
  if (profesionales.length === 0) return []

  const slotsMap = new Map<string, string>()

  for (const p of profesionales) {
    const slots = await getSlotsDisponibles(p.id, fecha)
    for (const hora of slots) {
      if (!slotsMap.has(hora)) slotsMap.set(hora, p.id)
    }
  }

  return Array.from(slotsMap.entries())
    .map(([hora, profesionalId]) => ({ hora, profesionalId }))
    .sort((a, b) => a.hora.localeCompare(b.hora))
}

export async function crearTurno(data: CrearTurnoData) {
  const supabase = createSupabaseAdminClient()

  const [h, m] = data.horaInicio.split(':').map(Number)
  const endTotalMin = h * 60 + m + 30
  const endH = Math.floor(endTotalMin / 60).toString().padStart(2, '0')
  const endM = (endTotalMin % 60).toString().padStart(2, '0')

  const { data: turno, error } = await supabase
    .from('turnos')
    .insert({
      profesional_id: data.profesionalId,
      especialidad_id: data.especialidadId,
      fecha: data.fecha,
      hora_inicio: data.horaInicio + ':00',
      hora_fin: `${endH}:${endM}:00`,
      paciente_nombre: data.pacienteNombre,
      paciente_telefono: data.pacienteTelefono,
      estado: 'confirmado',
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return turno
}
