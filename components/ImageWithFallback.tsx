'use client'
import React, { useState } from 'react'
import Image from 'next/image'

interface Props {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
  style?: React.CSSProperties
}

export default function ImageWithFallback({ src, alt, fill, width, height, className, priority, style }: Props) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div
        className={`bg-gradient-to-br from-[#1E6BC6]/20 to-[#56B4E9]/20 flex items-center justify-center ${className ?? ''}`}
        style={!fill ? { width, height } : undefined}
      >
        <span className="text-[#1E6BC6]/60 text-sm font-medium px-4 text-center">{alt}</span>
      </div>
    )
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        style={style}
        onError={() => setError(true)}
        priority={priority}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      onError={() => setError(true)}
      priority={priority}
    />
  )
}
