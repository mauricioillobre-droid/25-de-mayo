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
  ChevronDown,
  Phone,
  Plus,
  X,
} from 'lucide-react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { motion, useReducedMotion } from 'motion/react'
import {
  getEspecialidadesAdmin,
  crearTurnoManual,
  getDiasDisponiblesPorProfesional,
} from '@/app/actions/admin'
import {
  getProfesionalesByEspecialidad,
  getSlotsDisponibles,
} from '@/app/actions/turnos'

/* ─── Helpers ─────────────────────────────────────────── */
function toDateStr(d: Date) {
  return d.toISOString().split('T')[0]
}

function formatDayOfWeek(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es-AR', { weekday: 'long' })
}

function formatShortDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es-AR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatFullDate(dateStr: string) {
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

/* ─── Estado config ────────────────────────────────────── */
const ESTADO_CONFIG = {
  confirmado: { label: 'Confirmado', bg: 'bg-blue-100',   text: 'text-blue-700',   stripe: 'bg-[#1E6BC6]' },
  completado: { label: 'Completado', bg: 'bg-emerald-100', text: 'text-emerald-700', stripe: 'bg-emerald-500' },
  ausente:    { label: 'Ausente',    bg: 'bg-amber-100',  text: 'text-amber-700',  stripe: 'bg-amber-400' },
  cancelado:  { label: 'Cancelado',  bg: 'bg-red-100',    text: 'text-red-700',    stripe: 'bg-red-400' },
} as const

function EstadoBadge({ estado }: { estado: TurnoCompleto['estado'] }) {
  const cfg = ESTADO_CONFIG[estado]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
      {estado === 'confirmado' && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse shrink-0" aria-hidden="true" />
      )}
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
    // role="dialog" exposes this as a modal for screen readers
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Seleccionar fecha"
      className="absolute top-full mt-2 left-0 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-72"
    >
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMes}
          aria-label="Mes anterior"
          className="p-2 rounded-xl hover:bg-gray-100 motion-safe:transition-colors duration-150 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6BC6]/50"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" aria-hidden="true" />
        </button>
        <span className="text-sm font-bold text-[#0A2463] capitalize select-none">
          {MESES[vm]} {vy}
        </span>
        <button
          onClick={nextMes}
          aria-label="Mes siguiente"
          className="p-2 rounded-xl hover:bg-gray-100 motion-safe:transition-colors duration-150 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6BC6]/50"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" aria-hidden="true" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {DIAS_CORTOS.map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-1 select-none" aria-hidden="true">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid — 36px cells are compact but touch-operable with generous rounded area */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} aria-hidden="true" />
          const dayStr = `${vy}-${String(vm + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const isSelected = dayStr === fecha
          const isToday = dayStr === today
          return (
            <button
              key={day}
              onClick={() => selectDay(day)}
              aria-label={formatFullDate(dayStr)}
              aria-pressed={isSelected}
              className={`h-9 w-full flex items-center justify-center rounded-xl text-sm motion-safe:transition-all duration-150 cursor-pointer
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6BC6]/50
                ${isSelected
                  ? 'bg-[#0A2463] text-white font-bold shadow-sm'
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
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', keyHandler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', keyHandler)
    }
  }, [])

  return (
    <div ref={ref} className="relative">
      {/*
        Split date into two typographic levels:
        - Day of week: small, blue, uppercase — quick visual scan
        - Date: bold navy — primary information
        ChevronDown signals openable; rotates when open
      */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={`Fecha: ${formatDayOfWeek(fecha)} ${formatShortDate(fecha)}. Abrir calendario`}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="flex items-center gap-3 px-4 py-2.5 bg-white rounded-xl border border-gray-200 shadow-sm
          hover:border-[#1E6BC6]/40 hover:shadow-md
          motion-safe:transition-all duration-200 cursor-pointer min-h-[44px]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6BC6]/50"
      >
        <CalendarDays className="w-4 h-4 text-[#1E6BC6] shrink-0" aria-hidden="true" />
        <div className="flex flex-col items-start leading-none gap-0.5">
          <span className="text-[10px] font-bold text-[#1E6BC6] uppercase tracking-wider capitalize">
            {formatDayOfWeek(fecha)}
          </span>
          <span className="text-sm font-bold text-[#0A2463] capitalize">
            {formatShortDate(fecha)}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 ml-1 motion-safe:transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
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
  accentColor,
  loading = false,
}: {
  label: string
  value: number
  icon: React.ElementType
  color: string
  bgColor: string
  accentColor: string
  loading?: boolean
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden
      hover:shadow-md motion-safe:hover:-translate-y-0.5 motion-safe:transition-all duration-200">
      {/* 4px colored top accent */}
      <div className={`h-[4px] ${accentColor}`} aria-hidden="true" />
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            {/* Skeleton while loading */}
            {loading ? (
              <div className="h-10 w-14 bg-gray-100 rounded-lg motion-safe:animate-pulse mb-2" aria-hidden="true" />
            ) : (
              <p
                className={`text-4xl font-bold ${color} leading-none tabular-nums`}
                aria-label={`${value} ${label}`}
              >
                {value}
              </p>
            )}
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mt-2">{label}</p>
          </div>
          {/* Icon — top-right, 40×40, bg at 10% accent opacity */}
          <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center shrink-0`}>
            <Icon className={`w-5 h-5 ${color}`} aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Agenda skeleton ─────────────────────────────────── */
function AgendaSkeleton() {
  return (
    <div className="p-6 space-y-5" aria-hidden="true">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="w-14 h-8 bg-gray-100 rounded-lg motion-safe:animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 rounded-lg motion-safe:animate-pulse w-2/5" />
            <div className="h-3 bg-gray-50 rounded-lg motion-safe:animate-pulse w-3/5" />
          </div>
          <div className="flex gap-2 shrink-0">
            <div className="w-20 h-8 bg-gray-100 rounded-lg motion-safe:animate-pulse" />
            <div className="w-16 h-8 bg-gray-100 rounded-lg motion-safe:animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Calendar helpers (modal) ────────────────────────── */
function buildModalCalendar(refDate: Date) {
  const year = refDate.getFullYear()
  const month = refDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1
  return { year, month, daysInMonth, startOffset }
}

function modalDateStr(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function ModalCalendarPicker({
  value,
  onChange,
  fechasHabilitadas,
}: {
  value: string | null
  onChange: (d: string) => void
  fechasHabilitadas: Set<string> | null
}) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const maxDate = new Date(today)
  maxDate.setDate(maxDate.getDate() + 60)

  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const { year, month, daysInMonth, startOffset } = buildModalCalendar(viewDate)

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="select-none">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-[#0A2463]"
          aria-label="Mes anterior"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-bold text-[#0A2463] text-sm">{MESES[month]} {year}</span>
        <button
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-[#0A2463]"
          aria-label="Mes siguiente"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />
          const dateStr = modalDateStr(year, month, day)
          const date = new Date(year, month, day)
          const isSunday = date.getDay() === 0
          const isPast = date < today
          const isFuture = date > maxDate
          const noDisponible = fechasHabilitadas !== null && !fechasHabilitadas.has(dateStr)
          const disabled = isSunday || isPast || isFuture || noDisponible
          const isSelected = value === dateStr
          const isToday = dateStr === modalDateStr(today.getFullYear(), today.getMonth(), today.getDate())
          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => !disabled && onChange(dateStr)}
              className={`aspect-square rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-[#0A2463] text-white shadow-md'
                  : disabled
                  ? 'text-gray-200 cursor-not-allowed'
                  : isToday
                  ? 'bg-[#EFF6FF] text-[#1E6BC6] ring-1 ring-[#1E6BC6]/30 hover:bg-[#0A2463] hover:text-white'
                  : 'text-[#374151] hover:bg-[#0A2463] hover:text-white'
              }`}
              aria-label={`${day} de ${MESES[month]}`}
              aria-pressed={isSelected}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Coberturas ───────────────────────────────────────── */
const COBERTURAS = [
  { value: 'particular', label: 'Particular' },
  { value: 'ioma',       label: 'IOMA' },
  { value: 'pami',       label: 'PAMI' },
  { value: 'osde',       label: 'OSDE' },
  { value: 'sancor',     label: 'SANCOR' },
  { value: 'medife',     label: 'MEDIFÉ' },
  { value: 'omint',      label: 'OMINT' },
  { value: 'otra',       label: 'Otra obra social' },
]

/* ─── Modal Agregar Turno ──────────────────────────────── */
function ModalAgregarTurno({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [espId, setEspId] = useState('')
  const [espNombre, setEspNombre] = useState('')
  const [profId, setProfId] = useState('')
  const [profNombre, setProfNombre] = useState('')
  const [fecha, setFecha] = useState<string | null>(null)
  const [hora, setHora] = useState('')
  const [cobertura, setCobertura] = useState('particular')
  const [especialidades, setEspecialidades] = useState<{ id: string; nombre: string }[]>([])
  const [profesionales, setProfesionales] = useState<{ id: string; nombre: string }[]>([])
  const [fechasHabilitadas, setFechasHabilitadas] = useState<Set<string> | null>(null)
  const [slots, setSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [espOpen, setEspOpen] = useState(false)
  const [profOpen, setProfOpen] = useState(false)
  const [cobOpen, setCobOpen] = useState(false)
  const espRef = useRef<HTMLDivElement>(null)
  const profRef = useRef<HTMLDivElement>(null)
  const cobRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (espRef.current && !espRef.current.contains(e.target as Node)) setEspOpen(false)
      if (profRef.current && !profRef.current.contains(e.target as Node)) setProfOpen(false)
      if (cobRef.current && !cobRef.current.contains(e.target as Node)) setCobOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    startTransition(async () => {
      const esps = await getEspecialidadesAdmin()
      setEspecialidades(esps)
    })
  }, [])

  useEffect(() => {
    if (!espId) {
      setProfesionales([]); setProfId(''); setProfNombre('')
      setFechasHabilitadas(null); setFecha(null); setSlots([]); setHora('')
      return
    }
    startTransition(async () => {
      const profs = await getProfesionalesByEspecialidad(espId)
      setProfesionales(profs)
      setProfId(''); setProfNombre(''); setFechasHabilitadas(null); setFecha(null); setSlots([]); setHora('')
    })
  }, [espId])

  useEffect(() => {
    if (!profId) {
      setFechasHabilitadas(null); setFecha(null); setSlots([]); setHora(''); return
    }
    startTransition(async () => {
      const fechas = await getDiasDisponiblesPorProfesional(profId)
      setFechasHabilitadas(new Set(fechas))
      setFecha(null); setSlots([]); setHora('')
    })
  }, [profId])

  useEffect(() => {
    if (!profId || !fecha) { setSlots([]); setHora(''); return }
    setLoadingSlots(true)
    startTransition(async () => {
      const s = await getSlotsDisponibles(profId, fecha)
      setSlots(s)
      setHora('')
      setLoadingSlots(false)
    })
  }, [profId, fecha])

  const canSubmit =
    nombre.trim().length > 1 &&
    /^\d{6,}$/.test(telefono.replace(/\s/g, '')) &&
    !!espId && !!profId && !!fecha && !!hora

  const handleSubmit = () => {
    if (!canSubmit) { setError('Completá todos los campos requeridos.'); return }
    setError(null)
    startTransition(async () => {
      try {
        await crearTurnoManual({
          nombre: nombre.trim(),
          telefono: telefono.trim(),
          especialidadId: espId,
          profesionalId: profId,
          fecha: fecha!,
          horaInicio: hora,
          coberturaMedica: cobertura,
        })
        onSuccess()
        onClose()
      } catch (e: unknown) {
        setError((e as Error).message ?? 'Error al crear el turno.')
      }
    })
  }

  const lbl = 'block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5'
  const inp = 'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-[#0A2463] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1E6BC6]/25 focus:border-[#1E6BC6] transition-all bg-white'
  const dropBtn = (open: boolean, disabled?: boolean) =>
    `w-full flex items-center justify-between gap-3 px-4 py-3 bg-white border rounded-xl text-left transition-all duration-200 cursor-pointer min-h-[44px] ${
      disabled ? 'opacity-50 cursor-not-allowed' :
      open ? 'border-[#1E6BC6] shadow-md ring-2 ring-[#1E6BC6]/15' :
      'border-gray-200 shadow-sm hover:border-gray-300'
    }`
  const dropList = 'absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden'
  const dropItem = (sel: boolean) =>
    `flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer select-none transition-colors duration-100 min-h-[40px] ${
      sel ? 'bg-[#EFF6FF] text-[#1E6BC6] font-semibold' : 'text-[#374151] hover:bg-[#F0F7FF] hover:text-[#1E6BC6]'
    }`
  const checkMark = (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-label="Nuevo turno manual"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-[#0A2463]">Nuevo turno</h2>
            <p className="text-xs text-gray-400 mt-0.5">Completá los datos para agregar un turno manual</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6BC6]/50"
          >
            <X className="w-4 h-4 text-gray-400" aria-hidden="true" />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Especialidad */}
          <div>
            <label className={lbl}>Especialidad *</label>
            <div ref={espRef} className="relative">
              <button type="button" onClick={() => { setEspOpen(v => !v); setProfOpen(false); setCobOpen(false) }} className={dropBtn(espOpen)}>
                <span className={`text-sm font-semibold ${espNombre ? 'text-[#0A2463]' : 'text-gray-300'}`}>
                  {espNombre || 'Seleccioná una especialidad'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${espOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {espOpen && (
                <div className={dropList}>
                  <ul role="listbox" className="max-h-52 overflow-y-auto divide-y divide-gray-50 py-1">
                    {especialidades.map((e) => (
                      <li key={e.id} role="option" aria-selected={espId === e.id}
                        onClick={() => { setEspId(e.id); setEspNombre(e.nombre); setEspOpen(false) }}
                        className={dropItem(espId === e.id)}
                      >
                        {espId === e.id ? checkMark : <span className="w-3.5 shrink-0" />}
                        {e.nombre}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Profesional */}
          <div>
            <label className={lbl}>Profesional *</label>
            <div ref={profRef} className="relative">
              <button type="button" onClick={() => { if (!espId) return; setProfOpen(v => !v); setEspOpen(false); setCobOpen(false) }}
                className={dropBtn(profOpen, !espId)}>
                <span className={`text-sm font-semibold ${profNombre ? 'text-[#0A2463]' : 'text-gray-300'}`}>
                  {profNombre || (espId ? 'Seleccioná un profesional' : 'Primero elegí una especialidad')}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${profOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {profOpen && espId && (
                <div className={dropList}>
                  <ul role="listbox" className="max-h-52 overflow-y-auto divide-y divide-gray-50 py-1">
                    {profesionales.map((p) => (
                      <li key={p.id} role="option" aria-selected={profId === p.id}
                        onClick={() => { setProfId(p.id); setProfNombre(p.nombre); setProfOpen(false) }}
                        className={dropItem(profId === p.id)}
                      >
                        {profId === p.id ? checkMark : <span className="w-3.5 shrink-0" />}
                        {p.nombre}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Fecha — calendar custom */}
          <div>
            <label className={lbl}>Fecha *</label>
            {!profId ? (
              <p className="text-sm text-gray-400 py-4 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                Seleccioná un profesional primero
              </p>
            ) : isPending && !fechasHabilitadas ? (
              <div className="py-8 flex justify-center">
                <svg className="w-5 h-5 motion-safe:animate-spin text-[#1E6BC6]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl p-4">
                <ModalCalendarPicker value={fecha} onChange={setFecha} fechasHabilitadas={fechasHabilitadas} />
              </div>
            )}
          </div>

          {/* Horario — grid de botones */}
          {fecha && (
            <div>
              <label className={lbl}>Horario *</label>
              {loadingSlots || isPending ? (
                <div className="flex items-center gap-2 py-3 text-[#1E6BC6]">
                  <svg className="w-4 h-4 motion-safe:animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-sm font-semibold">Buscando disponibilidad...</span>
                </div>
              ) : slots.length === 0 ? (
                <p className="text-sm text-gray-400 py-4 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No hay turnos disponibles para este día
                </p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {slots.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setHora(s)}
                      className={`py-2.5 px-2 rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer min-h-[44px] ${
                        hora === s
                          ? 'bg-[#0A2463] text-white shadow-md'
                          : 'bg-[#F4F6F9] text-[#374151] hover:bg-[#EFF6FF] hover:text-[#1E6BC6]'
                      }`}
                      aria-pressed={hora === s}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Datos del paciente */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <div>
              <label className={lbl}>Nombre completo *</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: María González" className={inp} />
            </div>
            <div>
              <label className={lbl}>Teléfono *</label>
              <input type="tel" value={telefono}
                onChange={(e) => setTelefono(e.target.value.replace(/[^\d\s+()-]/g, ''))}
                placeholder="Ej: 1122355689" className={inp} />
            </div>

            {/* Cobertura */}
            <div>
              <label className={lbl}>Cobertura médica</label>
              <div ref={cobRef} className="relative">
                <button type="button" onClick={() => { setCobOpen(v => !v); setEspOpen(false); setProfOpen(false) }} className={dropBtn(cobOpen)}>
                  <span className="text-sm font-semibold text-[#0A2463]">
                    {COBERTURAS.find(c => c.value === cobertura)?.label ?? 'Particular'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${cobOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
                {cobOpen && (
                  <div className={dropList}>
                    <ul role="listbox" className="max-h-52 overflow-y-auto divide-y divide-gray-50 py-1">
                      {COBERTURAS.map((c) => (
                        <li key={c.value} role="option" aria-selected={cobertura === c.value}
                          onClick={() => { setCobertura(c.value); setCobOpen(false) }}
                          className={dropItem(cobertura === c.value)}
                        >
                          {cobertura === c.value ? checkMark : <span className="w-3.5 shrink-0" />}
                          {c.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 font-semibold bg-red-50 border border-red-100 rounded-xl px-4 py-3" role="alert">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:border-gray-300 hover:text-gray-800 transition-all duration-150 cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || isPending}
            className="flex-1 py-3 bg-[#0A2463] text-white font-bold rounded-xl hover:bg-[#1756b8] transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6BC6]/50"
          >
            {isPending ? 'Guardando...' : 'Guardar turno'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Main Page ────────────────────────────────────────── */
export default function AdminPage() {
  const router = useRouter()
  const shouldReduce = useReducedMotion()
  const [fecha, setFecha] = useState(toDateStr(new Date()))
  const [turnos, setTurnos] = useState<TurnoCompleto[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [userEmail, setUserEmail] = useState<string | undefined>()
  const [turnosMes, setTurnosMes] = useState(0)
  const [totalPacientes, setTotalPacientes] = useState(0)
  // Separate loading flag so month/patient stats don't show "0" while fetching
  const [statsLoading, setStatsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? undefined)
    })
    Promise.all([getTurnosEsteMes(), getTotalPacientes()]).then(([mes, pacs]) => {
      setTurnosMes(mes)
      setTotalPacientes(pacs)
      setStatsLoading(false)
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
    <div className="flex min-h-screen bg-[#F4F6F9]">
      <AdminSidebar userEmail={userEmail} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col overflow-x-hidden" style={{ marginLeft: '16rem' }}>
        {/* Page Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <h1 className="text-xl font-bold text-[#0A2463] text-balance">Agenda</h1>
          <span className="text-sm text-gray-400 capitalize hidden sm:block">{currentDate}</span>
        </header>

        <main className="flex-1 p-8">
          {/* Date Selector */}
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            <button
              onClick={() => setFecha((prev) => addDays(prev, -1))}
              aria-label="Día anterior"
              className="p-2.5 rounded-xl bg-white border border-gray-200 shadow-sm
                hover:border-gray-300 hover:shadow-md
                motion-safe:transition-all duration-150 cursor-pointer
                min-h-[44px] min-w-[44px] flex items-center justify-center
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6BC6]/50"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" aria-hidden="true" />
            </button>

            <DatePicker fecha={fecha} onChange={setFecha} />

            <button
              onClick={() => setFecha((prev) => addDays(prev, 1))}
              aria-label="Día siguiente"
              className="p-2.5 rounded-xl bg-white border border-gray-200 shadow-sm
                hover:border-gray-300 hover:shadow-md
                motion-safe:transition-all duration-150 cursor-pointer
                min-h-[44px] min-w-[44px] flex items-center justify-center
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6BC6]/50"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" aria-hidden="true" />
            </button>

            {fecha !== today && (
              <button
                onClick={() => setFecha(today)}
                className="text-xs text-[#1E6BC6] font-bold hover:underline cursor-pointer
                  px-3 py-2 rounded-xl hover:bg-[#1E6BC6]/5
                  motion-safe:transition-colors duration-150 min-h-[44px]
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6BC6]/50"
              >
                Hoy
              </button>
            )}
          </div>

          {/* Stats Grid — 3 cols desktop, 2 cols tablet */}
          {(() => {
            const cards = [
              { label: 'Total del día',   value: total,          icon: Calendar,    color: 'text-[#0A2463]',  bgColor: 'bg-[#0A2463]/10',   accentColor: 'bg-[#0A2463]',   loading },
              { label: 'Confirmados',     value: confirmados,    icon: CheckCircle, color: 'text-emerald-600', bgColor: 'bg-emerald-500/10', accentColor: 'bg-emerald-500', loading },
              { label: 'Ausentes',        value: ausentes,       icon: UserX,       color: 'text-amber-600',  bgColor: 'bg-amber-400/10',   accentColor: 'bg-amber-400',   loading },
              { label: 'Cancelados',      value: cancelados,     icon: XCircle,     color: 'text-red-600',    bgColor: 'bg-red-400/10',     accentColor: 'bg-red-400',     loading },
              { label: 'Turnos este mes', value: turnosMes,      icon: BarChart3,   color: 'text-violet-600', bgColor: 'bg-violet-500/10',  accentColor: 'bg-violet-500',  loading: statsLoading },
              { label: 'Total pacientes', value: totalPacientes, icon: Users,       color: 'text-teal-600',   bgColor: 'bg-teal-500/10',    accentColor: 'bg-teal-500',    loading: statsLoading },
            ]
            return (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {cards.map((card, i) => (
                  <motion.div
                    key={card.label}
                    initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3, ease: 'easeOut' }}
                  >
                    <StatCard {...card} />
                  </motion.div>
                ))}
              </div>
            )
          })()}

          {/* Agenda del día */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-[#0A2463]">Agenda del día</h2>
                {!loading && (
                  <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full tabular-nums">
                    {total} {total === 1 ? 'turno' : 'turnos'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-[#0A2463] text-white hover:bg-[#1756b8] motion-safe:transition-colors duration-150 cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6BC6]/50"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  Agregar turno
                </button>
                {(loading || isPending) && (
                  <svg
                    className="w-4 h-4 motion-safe:animate-spin text-[#1E6BC6]"
                    fill="none" viewBox="0 0 24 24"
                    aria-label="Actualizando"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
              </div>
            </div>

            {/*
              aria-live="polite" notifies screen readers when the list updates
              (date change, status change) without interrupting current reading
            */}
            <div aria-live="polite" aria-label="Turnos del día">
              {loading ? (
                <AgendaSkeleton />
              ) : turnos.length === 0 ? (
                <div className="py-16 text-center px-6">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-7 h-7 text-gray-300" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-bold text-gray-700">No hay turnos para este día</p>
                  <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                    No se registraron turnos para esta fecha.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {turnos.map((turno, idx) => (
                    <motion.div
                      key={turno.id}
                      initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.25, ease: 'easeOut' }}
                      className="relative"
                    >
                      {/* Left stripe: instant visual reading of status without badge */}
                      <div
                        className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r ${ESTADO_CONFIG[turno.estado].stripe}`}
                        aria-hidden="true"
                      />

                      <div
                        className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4
                          hover:bg-gray-50/80 motion-safe:transition-colors duration-150
                          ${turno.estado === 'cancelado' || turno.estado === 'ausente' ? 'opacity-55' : ''}`}
                      >
                        {/* Hora pill — monospace, pill shape, min-w */}
                        <div className="shrink-0">
                          <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-[#0A2463] text-white font-mono text-sm font-bold leading-none min-w-[4rem]">
                            {turno.hora_inicio.substring(0, 5)}
                          </span>
                        </div>

                        {/* Patient info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-base font-semibold text-slate-800">{turno.paciente_nombre}</span>
                            <EstadoBadge estado={turno.estado} />
                          </div>
                          <div className="flex items-center gap-2 flex-wrap text-sm text-slate-400">
                            <span>{turno.especialidades?.nombre ?? '—'}</span>
                            <span aria-hidden="true">·</span>
                            <span>{turno.profesionales?.nombre ?? '—'}</span>
                            <span aria-hidden="true">·</span>
                            <a
                              href={`tel:${turno.paciente_telefono}`}
                              className="flex items-center gap-1 hover:text-[#1E6BC6] motion-safe:transition-colors duration-150
                                focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1E6BC6]/50 rounded"
                            >
                              <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                              {turno.paciente_telefono}
                            </a>
                          </div>
                        </div>

                        {/* Action buttons — compact outline, hover fills color */}
                        {turno.estado === 'confirmado' && (
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => cambiarEstado(turno.id, 'completado')}
                              disabled={isPending}
                              className="text-xs font-bold px-3 py-2 rounded-xl border-2 border-emerald-500 text-emerald-600
                                hover:bg-emerald-500 hover:text-white
                                motion-safe:transition-all duration-150 cursor-pointer disabled:opacity-50
                                min-h-[44px]
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
                            >
                              Completado
                            </button>
                            <button
                              onClick={() => cambiarEstado(turno.id, 'ausente')}
                              disabled={isPending}
                              className="text-xs font-bold px-3 py-2 rounded-xl border-2 border-amber-400 text-amber-600
                                hover:bg-amber-400 hover:text-white
                                motion-safe:transition-all duration-150 cursor-pointer disabled:opacity-50
                                min-h-[44px]
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
                            >
                              Ausente
                            </button>
                            <button
                              onClick={() => cambiarEstado(turno.id, 'cancelado')}
                              disabled={isPending}
                              className="text-xs font-bold px-3 py-2 rounded-xl border-2 border-red-400 text-red-600
                                hover:bg-red-400 hover:text-white
                                motion-safe:transition-all duration-150 cursor-pointer disabled:opacity-50
                                min-h-[44px]
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
                            >
                              Cancelar
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {showModal && (
        <ModalAgregarTurno
          onClose={() => setShowModal(false)}
          onSuccess={() => fetchTurnos(fecha)}
        />
      )}
    </div>
  )
}
