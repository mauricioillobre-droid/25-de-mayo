'use client'

import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { TurnosPorSemanaData } from '@/lib/analytics'

interface Props {
  data: TurnosPorSemanaData[]
  variacionPct: number | null
}

export function TurnosPorSemana({ data, variacionPct }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const maxTotal = Math.max(...data.map((d) => d.total), 1)

  if (!mounted) {
    return <div className="h-48 bg-gray-100 rounded-xl motion-safe:animate-pulse" />
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Turnos por semana
        </p>
        {variacionPct !== null && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              variacionPct >= 0
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {variacionPct >= 0 ? '+' : ''}
            {variacionPct}% vs período anterior
          </span>
        )}
      </div>

      {data.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-sm text-gray-400">
          Sin datos para el período
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                fontSize: 12,
              }}
              cursor={{ fill: '#f1f5f9' }}
              formatter={(v) => [v ?? 0, 'Turnos']}
            />
            <Bar dataKey="total" radius={[6, 6, 0, 0]}>
              {data.map((entry, i) => {
                const opacity = 0.35 + 0.65 * (entry.total / maxTotal)
                return <Cell key={i} fill={`rgba(30, 58, 95, ${opacity})`} />
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
