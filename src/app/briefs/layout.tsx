import type { ReactNode } from 'react'

export default function BriefsLayout({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-4 py-8">{children}</div>
}
