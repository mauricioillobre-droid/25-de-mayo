'use client'
import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import MedicalIcon from '@/components/MedicalIcon'
import { especialidades, practicas, waEspecialidad } from '@/lib/data'

function getPracticasCount(espName: string): number {
  const norm = espName.toLowerCase()
  for (const cat of practicas) {
    if (norm.includes(cat.categoria.toLowerCase()) ||
        cat.categoria.toLowerCase().includes(norm.split(' ')[0])) {
      return cat.items.length
    }
  }
  return 0
}

const SearchIcon = () => (
  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
  </svg>
)

export default function EspecialidadesPage() {
  const [query, setQuery] = useState('')
  const shouldReduce = useReducedMotion()

  const filtered = especialidades.filter((e) =>
    e.name.toLowerCase().includes(query.toLowerCase())
  )

  const spring = { type: 'spring' as const, stiffness: 65, damping: 18 }

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: shouldReduce ? 0 : 0.05, delayChildren: 0.05 },
    },
  }
  const item = {
    hidden: shouldReduce ? {} : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: spring },
  }

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100 pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
          >
            <span className="inline-block text-[#1E6BC6] text-xs font-bold uppercase tracking-widest mb-4">
              Nuestros servicios
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A2463] mb-4 leading-tight">
              Especialidades médicas
            </h1>
            <p className="text-[#6B7280] text-lg leading-relaxed max-w-xl">
              Seleccioná tu especialidad y sacá turno directo por WhatsApp, sin llamadas ni esperas.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search bar */}
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.12 }}
          className="max-w-[500px] mx-auto mb-10"
        >
          <div className="relative">
            <SearchIcon />
            <input
              type="text"
              placeholder="Buscar especialidad..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar especialidad"
              className="w-full pl-12 pr-10 py-4 bg-white border border-gray-200 rounded-2xl text-[#0A2463] placeholder:text-[#6B7280] focus:outline-none focus:border-[#56B4E9] focus:ring-2 focus:ring-[#56B4E9]/20 shadow-sm text-base transition-all duration-200"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#6B7280] hover:text-[#0A2463] transition-colors cursor-pointer rounded-full hover:bg-gray-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {query && (
            <p className="text-[#6B7280] text-sm mt-2.5 text-center">
              <span className="font-semibold text-[#0A2463]">{filtered.length}</span> resultado{filtered.length !== 1 ? 's' : ''} para{' '}
              <span className="text-[#1E6BC6]">&quot;{query}&quot;</span>
            </p>
          )}
        </motion.div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-[#EFF6FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#1E6BC6]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <p className="text-[#0A2463] font-semibold text-lg mb-1">
              No encontramos &quot;{query}&quot;
            </p>
            <p className="text-[#6B7280] text-sm mb-4">Probá con otro término de búsqueda.</p>
            <button
              onClick={() => setQuery('')}
              className="text-[#1E6BC6] font-semibold hover:underline cursor-pointer"
            >
              Limpiar búsqueda
            </button>
          </div>
        )}

        {/* Cards grid */}
        {filtered.length > 0 && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            {filtered.map((esp) => {
              const count = getPracticasCount(esp.name)
              return (
                <motion.div
                  key={esp.name}
                  variants={item}
                  whileHover={shouldReduce ? {} : { scale: 1.02, transition: { duration: 0.2 } }}
                  className="group bg-white border border-gray-100 hover:border-[#0A2463] rounded-2xl p-5 flex flex-col items-center text-center gap-3.5 shadow-sm hover:shadow-[0_12px_40px_rgba(10,36,99,0.12)] transition-all duration-200 cursor-pointer"
                >
                  {/* Icon */}
                  <div
                    className="w-[52px] h-[52px] flex items-center justify-center text-white shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #1a4a7a 0%, #2563eb 100%)',
                      borderRadius: '14px',
                    }}
                  >
                    <MedicalIcon type={esp.icon} size={24} />
                  </div>

                  {/* Name */}
                  <p className="font-bold text-[#0A2463] text-sm leading-snug flex-1 flex items-center justify-center">
                    {esp.name}
                  </p>

                  {/* Practice count badge */}
                  {count > 0 && (
                    <span className="text-[10px] font-semibold text-[#1E6BC6] bg-[#EFF6FF] px-2.5 py-1 rounded-full">
                      {count} práctica{count !== 1 ? 's' : ''}
                    </span>
                  )}

                  {/* Subtle CTA */}
                  <a
                    href={waEspecialidad(esp.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Sacar turno con ${esp.name}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 text-[#0A2463] text-xs font-semibold hover:text-[#1E6BC6] transition-colors duration-150 cursor-pointer"
                  >
                    Ver turnos
                    <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-150" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}
