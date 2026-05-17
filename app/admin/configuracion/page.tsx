'use client'

import { useState, useEffect, useTransition, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import {
  getProfesionalesCompleto,
  toggleProfesionalActivo,
  crearProfesional,
  getDisponibilidadBase,
  guardarDisponibilidad,
  getBloqueos,
  crearBloqueo,
  eliminarBloqueo,
  getEspecialidadesAdmin,
  ProfesionalCompleto,
  DisponibilidadDia,
  BloqueoCompleto,
} from '@/app/actions/admin'

/* ─── Types ──────────────────────────────────────────── */
type Tab = 'profesionales' | 'disponibilidad' | 'bloqueos'

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

/* ─── Header ─────────────────────────────────────────── */
function AdminHeader({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-xs font-semibold text-[#6B7280] hover:text-[#0A2463] transition-colors cursor-pointer flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Agenda
            </Link>
            <div className="flex flex-col leading-none">
              <span className="font-black text-sm text-[#0A2463] tracking-tight">Configuración</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="text-xs font-semibold text-[#6B7280] hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  )
}

/* ─── TAB: Profesionales ─────────────────────────────── */
function TabProfesionales() {
  const [profesionales, setProfesionales] = useState<ProfesionalCompleto[]>([])
  const [especialidades, setEspecialidades] = useState<{ id: string; nombre: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(false)
  const [newNombre, setNewNombre] = useState('')
  const [newEspIds, setNewEspIds] = useState<string[]>([])
  const [formError, setFormError] = useState<string | null>(null)

  const load = useCallback(() => {
    startTransition(async () => {
      const [profs, esps] = await Promise.all([getProfesionalesCompleto(), getEspecialidadesAdmin()])
      setProfesionales(profs)
      setEspecialidades(esps)
      setLoading(false)
    })
  }, [])

  useEffect(() => { load() }, [load])

  const handleToggle = (id: string, activo: boolean) => {
    startTransition(async () => {
      await toggleProfesionalActivo(id, !activo)
      load()
    })
  }

  const handleCreate = () => {
    if (!newNombre.trim()) { setFormError('El nombre es requerido.'); return }
    setFormError(null)
    startTransition(async () => {
      await crearProfesional(newNombre.trim(), newEspIds)
      setNewNombre('')
      setNewEspIds([])
      setShowForm(false)
      load()
    })
  }

  const toggleEsp = (id: string) => {
    setNewEspIds((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    )
  }

  if (loading) return <div className="py-12 text-center text-sm text-[#9CA3AF]">Cargando...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#6B7280]">{profesionales.length} profesionales registrados</p>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="text-xs font-bold px-4 py-2 bg-[#0A2463] text-white rounded-full hover:bg-[#1756b8] transition-colors cursor-pointer min-h-[36px]"
        >
          + Agregar
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-4 p-4 bg-[#F4F6F9] rounded-xl border border-gray-200 space-y-3">
          <h3 className="text-xs font-bold text-[#374151] uppercase tracking-wide">Nuevo profesional</h3>
          <input
            type="text"
            value={newNombre}
            onChange={(e) => setNewNombre(e.target.value)}
            placeholder="Nombre completo"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-[#0A2463] focus:outline-none focus:ring-2 focus:ring-[#1E6BC6]/30 bg-white"
          />
          <div>
            <p className="text-xs font-semibold text-[#374151] mb-2">Especialidades</p>
            <div className="flex flex-wrap gap-2">
              {especialidades.map((esp) => (
                <button
                  key={esp.id}
                  onClick={() => toggleEsp(esp.id)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    newEspIds.includes(esp.id)
                      ? 'bg-[#0A2463] text-white border-[#0A2463]'
                      : 'bg-white text-[#374151] border-gray-200 hover:border-[#1E6BC6]'
                  }`}
                >
                  {esp.nombre}
                </button>
              ))}
            </div>
          </div>
          {formError && <p className="text-xs text-red-600 font-semibold">{formError}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={isPending}
              className="text-xs font-bold px-4 py-2 bg-[#0A2463] text-white rounded-lg hover:bg-[#1756b8] transition-colors cursor-pointer disabled:opacity-50"
            >
              {isPending ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              onClick={() => { setShowForm(false); setFormError(null); setNewNombre(''); setNewEspIds([]) }}
              className="text-xs font-semibold px-4 py-2 text-[#6B7280] hover:text-[#374151] cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-2">
        {profesionales.map((p) => {
          const espNombres = p.profesional_especialidades
            ?.map((pe: any) => pe.especialidades?.nombre)
            .filter(Boolean) ?? []
          return (
            <div key={p.id} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm ${p.activo ? 'text-[#0A2463]' : 'text-[#9CA3AF]'}`}>{p.nombre}</p>
                {espNombres.length > 0 && (
                  <p className="text-xs text-[#6B7280] mt-0.5 truncate">{espNombres.join(', ')}</p>
                )}
              </div>
              <button
                onClick={() => handleToggle(p.id, p.activo)}
                disabled={isPending}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
                  p.activo ? 'bg-[#0A2463]' : 'bg-gray-200'
                }`}
                role="switch"
                aria-checked={p.activo}
                aria-label={`${p.activo ? 'Desactivar' : 'Activar'} ${p.nombre}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    p.activo ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── TAB: Disponibilidad ────────────────────────────── */
function TabDisponibilidad() {
  const [profesionales, setProfesionales] = useState<{ id: string; nombre: string }[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dias, setDias] = useState<DisponibilidadDia[]>(
    DIAS_SEMANA.map((_, i) => ({ dia_semana: i, hora_inicio: '08:00', hora_fin: '18:00', activo: false }))
  )
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const profs = await getProfesionalesCompleto()
      setProfesionales(profs.map((p) => ({ id: p.id, nombre: p.nombre })))
    })
  }, [])

  const loadDisponibilidad = useCallback((profId: string) => {
    setLoading(true)
    setSaved(false)
    startTransition(async () => {
      const data = await getDisponibilidadBase(profId)
      const merged = DIAS_SEMANA.map((_, i) => {
        const found = data.find((d) => d.dia_semana === i)
        return found ?? { dia_semana: i, hora_inicio: '08:00', hora_fin: '18:00', activo: false }
      })
      setDias(merged)
      setLoading(false)
    })
  }, [])

  const handleSelectProf = (id: string) => {
    setSelectedId(id)
    loadDisponibilidad(id)
  }

  const updateDia = (idx: number, field: keyof DisponibilidadDia, value: string | boolean) => {
    setDias((prev) => prev.map((d, i) => i === idx ? { ...d, [field]: value } : d))
    setSaved(false)
  }

  const handleGuardar = () => {
    if (!selectedId) return
    startTransition(async () => {
      await guardarDisponibilidad(selectedId, dias)
      setSaved(true)
    })
  }

  return (
    <div>
      {/* Selector profesional */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-[#374151] uppercase tracking-wide mb-2">
          Seleccionar profesional
        </label>
        <select
          value={selectedId ?? ''}
          onChange={(e) => handleSelectProf(e.target.value)}
          className="w-full sm:w-72 px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-[#0A2463] focus:outline-none focus:ring-2 focus:ring-[#1E6BC6]/30 bg-white cursor-pointer"
        >
          <option value="" disabled>Elegí un profesional</option>
          {profesionales.map((p) => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>
      </div>

      {!selectedId && (
        <p className="text-sm text-[#9CA3AF] text-center py-8">Seleccioná un profesional para ver su disponibilidad.</p>
      )}

      {selectedId && (
        <>
          {loading ? (
            <div className="py-8 text-center text-sm text-[#9CA3AF]">Cargando...</div>
          ) : (
            <div className="space-y-3">
              {dias.map((dia, idx) => (
                <div
                  key={dia.dia_semana}
                  className={`p-4 rounded-xl border transition-all ${
                    dia.activo ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50 border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-wrap">
                    {/* Toggle */}
                    <div className="flex items-center gap-3 w-32">
                      <button
                        onClick={() => updateDia(idx, 'activo', !dia.activo)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                          dia.activo ? 'bg-[#0A2463]' : 'bg-gray-200'
                        }`}
                        role="switch"
                        aria-checked={dia.activo}
                      >
                        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition duration-200 ${dia.activo ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                      <span className={`text-sm font-bold ${dia.activo ? 'text-[#0A2463]' : 'text-[#9CA3AF]'}`}>
                        {DIAS_SEMANA[idx]}
                      </span>
                    </div>

                    {/* Time inputs */}
                    {dia.activo && (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={dia.hora_inicio}
                          onChange={(e) => updateDia(idx, 'hora_inicio', e.target.value)}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-[#0A2463] focus:outline-none focus:ring-2 focus:ring-[#1E6BC6]/30 cursor-pointer"
                        />
                        <span className="text-[#9CA3AF] text-xs font-semibold">a</span>
                        <input
                          type="time"
                          value={dia.hora_fin}
                          onChange={(e) => updateDia(idx, 'hora_fin', e.target.value)}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-[#0A2463] focus:outline-none focus:ring-2 focus:ring-[#1E6BC6]/30 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleGuardar}
                  disabled={isPending}
                  className="text-xs font-bold px-5 py-2.5 bg-[#0A2463] text-white rounded-full hover:bg-[#1756b8] transition-colors cursor-pointer disabled:opacity-50 min-h-[36px]"
                >
                  {isPending ? 'Guardando...' : 'Guardar disponibilidad'}
                </button>
                {saved && (
                  <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Guardado
                  </span>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

/* ─── TAB: Bloqueos ──────────────────────────────────── */
function TabBloqueos() {
  const [bloqueos, setBloqueos] = useState<BloqueoCompleto[]>([])
  const [profesionales, setProfesionales] = useState<{ id: string; nombre: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const [form, setForm] = useState({
    profesional_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    hora_inicio: '',
    hora_fin: '',
    motivo: '',
  })
  const [formError, setFormError] = useState<string | null>(null)

  const load = useCallback(() => {
    startTransition(async () => {
      const [bls, profs] = await Promise.all([getBloqueos(), getProfesionalesCompleto()])
      setBloqueos(bls)
      setProfesionales(profs.map((p) => ({ id: p.id, nombre: p.nombre })))
      setLoading(false)
    })
  }, [])

  useEffect(() => { load() }, [load])

  const handleCreate = () => {
    if (!form.fecha_inicio || !form.fecha_fin) { setFormError('Las fechas son requeridas.'); return }
    if (form.fecha_inicio > form.fecha_fin) { setFormError('La fecha de inicio debe ser anterior a la fecha de fin.'); return }
    setFormError(null)
    startTransition(async () => {
      await crearBloqueo({
        profesional_id: form.profesional_id || null,
        fecha_inicio: form.fecha_inicio,
        fecha_fin: form.fecha_fin,
        hora_inicio: form.hora_inicio || null,
        hora_fin: form.hora_fin || null,
        motivo: form.motivo,
      })
      setForm({ profesional_id: '', fecha_inicio: '', fecha_fin: '', hora_inicio: '', hora_fin: '', motivo: '' })
      load()
    })
  }

  const handleEliminar = (id: string) => {
    startTransition(async () => {
      await eliminarBloqueo(id)
      load()
    })
  }

  const inputClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-[#0A2463] focus:outline-none focus:ring-2 focus:ring-[#1E6BC6]/30 bg-white"

  return (
    <div>
      {/* Form */}
      <div className="mb-6 p-5 bg-[#F4F6F9] rounded-xl border border-gray-200 space-y-4">
        <h3 className="text-xs font-bold text-[#374151] uppercase tracking-wide">Nuevo bloqueo</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wide mb-1">Profesional</label>
            <select
              value={form.profesional_id}
              onChange={(e) => setForm((f) => ({ ...f, profesional_id: e.target.value }))}
              className={inputClass + ' cursor-pointer'}
            >
              <option value="">Todos los profesionales</option>
              {profesionales.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wide mb-1">Motivo</label>
            <input
              type="text"
              value={form.motivo}
              onChange={(e) => setForm((f) => ({ ...f, motivo: e.target.value }))}
              placeholder="Ej: Vacaciones, feriado..."
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wide mb-1">Fecha inicio</label>
            <input type="date" value={form.fecha_inicio} onChange={(e) => setForm((f) => ({ ...f, fecha_inicio: e.target.value }))} className={inputClass + ' cursor-pointer'} />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wide mb-1">Fecha fin</label>
            <input type="date" value={form.fecha_fin} onChange={(e) => setForm((f) => ({ ...f, fecha_fin: e.target.value }))} className={inputClass + ' cursor-pointer'} />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wide mb-1">Hora inicio (opcional)</label>
            <input type="time" value={form.hora_inicio} onChange={(e) => setForm((f) => ({ ...f, hora_inicio: e.target.value }))} className={inputClass + ' cursor-pointer'} />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wide mb-1">Hora fin (opcional)</label>
            <input type="time" value={form.hora_fin} onChange={(e) => setForm((f) => ({ ...f, hora_fin: e.target.value }))} className={inputClass + ' cursor-pointer'} />
          </div>
        </div>

        {formError && <p className="text-xs text-red-600 font-semibold">{formError}</p>}

        <button
          onClick={handleCreate}
          disabled={isPending}
          className="text-xs font-bold px-5 py-2.5 bg-[#0A2463] text-white rounded-full hover:bg-[#1756b8] transition-colors cursor-pointer disabled:opacity-50 min-h-[36px]"
        >
          {isPending ? 'Guardando...' : 'Crear bloqueo'}
        </button>
      </div>

      {/* Active bloqueos */}
      <h3 className="text-xs font-bold text-[#374151] uppercase tracking-wide mb-3">Bloqueos activos</h3>

      {loading ? (
        <p className="text-sm text-[#9CA3AF] py-4">Cargando...</p>
      ) : bloqueos.length === 0 ? (
        <p className="text-sm text-[#9CA3AF] py-4 text-center">Sin bloqueos activos.</p>
      ) : (
        <div className="space-y-2">
          {bloqueos.map((b) => (
            <div key={b.id} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[#0A2463]">
                  {b.profesionales?.nombre ?? 'Todos los profesionales'}
                </p>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  {b.fecha_inicio === b.fecha_fin ? b.fecha_inicio : `${b.fecha_inicio} → ${b.fecha_fin}`}
                  {b.hora_inicio && b.hora_fin && ` · ${b.hora_inicio.substring(0,5)}–${b.hora_fin.substring(0,5)} hs`}
                </p>
                {b.motivo && <p className="text-xs text-[#9CA3AF] mt-0.5">{b.motivo}</p>}
              </div>
              <button
                onClick={() => handleEliminar(b.id)}
                disabled={isPending}
                className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors cursor-pointer disabled:opacity-50 shrink-0 mt-0.5"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────── */
export default function ConfiguracionPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('profesionales')

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'profesionales', label: 'Profesionales' },
    { key: 'disponibilidad', label: 'Disponibilidad' },
    { key: 'bloqueos', label: 'Bloqueos' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onLogout={handleLogout} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-6 w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer min-h-[36px] ${
                tab === t.key
                  ? 'bg-[#0A2463] text-white shadow-sm'
                  : 'text-[#6B7280] hover:text-[#0A2463] hover:bg-gray-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
          {tab === 'profesionales' && <TabProfesionales />}
          {tab === 'disponibilidad' && <TabDisponibilidad />}
          {tab === 'bloqueos' && <TabBloqueos />}
        </div>
      </main>
    </div>
  )
}
