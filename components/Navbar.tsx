'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { WA_TURNO } from '@/lib/data'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/especialidades', label: 'Especialidades' },
  { href: '/practicas', label: 'Prácticas' },
  { href: '/contacto', label: 'Contacto' },
]

const WhatsAppIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/98 backdrop-blur-md shadow-[0_1px_24px_rgba(10,36,99,0.10)]'
          : 'bg-white/95 backdrop-blur-sm'
      }`}
      initial={shouldReduce ? false : { y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 80, damping: 20 }}
    >
      {/* Top accent line */}
      <div className="h-0.5 bg-gradient-to-r from-[#0A2463] via-[#1E6BC6] to-[#56B4E9]" />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none gap-0.5 hover:opacity-80 transition-opacity">
            <span className="text-[#0A2463] font-black text-base md:text-lg tracking-tight">
              25 DE MAYO
            </span>
            <span className="text-[#1E6BC6] font-semibold text-[11px] md:text-xs tracking-wide">
              Consultorios Médicos
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[#0A2463]/80 font-medium text-sm px-3 py-2 rounded-lg hover:text-[#1E6BC6] hover:bg-[#F0F7FF] transition-all duration-200"
              >
                {label}
              </Link>
            ))}
            <div className="w-px h-5 bg-gray-200 mx-2" />
            <a
              href={WA_TURNO}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1fba57] active:scale-[0.97] text-white font-bold text-sm px-5 py-2.5 rounded-full shadow-[0_4px_16px_rgba(37,211,102,0.3)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.4)] transition-all duration-200 cursor-pointer"
            >
              <WhatsAppIcon />
              Sacar turno
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-[#0A2463] rounded-lg hover:bg-[#F4F6F9] transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={shouldReduce ? {} : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={shouldReduce ? {} : { height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="overflow-hidden md:hidden border-t border-gray-100"
            >
              <div className="py-4 flex flex-col gap-1">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="text-[#0A2463] font-medium text-base px-3 py-3 rounded-xl hover:bg-[#F0F7FF] hover:text-[#1E6BC6] transition-all duration-200 min-h-[44px] flex items-center"
                  >
                    {label}
                  </Link>
                ))}
                <a
                  href={WA_TURNO}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fba57] text-white font-bold px-4 py-3.5 rounded-full mt-2 transition-colors cursor-pointer min-h-[44px]"
                >
                  <WhatsAppIcon />
                  Sacar turno por WhatsApp
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
