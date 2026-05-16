import React from 'react'
import type { Metadata } from 'next'
import PracticasCatalog from './PracticasCatalog'

export const metadata: Metadata = {
  title: 'Prácticas y estudios — 25 de Mayo Consultorios Médicos',
  description:
    'Electrocardiograma, Ecocardiograma, Ecografía, Espirometrías, EEG de sueño, Papanicolau y muchas más prácticas médicas en Los Polvorines.',
}

export default function PracticasPage() {
  return (
    <div className="min-h-screen bg-[#F8FBFF]">
      {/* Page header */}
      <div className="bg-white border-b border-gray-100 pt-20 md:pt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <span className="inline-block text-[#1E6BC6] text-xs font-bold uppercase tracking-widest mb-4">
            Estudios y procedimientos
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A2463] mb-4 leading-tight">
            Prácticas y estudios
          </h1>
          <p className="text-[#6B7280] text-lg leading-relaxed max-w-xl">
            Realizamos una amplia variedad de estudios y procedimientos directamente en el centro médico.
          </p>
        </div>
      </div>

      <PracticasCatalog />
    </div>
  )
}
