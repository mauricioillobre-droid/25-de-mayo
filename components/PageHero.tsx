'use client'
import Image from 'next/image'
import AnimateIn from '@/components/AnimateIn'

interface PageHeroProps {
  eyebrow: string
  title: string
  subtitle: string
  backgroundImage?: string
}

export default function PageHero({ eyebrow, title, subtitle, backgroundImage }: PageHeroProps) {
  return (
    <section
      className="relative pt-40 pb-20 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0A2463 0%, #0D3280 100%)' }}
    >
      {/* Background image (optional) */}
      {backgroundImage && (
        <>
          <Image src={backgroundImage} alt="" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-[#0A2463]/65" />
        </>
      )}

      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#1E6BC6]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#56B4E9]/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimateIn direction="up">
          <span className="inline-block text-[#56B4E9] text-xs font-bold uppercase tracking-widest mb-4">
            {eyebrow}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-5">
            {title}
          </h1>
        </AnimateIn>
        <AnimateIn direction="up" delay={0.15}>
          <p className="text-white/75 text-lg leading-relaxed max-w-xl mx-auto">
            {subtitle}
          </p>
        </AnimateIn>
      </div>
    </section>
  )
}
