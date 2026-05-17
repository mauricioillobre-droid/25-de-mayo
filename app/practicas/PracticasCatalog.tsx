'use client'
import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'
import AnimateIn from '@/components/AnimateIn'
import { practicas, WA_PRACTICA } from '@/lib/data'

const Check = () => (
  <svg className="w-4 h-4 text-[#1E6BC6] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

export default function PracticasCatalog() {
  const shouldReduce = useReducedMotion()
  const spring = { type: 'spring' as const, stiffness: 65, damping: 18 }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* items-start required for sticky to work on left column */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-20 items-start">

          {/* ── LEFT: sticky image ── */}
          <AnimateIn direction="left" className="lg:sticky lg:top-28 lg:self-start mb-14 lg:mb-0">
            <div className="relative h-56 lg:h-[560px] w-full rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5">
              <Image
                src="/images/recepcion.jpeg"
                alt="Recepción de 25 de Mayo Consultorios Médicos"
                fill
                className="object-cover"
                priority
              />
              <div
                className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(10,36,99,0.22), transparent)' }}
              />
            </div>
          </AnimateIn>

          {/* ── RIGHT: intro + catalog ── */}
          <AnimateIn direction="right">

            {/* Eyebrow */}
            <span className="inline-block text-[#1E6BC6] text-xs font-bold uppercase tracking-widest mb-4">
              ESTUDIOS Y PROCEDIMIENTOS
            </span>

            {/* Title */}
            <h2
              className="text-2xl md:text-3xl lg:text-[2.1rem] font-black text-[#0A2463] leading-tight mb-4"
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              Todo lo que necesitás en un solo centro médico
            </h2>

            {/* Description */}
            <p
              className="text-[#4B5563] text-base leading-relaxed max-w-[52ch] mb-7"
              style={{ textWrap: 'pretty' } as React.CSSProperties}
            >
              Realizamos una amplia variedad de estudios y procedimientos directamente
              en el centro. Sin derivaciones innecesarias, con profesionales especializados
              y turnos coordinados por WhatsApp.
            </p>

            {/* WA CTA */}
            <a
              href={WA_PRACTICA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#25D366] hover:bg-[#1fba57] active:scale-[0.98] text-white font-bold px-7 py-3.5 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.35)] hover:shadow-[0_8px_28px_rgba(37,211,102,0.45)] transition-all duration-200 cursor-pointer text-[15px] min-h-[44px]"
            >
              <WhatsAppIcon />
              Consultar por una práctica
            </a>

            {/* Separator */}
            <div className="border-b border-gray-100 my-9" />

            {/* Practices catalog */}
            <div className="space-y-5">
              {practicas.map((cat, i) => (
                <motion.div
                  key={cat.categoria}
                  initial={shouldReduce ? {} : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ ...spring, delay: i < 4 ? i * 0.07 : 0 }}
                  className="rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                >
                  {/* Navy category header */}
                  <div className="bg-[#0A2463] px-5 py-4 flex items-center justify-between gap-3">
                    <h3 className="text-white font-black text-base">{cat.categoria}</h3>
                    <span className="shrink-0 bg-white/10 text-white/75 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {cat.items.length} práctica{cat.items.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Practice items grid */}
                  <div className="bg-white p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {cat.items.map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-2.5 bg-[#F8FBFF] hover:bg-[#EFF6FF] border border-gray-100 hover:border-[#1E6BC6]/20 rounded-xl px-4 py-3 transition-all duration-200"
                        >
                          <Check />
                          <span className="text-[#0A2463] text-sm font-medium leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimateIn>

        </div>
      </div>
    </section>
  )
}
