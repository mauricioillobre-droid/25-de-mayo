import Link from 'next/link'

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/especialidades', label: 'Especialidades' },
  { href: '/practicas', label: 'Prácticas' },
  { href: '/contacto', label: 'Contacto' },
]

const MapPinIcon = () => (
  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)
const PhoneIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)
const MailIcon = () => (
  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)
const ClockIcon = () => (
  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" strokeWidth={2} />
    <path strokeLinecap="round" strokeWidth={2} d="M12 6v6l4 2" />
  </svg>
)
const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
)

export default function Footer() {
  return (
    <footer className="bg-[#0A2463] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <p className="text-white font-extrabold text-xl tracking-tight">25 DE MAYO</p>
              <p className="text-[#56B4E9] font-medium text-sm">Consultorios Médicos</p>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Más de 35 especialidades médicas en Los Polvorines. Cuidamos tu salud cerca de tu casa.
            </p>
            <a
              href="https://www.instagram.com/25demayo.cm/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-white/70 hover:text-[#56B4E9] transition-colors"
            >
              <InstagramIcon />
              <span className="text-sm">@25demayo.cm</span>
            </a>
          </div>

          {/* Nav */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navegación</h3>
            <ul className="space-y-2">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-white/70 hover:text-[#56B4E9] text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-white/70 text-sm">
                <MapPinIcon />
                <span>25 de Mayo 2557, entre Savio y Suiza, Los Polvorines, Malvinas Argentinas</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <PhoneIcon />
                <a href="tel:+5491122355689" className="text-white/70 hover:text-[#56B4E9] transition-colors">
                  +54 9 11 2235-5689
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <MailIcon />
                <a href="mailto:25demayocm@gmail.com" className="text-white/70 hover:text-[#56B4E9] transition-colors">
                  25demayocm@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-white/70 text-sm">
                <ClockIcon />
                <div>
                  <p>Lun–Vie: 8:00 a 18:00 hs</p>
                  <p>Sáb: 9:30 a 12:30 hs</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-white/50 text-xs">
          © 2026 25 de Mayo Consultorios Médicos. Todos los derechos reservados.
          {' · '}
          <a href="#" className="hover:text-[#56B4E9] transition-colors">
            Desarrollado por Órbita Digital
          </a>
        </div>
      </div>
    </footer>
  )
}
