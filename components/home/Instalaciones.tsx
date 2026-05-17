'use client'
import Image from 'next/image'
import { motion, useReducedMotion } from 'motion/react'

const features = [
  'Accesibilidad garantizada con rampa de ingreso',
  'Sala de espera amplia y climatizada',
  'Consultorios equipados con tecnología actual',
  'Estacionamiento disponible en la zona',
]

export default function Instalaciones() {
  const shouldReduce = useReducedMotion()
  const spring = { type: 'spring' as const, stiffness: 65, damping: 18 }

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Image — left */}
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={spring}
            className="relative order-2 lg:order-1"
          >
            {/* Decorative frame */}
            <div className="absolute -inset-3 bg-gradient-to-br from-[#1E6BC6]/10 to-[#56B4E9]/8 rounded-[28px] blur-sm pointer-events-none" />
            <div className="relative h-72 sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(10,36,99,0.15)]">
              <Image
                src="/images/recepcion.jpeg"
                alt="Recepción de 25 de Mayo Consultorios Médicos"
                fill
                className="object-cover"
                style={{ filter: 'brightness(1.05) contrast(1.1) saturate(1.15)' }}
              />
            </div>
          </motion.div>

          {/* Text — right */}
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ ...spring, delay: 0.1 }}
            className="order-1 lg:order-2"
          >
            <span className="inline-block text-[#1E6BC6] text-xs font-bold uppercase tracking-widest mb-4">
              Nuestras instalaciones
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0A2463] leading-tight mb-6">
              Un espacio pensado{' '}
              <br className="hidden md:block" />
              para vos
            </h2>
            <p className="text-[#6B7280] text-lg leading-relaxed mb-8 max-w-lg">
              Nuestro centro médico fue diseñado para que te sientas cómodo y bien atendido desde el primer momento. Espacios amplios, modernos y accesibles para toda la familia.
            </p>
            <ul className="space-y-3.5">
              {features.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-[#1E6BC6]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[#374151] text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
