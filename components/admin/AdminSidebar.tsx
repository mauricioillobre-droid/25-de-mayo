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
    { href: '/admin', label: 'Agenda', icon: CalendarDays },
    { href: '/admin/configuracion', label: 'Ajustes', icon: Settings },
  ] as const

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-[#0A2463] flex flex-col z-50 overflow-hidden">
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

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 cursor-pointer border-l-[3px] ${
                isActive
                  ? 'bg-white/10 border-[#1E6BC6] text-white'
                  : 'border-transparent text-white/60 hover:text-white/90 hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-sm font-semibold">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User info */}
      <div className="px-4 pb-5 pt-4 border-t border-white/10">
        {userEmail && (
          <p className="text-xs text-white/50 mb-3 truncate" title={userEmail}>
            {userEmail}
          </p>
        )}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors duration-150 cursor-pointer w-full text-sm font-semibold"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
