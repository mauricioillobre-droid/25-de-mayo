'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { especialidades, practicas } from '@/lib/data'

const WA_BASE = 'https://wa.me/5491122355689'

function waEsp(name: string) {
  return `${WA_BASE}?text=${encodeURIComponent(`Hola, quiero sacar un turno de ${name}`)}`
}

function getPracticasForEsp(espName: string): string[] {
  const norm = espName.toLowerCase()
  for (const cat of practicas) {
    if (
      norm.includes(cat.categoria.toLowerCase()) ||
      cat.categoria.toLowerCase().includes(norm.split(' ')[0])
    ) {
      return cat.items
    }
  }
  return []
}

const WhatsAppIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

const ChevronIcon = ({ open }: { open: boolean }) => (
  <motion.svg
    animate={{ rotate: open ? 180 : 0 }}
    transition={{ duration: 0.22, ease: 'easeInOut' }}
    className={`w-5 h-5 shrink-0 transition-colors duration-200 ${open ? 'text-[#1E6BC6]' : 'text-gray-400'}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </motion.svg>
)

const stats = [
  { value: '35+', label: 'especialidades' },
  { value: '2020', label: 'año de fundación' },
  { value: '24hs', label: 'turnos por WhatsApp' },
]

export default function EspecialidadesPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const shouldReduce = useReducedMotion()

  const toggle = (i: number) => setOpenIdx((prev) => (prev === i ? null : i))

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-start">

          {/* ── LEFT: sticky panel ── */}
          <div className="lg:sticky lg:top-[100px] lg:self-start mb-12 lg:mb-0">

            {/* Image */}
            <div className="relative h-64 lg:h-[520px] rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/consultorio.jpeg"
                alt="Consultorio médico 25 de Mayo"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Text block */}
            <div className="mt-8 space-y-4">
              <span className="inline-block text-[#1E6BC6] text-xs font-bold uppercase tracking-widest">
                ESPECIALIDADES MÉDICAS
              </span>
              <h1
                className="text-2xl md:text-3xl lg:text-4xl font-black text-[#0A2463] leading-tight"
                style={{ textWrap: 'pretty' } as React.CSSProperties}
              >
                Más de 35 especialidades en un solo lugar
              </h1>
              <p
                className="text-[#6B7280] text-base leading-relaxed max-w-sm"
                style={{ textWrap: 'balance' } as React.CSSProperties}
              >
                Contamos con profesionales especializados en cada área de la salud.
                Seleccioná la especialidad para ver las prácticas disponibles
                y sacar tu turno directo por WhatsApp.
              </p>

              {/* Stats */}
              <div className="flex gap-6 pt-2">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-black text-[#1E6BC6] leading-none">{s.value}</p>
                    <p className="text-[11px] text-[#6B7280] font-medium mt-1 leading-tight">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: accordion ── */}
          <div>
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-[0_4px_24px_rgba(10,36,99,0.06)]">
              {especialidades.map((esp, i) => {
                const items = getPracticasForEsp(esp.name)
                const isOpen = openIdx === i

                return (
                  <div
                    key={esp.name}
                    className={`transition-colors duration-200 ${isOpen ? 'bg-gray-50' : 'bg-white hover:bg-gray-50/50'}`}
                  >
                    {/* Row header */}
                    <button
                      onClick={() => toggle(i)}
                      className={`w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer transition-all duration-200 ${
                        isOpen ? 'border-l-2 border-[#1E6BC6]' : 'border-l-2 border-transparent'
                      }`}
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <span
                          className={`font-semibold text-[15px] leading-snug transition-colors duration-200 ${
                            isOpen ? 'text-[#0A2463]' : 'text-[#374151]'
                          }`}
                        >
                          {esp.name}
                        </span>
                        {items.length > 0 && (
                          <span className="shrink-0 text-[10px] font-semibold text-[#1E6BC6] bg-[#EFF6FF] px-2 py-0.5 rounded-full">
                            {items.length} práctica{items.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <ChevronIcon open={isOpen} />
                    </button>

                    {/* Body */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="body"
                          initial={shouldReduce ? {} : { height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={shouldReduce ? {} : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden border-l-2 border-[#1E6BC6]"
                        >
                          <div className="px-5 pb-5 pt-1">
                            {items.length > 0 ? (
                              <ul className="mb-4 space-y-2">
                                {items.map((item) => (
                                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#6B7280]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#56B4E9] shrink-0 mt-1.5" />
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-[#6B7280] mb-4">
                                Consultá disponibilidad por WhatsApp
                              </p>
                            )}

                            <a
                              href={waEsp(esp.name)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1fba57] active:scale-[0.98] text-white font-bold text-sm px-5 py-2.5 rounded-full shadow-[0_4px_12px_rgba(37,211,102,0.3)] hover:shadow-[0_6px_18px_rgba(37,211,102,0.4)] transition-all duration-200 cursor-pointer"
                            >
                              <WhatsAppIcon />
                              Sacar turno de {esp.name}
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
