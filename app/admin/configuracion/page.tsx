'use client'

import { useState, useEffect, useTransition, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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
import { Stethoscope, Clock, CalendarOff } from 'lucide-react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

/* ─── Types ──────────────────────────────────────────── */
type Tab = 'profesionales' | 'disponibilidad' | 'bloqueos'

const DIAS_SEMANA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

/* ─── TAB: Profesionales ─────────────────────────────── */
const DURACIONES = [10, 15, 20, 30, 45, 60]

function TabProfesionales() {
  const [profesionales, setProfesionales] = useState<ProfesionalCompleto[]>([])
  const [especialidades, setEspecialidades] = useState<{ id: string; nombre: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(false)
  const [newNombre, setNewNombre] = useState('')
  const [newEspIds, setNewEspIds] = useState<string[]>([])
  const [newDuracion, setNewDuracion] = useState(30)
  const [newEdadMin, setNewEdadMin] = useState('')
  const [newEdadMax, setNewEdadMax] = useState('')
  const [newNotas, setNewNotas] = useState('')
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
      await crearProfesional(newNombre.trim(), newEspIds, {
        duracion_turno: newDuracion,
        edad_minima: newEdadMin ? parseInt(newEdadMin) : null,
        edad_maxima: newEdadMax ? parseInt(newEdadMax) : null,
        notas: newNotas.trim() || undefined,
      })
      setNewNombre('')
      setNewEspIds([])
      setNewDuracion(30)
      setNewEdadMin('')
      setNewEdadMax('')
      setNewNotas('')
      setShowForm(false)
      load()
    })
  }

  const toggleEsp = (id: string) => {
    setNewEspIds((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    )
  }

  if (loading) return <div className="py-12 text-center text-sm text-gray-400">Cargando...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{profesionales.length} profesionales registrados</p>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="text-xs font-bold px-4 py-2 bg-[#0A2463] text-white rounded-full hover:bg-[#1756b8] transition-colors cursor-pointer min-h-[36px]"
        >
          + Agregar
        </button>
      </div>

      {showForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Nuevo profesional</h3>
          <input
            type="text"
            value={newNombre}
            onChange={(e) => setNewNombre(e.target.value)}
            placeholder="Nombre completo"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-[#0A2463] focus:outline-none focus:ring-2 focus:ring-[#1E6BC6]/30 bg-white"
          />
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Especialidades</p>
            <div className="flex flex-wrap gap-2">
              {especialidades.map((esp) => (
                <button
                  key={esp.id}
                  onClick={() => toggleEsp(esp.id)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    newEspIds.includes(esp.id)
                      ? 'bg-[#0A2463] text-white border-[#0A2463]'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#1E6BC6]'
                  }`}
                >
                  {esp.nombre}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Duración del turno</p>
              <select
                value={newDuracion}
                onChange={(e) => setNewDuracion(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-[#0A2463] focus:outline-none focus:ring-2 focus:ring-[#1E6BC6]/30 bg-white cursor-pointer"
              >
                {DURACIONES.map((d) => (
                  <option key={d} value={d}>{d} min</option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Edad mínima</p>
              <input
                type="number"
                min={0}
                value={newEdadMin}
                onChange={(e) => setNewEdadMin(e.target.value)}
                placeholder="Sin límite"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-[#0A2463] focus:outline-none focus:ring-2 focus:ring-[#1E6BC6]/30 bg-white"
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1">Edad máxima</p>
              <input
                type="number"
                min={0}
                value={newEdadMax}
                onChange={(e) => setNewEdadMax(e.target.value)}
                placeholder="Sin límite"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-[#0A2463] focus:outline-none focus:ring-2 focus:ring-[#1E6BC6]/30 bg-white"
              />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-1">Notas</p>
            <textarea
              value={newNotas}
              onChange={(e) => setNewNotas(e.target.value)}
              placeholder="Ej: Atiende cada 15 días, orden de llegada..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-[#0A2463] focus:outline-none focus:ring-2 focus:ring-[#1E6BC6]/30 bg-white resize-none"
            />
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
              onClick={() => {
                setShowForm(false)
                setFormError(null)
                setNewNombre('')
                setNewEspIds([])
                setNewDuracion(30)
                setNewEdadMin('')
                setNewEdadMax('')
                setNewNotas('')
              }}
              className="text-xs font-semibold px-4 py-2 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {profesionales.map((p) => {
          const espNombres = p.profesional_especialidades
            ?.map((pe: any) => pe.especialidades?.nombre)
            .filter(Boolean) ?? []
          return (
            <div key={p.id} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm ${p.activo ? 'text-[#0A2463]' : 'text-gray-400'}`}>
                  {p.nombre}
                </p>
                {espNombres.length > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{espNombres.join(', ')}</p>
                )}
              </div>
              <button
                onClick={() => handleToggle(p.id, p.activo)}
                disabled={isPending}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1E6BC6]/30 disabled:opacity-50 ${
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
    DIAS_SEMANA.map((_, i) => ({ dia_semana: i, hora_inicio: '08:00', hora_fin: '18:00', activo: false, frecuencia: 'semanal' }))
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
        return found ?? { dia_semana: i, hora_inicio: '08:00', hora_fin: '18:00', activo: false, frecuencia: 'semanal' }
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
    setDias((prev) => prev.map((d, i) => (i === idx ? { ...d, [field]: value } : d)))
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
      <div className="mb-6">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
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
        <p className="text-sm text-gray-400 text-center py-8">
          Seleccioná un profesional para ver su disponibilidad.
        </p>
      )}

      {selectedId && (
        <>
          {loading ? (
            <div className="py-8 text-center text-sm text-gray-400">Cargando...</div>
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
                    <div className="flex items-center gap-3 w-32">
                      <button
                        onClick={() => updateDia(idx, 'activo', !dia.activo)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                          dia.activo ? 'bg-[#0A2463]' : 'bg-gray-200'
                        }`}
                        role="switch"
                        aria-checked={dia.activo}
                      >
                        <span
                          className={`inline-block h-4 w-4 rounded-full bg-white shadow transition duration-200 ${
                            dia.activo ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <span className={`text-sm font-bold ${dia.activo ? 'text-[#0A2463]' : 'text-gray-400'}`}>
                        {DIAS_SEMANA[idx]}
                      </span>
                    </div>

                    {dia.activo && (
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="time"
                          value={dia.hora_inicio}
                          onChange={(e) => updateDia(idx, 'hora_inicio', e.target.value)}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-[#0A2463] focus:outline-none focus:ring-2 focus:ring-[#1E6BC6]/30 cursor-pointer"
                        />
                        <span className="text-gray-400 text-xs font-semibold">a</span>
                        <input
                          type="time"
                          value={dia.hora_fin}
                          onChange={(e) => updateDia(idx, 'hora_fin', e.target.value)}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-[#0A2463] focus:outline-none focus:ring-2 focus:ring-[#1E6BC6]/30 cursor-pointer"
                        />
                        <select
                          value={dia.frecuencia ?? 'semanal'}
                          onChange={(e) => updateDia(idx, 'frecuencia', e.target.value)}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-[#0A2463] focus:outline-none focus:ring-2 focus:ring-[#1E6BC6]/30 bg-white cursor-pointer"
                        >
                          <option value="semanal">Semanal (todas las semanas)</option>
                          <option value="quincenal_1">Quincenal — 1ra quincena (sem. 1 y 3)</option>
                          <option value="quincenal_2">Quincenal — 2da quincena (sem. 2 y 4)</option>
                          <option value="mensual_1">1 vez por mes — semana 1</option>
                          <option value="mensual_2">1 vez por mes — semana 2</option>
                          <option value="mensual_3">1 vez por mes — semana 3</option>
                          <option value="mensual_4">1 vez por mes — semana 4</option>
                        </select>
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

  const inputClass = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-[#0A2463] focus:outline-none focus:ring-2 focus:ring-[#1E6BC6]/30 bg-white'

  return (
    <div>
      <div className="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Nuevo bloqueo</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Profesional</label>
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
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Motivo</label>
            <input
              type="text"
              value={form.motivo}
              onChange={(e) => setForm((f) => ({ ...f, motivo: e.target.value }))}
              placeholder="Ej: Vacaciones, feriado..."
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Fecha inicio</label>
            <input
              type="date"
              value={form.fecha_inicio}
              onChange={(e) => setForm((f) => ({ ...f, fecha_inicio: e.target.value }))}
              className={inputClass + ' cursor-pointer'}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Fecha fin</label>
            <input
              type="date"
              value={form.fecha_fin}
              onChange={(e) => setForm((f) => ({ ...f, fecha_fin: e.target.value }))}
              className={inputClass + ' cursor-pointer'}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Hora inicio (opcional)</label>
            <input
              type="time"
              value={form.hora_inicio}
              onChange={(e) => setForm((f) => ({ ...f, hora_inicio: e.target.value }))}
              className={inputClass + ' cursor-pointer'}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Hora fin (opcional)</label>
            <input
              type="time"
              value={form.hora_fin}
              onChange={(e) => setForm((f) => ({ ...f, hora_fin: e.target.value }))}
              className={inputClass + ' cursor-pointer'}
            />
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

      <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">Bloqueos activos</h3>

      {loading ? (
        <p className="text-sm text-gray-400 py-4">Cargando...</p>
      ) : bloqueos.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">Sin bloqueos activos.</p>
      ) : (
        <div className="space-y-2">
          {bloqueos.map((b) => (
            <div key={b.id} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[#0A2463]">
                  {b.profesionales?.nombre ?? 'Todos los profesionales'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {b.fecha_inicio === b.fecha_fin ? b.fecha_inicio : `${b.fecha_inicio} → ${b.fecha_fin}`}
                  {b.hora_inicio && b.hora_fin && ` · ${b.hora_inicio.substring(0, 5)}–${b.hora_fin.substring(0, 5)} hs`}
                </p>
                {b.motivo && <p className="text-xs text-gray-400 mt-0.5">{b.motivo}</p>}
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
const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'profesionales', label: 'Profesionales', icon: Stethoscope },
  { key: 'disponibilidad', label: 'Disponibilidad', icon: Clock },
  { key: 'bloqueos', label: 'Bloqueos', icon: CalendarOff },
]

export default function ConfiguracionPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('profesionales')
  const [userEmail, setUserEmail] = useState<string | undefined>()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? undefined)
    })
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const currentDate = new Date().toLocaleDateString('es-AR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar userEmail={userEmail} onLogout={handleLogout} />

      <div className="flex-1 flex flex-col" style={{ marginLeft: '16rem' }}>
        {/* Page Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#0A2463] text-balance">Ajustes</h1>
          <span className="text-sm text-gray-400 capitalize">{currentDate}</span>
        </header>

        <main className="flex-1 p-8">
          {/* Tabs pill style */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 w-fit">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 cursor-pointer min-h-[36px] ${
                  tab === key
                    ? 'bg-white text-[#0A2463] shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {tab === 'profesionales' && <TabProfesionales />}
            {tab === 'disponibilidad' && <TabDisponibilidad />}
            {tab === 'bloqueos' && <TabBloqueos />}
          </div>
        </main>
      </div>
    </div>
  )
}
