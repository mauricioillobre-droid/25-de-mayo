'use client'

import { useState, useEffect, useTransition, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import {
  getTurnosDelDia,
  actualizarEstadoTurno,
  getTurnosEsteMes,
  getTotalPacientes,
  TurnoCompleto,
} from '@/app/actions/admin'
import {
  Calendar,
  CalendarDays,
  CheckCircle,
  UserX,
  XCircle,
  BarChart3,
  Users,
  ChevronLeft,
  ChevronRight,
  Phone,
} from 'lucide-react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

/* ─── Helpers ─────────────────────────────────────────── */
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

/* ─── Estado badge ─────────────────────────────────────── */
const ESTADO_CONFIG = {
  confirmado: { label: 'Confirmado', bg: 'bg-blue-100',  text: 'text-blue-700' },
  completado: { label: 'Completado', bg: 'bg-green-100', text: 'text-green-700' },
  ausente:    { label: 'Ausente',    bg: 'bg-amber-100', text: 'text-amber-700' },
  cancelado:  { label: 'Cancelado',  bg: 'bg-red-100',   text: 'text-red-700' },
} as const

function EstadoBadge({ estado }: { estado: TurnoCompleto['estado'] }) {
  const cfg = ESTADO_CONFIG[estado]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  )
}

/* ─── Mini Calendar ─────────────────────────────────────── */
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DIAS_CORTOS = ['Lu','Ma','Mi','Ju','Vi','Sá','Do']

function MiniCalendar({
  fecha,
  onChange,
  onClose,
}: {
  fecha: string
  onChange: (date: string) => void
  onClose: () => void
}) {
  const [y, m] = fecha.split('-').map(Number)
  const [vy, setVy] = useState(y)
  const [vm, setVm] = useState(m - 1)
  const today = toDateStr(new Date())

  const prevMes = () => {
    if (vm === 0) { setVm(11); setVy((v) => v - 1) }
    else setVm((v) => v - 1)
  }
  const nextMes = () => {
    if (vm === 11) { setVm(0); setVy((v) => v + 1) }
    else setVm((v) => v + 1)
  }

  const firstDay = new Date(vy, vm, 1).getDay()
  const startOffset = (firstDay + 6) % 7
  const daysInMonth = new Date(vy, vm + 1, 0).getDate()

  const cells: (number | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let i = 1; i <= daysInMonth; i++) cells.push(i)

  const selectDay = (day: number) => {
    const str = `${vy}-${String(vm + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    onChange(str)
    onClose()
  }

  return (
    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-72">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMes}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Mes anterior"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>
        <span className="text-sm font-bold text-[#0A2463] capitalize">
          {MESES[vm]} {vy}
        </span>
        <button
          onClick={nextMes}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Mes siguiente"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DIAS_CORTOS.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />
          const dayStr = `${vy}-${String(vm + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const isSelected = dayStr === fecha
          const isToday = dayStr === today
          return (
            <button
              key={day}
              onClick={() => selectDay(day)}
              className={`aspect-square flex items-center justify-center rounded-lg text-sm transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#0A2463] text-white font-bold'
                  : isToday
                  ? 'bg-[#1E6BC6]/10 text-[#1E6BC6] font-bold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Date Picker ──────────────────────────────────────── */
function DatePicker({ fecha, onChange }: { fecha: string; onChange: (d: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-[#1E6BC6]/40 hover:shadow-md transition-all duration-150 cursor-pointer"
        aria-label="Seleccionar fecha"
        aria-expanded={open}
      >
        <CalendarDays className="w-4 h-4 text-[#1E6BC6]" />
        <span className="text-sm font-bold text-[#0A2463] capitalize">
          {formatDisplayDate(fecha)}
        </span>
      </button>
      {open && (
        <MiniCalendar fecha={fecha} onChange={onChange} onClose={() => setOpen(false)} />
      )}
    </div>
  )
}

/* ─── Stat Card ────────────────────────────────────────── */
function StatCard({
  label,
  value,
  icon: Icon,
  color,
  bgColor,
}: {
  label: string
  value: number
  icon: React.ElementType
  color: string
  bgColor: string
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center mb-4`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className={`text-4xl font-black ${color} leading-none`}>{value}</p>
      <p className="text-xs text-gray-500 font-semibold mt-2">{label}</p>
    </div>
  )
}

/* ─── Main Page ────────────────────────────────────────── */
export default function AdminPage() {
  const router = useRouter()
  const [fecha, setFecha] = useState(toDateStr(new Date()))
  const [turnos, setTurnos] = useState<TurnoCompleto[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [userEmail, setUserEmail] = useState<string | undefined>()
  const [turnosMes, setTurnosMes] = useState(0)
  const [totalPacientes, setTotalPacientes] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? undefined)
    })
    Promise.all([getTurnosEsteMes(), getTotalPacientes()]).then(([mes, pacs]) => {
      setTurnosMes(mes)
      setTotalPacientes(pacs)
    })
  }, [])

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

  const total       = turnos.length
  const confirmados = turnos.filter((t) => t.estado === 'confirmado').length
  const ausentes    = turnos.filter((t) => t.estado === 'ausente').length
  const cancelados  = turnos.filter((t) => t.estado === 'cancelado').length

  const today = toDateStr(new Date())
  const currentDate = new Date().toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar userEmail={userEmail} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col" style={{ marginLeft: '16rem' }}>
        {/* Page Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#0A2463] text-balance">Agenda</h1>
          <span className="text-sm text-gray-400 capitalize">{currentDate}</span>
        </header>

        <main className="flex-1 p-8">
          {/* Date Selector */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => setFecha((prev) => addDays(prev, -1))}
              className="p-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-150 cursor-pointer shadow-sm"
              aria-label="Día anterior"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>

            <DatePicker fecha={fecha} onChange={setFecha} />

            <button
              onClick={() => setFecha((prev) => addDays(prev, 1))}
              className="p-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-150 cursor-pointer shadow-sm"
              aria-label="Día siguiente"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>

            {fecha !== today && (
              <button
                onClick={() => setFecha(today)}
                className="text-xs text-[#1E6BC6] font-bold hover:underline cursor-pointer px-2 py-1"
              >
                Hoy
              </button>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <StatCard label="Total del día"    value={total}          icon={Calendar}   color="text-[#0A2463]"  bgColor="bg-[#0A2463]/10" />
            <StatCard label="Confirmados"      value={confirmados}    icon={CheckCircle} color="text-green-600" bgColor="bg-green-100" />
            <StatCard label="Ausentes"         value={ausentes}       icon={UserX}       color="text-amber-600" bgColor="bg-amber-100" />
            <StatCard label="Cancelados"       value={cancelados}     icon={XCircle}     color="text-red-600"   bgColor="bg-red-100" />
            <StatCard label="Turnos este mes"  value={turnosMes}      icon={BarChart3}   color="text-[#7C3AED]" bgColor="bg-[#7C3AED]/10" />
            <StatCard label="Total pacientes"  value={totalPacientes} icon={Users}       color="text-[#0D9488]" bgColor="bg-[#0D9488]/10" />
          </div>

          {/* Agenda del día */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-[#0A2463] text-base">Agenda del día</h2>
                <span className="text-xs text-gray-500 font-semibold bg-gray-100 px-2.5 py-0.5 rounded-full">
                  {total} {total === 1 ? 'turno' : 'turnos'}
                </span>
              </div>
              {(loading || isPending) && (
                <svg className="w-4 h-4 animate-spin text-[#1E6BC6]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
            </div>

            {loading ? (
              <div className="py-16 flex items-center justify-center text-gray-400 text-sm">
                Cargando turnos...
              </div>
            ) : turnos.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-7 h-7 text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-700">No hay turnos para este día</p>
                <p className="text-xs text-gray-400 mt-1">No se encontraron turnos agendados para esta fecha.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {turnos.map((turno) => (
                  <div
                    key={turno.id}
                    className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-50 transition-colors duration-150 ${
                      turno.estado === 'cancelado' || turno.estado === 'ausente' ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Hora badge */}
                    <div className="shrink-0">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#0A2463] text-white font-mono text-sm font-bold">
                        {turno.hora_inicio.substring(0, 5)}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-[#0A2463] text-sm">{turno.paciente_nombre}</span>
                        <EstadoBadge estado={turno.estado} />
                      </div>
                      <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500">
                        <span>{turno.especialidades?.nombre ?? '—'}</span>
                        <span className="text-gray-300">·</span>
                        <span>{turno.profesionales?.nombre ?? '—'}</span>
                        <span className="text-gray-300">·</span>
                        <a
                          href={`tel:${turno.paciente_telefono}`}
                          className="flex items-center gap-1 hover:text-[#1E6BC6] transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          {turno.paciente_telefono}
                        </a>
                      </div>
                    </div>

                    {/* Actions */}
                    {turno.estado === 'confirmado' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => cambiarEstado(turno.id, 'completado')}
                          disabled={isPending}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300 transition-all duration-150 cursor-pointer disabled:opacity-50 min-h-[36px]"
                        >
                          Completado
                        </button>
                        <button
                          onClick={() => cambiarEstado(turno.id, 'ausente')}
                          disabled={isPending}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg border-2 border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 transition-all duration-150 cursor-pointer disabled:opacity-50 min-h-[36px]"
                        >
                          Ausente
                        </button>
                        <button
                          onClick={() => cambiarEstado(turno.id, 'cancelado')}
                          disabled={isPending}
                          className="text-xs font-bold px-3 py-1.5 rounded-lg border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-150 cursor-pointer disabled:opacity-50 min-h-[36px]"
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
    </div>
  )
}
