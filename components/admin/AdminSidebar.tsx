'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { CalendarDays, Settings, LogOut } from 'lucide-react'

interface AdminSidebarProps {
  userEmail?: string
  onLogout: () => void
}

export function AdminSidebar({ userEmail, onLogout }: AdminSidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/admin',                label: 'Agenda',  icon: CalendarDays },
    { href: '/admin/configuracion',  label: 'Ajustes', icon: Settings },
  ] as const

  // Avatar: initial letter of email for quick user identification
  const avatarLetter = userEmail ? userEmail[0].toUpperCase() : '?'

  return (
    // Gradient adds subtle depth vs flat color; border-r separates from content
    <aside
      className="fixed left-0 top-0 w-64 h-screen flex flex-col z-50 border-r border-white/5"
      style={{ background: 'linear-gradient(180deg, #0A2463 0%, #061840 100%)' }}
    >
      {/* Logo */}
      <div className="flex justify-center items-center pt-6 pb-5 px-6 border-b border-white/10">
        <Image
          src="/images/logo.png"
          alt="25 de Mayo Consultorios Médicos"
          width={140}
          height={70}
          className="max-w-[140px] w-full object-contain"
          priority
        />
      </div>

      {/* Navigation — aria-label identifies this landmark for screen readers */}
      <nav className="flex-1 px-3 py-5 space-y-1" aria-label="Navegación del panel">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl motion-safe:transition-all duration-200 cursor-pointer border-l-[3px] group
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0A2463]
                ${isActive
                  ? 'bg-white/10 border-[#1E6BC6] text-white shadow-sm'
                  : 'border-transparent text-white/60 hover:text-white/90 hover:bg-white/5'
                }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 motion-safe:transition-colors duration-200 ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white/90'}`}
                aria-hidden="true"
              />
              <span className="text-sm font-semibold">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User info — avatar + email + logout */}
      <div className="px-4 pb-6 pt-4 border-t border-white/10">
        {userEmail && (
          <div className="flex items-center gap-3 mb-4 min-w-0">
            {/* Initial avatar */}
            <div
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 ring-1 ring-white/20"
              aria-hidden="true"
            >
              <span className="text-sm font-bold text-white/80">{avatarLetter}</span>
            </div>
            <p className="text-xs text-white/50 truncate" title={userEmail}>
              {userEmail}
            </p>
          </div>
        )}
        {/* Logout — full row clickable for larger touch target */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2.5 text-white/60 hover:text-white/90 motion-safe:transition-colors duration-200 cursor-pointer w-full text-sm font-semibold px-2 py-2.5 rounded-xl hover:bg-white/5 min-h-[44px]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
