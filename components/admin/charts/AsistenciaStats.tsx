'use client'

import type { AsistenciaData, HeatmapHorarioData } from '@/lib/analytics'

interface Props {
  asistencia: AsistenciaData
  heatmap: HeatmapHorarioData[]
  picoHorario: number | null
}

function pct(num: number, total: number) {
  return total > 0 ? Math.round((num / total) * 100) : 0
}

export function AsistenciaStats({ asistencia, heatmap, picoHorario }: Props) {
  const { asistidos, ausentes, cancelados, total } = asistencia
  const maxHeat = Math.max(...heatmap.map((h) => h.total), 1)

  const cards = [
    {
      label: 'Asistidos',
      value: pct(asistidos, total),
      count: asistidos,
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      bar: 'bg-emerald-500',
      border: 'border-emerald-100',
    },
    {
      label: 'Ausentes',
      value: pct(ausentes, total),
      count: ausentes,
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      bar: 'bg-amber-400',
      border: 'border-amber-100',
    },
    {
      label: 'Cancelados',
      value: pct(cancelados, total),
      count: cancelados,
      bg: 'bg-red-50',
      text: 'text-red-600',
      bar: 'bg-red-400',
      border: 'border-red-100',
    },
  ]

  return (
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
        Tasa de asistencia
      </p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`${card.bg} ${card.border} border rounded-xl p-4`}
          >
            <p className={`text-2xl font-bold ${card.text} tabular-nums`}>{card.value}%</p>
            <p className={`text-xs font-semibold ${card.text} mt-0.5`}>{card.label}</p>
            <p className="text-[10px] text-gray-400 mt-1">{card.count} turnos</p>
          </div>
        ))}
      </div>

      {/* Heatmap horario */}
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
        Distribución horaria
      </p>
      <div className="flex gap-1.5 items-end">
        {heatmap.map(({ hora, label, total: t }) => {
          const intensity = t / maxHeat
          const opacity = t === 0 ? 0.06 : 0.15 + 0.85 * intensity
          return (
            <div key={hora} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-md transition-all duration-300"
                style={{
                  height: Math.max(t === 0 ? 4 : 8, Math.round(48 * intensity) + 8),
                  background: `rgba(30, 58, 95, ${opacity})`,
                }}
                title={`${label}: ${t} turnos`}
              />
              <span className="text-[9px] text-gray-400 leading-none">{label}</span>
            </div>
          )
        })}
      </div>

      {picoHorario !== null && (
        <p className="text-xs text-gray-400 mt-3 text-center">
          Pico de demanda:{' '}
          <span className="font-bold text-[#1E3A5F]">{picoHorario}:00 hs</span>
        </p>
      )}
    </div>
  )
}
