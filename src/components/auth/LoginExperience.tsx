'use client'

import Link from 'next/link'
import { useState, useSyncExternalStore } from 'react'
import AuthCard from './AuthCard'
import BrandScene from './BrandScene'
import CreatorScene from './CreatorScene'
import ModeSwitch from './ModeSwitch'
import SceneStage from './SceneStage'
import { COPY, type Mode } from './theme'

// Reads "?error=..." from the address bar without making the page wait for JavaScript
function subscribeToUrl(onChange: () => void) {
  window.addEventListener('popstate', onChange)
  return () => window.removeEventListener('popstate', onChange)
}

function readUrlError() {
  return new URLSearchParams(window.location.search).get('error') ?? ''
}

export default function LoginExperience() {
  const [mode, setMode] = useState<Mode>('brand')
  const urlError = useSyncExternalStore(subscribeToUrl, readUrlError, () => '') || undefined
  const copy = COPY[mode]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f6f1e9] text-stone-900">
      {/* Background: soft colour glows that change with the mode, plus a faint dot grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${mode === 'creator' ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background:
              'radial-gradient(60% 50% at 18% 28%, rgba(251,146,60,0.30), transparent 70%), radial-gradient(50% 45% at 88% 82%, rgba(244,114,182,0.20), transparent 70%)',
          }}
        />
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${mode === 'brand' ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background:
              'radial-gradient(60% 50% at 18% 28%, rgba(99,102,241,0.24), transparent 70%), radial-gradient(50% 45% at 88% 82%, rgba(56,189,248,0.22), transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: 'radial-gradient(rgba(28,25,23,0.09) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-full max-w-7xl flex-col px-5 py-6 sm:px-8">
        {/* Top bar: logo left, Brand/Creator switch in the centre */}
        <header className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <Link href="/" className="font-serif text-xl font-semibold tracking-wide text-stone-900">
            SNAKALP
          </Link>
          <div className="justify-self-start sm:justify-self-center">
            <ModeSwitch mode={mode} onChange={setMode} />
          </div>
          <span className="hidden sm:block" />
        </header>

        <main className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
          <section aria-live="polite">
            <p className="text-sm font-semibold uppercase tracking-widest text-stone-500">
              {copy.eyebrow}
            </p>
            <h1 className="mt-3 max-w-xl font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
              {copy.title}
            </h1>
            <p className="mt-4 max-w-lg text-base text-stone-600">{copy.body}</p>

            {/* The 3D scene is hidden on phones to keep the page fast and simple */}
            <div className="mt-8 hidden lg:block">
              <SceneStage>
                <div
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    mode === 'creator' ? 'opacity-100' : 'pointer-events-none opacity-0'
                  }`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <CreatorScene />
                </div>
                <div
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    mode === 'brand' ? 'opacity-100' : 'pointer-events-none opacity-0'
                  }`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <BrandScene />
                </div>
              </SceneStage>
            </div>
          </section>

          <section className="flex justify-center lg:justify-end">
            <AuthCard mode={mode} urlError={urlError} />
          </section>
        </main>
      </div>
    </div>
  )
}
