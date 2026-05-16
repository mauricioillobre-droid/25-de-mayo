'use client'
import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import MedicalIcon from '@/components/MedicalIcon'
import { especialidades, waEspecialidad } from '@/lib/data'

const WhatsAppIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

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
      transition: { staggerChildren: shouldReduce ? 0 : 0.04, delayChildren: 0.05 },
    },
  }
  const item = {
    hidden: shouldReduce ? {} : { opacity: 0, y: 24, scale: 0.96 },
    show: { opacity: 1, y: 0, scale: 1, transition: spring },
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
            {filtered.map((esp) => (
              <motion.div
                key={esp.name}
                variants={item}
                /* Lift on hover — respects reduced motion */
                whileHover={shouldReduce ? {} : { y: -6, transition: { type: 'spring', stiffness: 300, damping: 22 } }}
                className="group relative bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center gap-4 shadow-sm hover:shadow-[0_12px_40px_rgba(30,107,198,0.14)] hover:border-[#1E6BC6]/20 transition-shadow duration-300 cursor-pointer"
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-[#EFF6FF] rounded-2xl flex items-center justify-center text-[#1E6BC6] transition-colors duration-250 group-hover:bg-[#1E6BC6] group-hover:text-white">
                  <MedicalIcon type={esp.icon} className="w-8 h-8" />
                </div>

                {/* Name */}
                <p className="font-bold text-[#0A2463] text-sm leading-snug min-h-[2.5rem] flex items-center justify-center">
                  {esp.name}
                </p>

                {/*
                  WhatsApp button:
                  - Mobile (touch): always visible
                  - Desktop: hidden by default, slides up on group hover
                  CSS approach = no layout shift, works on all devices (skill guideline: hover vs tap)
                */}
                <a
                  href={waEspecialidad(esp.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Sacar turno con ${esp.name}`}
                  className={[
                    'w-full flex items-center justify-center gap-1.5',
                    'bg-[#25D366] hover:bg-[#1fba57] active:scale-[0.97]',
                    'text-white text-xs font-bold py-2.5 rounded-xl',
                    'transition-all duration-200 cursor-pointer min-h-[36px]',
                    // Desktop: hidden until hover
                    'md:opacity-0 md:translate-y-2',
                    'md:group-hover:opacity-100 md:group-hover:translate-y-0',
                    shouldReduce ? 'md:opacity-100 md:translate-y-0' : '',
                  ].join(' ')}
                >
                  <WhatsAppIcon />
                  Sacar turno
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
