'use client'

import { useState, useEffect } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from 'recharts'
import type { TendenciaDiariaData } from '@/lib/analytics'

interface Props {
  data: TendenciaDiariaData[]
  promedioDiario: number
}

function CustomDot(props: {
  cx?: number
  cy?: number
  payload?: TendenciaDiariaData
}) {
  const { cx = 0, cy = 0, payload } = props
  if (!payload?.esPico || !payload.total) return null
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="#1E3A5F" stroke="#fff" strokeWidth={2} />
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fill="#1E3A5F"
      >
        {payload.total}
      </text>
    </g>
  )
}

export function TendenciaDiaria({ data, promedioDiario }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="h-48 bg-gray-100 rounded-xl motion-safe:animate-pulse" />
  }

  // Show every 3rd label to avoid crowding
  const tickFormatter = (_: string, index: number) => {
    const item = data[index]
    return index % 3 === 0 && item ? item.label : ''
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Tendencia diaria del mes
        </p>
        {promedioDiario > 0 && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
            Promedio: {promedioDiario} turnos/día
          </span>
        )}
      </div>

      {data.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-sm text-gray-400">
          Sin datos para este mes
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E3A5F" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#1E3A5F" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="label"
              tickFormatter={tickFormatter}
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
              formatter={(v) => [v ?? 0, 'Turnos']}
              labelFormatter={(label) => `${label}`}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#1E3A5F"
              strokeWidth={2}
              fill="url(#areaGrad)"
              dot={<CustomDot />}
              activeDot={{ r: 5, fill: '#1E3A5F', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
