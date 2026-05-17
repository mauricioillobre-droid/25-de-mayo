import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import Instalaciones from '@/components/home/Instalaciones'
import SobreNosotros from '@/components/home/SobreNosotros'
import EspecialidadesDestacadas from '@/components/home/EspecialidadesDestacadas'
import PracticasDestacadas from '@/components/home/PracticasDestacadas'
import PorQueElegirnos from '@/components/home/PorQueElegirnos'
import ComoLlegar from '@/components/home/ComoLlegar'

export const metadata: Metadata = {
  title: '25 de Mayo Consultorios Médicos — Tu salud cerca de casa | Los Polvorines',
  description:
    'Centro médico en Los Polvorines con más de 35 especialidades. Cardiología, Pediatría, Ginecología, Neurología y mucho más. Sacá tu turno por WhatsApp.',
}

export default function Home() {
  return (
    <>
      <Hero />
      <Instalaciones />
      <SobreNosotros />
      <EspecialidadesDestacadas />
      <PracticasDestacadas />
      <PorQueElegirnos />
      <ComoLlegar />
    </>
  )
}
