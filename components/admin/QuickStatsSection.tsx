'use client'

import { useState, useEffect, useTransition } from 'react'
import { getQuickStatsAction } from '@/app/actions/analytics'
import { TurnosPorSemana } from '@/components/admin/charts/TurnosPorSemana'
import { OrigenDonut } from '@/components/admin/charts/OrigenDonut'
import { AsistenciaStats } from '@/components/admin/charts/AsistenciaStats'
import type { TurnosPorSemanaData, OrigenData, AsistenciaData, HeatmapHorarioData } from '@/lib/analytics'

interface QuickData {
  semanas: { data: TurnosPorSemanaData[]; variacionPct: number | null }
  origenes: OrigenData[]
  asistencia: AsistenciaData
  heatmap: HeatmapHorarioData[]
  picoHorario: number | null
}

const CARD = 'bg-white rounded-2xl border border-slate-100 p-5'

export function QuickStatsSection() {
  const [data, setData] = useState<QuickData | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const result = await getQuickStatsAction()
      setData({
        semanas: result.semanas,
        origenes: result.origenes,
        asistencia: result.asistencia,
        heatmap: result.heatmap,
        picoHorario: result.picoHorario,
      })
    })
  }, [])

  const isLoading = isPending || data === null

  return (
    <section className="mb-8">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
        Estadísticas rápidas — últimos 30 días
      </p>

      {/* Row 1: weekly bars (col-span 2) + donut (col-span 1) */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className={`${CARD} col-span-2`}>
          {isLoading ? (
            <ChartSkeleton height={220} />
          ) : (
            <TurnosPorSemana
              data={data.semanas.data}
              variacionPct={data.semanas.variacionPct}
            />
          )}
        </div>

        <div className={CARD}>
          {isLoading ? (
            <ChartSkeleton height={220} />
          ) : (
            <OrigenDonut data={data.origenes} />
          )}
        </div>
      </div>

      {/* Row 2: asistencia full width */}
      <div className={CARD}>
        {isLoading ? (
          <ChartSkeleton height={180} label="Cargando estadísticas de asistencia..." />
        ) : (
          <AsistenciaStats
            asistencia={data.asistencia}
            heatmap={data.heatmap}
            picoHorario={data.picoHorario}
          />
        )}
      </div>
    </section>
  )
}

function ChartSkeleton({ height, label }: { height: number; label?: string }) {
  return (
    <div
      className="bg-gray-100 rounded-xl motion-safe:animate-pulse flex items-center justify-center"
      style={{ height }}
    >
      {label && <span className="text-xs text-gray-400">{label}</span>}
    </div>
  )
}
