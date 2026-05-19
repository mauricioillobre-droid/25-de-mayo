'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import {
  EspecialidadDB,
  SlotConProfesional,
  getSlotsParaEspecialidad,
  getDiasDisponibles,
  crearTurno,
} from '@/app/actions/turnos'

/* ─── Types ─────────────────────────────────────────── */
type Paso = 1 | 2 | 3 | 4 | 5

/* ─── Helpers ────────────────────────────────────────── */
function formatFecha(fechaStr: string): string {
  const [y, m, d] = fechaStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function buildCalendar(refDate: Date) {
  const year = refDate.getFullYear()
  const month = refDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1
  return { year, month, daysInMonth, startOffset }
}

function toDateStr(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

/* ─── Icons ──────────────────────────────────────────── */
const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)
const ChevronIcon = ({ open }: { open: boolean }) => (
  <motion.svg
    animate={{ rotate: open ? 180 : 0 }}
    transition={{ duration: 0.2, ease: 'easeInOut' }}
    className="w-5 h-5 shrink-0 text-[#9CA3AF]"
    fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </motion.svg>
)

/* ─── Stepper ────────────────────────────────────────── */
const STEPS = ['Especialidad', 'Fecha', 'Horario', 'Tus datos', 'Confirmación']

function Stepper({ paso }: { paso: Paso }) {
  return (
    <div className="flex items-center justify-center mb-8 gap-0">
      {STEPS.map((label, i) => {
        const num = (i + 1) as Paso
        const done = num < paso
        const active = num === paso
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  done
                    ? 'bg-[#0A2463] text-white'
                    : active
                    ? 'bg-[#0A2463] text-white ring-4 ring-[#0A2463]/20'
                    : 'bg-gray-100 text-[#9CA3AF]'
                }`}
              >
                {done ? <CheckIcon /> : num}
              </div>
              <span
                className={`text-[10px] font-semibold tracking-wide hidden sm:block ${
                  active ? 'text-[#0A2463]' : done ? 'text-[#0A2463]/60' : 'text-[#9CA3AF]'
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 sm:w-12 h-0.5 mx-1 mb-4 transition-colors duration-300 ${
                  done ? 'bg-[#0A2463]' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Calendar ───────────────────────────────────────── */
function CalendarPicker({
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
  const { year, month, daysInMonth, startOffset } = buildCalendar(viewDate)

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="select-none">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-[#0A2463]"
          aria-label="Mes anterior"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-bold text-[#0A2463] text-base">
          {MESES[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-[#0A2463]"
          aria-label="Mes siguiente"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DIAS.map((d) => (
          <div key={d} className="text-center text-[11px] font-bold text-[#9CA3AF] py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />

          const dateStr = toDateStr(year, month, day)
          const date = new Date(year, month, day)
          const isSunday = date.getDay() === 0
          const isPast = date < today
          const isFuture = date > maxDate
          const noDisponible = fechasHabilitadas !== null && !fechasHabilitadas.has(dateStr)
          const disabled = isSunday || isPast || isFuture || noDisponible
          const isSelected = value === dateStr
          const isToday = dateStr === toDateStr(today.getFullYear(), today.getMonth(), today.getDate())

          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => !disabled && onChange(dateStr)}
              className={`
                aspect-square rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer
                ${isSelected
                  ? 'bg-[#0A2463] text-white shadow-md'
                  : disabled
                  ? 'text-gray-200 cursor-not-allowed'
                  : isToday
                  ? 'bg-[#EFF6FF] text-[#1E6BC6] ring-1 ring-[#1E6BC6]/30 hover:bg-[#0A2463] hover:text-white'
                  : 'text-[#374151] hover:bg-[#0A2463] hover:text-white'
                }
              `}
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

/* ─── Coberturas ─────────────────────────────────────── */
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

/* ─── Main Wizard ────────────────────────────────────── */
export default function TurnoWizard({ especialidades }: { especialidades: EspecialidadDB[] }) {
  const shouldReduce = useReducedMotion()
  const spring = { type: 'spring' as const, stiffness: 68, damping: 18 }
  const [isPending, startTransition] = useTransition()

  /* State */
  const [paso, setPaso] = useState<Paso>(1)
  const [especialidadId, setEspecialidadId] = useState<string | null>(null)
  const [especialidadNombre, setEspecialidadNombre] = useState<string | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [fecha, setFecha] = useState<string | null>(null)
  const [slots, setSlots] = useState<SlotConProfesional[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [slotSeleccionado, setSlotSeleccionado] = useState<SlotConProfesional | null>(null)
  const [fechasHabilitadas, setFechasHabilitadas] = useState<Set<string> | null>(null)
  const [tieneFreqEspecial, setTieneFreqEspecial] = useState(false)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [cobertura, setCobertura] = useState('particular')
  const [turnoId, setTurnoId] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const dropdownRef = useRef<HTMLDivElement>(null)

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* Load available dates when specialty changes */
  useEffect(() => {
    if (!especialidadId) return
    setFechasHabilitadas(null)
    setTieneFreqEspecial(false)
    startTransition(async () => {
      const { fechas, tieneFreqEspecial: freq } = await getDiasDisponibles(especialidadId)
      setFechasHabilitadas(new Set(fechas))
      setTieneFreqEspecial(freq)
    })
  }, [especialidadId])

  /* Load slots when fecha changes */
  useEffect(() => {
    if (!especialidadId || !fecha) return
    setLoadingSlots(true)
    setSlots([])
    setSlotSeleccionado(null)

    startTransition(async () => {
      const result = await getSlotsParaEspecialidad(especialidadId, fecha)
      setSlots(result)
      setLoadingSlots(false)
    })
  }, [especialidadId, fecha])

  /* Navigation */
  const canContinue = (): boolean => {
    if (paso === 1) return !!especialidadId
    if (paso === 2) return !!fecha
    if (paso === 3) return !!slotSeleccionado
    if (paso === 4) return nombre.trim().length > 1 && /^\d{6,}$/.test(telefono.replace(/\s/g, ''))
    return false
  }

  const handleContinue = () => {
    if (paso === 2 && fecha) setPaso(3)
    else if (paso < 4) setPaso((p) => (p + 1) as Paso)
  }

  const handleConfirmar = async () => {
    if (!especialidadId || !fecha || !slotSeleccionado) return
    setSubmitError(null)
    startTransition(async () => {
      try {
        const turno = await crearTurno({
          profesionalId: slotSeleccionado.profesionalId,
          especialidadId,
          fecha,
          horaInicio: slotSeleccionado.hora,
          pacienteNombre: nombre.trim(),
          pacienteTelefono: telefono.trim(),
          coberturaMedica: cobertura,
        })
        setTurnoId(turno.id)
        setPaso(5)
      } catch {
        setSubmitError('No se pudo crear el turno. Intente nuevamente.')
      }
    })
  }

  const animProps = shouldReduce
    ? {}
    : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 } }
  const animTransition = { ...spring, duration: 0.35 }

  return (
    <div>
      {paso < 5 && <Stepper paso={paso} />}

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <AnimatePresence mode="wait">

          {/* PASO 1 — Especialidad */}
          {paso === 1 && (
            <motion.div key="p1" {...animProps} transition={animTransition} className="p-6 md:p-8">
              <p className="text-[11px] font-bold text-[#1E6BC6] uppercase tracking-widest mb-1">
                PASO 1
              </p>
              <h2 className="text-xl font-black text-[#0A2463] mb-6">
                ¿Qué especialidad necesitás?
              </h2>

              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                  className={`w-full flex items-center justify-between gap-3 px-5 py-4 bg-white border rounded-xl text-left transition-all duration-200 cursor-pointer min-h-[52px] ${
                    dropdownOpen
                      ? 'border-[#1E6BC6] shadow-md shadow-[#1E6BC6]/10 ring-[3px] ring-[#1E6BC6]/12'
                      : 'border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300'
                  } focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#1E6BC6]/30`}
                >
                  <span className={`text-[15px] font-semibold ${especialidadNombre ? 'text-[#0A2463]' : 'text-[#9CA3AF]'}`}>
                    {especialidadNombre ?? 'Seleccioná una especialidad'}
                  </span>
                  <ChevronIcon open={dropdownOpen} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={shouldReduce ? {} : { opacity: 0, y: -8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={shouldReduce ? {} : { opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
                    >
                      <ul role="listbox" className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                        {especialidades.map((esp) => {
                          const sel = especialidadId === esp.id
                          return (
                            <li
                              key={esp.id}
                              role="option"
                              aria-selected={sel}
                              onClick={() => {
                                setEspecialidadId(esp.id)
                                setEspecialidadNombre(esp.nombre)
                                setDropdownOpen(false)
                              }}
                              className={`flex items-center gap-3 px-5 min-h-[44px] py-2.5 text-[15px] cursor-pointer select-none transition-colors duration-150 ${
                                sel
                                  ? 'bg-[#EFF6FF] text-[#1E6BC6] font-semibold'
                                  : 'text-[#374151] hover:bg-[#F0F7FF] hover:text-[#1E6BC6]'
                              }`}
                            >
                              {sel ? (
                                <svg className="w-4 h-4 text-[#1E6BC6] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <span className="w-4 shrink-0" />
                              )}
                              {esp.nombre}
                            </li>
                          )
                        })}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* PASO 2 — Fecha */}
          {paso === 2 && (
            <motion.div key="p2" {...animProps} transition={animTransition} className="p-6 md:p-8">
              <p className="text-[11px] font-bold text-[#1E6BC6] uppercase tracking-widest mb-1">PASO 2</p>
              <h2 className="text-xl font-black text-[#0A2463] mb-6">Elegí una fecha</h2>
              <CalendarPicker value={fecha} onChange={setFecha} fechasHabilitadas={fechasHabilitadas} />
              {tieneFreqEspecial && (
                <p className="mt-4 text-xs text-[#6B7280] bg-[#F4F6F9] rounded-xl px-4 py-3 leading-relaxed">
                  Esta especialidad tiene turnos disponibles en fechas específicas. Los días habilitados están marcados en el calendario.
                </p>
              )}
              {fecha && (
                <p className="mt-4 text-sm font-semibold text-[#1E6BC6] capitalize">
                  Seleccionaste: {formatFecha(fecha)}
                </p>
              )}
            </motion.div>
          )}

          {/* PASO 3 — Horario */}
          {paso === 3 && (
            <motion.div key="p3" {...animProps} transition={animTransition} className="p-6 md:p-8">
              <p className="text-[11px] font-bold text-[#1E6BC6] uppercase tracking-widest mb-1">PASO 3</p>
              <h2 className="text-xl font-black text-[#0A2463] mb-2">Elegí un horario</h2>
              <p className="text-sm text-[#6B7280] mb-6 capitalize">{fecha ? formatFecha(fecha) : ''}</p>

              {loadingSlots || isPending ? (
                <div className="flex items-center justify-center py-12 gap-3 text-[#1E6BC6]">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-sm font-semibold">Buscando disponibilidad...</span>
                </div>
              ) : slots.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 rounded-2xl bg-[#F4F6F9] flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                    </svg>
                  </div>
                  <p className="text-[#374151] font-semibold mb-1">No hay turnos disponibles</p>
                  <p className="text-sm text-[#6B7280] max-w-[30ch] mx-auto">
                    No hay turnos para este día. Probá con otra fecha.
                  </p>
                  <button
                    onClick={() => setPaso(2)}
                    className="mt-5 text-[#1E6BC6] text-sm font-semibold hover:underline cursor-pointer"
                  >
                    ← Cambiar fecha
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map((slot) => {
                    const sel = slotSeleccionado?.hora === slot.hora
                    return (
                      <button
                        key={slot.hora}
                        onClick={() => setSlotSeleccionado(slot)}
                        className={`py-3 px-2 rounded-xl text-sm font-bold transition-all duration-150 cursor-pointer min-h-[44px] ${
                          sel
                            ? 'bg-[#0A2463] text-white shadow-md'
                            : 'bg-[#F4F6F9] text-[#374151] hover:bg-[#EFF6FF] hover:text-[#1E6BC6]'
                        }`}
                        aria-pressed={sel}
                      >
                        {slot.hora}
                      </button>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* PASO 4 — Datos del paciente */}
          {paso === 4 && (
            <motion.div key="p4" {...animProps} transition={animTransition} className="p-6 md:p-8">
              <p className="text-[11px] font-bold text-[#1E6BC6] uppercase tracking-widest mb-1">PASO 4</p>
              <h2 className="text-xl font-black text-[#0A2463] mb-6">Tus datos</h2>

              {/* Resumen */}
              <div className="bg-[#F4F6F9] rounded-xl p-4 mb-6 space-y-1">
                <p className="text-xs text-[#6B7280] font-semibold uppercase tracking-wide">Resumen</p>
                <p className="text-sm font-semibold text-[#0A2463]">{especialidadNombre}</p>
                <p className="text-sm text-[#374151] capitalize">{fecha ? formatFecha(fecha) : ''} · {slotSeleccionado?.hora} hs</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="nombre" className="block text-xs font-bold text-[#374151] uppercase tracking-wide mb-2">
                    Nombre completo
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: María González"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[15px] text-[#0A2463] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1E6BC6]/30 focus:border-[#1E6BC6] transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="telefono" className="block text-xs font-bold text-[#374151] uppercase tracking-wide mb-2">
                    Teléfono
                  </label>
                  <input
                    id="telefono"
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value.replace(/[^\d\s+()-]/g, ''))}
                    placeholder="Ej: 1122355689"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[15px] text-[#0A2463] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1E6BC6]/30 focus:border-[#1E6BC6] transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="cobertura" className="block text-xs font-bold text-[#374151] uppercase tracking-wide mb-2">
                    Cobertura médica
                  </label>
                  <select
                    id="cobertura"
                    value={cobertura}
                    onChange={(e) => setCobertura(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-[15px] text-[#0A2463] focus:outline-none focus:ring-2 focus:ring-[#1E6BC6]/30 focus:border-[#1E6BC6] transition-all bg-white cursor-pointer"
                  >
                    {COBERTURAS.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {submitError && (
                <p className="mt-4 text-sm text-red-600 font-semibold" role="alert">
                  {submitError}
                </p>
              )}
            </motion.div>
          )}

          {/* PASO 5 — Confirmación */}
          {paso === 5 && (
            <motion.div key="p5" {...animProps} transition={animTransition} className="p-6 md:p-8 text-center">
              {/* Success icon */}
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h2 className="text-2xl font-black text-[#0A2463] mb-2">¡Turno confirmado!</h2>
              <p className="text-[#6B7280] text-sm mb-8">
                Te esperamos. Recordá llegar con 10 minutos de anticipación.
              </p>

              {/* Summary card */}
              <div
                className="rounded-2xl p-6 mb-8 text-left"
                style={{ background: 'linear-gradient(135deg, #0A2463 0%, #1756b8 100%)' }}
              >
                <p className="text-[#56B4E9] text-[10px] font-bold uppercase tracking-widest mb-4">
                  DETALLE DEL TURNO
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70 text-sm">Especialidad</span>
                    <span className="text-white font-semibold text-sm">{especialidadNombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70 text-sm">Fecha</span>
                    <span className="text-white font-semibold text-sm capitalize">
                      {fecha ? formatFecha(fecha) : ''}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70 text-sm">Horario</span>
                    <span className="text-white font-semibold text-sm">{slotSeleccionado?.hora} hs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70 text-sm">Paciente</span>
                    <span className="text-white font-semibold text-sm">{nombre}</span>
                  </div>
                  <div className="h-px bg-white/20 my-2" />
                  <div className="flex justify-between">
                    <span className="text-white/70 text-sm">N° de turno</span>
                    <span className="text-[#56B4E9] font-black text-sm tracking-wider">
                      #{turnoId?.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-[#0A2463] hover:bg-[#1756b8] active:scale-[0.98] text-white font-bold px-8 py-3.5 rounded-full transition-all duration-200 text-[15px] min-h-[44px] cursor-pointer"
              >
                Volver al inicio
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer con botones de navegación */}
        {paso < 5 && (
          <div className="px-6 md:px-8 pb-6 md:pb-8 flex items-center justify-between gap-3 border-t border-gray-100 pt-5">
            {paso > 1 ? (
              <button
                onClick={() => setPaso((p) => (p - 1) as Paso)}
                className="text-sm font-semibold text-[#6B7280] hover:text-[#0A2463] transition-colors cursor-pointer min-h-[44px] px-4"
              >
                ← Atrás
              </button>
            ) : (
              <div />
            )}

            {paso === 4 ? (
              <button
                onClick={handleConfirmar}
                disabled={!canContinue() || isPending}
                className="flex items-center gap-2 bg-[#0A2463] hover:bg-[#1756b8] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] text-white font-bold px-8 py-3 rounded-full transition-all duration-200 text-[15px] min-h-[44px] cursor-pointer"
              >
                {isPending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Confirmando...
                  </>
                ) : (
                  'Confirmar turno'
                )}
              </button>
            ) : (
              <button
                onClick={() => {
                  if (paso === 1 && canContinue()) setPaso(2)
                  else if (paso === 2 && canContinue()) {
                    setPaso(3)
                  } else if (canContinue()) handleContinue()
                }}
                disabled={!canContinue()}
                className="bg-[#0A2463] hover:bg-[#1756b8] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] text-white font-bold px-8 py-3 rounded-full transition-all duration-200 text-[15px] min-h-[44px] cursor-pointer"
              >
                Continuar →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
