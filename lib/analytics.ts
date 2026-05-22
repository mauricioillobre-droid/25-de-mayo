import { createSupabaseAdminClient } from '@/lib/supabase-server'

/* ── Types ─────────────────────────────────────────────────── */
export interface TurnosPorSemanaData {
  semana: string
  label: string
  total: number
}

export interface OrigenData {
  origen: string
  total: number
  porcentaje: number
}

export interface EspecialidadData {
  especialidad: string
  total: number
}

export interface AsistenciaData {
  asistidos: number
  ausentes: number
  cancelados: number
  total: number
}

export interface HeatmapHorarioData {
  hora: number
  label: string
  total: number
}

export interface TendenciaDiariaData {
  fecha: string
  label: string
  total: number
  esPico: boolean
}

/* ── Date helpers ───────────────────────────────────────────── */
const MESES_CORTOS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0]
}

function getMondayOf(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  const day = date.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  date.setUTCDate(date.getUTCDate() + diff)
  return date.toISOString().split('T')[0]
}

function formatSemanaLabel(dateStr: string): string {
  const [, m, d] = dateStr.split('-').map(Number)
  return `${d} ${MESES_CORTOS[m - 1]}`
}

export function getDesde(period: string): Date {
  const now = new Date()
  switch (period) {
    case '3_meses':
      return new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
    case 'este_anio':
      return new Date(now.getFullYear(), 0, 1)
    default:
      return new Date(now.getFullYear(), now.getMonth(), 1)
  }
}

/* ── Query functions ────────────────────────────────────────── */

export async function getTurnosPorSemana(
  desde: Date
): Promise<{ data: TurnosPorSemanaData[]; variacionPct: number | null }> {
  const supabase = createSupabaseAdminClient()
  const desdeStr = toDateStr(desde)
  const ms = Date.now() - desde.getTime()
  const anteriorStr = toDateStr(new Date(desde.getTime() - ms))

  const { data } = await supabase
    .from('turnos')
    .select('fecha')
    .gte('fecha', anteriorStr)

  if (!data) return { data: [], variacionPct: null }

  const actual = data.filter((r) => r.fecha >= desdeStr)
  const anterior = data.filter((r) => r.fecha >= anteriorStr && r.fecha < desdeStr)

  const map = new Map<string, number>()
  for (const { fecha } of actual) {
    const week = getMondayOf(fecha)
    map.set(week, (map.get(week) ?? 0) + 1)
  }

  const semanas = [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8)
    .map(([semana, total]) => ({ semana, label: formatSemanaLabel(semana), total }))

  const totalActual = actual.length
  const totalAnterior = anterior.length
  const variacionPct =
    totalAnterior > 0 ? Math.round(((totalActual - totalAnterior) / totalAnterior) * 100) : null

  return { data: semanas, variacionPct }
}

export async function getOrigenTurnos(desde: Date): Promise<OrigenData[]> {
  const supabase = createSupabaseAdminClient()
  const { data } = await supabase
    .from('turnos')
    .select('origen')
    .gte('fecha', toDateStr(desde))

  if (!data || data.length === 0) return []

  const map = new Map<string, number>()
  for (const { origen } of data) {
    const key = origen ?? 'manual'
    map.set(key, (map.get(key) ?? 0) + 1)
  }

  const total = data.length
  return [...map.entries()]
    .sort(([, a], [, b]) => b - a)
    .map(([origen, count]) => ({
      origen,
      total: count,
      porcentaje: Math.round((count / total) * 100),
    }))
}

export async function getTurnosPorEspecialidad(desde: Date): Promise<EspecialidadData[]> {
  const supabase = createSupabaseAdminClient()
  const { data } = await supabase
    .from('turnos')
    .select('especialidades(nombre)')
    .gte('fecha', toDateStr(desde))

  if (!data) return []

  const map = new Map<string, number>()
  for (const row of data) {
    const esp = (row as unknown as { especialidades: { nombre: string } | null }).especialidades
    const nombre = esp?.nombre ?? 'Sin especialidad'
    map.set(nombre, (map.get(nombre) ?? 0) + 1)
  }

  return [...map.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([especialidad, total]) => ({ especialidad, total }))
}

export async function getTasaAsistencia(desde: Date): Promise<AsistenciaData> {
  const supabase = createSupabaseAdminClient()
  const today = toDateStr(new Date())

  const { data } = await supabase
    .from('turnos')
    .select('estado')
    .gte('fecha', toDateStr(desde))
    .lte('fecha', today)

  if (!data) return { asistidos: 0, ausentes: 0, cancelados: 0, total: 0 }

  let asistidos = 0, ausentes = 0, cancelados = 0
  for (const { estado } of data) {
    if (estado === 'completado' || estado === 'confirmado') asistidos++
    else if (estado === 'ausente') ausentes++
    else if (estado === 'cancelado') cancelados++
  }

  return { asistidos, ausentes, cancelados, total: data.length }
}

export async function getHeatmapHorario(
  desde: Date
): Promise<{ data: HeatmapHorarioData[]; picoHorario: number | null }> {
  const supabase = createSupabaseAdminClient()
  const { data } = await supabase
    .from('turnos')
    .select('hora_inicio')
    .gte('fecha', toDateStr(desde))

  const map = new Map<number, number>()
  for (let h = 8; h <= 19; h++) map.set(h, 0)

  if (data) {
    for (const { hora_inicio } of data) {
      if (!hora_inicio) continue
      const hour = parseInt(hora_inicio.split(':')[0], 10)
      if (hour >= 8 && hour <= 19) map.set(hour, (map.get(hour) ?? 0) + 1)
    }
  }

  const heatmap = [...map.entries()]
    .sort(([a], [b]) => a - b)
    .map(([hora, total]) => ({ hora, label: `${hora}h`, total }))

  const picoEntry = heatmap.reduce(
    (max, cur) => (cur.total > max.total ? cur : max),
    heatmap[0]
  )
  const picoHorario = picoEntry?.total > 0 ? picoEntry.hora : null

  return { data: heatmap, picoHorario }
}

export async function getTendenciaDiaria(): Promise<{
  data: TendenciaDiariaData[]
  promedioDiario: number
}> {
  const supabase = createSupabaseAdminClient()
  const now = new Date()
  const today = toDateStr(now)
  const firstOfMonth = toDateStr(new Date(now.getFullYear(), now.getMonth(), 1))

  const { data } = await supabase
    .from('turnos')
    .select('fecha')
    .gte('fecha', firstOfMonth)
    .lte('fecha', today)

  const map = new Map<string, number>()
  if (data) {
    for (const { fecha } of data) map.set(fecha, (map.get(fecha) ?? 0) + 1)
  }

  const entries: { fecha: string; total: number }[] = []
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = toDateStr(d)
    entries.push({ fecha: dateStr, total: map.get(dateStr) ?? 0 })
  }

  // Mark top-3 days as peaks
  const sorted = [...entries].sort((a, b) => b.total - a.total)
  const picoMin = sorted[2]?.total ?? 0
  const picoSet = new Set(sorted.slice(0, 3).filter((e) => e.total > 0).map((e) => e.fecha))

  const tendencia = entries.map(({ fecha, total }) => {
    const [, m, d] = fecha.split('-').map(Number)
    return {
      fecha,
      label: `${d} ${MESES_CORTOS[m - 1]}`,
      total,
      esPico: picoSet.has(fecha) && total >= picoMin && total > 0,
    }
  })

  const promedioDiario =
    entries.length > 0
      ? Math.round(entries.reduce((s, e) => s + e.total, 0) / entries.length)
      : 0

  return { data: tendencia, promedioDiario }
}
