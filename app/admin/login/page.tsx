'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (authError) {
        setError('Email o contraseña incorrectos.')
        return
      }
      router.push('/admin')
      router.refresh()
    })
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center gap-1">
            <span className="font-black text-2xl text-[#0A2463] tracking-tight">25 DE MAYO</span>
            <span className="font-semibold text-xs text-[#1E6BC6] tracking-wide">Consultorios Médicos</span>
          </div>
          <p className="mt-3 text-[#6B7280] text-sm">Acceso al panel de gestión</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-lg font-black text-[#0A2463] mb-6">Iniciar sesión</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#374151] uppercase tracking-wide mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@ejemplo.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-[#0A2463] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1E6BC6]/30 focus:border-[#1E6BC6] transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-[#374151] uppercase tracking-wide mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-[#0A2463] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1E6BC6]/30 focus:border-[#1E6BC6] transition-all"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 font-semibold" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#0A2463] hover:bg-[#1756b8] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-full transition-all duration-200 cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Ingresando...
                </>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
