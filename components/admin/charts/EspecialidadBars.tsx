'use client'

import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts'
import type { EspecialidadData } from '@/lib/analytics'

interface Props {
  data: EspecialidadData[]
}

const BLUES = [
  '#1E3A5F',
  '#1E4D8C',
  '#2563EB',
  '#3B82F6',
  '#60A5FA',
  '#93C5FD',
  '#BFDBFE',
  '#DBEAFE',
]

export function EspecialidadBars({ data }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="h-64 bg-gray-100 rounded-xl motion-safe:animate-pulse" />
  }

  const chartHeight = Math.max(data.length * 36 + 20, 160)

  return (
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
        Turnos por especialidad
      </p>

      {data.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-sm text-gray-400">
          Sin datos para el período
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 0, right: 40, left: 0, bottom: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="especialidad"
              width={140}
              tick={{ fontSize: 12, fill: '#475569' }}
              axisLine={false}
              tickLine={false}
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
            <Bar dataKey="total" radius={[0, 6, 6, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={BLUES[i] ?? '#DBEAFE'} />
              ))}
              <LabelList
                dataKey="total"
                position="right"
                style={{ fontSize: 12, fontWeight: 700, fill: '#475569' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
