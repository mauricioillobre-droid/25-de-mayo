'use client'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Calendar } from 'lucide-react'
import PageHero from '@/components/PageHero'
import AnimateIn from '@/components/AnimateIn'
import { especialidades } from '@/lib/data'

const WA_BASE = 'https://wa.me/5491122355689'

function waEsp(name: string) {
  return `${WA_BASE}?text=${encodeURIComponent(`Hola, quiero sacar un turno de ${name}`)}`
}

/* ─── Icons ─────────────────────────────────────────── */
const WhatsAppIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

const CalendarIcon = () => (
  <svg className="w-10 h-10 text-[#1E6BC6]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.3} aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="3" />
    <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
  </svg>
)

const ChevronIcon = ({ open }: { open: boolean }) => (
  <motion.svg
    animate={{ rotate: open ? 180 : 0 }}
    transition={{ duration: 0.22, ease: 'easeInOut' }}
    className={`w-5 h-5 shrink-0 transition-colors duration-200 ${open ? 'text-[#1E6BC6]' : 'text-[#9CA3AF]'}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </motion.svg>
)

/* ─── Stats ──────────────────────────────────────────── */
const stats = [
  { value: '35+', label: 'especialidades' },
  { value: '2020', label: 'desde' },
  { value: '24hs', label: 'sacá tu turno' },
]

/* ─── Page ───────────────────────────────────────────── */
export default function EspecialidadesPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const shouldReduce = useReducedMotion()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const spring = { type: 'spring' as const, stiffness: 68, damping: 18 }

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close dropdown on Escape key (a11y)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const handleSelect = (name: string) => {
    setSelected(name)
    setIsOpen(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <PageHero
        eyebrow="MÁS DE 35 ESPECIALIDADES"
        title="Atención especializada cerca de vos"
        subtitle="Profesionales de experiencia, turnos por WhatsApp y sin esperas innecesarias."
        backgroundImage="/images/consultorio.jpeg"
      />

      {/* ── Main two-column section ── */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/*
          items-start es requerido para que position:sticky funcione
          correctamente en la columna izquierda (UX guideline: Sticky Navigation)
        */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-20 items-start">

          {/* ── LEFT: sticky image only ── */}
          <AnimateIn direction="left" className="lg:sticky lg:top-28 lg:self-start mb-14 lg:mb-0">
            {/*
              ring-1 ring-black/5: micro-borde premium que separa la imagen
              del fondo blanco sin agregar peso visual (best practice de shadow)
            */}
            <div className="relative h-56 lg:h-[520px] w-full rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5">
              <Image
                src="/images/consultorio.jpeg"
                alt="Consultorio de 25 de Mayo Consultorios Médicos"
                fill
                className="object-cover"
                priority
              />
              {/* Bottom gradient for visual depth — subtle, doesn't obscure the photo */}
              <div
                className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(10,36,99,0.18), transparent)' }}
              />
            </div>
          </AnimateIn>

          {/* ── RIGHT: text + selector ── */}
          <AnimateIn direction="right" className="space-y-0">

            {/* Eyebrow */}
            <span className="inline-block text-[#1E6BC6] text-xs font-bold uppercase tracking-widest mb-4">
              ESPECIALIDADES MÉDICAS
            </span>

            {/*
              h1 semántico correcto (a11y guideline: Heading Hierarchy).
              text-wrap: balance para evitar huérfanas.
            */}
            <h1
              className="text-2xl md:text-3xl lg:text-[2.15rem] font-black text-[#0A2463] leading-tight mb-4"
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              Profesionales especializados en cada área de la salud
            </h1>

            {/*
              leading-relaxed → 1.625 (UX: Line Height guideline).
              text-[#4B5563] → ratio ~5.9:1 sobre blanco (supera WCAG AA 4.5:1).
              max-w-[52ch] → ~65-75 chars por línea (UX: Line Length guideline).
            */}
            <p
              className="text-[#4B5563] text-base leading-relaxed max-w-[52ch] mb-6"
              style={{ textWrap: 'pretty' } as React.CSSProperties}
            >
              Profesionales con experiencia y formación en cada área de la medicina.
              Encontrá la especialidad que necesitás y coordiná tu consulta de forma simple.
            </p>

            {/* Stats row — separados con border-l para elegancia */}
            <div className="flex gap-0 mb-8 border border-gray-100 rounded-2xl overflow-hidden">
              {stats.map((s, i) => (
                <div
                  key={s.value}
                  className={`flex-1 px-4 py-5 text-center ${i > 0 ? 'border-l border-gray-100' : ''}`}
                >
                  <p className="text-2xl font-black text-[#0A2463] leading-none tabular-nums">{s.value}</p>
                  <p className="text-[11px] text-[#9CA3AF] font-semibold mt-1.5 uppercase tracking-wide leading-tight">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Separador */}
            <div className="border-b border-gray-100 mb-8" />

            {/* Label */}
            <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">
              SELECCIONÁ TU ESPECIALIDAD
            </p>

            {/* ── Custom dropdown ── */}
            <div ref={dropdownRef} className="relative mb-6">

              {/* Trigger button */}
              <button
                onClick={() => setIsOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label="Seleccionar especialidad médica"
                className={`w-full flex items-center justify-between gap-3 px-5 py-4 bg-white border rounded-xl text-left transition-all duration-200 cursor-pointer min-h-[52px] ${
                  isOpen
                    ? 'border-[#1E6BC6] shadow-md shadow-[#1E6BC6]/10 ring-[3px] ring-[#1E6BC6]/12'
                    : 'border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300'
                } focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#1E6BC6]/30`}
              >
                <span
                  className={`text-[15px] font-semibold leading-snug select-none ${
                    selected ? 'text-[#0A2463]' : 'text-[#9CA3AF]'
                  }`}
                >
                  {selected ?? 'Seleccioná una especialidad'}
                </span>
                <ChevronIcon open={isOpen} />
              </button>

              {/* Dropdown list */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={shouldReduce ? {} : { opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={shouldReduce ? {} : { opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
                  >
                    <ul
                      role="listbox"
                      aria-label="Lista de especialidades"
                      className="max-h-72 overflow-y-auto divide-y divide-gray-50"
                    >
                      {especialidades.map((esp) => {
                        const isSel = selected === esp.name
                        return (
                          <li
                            key={esp.name}
                            role="option"
                            aria-selected={isSel}
                            onClick={() => handleSelect(esp.name)}
                            /*
                              min-h-[44px]: touch target mínimo requerido por UX guideline.
                              cursor-pointer: siempre en elementos clickeables (UX guideline).
                            */
                            className={`flex items-center gap-3 px-5 min-h-[44px] py-2.5 text-[15px] cursor-pointer select-none transition-colors duration-150 ${
                              isSel
                                ? 'bg-[#EFF6FF] text-[#1E6BC6] font-semibold'
                                : 'text-[#374151] hover:bg-[#F0F7FF] hover:text-[#1E6BC6]'
                            }`}
                          >
                            {isSel ? (
                              <svg className="w-4 h-4 text-[#1E6BC6] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span className="w-4 shrink-0" aria-hidden="true" />
                            )}
                            {esp.name}
                          </li>
                        )
                      })}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── CTA block — placeholder / selected ── */}
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key="selected"
                  initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={shouldReduce ? {} : { opacity: 0, y: 8 }}
                  transition={{ ...spring, delay: 0 }}
                  className="rounded-2xl overflow-hidden relative"
                  style={{ background: 'linear-gradient(135deg, #0A2463 0%, #1756b8 100%)' }}
                >
                  {/* Decorative blob */}
                  <div
                    className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(86,180,233,0.2) 0%, transparent 70%)', transform: 'translate(25%, -30%)' }}
                  />

                  <div className="relative p-6 md:p-8">
                    <p className="text-[#56B4E9] text-[11px] font-bold uppercase tracking-widest mb-3">
                      TU TURNO
                    </p>
                    <h2
                      className="text-white font-black text-xl md:text-2xl leading-tight mb-2"
                      style={{ textWrap: 'balance' } as React.CSSProperties}
                    >
                      Sacar turno de {selected}
                    </h2>
                    <p className="text-white/70 text-sm leading-relaxed mb-7">
                      Te respondemos por WhatsApp a la brevedad para coordinar día y horario.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {/*
                        min-h-[44px]: touch target correcto (UX guideline: Touch Target Size).
                        active:scale-[0.98]: feedback de presión (UX guideline: Active States).
                      */}
                      <a
                        href={waEsp(selected)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1fba57] active:scale-[0.98] text-white font-bold px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_24px_rgba(37,211,102,0.5)] transition-all duration-200 cursor-pointer text-[15px] min-h-[44px]"
                      >
                        <WhatsAppIcon />
                        Sacar turno por WhatsApp
                      </a>
                      <Link
                        href={`/sacar-turno?especialidad=${encodeURIComponent(selected ?? '')}`}
                        className="inline-flex items-center justify-center gap-2 bg-[#0A2463] hover:bg-[#1756b8] active:scale-[0.98] text-white font-semibold px-6 py-3 rounded-full transition-all duration-200 cursor-pointer text-[15px] min-h-[44px]"
                      >
                        <Calendar className="w-4 h-4 shrink-0" />
                        Sacar turno online
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={shouldReduce ? {} : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={shouldReduce ? {} : { opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] flex items-center justify-center">
                    <CalendarIcon />
                  </div>
                  <p
                    className="text-[#9CA3AF] text-sm leading-relaxed max-w-[36ch]"
                    style={{ textWrap: 'balance' } as React.CSSProperties}
                  >
                    Seleccioná una especialidad para ver las opciones de turno disponibles.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </AnimateIn>
        </div>
      </div>
    </div>
  )
}
