'use client'

import { useState, useEffect, useTransition, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import {
  getTurnosDelDia,
  actualizarEstadoTurno,
  TurnoCompleto,
} from '@/app/actions/admin'
import Link from 'next/link'

/* ─── Helpers ────────────────────────────────────────── */
function toDateStr(d: Date) {
  return d.toISOString().split('T')[0]
}
function formatDisplayDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}
function addDays(dateStr: string, n: number) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + n)
  return toDateStr(date)
}

/* ─── Estado badge ───────────────────────────────────── */
const ESTADO_CONFIG = {
  confirmado: { label: 'Confirmado', bg: 'bg-blue-100', text: 'text-blue-700' },
  completado: { label: 'Completado', bg: 'bg-green-100', text: 'text-green-700' },
  ausente: { label: 'Ausente', bg: 'bg-amber-100', text: 'text-amber-700' },
  cancelado: { label: 'Cancelado', bg: 'bg-red-100', text: 'text-red-700' },
} as const

function EstadoBadge({ estado }: { estado: TurnoCompleto['estado'] }) {
  const cfg = ESTADO_CONFIG[estado]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  )
}

/* ─── Header Admin ───────────────────────────────────── */
function AdminHeader({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="flex flex-col leading-none">
              <span className="font-black text-sm text-[#0A2463] tracking-tight">25 DE MAYO</span>
              <span className="font-semibold text-[10px] text-[#1E6BC6]">Panel de gestión</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/configuracion"
              className="text-xs font-semibold text-[#6B7280] hover:text-[#0A2463] transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              Configuración
            </Link>
            <button
              onClick={onLogout}
              className="text-xs font-semibold text-[#6B7280] hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 cursor-pointer"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

/* ─── Main page ──────────────────────────────────────── */
export default function AdminPage() {
  const router = useRouter()
  const [fecha, setFecha] = useState(toDateStr(new Date()))
  const [turnos, setTurnos] = useState<TurnoCompleto[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const fetchTurnos = useCallback((f: string) => {
    setLoading(true)
    startTransition(async () => {
      const data = await getTurnosDelDia(f)
      setTurnos(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => { fetchTurnos(fecha) }, [fecha, fetchTurnos])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const cambiarEstado = (turnoId: string, estado: TurnoCompleto['estado']) => {
    startTransition(async () => {
      await actualizarEstadoTurno(turnoId, estado)
      fetchTurnos(fecha)
    })
  }

  /* Stats */
  const total = turnos.length
  const confirmados = turnos.filter((t) => t.estado === 'confirmado').length
  const completados = turnos.filter((t) => t.estado === 'completado').length
  const ausentes = turnos.filter((t) => t.estado === 'ausente').length
  const cancelados = turnos.filter((t) => t.estado === 'cancelado').length

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Date selector */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setFecha(addDays(fecha, -1))}
            className="p-2 rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer shadow-sm"
            aria-label="Día anterior"
          >
            <svg className="w-4 h-4 text-[#374151]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={fecha}
                onChange={(e) => e.target.value && setFecha(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-[#0A2463] focus:outline-none focus:ring-2 focus:ring-[#1E6BC6]/30 cursor-pointer bg-white shadow-sm"
              />
              <span className="text-sm text-[#6B7280] capitalize hidden sm:block">
                {formatDisplayDate(fecha)}
              </span>
              {fecha !== toDateStr(new Date()) && (
                <button
                  onClick={() => setFecha(toDateStr(new Date()))}
                  className="text-xs text-[#1E6BC6] font-semibold hover:underline cursor-pointer"
                >
                  Hoy
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => setFecha(addDays(fecha, 1))}
            className="p-2 rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer shadow-sm"
            aria-label="Día siguiente"
          >
            <svg className="w-4 h-4 text-[#374151]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total', value: total, color: 'text-[#0A2463]', bg: 'bg-white' },
            { label: 'Confirmados', value: confirmados, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Ausentes', value: ausentes, color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Cancelados', value: cancelados, color: 'text-red-600', bg: 'bg-red-50' },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-4 shadow-sm border border-gray-100`}>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-[#6B7280] font-semibold mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Turnos list */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-[#0A2463] text-sm">
              Agenda del día
              {completados > 0 && (
                <span className="ml-2 text-xs text-green-600 font-normal">· {completados} completado{completados !== 1 ? 's' : ''}</span>
              )}
            </h2>
            {(loading || isPending) && (
              <svg className="w-4 h-4 animate-spin text-[#1E6BC6]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
          </div>

          {loading ? (
            <div className="py-16 flex items-center justify-center text-[#9CA3AF] text-sm">
              Cargando turnos...
            </div>
          ) : turnos.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-[#D1D5DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[#374151]">Sin turnos este día</p>
              <p className="text-xs text-[#9CA3AF] mt-1">No hay turnos agendados para esta fecha.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {turnos.map((turno) => (
                <div
                  key={turno.id}
                  className={`px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 transition-colors ${
                    turno.estado === 'cancelado' || turno.estado === 'ausente' ? 'opacity-60' : ''
                  }`}
                >
                  {/* Hora */}
                  <div className="w-14 shrink-0">
                    <span className="font-black text-[#0A2463] text-base tabular-nums">
                      {turno.hora_inicio.substring(0, 5)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#0A2463] text-sm">{turno.paciente_nombre}</span>
                      <EstadoBadge estado={turno.estado} />
                    </div>
                    <div className="text-xs text-[#6B7280] mt-0.5 flex items-center gap-2 flex-wrap">
                      <span>{turno.especialidades?.nombre ?? '—'}</span>
                      <span>·</span>
                      <span>{turno.profesionales?.nombre ?? '—'}</span>
                      <span>·</span>
                      <a
                        href={`tel:${turno.paciente_telefono}`}
                        className="hover:text-[#1E6BC6] transition-colors"
                      >
                        {turno.paciente_telefono}
                      </a>
                    </div>
                  </div>

                  {/* Actions */}
                  {turno.estado === 'confirmado' && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => cambiarEstado(turno.id, 'completado')}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors cursor-pointer min-h-[36px]"
                      >
                        Completado
                      </button>
                      <button
                        onClick={() => cambiarEstado(turno.id, 'ausente')}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer min-h-[36px]"
                      >
                        Ausente
                      </button>
                      <button
                        onClick={() => cambiarEstado(turno.id, 'cancelado')}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer min-h-[36px]"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
