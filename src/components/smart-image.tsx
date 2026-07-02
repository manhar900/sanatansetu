'use client'

import * as React from 'react'
import { OmSymbol } from '@/components/sacred-icons'
import { cn } from '@/lib/utils'

type SmartImageProps = {
  src?: string | null
  alt: string
  className?: string
  fallback?: React.ReactNode
  showError?: boolean
  containerClassName?: string
}

// A defensive image component: if the remote image fails to load (CORS,
// 404, broken hotlink protection), we show a graceful fallback instead of
// the broken-image icon. Uses referrerPolicy="no-referrer" to dodge the
// most common hotlink-protection blocks.
export function SmartImage({
  src,
  alt,
  className,
  fallback,
  showError = true,
  containerClassName,
}: SmartImageProps) {
  const [hasError, setHasError] = React.useState(false)

  // Reset error state whenever the src prop changes.
  React.useEffect(() => {
    setHasError(false)
  }, [src])

  if (!src || hasError) {
    if (fallback) {
      return <div className={containerClassName}>{fallback}</div>
    }
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2 text-muted-foreground/60',
          containerClassName
        )}
        role="img"
        aria-label={alt}
      >
        <OmSymbol className="h-10 w-10 opacity-50" />
        {showError && hasError && (
          <span className="text-[0.65rem] uppercase tracking-wider">
            image unavailable
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={containerClassName}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setHasError(true)}
        className={className}
      />
    </div>
  )
}
