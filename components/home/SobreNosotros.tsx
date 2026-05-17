'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import ImageWithFallback from '@/components/ImageWithFallback'

const stats = [
  { value: 35, suffix: '+', label: 'Especialidades médicas' },
  { value: 2020, suffix: '', label: 'Año de fundación' },
  { value: 100, suffix: '%', label: 'Compromiso con tu salud' },
]

function Counter({ target, suffix, active, shouldReduce }: { target: number; suffix: string; active: boolean; shouldReduce: boolean | null }) {
  const [count, setCount] = useState(shouldReduce ? target : 0)

  useEffect(() => {
    if (!active || shouldReduce) {
      setCount(target)
      return
    }
    const duration = 2000
    const startTime = performance.now()

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [active, target, shouldReduce])

  return <>{count}{suffix}</>
}

export default function SobreNosotros() {
  const textRef = useRef(null)
  const statsRef = useRef(null)
  const isInView = useInView(textRef, { once: true, margin: '-80px' })
  const statsInView = useInView(statsRef, { once: true, margin: '-40px' })
  const shouldReduce = useReducedMotion()

  const spring = { type: 'spring' as const, stiffness: 70, damping: 18 }

  return (
    <>
      {/* Text + Image */}
      <section ref={textRef} className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 items-center">

            <div>
              <motion.div
                initial={shouldReduce ? {} : { opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ ...spring, delay: 0 }}
              >
                <span className="inline-block text-[#1E6BC6] text-sm font-semibold uppercase tracking-widest mb-4">
                  Quiénes somos
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#0A2463] leading-tight mb-6">
                  Salud accesible,{' '}
                  <br className="hidden md:block" />
                  <span className="text-[#1E6BC6]">atención de calidad</span>
                </h2>
              </motion.div>

              <motion.p
                initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ ...spring, delay: 0.08 }}
                className="text-[#6B7280] text-base md:text-lg leading-relaxed"
              >
                25 de Mayo Consultorios Médicos nació en diciembre de 2020 con un objetivo claro: acercar
                la salud a los vecinos de Los Polvorines y la zona norte del conurbano bonaerense. En pocos
                años crecimos hasta ofrecer más de 35 especialidades médicas y una amplia variedad de
                prácticas y estudios, siempre priorizando la calidez en la atención y la accesibilidad para
                cada paciente.
              </motion.p>
            </div>

            {/* Image */}
            <motion.div
              initial={shouldReduce ? {} : { opacity: 0, x: 48, scale: 0.97 }}
              animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ ...spring, delay: 0.12 }}
              className="relative"
            >
              <div className="absolute -inset-3 bg-gradient-to-br from-[#56B4E9]/12 to-[#1E6BC6]/8 rounded-[28px] blur-sm" />
              <div className="relative h-72 sm:h-[400px] lg:h-[480px] rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(10,36,99,0.15)]">
                <ImageWithFallback
                  src="/images/recepcion.jpeg"
                  alt="Interior de 25 de Mayo Consultorios Médicos"
                  fill
                  className="object-cover object-center-bottom"
                  style={{ filter: 'brightness(1.05) contrast(1.08) saturate(1.1)', objectPosition: 'center bottom' }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Navy stats band */}
      <section ref={statsRef} className="bg-[#0A2463] py-8 md:py-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#1E6BC6]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#56B4E9]/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={shouldReduce ? {} : { opacity: 0, y: 28 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ ...spring, delay: i * 0.1 }}
                className={[
                  'text-center py-2 px-4',
                  i > 0 ? 'border-l border-white/15' : '',
                ].join(' ')}
              >
                <p className="text-4xl sm:text-5xl md:text-6xl font-black text-[#56B4E9] leading-none tabular-nums">
                  <Counter
                    target={s.value}
                    suffix={s.suffix}
                    active={statsInView}
                    shouldReduce={shouldReduce}
                  />
                </p>
                <p className="text-white/70 text-xs sm:text-sm font-medium mt-2 leading-snug max-w-[120px] mx-auto">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
