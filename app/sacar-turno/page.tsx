import { getEspecialidades } from '@/app/actions/turnos'
import TurnoWizard from './TurnoWizard'
import PageHero from '@/components/PageHero'

export const metadata = {
  title: 'Sacar turno — 25 de Mayo Consultorios Médicos',
  description: 'Reservá tu turno online en segundos. Elegí tu especialidad, fecha y horario.',
}

export default async function SacarTurnoPage() {
  const especialidades = await getEspecialidades()

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <PageHero
        eyebrow="RESERVA ONLINE"
        title="Sacá tu turno en minutos"
        subtitle="Elegí especialidad, fecha y horario. Sin llamados, sin esperas."
        backgroundImage="/images/recepcion.jpeg"
      />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <TurnoWizard especialidades={especialidades} />
      </div>
    </div>
  )
}
