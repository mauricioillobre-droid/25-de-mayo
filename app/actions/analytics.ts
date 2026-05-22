'use server'

import {
  getTurnosPorSemana,
  getOrigenTurnos,
  getTurnosPorEspecialidad,
  getTasaAsistencia,
  getHeatmapHorario,
  getTendenciaDiaria,
  getDesde,
} from '@/lib/analytics'

export async function getQuickStatsAction() {
  const desde = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const [semaanas, origenes, asistencia, heatmapResult] = await Promise.all([
    getTurnosPorSemana(desde),
    getOrigenTurnos(desde),
    getTasaAsistencia(desde),
    getHeatmapHorario(desde),
  ])
  return {
    semanas: semaanas,
    origenes,
    asistencia,
    heatmap: heatmapResult.data,
    picoHorario: heatmapResult.picoHorario,
  }
}

export async function getResumenAction(period: string) {
  const desde = getDesde(period)
  const [semaanas, origenes, especialidades, asistencia, heatmapResult, tendenciaResult] =
    await Promise.all([
      getTurnosPorSemana(desde),
      getOrigenTurnos(desde),
      getTurnosPorEspecialidad(desde),
      getTasaAsistencia(desde),
      getHeatmapHorario(desde),
      getTendenciaDiaria(),
    ])
  return {
    semanas: semaanas.data,
    variacionPct: semaanas.variacionPct,
    origenes,
    especialidades,
    asistencia,
    heatmap: heatmapResult.data,
    picoHorario: heatmapResult.picoHorario,
    tendencia: tendenciaResult.data,
    promedioDiario: tendenciaResult.promedioDiario,
  }
}
