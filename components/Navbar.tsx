'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/especialidades', label: 'Especialidades' },
  { href: '/practicas', label: 'Prácticas' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const shouldReduce = useReducedMotion()
  const pathname = usePathname()

  // Transparent on pages that have a hero with background image
  const hasHeroImage = pathname === '/' || pathname === '/especialidades' || pathname === '/practicas' || pathname === '/contacto'
  const isTransparent = hasHeroImage && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on Escape key (WCAG 2.1.2)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent'
          : 'bg-white/98 backdrop-blur-md shadow-[0_1px_20px_rgba(0,0,0,0.08)]'
      }`}
      initial={shouldReduce ? false : { y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 80, damping: 20 }}
    >
      {/* Top accent line — hidden when transparent over hero */}
      <div className={`h-0.5 bg-gradient-to-r from-[#0A2463] via-[#1E6BC6] to-[#56B4E9] transition-opacity duration-300 ${isTransparent ? 'opacity-0' : 'opacity-100'}`} />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" aria-label="25 de Mayo Consultorios Médicos — Ir a inicio" className="flex flex-col leading-none gap-0.5 hover:opacity-80 transition-opacity">
            <span className={`font-black text-base md:text-lg tracking-tight transition-colors duration-300 ${isTransparent ? 'text-white' : 'text-[#0A2463]'}`}>
              25 DE MAYO
            </span>
            <span className={`font-semibold text-[11px] md:text-xs tracking-wide transition-colors duration-300 ${isTransparent ? 'text-white/85' : 'text-[#1E6BC6]'}`}>
              Consultorios Médicos
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`font-medium text-sm px-3 py-2 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:rounded-lg ${
                  isTransparent
                    ? 'text-white/90 hover:text-white hover:bg-white/15 focus-visible:ring-white/60'
                    : 'text-[#0A2463]/80 hover:text-[#1E6BC6] hover:bg-[#F0F7FF] focus-visible:ring-[#1E6BC6]/50'
                }`}
              >
                {label}
              </Link>
            ))}
            <div className={`w-px h-5 mx-2 transition-colors duration-300 ${isTransparent ? 'bg-white/30' : 'bg-gray-200'}`} />
            <Link
              href="/sacar-turno"
              className="flex items-center gap-2 bg-[#0A2463] hover:bg-[#1756b8] active:scale-[0.97] text-white font-bold text-sm px-5 py-2.5 rounded-full shadow-[0_4px_16px_rgba(10,36,99,0.25)] hover:shadow-[0_6px_20px_rgba(10,36,99,0.35)] transition-all duration-200 cursor-pointer"
            >
              Sacar turno
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center ${
              isTransparent ? 'text-white hover:bg-white/15' : 'text-[#0A2463] hover:bg-[#F4F6F9]'
            }`}
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
              className="overflow-hidden md:hidden border-t border-white/20 bg-[#0A2463]/95 backdrop-blur-md rounded-b-2xl"
            >
              <div className="py-4 flex flex-col gap-1 px-1">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="text-white/90 font-medium text-base px-3 py-3 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-200 min-h-[44px] flex items-center"
                  >
                    {label}
                  </Link>
                ))}
                <Link
                  href="/sacar-turno"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-[#0A2463] hover:bg-[#1756b8] text-white font-bold px-4 py-3.5 rounded-full mt-2 transition-colors cursor-pointer min-h-[44px]"
                >
                  Sacar turno online
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
