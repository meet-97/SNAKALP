import type { Metadata } from 'next'
import { Suspense } from 'react'
import type { ReactNode } from 'react'
import { Toaster } from 'sonner'
import './globals.css'
import CommandPalette from '@/components/CommandPalette'
import NavbarWithUser from '@/components/NavbarWithUser'
import { AppProvider } from '@/context/AppContext'
import { WorkspaceProvider } from '@/context/WorkspaceContext'

export const metadata: Metadata = {
  title: 'SNAKALP - Verified AI Creator Marketplace',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;1,9..144,500&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap"
        />
      </head>
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">
        <AppProvider>
          <WorkspaceProvider>
            <Suspense fallback={null}>
              <NavbarWithUser />
            </Suspense>
            <main>{children}</main>
            <Suspense fallback={null}>
              <CommandPalette />
            </Suspense>
            <Toaster position="bottom-right" />
          </WorkspaceProvider>
        </AppProvider>
      </body>
    </html>
  )
}
