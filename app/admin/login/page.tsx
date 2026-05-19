'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const errorId = 'login-error'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) {
        setError('Email o contraseña incorrectos.')
        return
      }
      router.push('/admin')
      router.refresh()
    })
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #0A2463 0%, #0D3280 100%)' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo above card — establishes brand context before credentials */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/logo.png"
            alt="25 de Mayo Consultorios Médicos"
            width={120}
            height={60}
            className="object-contain drop-shadow-sm"
            priority
          />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Heading hierarchy: large welcome + small descriptor */}
          <div className="mb-7">
            <h1 className="text-2xl font-black text-[#0A2463] text-balance leading-tight">
              Bienvenido
            </h1>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              Panel de gestión
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2"
              >
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
                // aria-describedby links to error for screen readers
                aria-describedby={error ? errorId : undefined}
                aria-invalid={!!error}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm text-[#0A2463]
                  placeholder:text-gray-300
                  focus:outline-none focus:border-[#1E6BC6]
                  focus-visible:ring-2 focus-visible:ring-[#1E6BC6]/30
                  motion-safe:transition-colors duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2"
              >
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
                aria-describedby={error ? errorId : undefined}
                aria-invalid={!!error}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm text-[#0A2463]
                  placeholder:text-gray-300
                  focus:outline-none focus:border-[#1E6BC6]
                  focus-visible:ring-2 focus-visible:ring-[#1E6BC6]/30
                  motion-safe:transition-colors duration-200"
              />
            </div>

            {/* Error: icon + text for redundant (non-color-only) feedback */}
            {error && (
              <div
                id={errorId}
                role="alert"
                className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl"
              >
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" aria-hidden="true" />
                <p className="text-sm text-red-700 font-semibold">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#0A2463] hover:bg-[#0D3280] hover:shadow-lg
                active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
                text-white font-bold py-3 rounded-xl
                motion-safe:transition-all duration-200 cursor-pointer
                min-h-[44px] flex items-center justify-center gap-2
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E6BC6]/60 focus-visible:ring-offset-2"
            >
              {isPending ? (
                <>
                  <svg className="w-4 h-4 motion-safe:animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Ingresando...</span>
                </>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>
        </div>

        {/* Subtle branding footer below card */}
        <p className="text-center text-white/30 text-xs mt-6 tracking-wide">
          25 de Mayo Consultorios Médicos · Los Polvorines
        </p>
      </div>
    </div>
  )
}
