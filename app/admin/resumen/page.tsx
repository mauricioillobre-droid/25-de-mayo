'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { getResumenAction } from '@/app/actions/analytics'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { TurnosPorSemana } from '@/components/admin/charts/TurnosPorSemana'
import { OrigenDonut } from '@/components/admin/charts/OrigenDonut'
import { EspecialidadBars } from '@/components/admin/charts/EspecialidadBars'
import { AsistenciaStats } from '@/components/admin/charts/AsistenciaStats'
import { TendenciaDiaria } from '@/components/admin/charts/TendenciaDiaria'
import type {
  TurnosPorSemanaData,
  OrigenData,
  EspecialidadData,
  AsistenciaData,
  HeatmapHorarioData,
  TendenciaDiariaData,
} from '@/lib/analytics'

/* ── Types ─────────────────────────────────────────────────── */
type Period = 'este_mes' | '3_meses' | 'este_anio'

interface ResumenData {
  semanas: TurnosPorSemanaData[]
  variacionPct: number | null
  origenes: OrigenData[]
  especialidades: EspecialidadData[]
  asistencia: AsistenciaData
  heatmap: HeatmapHorarioData[]
  picoHorario: number | null
  tendencia: TendenciaDiariaData[]
  promedioDiario: number
}

const PERIODS: { value: Period; label: string }[] = [
  { value: 'este_mes', label: 'Este mes' },
  { value: '3_meses', label: 'Últimos 3 meses' },
  { value: 'este_anio', label: 'Este año' },
]

const CARD = 'bg-white rounded-2xl border border-slate-100 p-6'

/* ── Skeleton ──────────────────────────────────────────────── */
function ChartSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div
      className="bg-gray-100 rounded-xl motion-safe:animate-pulse"
      style={{ height }}
    />
  )
}

/* ── Page ──────────────────────────────────────────────────── */
export default function ResumenPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | undefined>()
  const [period, setPeriod] = useState<Period>('este_mes')
  const [data, setData] = useState<ResumenData | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: d }) => {
      setUserEmail(d.user?.email ?? undefined)
    })
  }, [])

  useEffect(() => {
    startTransition(async () => {
      const result = await getResumenAction(period)
      setData(result)
    })
  }, [period])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const isLoading = isPending || data === null

  return (
    <div className="flex min-h-screen bg-[#F4F6F9]">
      <AdminSidebar userEmail={userEmail} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col overflow-x-hidden" style={{ marginLeft: '16rem' }}>
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <h1 className="text-xl font-bold text-[#0A2463]">Resumen analítico</h1>

          {/* Period selector */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {PERIODS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setPeriod(value)}
                disabled={isPending}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer disabled:opacity-60
                  ${period === value
                    ? 'bg-white text-[#0A2463] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </header>

        <main className="flex-1 p-8 space-y-6">
          {/* Gráfico 1 — Turnos por semana */}
          <div className={CARD}>
            {isLoading ? (
              <>
                <div className="h-4 w-40 bg-gray-100 rounded motion-safe:animate-pulse mb-4" />
                <ChartSkeleton height={200} />
              </>
            ) : (
              <TurnosPorSemana
                data={data.semanas}
                variacionPct={data.variacionPct}
              />
            )}
          </div>

          {/* Gráfico 2 — Origen (donut) */}
          <div className={CARD}>
            {isLoading ? (
              <>
                <div className="h-4 w-40 bg-gray-100 rounded motion-safe:animate-pulse mb-4" />
                <ChartSkeleton height={160} />
              </>
            ) : (
              <OrigenDonut data={data.origenes} />
            )}
          </div>

          {/* Gráfico 3 — Especialidades (barras horizontales) */}
          <div className={CARD}>
            {isLoading ? (
              <>
                <div className="h-4 w-48 bg-gray-100 rounded motion-safe:animate-pulse mb-4" />
                <ChartSkeleton height={280} />
              </>
            ) : (
              <EspecialidadBars data={data.especialidades} />
            )}
          </div>

          {/* Gráfico 4 — Tasa de asistencia + heatmap */}
          <div className={CARD}>
            {isLoading ? (
              <>
                <div className="h-4 w-48 bg-gray-100 rounded motion-safe:animate-pulse mb-4" />
                <ChartSkeleton height={220} />
              </>
            ) : (
              <AsistenciaStats
                asistencia={data.asistencia}
                heatmap={data.heatmap}
                picoHorario={data.picoHorario}
              />
            )}
          </div>

          {/* Gráfico 5 — Tendencia diaria */}
          <div className={CARD}>
            {isLoading ? (
              <>
                <div className="h-4 w-48 bg-gray-100 rounded motion-safe:animate-pulse mb-4" />
                <ChartSkeleton height={220} />
              </>
            ) : (
              <TendenciaDiaria
                data={data.tendencia}
                promedioDiario={data.promedioDiario}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
