'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
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
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0A2463 0%, #0D3280 100%)' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/logo.png"
            alt="25 de Mayo Consultorios Médicos"
            width={120}
            height={60}
            className="object-contain"
            priority
          />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-[#0A2463] text-balance">Bienvenido</h1>
            <p className="text-sm text-gray-500 mt-1">Panel de gestión</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm text-[#0A2463] placeholder-gray-300 focus:outline-none focus:border-[#1E6BC6] transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm text-[#0A2463] placeholder-gray-300 focus:outline-none focus:border-[#1E6BC6] transition-colors"
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
              className="w-full bg-[#0A2463] hover:bg-[#0D3280] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-200 cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
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
