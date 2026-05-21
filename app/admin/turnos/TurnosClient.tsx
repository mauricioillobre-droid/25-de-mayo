'use client'

import { useState, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import {
  IconWorld,
  IconBrandWhatsapp,
  IconUserEdit,
  IconEye,
  IconRefresh,
  IconSearch,
} from '@tabler/icons-react'

/* ─── Types ──────────────────────────────────────────────── */

export type TurnoEstado = 'confirmado' | 'pendiente' | 'cancelado' | 'ausente' | 'completado'
export type TurnoOrigen = 'web' | 'whatsapp' | 'manual'

export interface TurnoConJoins {
  id: string
  profesional_id: string | null
  especialidad_id: string | null
  paciente_nombre: string
  paciente_telefono: string
  fecha: string
  hora_inicio: string
  hora_fin: string
  estado: TurnoEstado
  origen: TurnoOrigen | null
  cobertura_medica: string | null
  notas: string | null
  created_at: string
  profesionales: { nombre: string } | null
  especialidades: { nombre: string } | null
}

export interface EspecialidadItem {
  id: string
  nombre: string
}

/* ─── Helpers ─────────────────────────────────────────────── */

function formatFecha(fecha: string): string {
  const [y, m, d] = fecha.split('-')
  return `${d}/${m}/${y}`
}

function formatHora(hora: string): string {
  return hora.substring(0, 5)
}

function resolveOrigen(origen: TurnoOrigen | null): TurnoOrigen {
  return origen ?? 'manual'
}

/* ─── Estado badge ────────────────────────────────────────── */

const ESTADO_CONFIG: Record<TurnoEstado, { label: string; bg: string; text: string }> = {
  confirmado: { label: 'Confirmado', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  pendiente:  { label: 'Pendiente',  bg: 'bg-amber-100',  text: 'text-amber-700'  },
  ausente:    { label: 'Ausente',    bg: 'bg-orange-100', text: 'text-orange-700' },
  cancelado:  { label: 'Cancelado',  bg: 'bg-red-100',    text: 'text-red-600'    },
  completado: { label: 'Completado', bg: 'bg-gray-100',   text: 'text-gray-500'   },
}

function EstadoBadge({ estado }: { estado: TurnoEstado }) {
  const cfg = ESTADO_CONFIG[estado] ?? ESTADO_CONFIG.confirmado
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  )
}

/* ─── Origen badge ────────────────────────────────────────── */

type OrigenCfg = {
  label: string
  Icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>
  border: string
  text: string
  bg: string
}

const ORIGEN_CONFIG: Record<TurnoOrigen, OrigenCfg> = {
  web:      { label: 'Sitio web', Icon: IconWorld,          border: 'border-blue-200',  text: 'text-blue-700',  bg: 'bg-blue-50'  },
  whatsapp: { label: 'WhatsApp',  Icon: IconBrandWhatsapp,  border: 'border-green-200', text: 'text-green-700', bg: 'bg-green-50' },
  manual:   { label: 'Manual',    Icon: IconUserEdit,        border: 'border-gray-200',  text: 'text-gray-600',  bg: 'bg-gray-50'  },
}

function OrigenBadge({ origen }: { origen: TurnoOrigen }) {
  const cfg = ORIGEN_CONFIG[origen]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.border} ${cfg.text} ${cfg.bg}`}>
      <cfg.Icon className="w-3.5 h-3.5" aria-hidden="true" />
      {cfg.label}
    </span>
  )
}

/* ─── Metric card ─────────────────────────────────────────── */

function MetricCard({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-1">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 leading-none">{label}</p>
      <p className={`text-2xl font-bold leading-tight ${accent ?? 'text-gray-800'}`}>{value}</p>
    </div>
  )
}

/* ─── Select / Input helper styles ───────────────────────── */

const INPUT_CLS =
  'px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white ' +
  'focus:outline-none focus:ring-2 focus:ring-[#1E6BC6]/30 focus:border-[#1E6BC6] ' +
  'transition-colors cursor-pointer'

/* ─── Main component ──────────────────────────────────────── */

interface TurnosClientProps {
  turnos: TurnoConJoins[]
  especialidades: EspecialidadItem[]
  userEmail?: string
}

export function TurnosClient({ turnos, especialidades, userEmail }: TurnosClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  /* Filters */
  const [search, setSearch] = useState('')
  const [filtroOrigen, setFiltroOrigen] = useState<'todos' | TurnoOrigen>('todos')
  const [filtroEstado, setFiltroEstado] = useState<'todos' | TurnoEstado>('todos')
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('todos')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  /* Auth */
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  /* Refresh */
  const handleRefresh = () => {
    startTransition(() => {
      router.refresh()
    })
  }

  /* Filtered list */
  const filteredTurnos = useMemo(() => {
    const q = search.toLowerCase().trim()
    return turnos.filter((t) => {
      const origen = resolveOrigen(t.origen)

      if (q) {
        const matchPaciente = t.paciente_nombre.toLowerCase().includes(q)
        const matchProf     = (t.profesionales?.nombre ?? '').toLowerCase().includes(q)
        const matchEsp      = (t.especialidades?.nombre ?? '').toLowerCase().includes(q)
        if (!matchPaciente && !matchProf && !matchEsp) return false
      }
      if (filtroOrigen !== 'todos' && origen !== filtroOrigen) return false
      if (filtroEstado !== 'todos' && t.estado !== filtroEstado) return false
      if (filtroEspecialidad !== 'todos' && t.especialidad_id !== filtroEspecialidad) return false
      if (fechaDesde && t.fecha < fechaDesde) return false
      if (fechaHasta && t.fecha > fechaHasta) return false
      return true
    })
  }, [turnos, search, filtroOrigen, filtroEstado, filtroEspecialidad, fechaDesde, fechaHasta])

  /* Metrics — recalculated from filtered list */
  const metrics = useMemo(() => ({
    total:      filteredTurnos.length,
    confirmados: filteredTurnos.filter((t) => t.estado === 'confirmado').length,
    pendientes:  filteredTurnos.filter((t) => t.estado === 'pendiente').length,
    cancelados:  filteredTurnos.filter((t) => t.estado === 'cancelado').length,
    web:       filteredTurnos.filter((t) => resolveOrigen(t.origen) === 'web').length,
    whatsapp:  filteredTurnos.filter((t) => resolveOrigen(t.origen) === 'whatsapp').length,
    manual:    filteredTurnos.filter((t) => resolveOrigen(t.origen) === 'manual').length,
  }), [filteredTurnos])

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar userEmail={userEmail} onLogout={handleLogout} />

      <main className="flex-1 ml-64 overflow-auto">
        <div className="p-8" style={{ maxWidth: '1400px' }}>

          {/* ── Header ─────────────────────────────────────── */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Turnos</h1>
            <p className="text-sm text-gray-500 mt-1">Historial completo · filtros en tiempo real</p>
          </div>

          {/* ── Metric cards ────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
            <MetricCard label="Total"       value={metrics.total}      />
            <MetricCard label="Confirmados" value={metrics.confirmados} accent="text-emerald-600" />
            <MetricCard label="Pendientes"  value={metrics.pendientes}  accent="text-amber-600"   />
            <MetricCard label="Cancelados"  value={metrics.cancelados}  accent="text-red-500"     />
            <MetricCard label="Vía web"     value={metrics.web}         accent="text-blue-600"    />
            <MetricCard label="WhatsApp"    value={metrics.whatsapp}    accent="text-green-600"   />
            <MetricCard label="Manual"      value={metrics.manual}      accent="text-gray-600"    />
          </div>

          {/* ── Filter toolbar ──────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4">
            <div className="flex flex-wrap gap-3 items-end">

              {/* Text search */}
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Buscar
                </label>
                <div className="relative">
                  <IconSearch
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Paciente, profesional, especialidad…"
                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800
                      placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2
                      focus:ring-[#1E6BC6]/30 focus:border-[#1E6BC6] transition-colors`}
                  />
                </div>
              </div>

              {/* Origen */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Origen
                </label>
                <select
                  value={filtroOrigen}
                  onChange={(e) => setFiltroOrigen(e.target.value as typeof filtroOrigen)}
                  className={INPUT_CLS}
                >
                  <option value="todos">Todos</option>
                  <option value="web">Sitio web</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="manual">Manual</option>
                </select>
              </div>

              {/* Estado */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Estado
                </label>
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value as typeof filtroEstado)}
                  className={INPUT_CLS}
                >
                  <option value="todos">Todos</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="cancelado">Cancelado</option>
                  <option value="ausente">Ausente</option>
                  <option value="completado">Completado</option>
                </select>
              </div>

              {/* Especialidad */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Especialidad
                </label>
                <select
                  value={filtroEspecialidad}
                  onChange={(e) => setFiltroEspecialidad(e.target.value)}
                  className={INPUT_CLS}
                >
                  <option value="todos">Todas</option>
                  {especialidades.map((esp) => (
                    <option key={esp.id} value={esp.id}>{esp.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Fecha desde */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Desde
                </label>
                <input
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  className={INPUT_CLS}
                />
              </div>

              {/* Fecha hasta */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Hasta
                </label>
                <input
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  className={INPUT_CLS}
                />
              </div>

              {/* Actualizar */}
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A2463] text-white
                  text-sm font-semibold hover:bg-[#1a3a7a] transition-colors cursor-pointer
                  disabled:opacity-60 min-h-[44px]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6BC6]"
              >
                <IconRefresh
                  className={`w-4 h-4 transition-transform ${isPending ? 'animate-spin' : ''}`}
                  aria-hidden="true"
                />
                Actualizar
              </button>
            </div>
          </div>

          {/* ── Table ───────────────────────────────────────── */}
          <div
            className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden
              transition-opacity duration-200 ${isPending ? 'opacity-60' : 'opacity-100'}`}
          >
            {filteredTurnos.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-20 text-center select-none">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <IconSearch className="w-7 h-7 text-gray-400" aria-hidden="true" />
                </div>
                <p className="text-gray-700 font-semibold text-base">Sin resultados</p>
                <p className="text-sm text-gray-400 mt-1">
                  {turnos.length === 0
                    ? 'No hay turnos registrados todavía.'
                    : 'Ajustá los filtros para encontrar turnos.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['Fecha', 'Hora', 'Paciente', 'Especialidad'].map((col) => (
                        <th
                          key={col}
                          className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                      <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap hidden md:table-cell">
                        Profesional
                      </th>
                      {['Origen', 'Estado', 'Acciones'].map((col) => (
                        <th
                          key={col}
                          className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-400 whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredTurnos.map((t) => (
                      <tr
                        key={t.id}
                        className="hover:bg-gray-50/80 transition-colors duration-150"
                      >
                        {/* Fecha */}
                        <td className="px-5 py-4 text-gray-700 whitespace-nowrap tabular-nums">
                          {formatFecha(t.fecha)}
                        </td>

                        {/* Hora */}
                        <td className="px-5 py-4 text-gray-700 whitespace-nowrap tabular-nums font-medium">
                          {formatHora(t.hora_inicio)}
                        </td>

                        {/* Paciente */}
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-900 leading-snug">
                            {t.paciente_nombre}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 leading-none">
                            {t.paciente_telefono}
                          </p>
                        </td>

                        {/* Especialidad */}
                        <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                          {t.especialidades?.nombre ?? '—'}
                        </td>

                        {/* Profesional (hidden on mobile) */}
                        <td className="px-5 py-4 text-gray-600 whitespace-nowrap hidden md:table-cell">
                          {t.profesionales?.nombre ?? '—'}
                        </td>

                        {/* Origen */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <OrigenBadge origen={resolveOrigen(t.origen)} />
                        </td>

                        {/* Estado */}
                        <td className="px-5 py-4 whitespace-nowrap">
                          <EstadoBadge estado={t.estado} />
                        </td>

                        {/* Acciones */}
                        <td className="px-5 py-4">
                          <button
                            type="button"
                            aria-label={`Ver detalle de ${t.paciente_nombre}`}
                            className="p-2 rounded-xl text-gray-400 hover:text-[#1E6BC6] hover:bg-blue-50
                              transition-colors cursor-pointer flex items-center justify-center
                              min-h-[44px] min-w-[44px]
                              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6BC6]"
                          >
                            <IconEye className="w-5 h-5" aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Row count */}
          {filteredTurnos.length > 0 && (
            <p className="text-xs text-gray-400 text-right mt-3">
              {filteredTurnos.length}{' '}
              {filteredTurnos.length === 1 ? 'turno encontrado' : 'turnos encontrados'}
            </p>
          )}

        </div>
      </main>
    </div>
  )
}
