import * as React from 'react'

type OmSymbolProps = React.SVGProps<SVGSVGElement> & {
  size?: number
}

export function OmSymbol({ size = 48, ...props }: OmSymbolProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Top curl (the chandra-bindu) */}
      <path d="M44 10c-2.5 0-4.5 1.8-4.5 4.2 0 2.2 1.8 3.8 4 3.8 1.6 0 2.8-1 2.8-2.6 0-1.4-1-2.4-2.4-2.4-.7 0-1.3.2-1.7.6" />
      <circle cx="40" cy="22" r="1.6" fill="currentColor" stroke="none" />
      {/* Main 3-shape */}
      <path d="M48 28c2.5 2.5 4 5.6 4 9 0 6-4.6 10-10 10-4 0-7-2-8.5-5-1.8 3-5 5-9 5-5 0-9-3.5-9-8.4 0-4.4 3-7.6 7-7.6 2.8 0 5 1.6 5 4.4 0 2.2-1.6 3.8-3.7 3.8-1.5 0-2.6-.8-3.1-2" />
      <path d="M14 30c2-3.4 5.4-5.5 9.4-5.5 4.6 0 8.4 2.6 9.6 7" />
      <path d="M52 26c-3-2-7-2.4-10 0" />
    </svg>
  )
}

export function LotusIcon({ size = 48, ...props }: OmSymbolProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M32 50c-10 0-18-5-18-12 4 0 8 1 12 4" />
      <path d="M32 50c10 0 18-5 18-12-4 0-8 1-12 4" />
      <path d="M32 50c-14 0-22-9-22-18 5 0 10 2 14 6" />
      <path d="M32 50c14 0 22-9 22-18-5 0-10 2-14 6" />
      <path d="M32 50c-6 0-10-4-10-10 0-6 4-12 10-18 6 6 10 12 10 18 0 6-4 10-10 10z" />
      <path d="M32 50V18" opacity={0.4} />
    </svg>
  )
}

export function KalashIcon({ size = 48, ...props }: OmSymbolProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <ellipse cx="32" cy="14" rx="10" ry="3" />
      <path d="M22 14c-2 6-8 9-8 16 0 9 8 16 18 16s18-7 18-16c0-7-6-10-8-16" />
      <path d="M24 46c2 4 5 6 8 6s6-2 8-6" />
      <path d="M32 8v4" />
    </svg>
  )
}

export function DiyaIcon({ size = 48, ...props }: OmSymbolProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M32 16c-3 2-5 5-5 8 0 3 2 5 5 5s5-2 5-5c0-3-2-6-5-8z" />
      <path d="M32 8c-1 1-1 3 0 4 1-1 1-3 0-4z" />
      <path d="M10 38c4 6 14 9 22 9s18-3 22-9c-4-2-12-3-22-3s-18 1-22 3z" />
      <path d="M14 42c2 4 8 6 18 6s16-2 18-6" />
    </svg>
  )
}
