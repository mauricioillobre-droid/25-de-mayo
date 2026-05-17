'use client'
import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { WA_BASE } from '@/lib/data'
import PageHero from '@/components/PageHero'

const MapPinIcon = () => (
  <svg className="w-6 h-6 text-[#1E6BC6] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)
const PhoneIcon = () => (
  <svg className="w-6 h-6 text-[#1E6BC6] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
)
const MailIcon = () => (
  <svg className="w-6 h-6 text-[#1E6BC6] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)
const ClockIcon = () => (
  <svg className="w-6 h-6 text-[#1E6BC6] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" d="M12 6v6l4 2" />
  </svg>
)
const InstagramIcon = () => (
  <svg className="w-6 h-6 text-[#1E6BC6] shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
)
const WhatsAppIcon = () => (
  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

const motivos = [
  'Quiero sacar un turno',
  'Consulta sobre una práctica',
  'Consulta general',
  'Otro',
]

const labelCls = 'block text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-2'
const inputCls =
  'w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-white text-[#0A2463] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#56B4E9] focus:ring-2 focus:ring-[#56B4E9]/20 transition-all duration-200 text-sm'

interface FormState {
  nombre: string
  telefono: string
  email: string
  motivo: string
  mensaje: string
}

const contactInfo = [
  {
    icon: <MapPinIcon />,
    label: 'Dirección',
    content: (
      <p className="text-[#6B7280] text-sm leading-relaxed">
        25 de Mayo 2557, entre Savio y Suiza<br />
        Los Polvorines, Malvinas Argentinas
      </p>
    ),
  },
  {
    icon: <ClockIcon />,
    label: 'Horarios',
    content: (
      <div className="space-y-0.5">
        <p className="text-[#6B7280] text-sm">Lun – Vie: 8:00 a 18:00 hs</p>
        <p className="text-[#6B7280] text-sm">Sáb: 9:30 a 12:30 hs</p>
      </div>
    ),
  },
  {
    icon: <PhoneIcon />,
    label: 'Teléfono / WhatsApp',
    content: (
      <a href="tel:+5491122355689" className="text-[#1E6BC6] hover:text-[#0A2463] transition-colors text-sm font-medium">
        +54 9 11 2235-5689
      </a>
    ),
  },
  {
    icon: <MailIcon />,
    label: 'Email',
    content: (
      <a href="mailto:25demayocm@gmail.com" className="text-[#1E6BC6] hover:text-[#0A2463] transition-colors text-sm font-medium">
        25demayocm@gmail.com
      </a>
    ),
  },
  {
    icon: <InstagramIcon />,
    label: 'Instagram',
    content: (
      <a
        href="https://www.instagram.com/25demayo.cm/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#1E6BC6] hover:text-[#0A2463] transition-colors text-sm font-medium"
      >
        @25demayo.cm
      </a>
    ),
  },
]

export default function ContactoPage() {
  const [form, setForm] = useState<FormState>({
    nombre: '',
    telefono: '',
    email: '',
    motivo: motivos[0],
    mensaje: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const shouldReduce = useReducedMotion()
  const spring = { type: 'spring' as const, stiffness: 65, damping: 18 }

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const errs: typeof errors = {}
    if (!form.nombre.trim()) errs.nombre = 'El nombre es obligatorio.'
    if (!form.mensaje.trim()) errs.mensaje = 'El mensaje es obligatorio.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const buildText = () =>
    `Hola, soy ${form.nombre}.${form.telefono ? ` Mi teléfono es ${form.telefono}.` : ''}${form.email ? ` Mi email es ${form.email}.` : ''} Motivo: ${form.motivo}. ${form.mensaje}`

  const handleWhatsApp = () => {
    if (!validate()) return
    window.open(`${WA_BASE}?text=${encodeURIComponent(buildText())}`, '_blank', 'noopener,noreferrer')
  }

  const handleEmail = () => {
    if (!validate()) return
    const subject = encodeURIComponent(`[25 de Mayo CM] ${form.motivo}`)
    const body = encodeURIComponent(buildText())
    window.open(`mailto:25demayocm@gmail.com?subject=${subject}&body=${body}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      <PageHero
        eyebrow="ESTAMOS PARA AYUDARTE"
        title="Contactanos"
        subtitle="Respondemos por WhatsApp o email. También podés venir a visitarnos."
        backgroundImage="/images/recepcion.jpeg"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Form card */}
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, delay: 0.08 }}
            className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(10,36,99,0.08)] border border-gray-100 p-8 md:p-10"
          >
            <h2 className="text-xl font-black text-[#0A2463] mb-8">Envianos un mensaje</h2>
            <div className="space-y-5">
              <div>
                <label className={labelCls}>Nombre completo <span className="text-red-400 normal-case tracking-normal">*</span></label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={form.nombre}
                  onChange={update('nombre')}
                  className={inputCls}
                />
                {errors.nombre && <p className="text-red-500 text-xs mt-1.5">{errors.nombre}</p>}
              </div>

              <div>
                <label className={labelCls}>Teléfono</label>
                <input
                  type="tel"
                  placeholder="+54 9 11 ..."
                  value={form.telefono}
                  onChange={update('telefono')}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Email</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={update('email')}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Motivo</label>
                <select value={form.motivo} onChange={update('motivo')} className={inputCls}>
                  {motivos.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Mensaje <span className="text-red-400 normal-case tracking-normal">*</span></label>
                <textarea
                  rows={4}
                  placeholder="Escribí tu consulta..."
                  value={form.mensaje}
                  onChange={update('mensaje')}
                  className={`${inputCls} resize-none`}
                />
                {errors.mensaje && <p className="text-red-500 text-xs mt-1.5">{errors.mensaje}</p>}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={handleWhatsApp}
                  className="inline-flex items-center gap-2 whitespace-nowrap bg-[#25D366] hover:bg-[#1fba57] active:scale-[0.98] text-white font-bold py-3 px-6 rounded-full shadow-[0_4px_16px_rgba(37,211,102,0.3)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.4)] transition-all duration-200 cursor-pointer text-sm"
                >
                  <WhatsAppIcon />
                  Enviar por WhatsApp
                </button>
                <button
                  onClick={handleEmail}
                  className="inline-flex items-center gap-2 whitespace-nowrap bg-[#1E6BC6] hover:bg-[#155fad] active:scale-[0.98] text-white font-bold py-3 px-6 rounded-full shadow-[0_4px_16px_rgba(30,107,198,0.25)] hover:shadow-[0_6px_20px_rgba(30,107,198,0.35)] transition-all duration-200 cursor-pointer text-sm"
                >
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Enviar por Email
                </button>
              </div>
            </div>
          </motion.div>

          {/* Info + Map */}
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, delay: 0.14 }}
            className="space-y-6"
          >
            {/* Contact info card */}
            <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(10,36,99,0.08)] border border-gray-100 p-8">
              <h2 className="text-xl font-black text-[#0A2463] mb-7">Información de contacto</h2>
              <ul className="space-y-6">
                {contactInfo.map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div className="pt-0.5">
                      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-1">{item.label}</p>
                      {item.content}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(10,36,99,0.10)] border border-gray-100 h-56 md:h-64">
              <iframe
                title="Mapa 25 de Mayo Consultorios Médicos"
                src="https://maps.google.com/maps?q=25+de+Mayo+2557+Los+Polvorines+Buenos+Aires+Argentina&output=embed&z=16"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
