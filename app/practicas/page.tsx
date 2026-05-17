import React from 'react'
import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import PracticasCatalog from './PracticasCatalog'

export const metadata: Metadata = {
  title: 'Prácticas y estudios — 25 de Mayo Consultorios Médicos',
  description:
    'Electrocardiograma, Ecocardiograma, Ecografía, Espirometrías, EEG de sueño, Papanicolau y muchas más prácticas médicas en Los Polvorines.',
}

export default function PracticasPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHero
        eyebrow="ESTUDIOS Y PROCEDIMIENTOS"
        title="Prácticas y estudios"
        subtitle="Realizamos una amplia variedad de estudios y procedimientos directamente en el centro médico."
      />
      <PracticasCatalog />
    </div>
  )
}
