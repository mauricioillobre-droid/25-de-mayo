'use client'
import { motion, useReducedMotion } from 'motion/react'

const MapPinIcon = () => (
  <svg className="w-5 h-5 text-[#1E6BC6] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)
const PhoneIcon = () => (
  <svg className="w-5 h-5 text-[#1E6BC6] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)
const MailIcon = () => (
  <svg className="w-5 h-5 text-[#1E6BC6] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)
const ClockIcon = () => (
  <svg className="w-5 h-5 text-[#1E6BC6] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" d="M12 6v6l4 2" />
  </svg>
)

export default function ComoLlegar() {
  const shouldReduce = useReducedMotion()
  const spring = { type: 'spring' as const, stiffness: 65, damping: 18 }

  return (
    <section className="py-24 md:py-32 bg-[#F4F6F9] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1E6BC6]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={spring}
          className="text-center mb-14"
        >
          <span className="inline-block text-[#1E6BC6] text-sm font-semibold uppercase tracking-widest mb-4">
            Ubicación
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0A2463]">
            Cómo llegar
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Info card */}
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={spring}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-7"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#1E6BC6]/10 flex items-center justify-center shrink-0">
                <MapPinIcon />
              </div>
              <div>
                <p className="font-bold text-[#0A2463] mb-1">Dirección</p>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  25 de Mayo 2557, entre Savio y Suiza<br />
                  Los Polvorines, Malvinas Argentinas<br />
                  Buenos Aires, Argentina
                </p>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#1E6BC6]/10 flex items-center justify-center shrink-0">
                <ClockIcon />
              </div>
              <div>
                <p className="font-bold text-[#0A2463] mb-3">Horarios de atención</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-sm font-semibold text-[#0A2463]">Lun – Vie</span>
                    <span className="text-sm text-[#6B7280] bg-[#F4F6F9] px-3 py-1 rounded-full">8:00 – 18:00 hs</span>
                  </div>
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-sm font-semibold text-[#0A2463]">Sábado</span>
                    <span className="text-sm text-[#6B7280] bg-[#F4F6F9] px-3 py-1 rounded-full">9:30 – 12:30 hs</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#1E6BC6]/10 flex items-center justify-center shrink-0">
                <PhoneIcon />
              </div>
              <div>
                <p className="font-bold text-[#0A2463] mb-0.5">Teléfono / WhatsApp</p>
                <a href="tel:+5491122355689" className="text-[#1E6BC6] hover:text-[#0A2463] transition-colors text-sm font-medium">
                  +54 9 11 2235-5689
                </a>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#1E6BC6]/10 flex items-center justify-center shrink-0">
                <MailIcon />
              </div>
              <div>
                <p className="font-bold text-[#0A2463] mb-0.5">Email</p>
                <a href="mailto:25demayocm@gmail.com" className="text-[#1E6BC6] hover:text-[#0A2463] transition-colors text-sm font-medium">
                  25demayocm@gmail.com
                </a>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ ...spring, delay: 0.1 }}
            className="h-72 lg:h-auto min-h-[360px] rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(10,36,99,0.12)] border border-gray-100"
          >
            <iframe
              title="Ubicación 25 de Mayo Consultorios Médicos"
              src="https://maps.google.com/maps?q=25+de+Mayo+2557+Los+Polvorines+Buenos+Aires+Argentina&output=embed&z=16"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '360px' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
