'use client'
import React, { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { practicas, WA_PRACTICA } from '@/lib/data'

/* ─── Category icons ─────────────────────────────── */
const categoryIcon: Record<string, React.ReactNode> = {
  Cardiología: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l7.78 7.78 7.78-7.78a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  Neurología: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.26ZM14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.26Z" />
    </svg>
  ),
  Ginecología: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <circle cx="12" cy="8" r="5" /><path strokeLinecap="round" d="M12 13v8m-4-4h8" />
    </svg>
  ),
  Otorrinolaringología: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 0 1-7 0" />
    </svg>
  ),
  Respiratorio: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" d="M6 12H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2 4 4 0 0 0 4-4V4a2 2 0 1 1 4 0v11M18 12h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2 4 4 0 0 1-4-4V4a2 2 0 1 0-4 0v11" />
    </svg>
  ),
  Dermatología: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  ),
  Flebología: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" d="M22 12h-6l-2 7-4-14-2 7H2" />
    </svg>
  ),
  Ecografía: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
    </svg>
  ),
  General: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
}

const Check = () => (
  <svg className="w-4 h-4 text-[#56B4E9] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

export default function PracticasCatalog() {
  const [query, setQuery] = useState('')
  const shouldReduce = useReducedMotion()
  const spring = { type: 'spring' as const, stiffness: 65, damping: 18 }

  const q = query.toLowerCase()
  const filtered = practicas
    .map((cat) => ({ ...cat, items: cat.items.filter((item) => item.toLowerCase().includes(q)) }))
    .filter((cat) => cat.items.length > 0)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      {/* Search bar */}
      <div className="max-w-[500px] mx-auto">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Buscar práctica..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar práctica"
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
            <span className="font-semibold text-[#0A2463]">{filtered.reduce((n, c) => n + c.items.length, 0)}</span> resultado{filtered.reduce((n, c) => n + c.items.length, 0) !== 1 ? 's' : ''} para{' '}
            <span className="text-[#1E6BC6]">&quot;{query}&quot;</span>
          </p>
        )}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-[#EFF6FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#1E6BC6]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <p className="text-[#0A2463] font-semibold text-lg mb-1">No encontramos &quot;{query}&quot;</p>
          <p className="text-[#6B7280] text-sm mb-4">Probá con otro término de búsqueda.</p>
          <button onClick={() => setQuery('')} className="text-[#1E6BC6] font-semibold hover:underline cursor-pointer">
            Limpiar búsqueda
          </button>
        </div>
      )}

      {filtered.length > 0 && filtered.map((cat, i) => (
        <motion.div
          key={cat.categoria}
          initial={shouldReduce ? {} : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ ...spring, delay: !query && i < 3 ? i * 0.06 : 0 }}
          className="overflow-hidden rounded-2xl shadow-sm border border-gray-100"
        >
          {/* Navy category header */}
          <div className="bg-[#0A2463] px-6 py-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white shrink-0">
                {categoryIcon[cat.categoria] ?? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                )}
              </div>
              <h2 className="text-white font-black text-lg">{cat.categoria}</h2>
            </div>
            <span className="shrink-0 bg-white/10 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full">
              {cat.items.length} práctica{cat.items.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Practice cards grid */}
          <div className="bg-white p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cat.items.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 bg-[#F8FBFF] hover:bg-[#EFF6FF] border border-gray-100 hover:border-[#56B4E9]/30 rounded-xl px-4 py-3.5 transition-all duration-200"
                >
                  <Check />
                  <span className="text-[#0A2463] text-sm font-medium leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}

      {/* CTA banner */}
      <motion.div
        initial={shouldReduce ? {} : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ ...spring, delay: 0.1 }}
        className="mt-4 bg-[#0A2463] rounded-2xl overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#1E6BC6]/30 rounded-full blur-3xl pointer-events-none -translate-y-1/4 translate-x-1/4" />
        <div className="relative px-8 md:px-12 py-12 text-center">
          <p className="text-[#56B4E9] text-xs font-bold uppercase tracking-widest mb-3">
            ¿Tenés una consulta?
          </p>
          <h3 className="text-white font-black text-2xl md:text-3xl mb-2 leading-tight">
            Consultá por cualquier práctica
          </h3>
          <p className="text-white/60 text-sm mb-8 max-w-sm mx-auto">
            Te respondemos a la brevedad y coordinamos el estudio que necesitás.
          </p>
          <a
            href={WA_PRACTICA}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1fba57] active:scale-[0.98] text-white font-bold px-8 py-4 rounded-full shadow-[0_8px_24px_rgba(37,211,102,0.35)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.45)] transition-all duration-200 cursor-pointer text-[15px]"
          >
            <WhatsAppIcon />
            Consultar por una práctica
          </a>
        </div>
      </motion.div>
    </div>
  )
}
