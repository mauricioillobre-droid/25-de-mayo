'use client'

import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { OrigenData } from '@/lib/analytics'

interface Props {
  data: OrigenData[]
}

const COLORS: Record<string, string> = {
  manual: '#1E3A5F',
  web: '#3B82F6',
  whatsapp: '#22C55E',
}

const LABELS: Record<string, string> = {
  manual: 'Manual',
  web: 'Web',
  whatsapp: 'WhatsApp',
}

export function OrigenDonut({ data }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="h-48 bg-gray-100 rounded-xl motion-safe:animate-pulse" />
  }

  const total = data.reduce((s, d) => s + d.total, 0)

  return (
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
        Origen de turnos
      </p>

      {data.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-sm text-gray-400">
          Sin datos para el período
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={55}
                dataKey="total"
                strokeWidth={2}
                stroke="#fff"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={COLORS[entry.origen] ?? '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  fontSize: 12,
                }}
                formatter={(v, _, p) => [
                  `${v} (${(p as { payload: OrigenData }).payload.porcentaje}%)`,
                  LABELS[(p as { payload: OrigenData }).payload.origen] ?? (p as { payload: OrigenData }).payload.origen,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Custom legend */}
          <div className="flex-1 space-y-2">
            {data.map((entry) => (
              <div key={entry.origen} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: COLORS[entry.origen] ?? '#94a3b8' }}
                  />
                  <span className="text-xs font-semibold text-gray-600 truncate">
                    {LABELS[entry.origen] ?? entry.origen}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs font-bold text-gray-800">{entry.porcentaje}%</span>
                  <span className="text-[10px] text-gray-400">({entry.total})</span>
                </div>
              </div>
            ))}
            <div className="pt-1 border-t border-gray-100 flex justify-between">
              <span className="text-[10px] text-gray-400 uppercase tracking-wide">Total</span>
              <span className="text-xs font-bold text-gray-700">{total}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
