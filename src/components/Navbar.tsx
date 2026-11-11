'use client'

import { Bell, ChevronDown, LogOut, Menu, Plus, Search, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { signOut } from '@/app/auth/actions'
import BriefModal from '@/components/BriefModal'
import { OPEN_PALETTE_EVENT } from '@/components/CommandPalette'
import type { CurrentUser } from '@/lib/auth'

// Preview data. Real notifications arrive with the invitation flow (Phase 8).
const SAMPLE_NOTIFICATIONS = [
  { id: 1, text: 'A creator accepted your invitation', time: '10 min ago' },
  { id: 2, text: '3 new matches for "Summer reel"', time: 'Yesterday' },
  { id: 3, text: 'Welcome to SNAKALP', time: '2 days ago' },
]

function useOutsideClick(onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handle(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) onOutside()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [onOutside])
  return ref
}

function initialsOf(user: CurrentUser) {
  const source = user.displayName || user.email || '?'
  return source
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

export default function Navbar({ user }: { user: CurrentUser | null }) {
  const pathname = usePathname()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuRef = useOutsideClick(() => setMenuOpen(false))
  const bellRef = useOutsideClick(() => setBellOpen(false))

  // The login and welcome pages have their own full-screen design
  if (pathname === '/login' || pathname === '/welcome') return null

  const canPostBrief = user?.role === 'brand' || user?.role === 'admin'
  const links = [
    { href: '/', label: 'Discover' },
    ...(canPostBrief ? [{ href: '/briefs', label: 'Briefs' }] : []),
  ]

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-display text-2xl font-medium italic tracking-tight">
            snakalp<span className="text-vermilion">.</span>
          </Link>

          <nav className="ml-6 hidden items-center gap-1 md:flex" aria-label="Main">
            {links.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition ${
                    active ? 'bg-ink text-paper' : 'text-muted hover:bg-ink/5 hover:text-ink'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
              className="hidden items-center gap-2 rounded-full border border-ink/15 bg-card px-3 py-2 text-sm text-muted transition hover:border-ink/40 sm:flex"
              aria-label="Search (Ctrl K)"
            >
              <Search className="h-4 w-4" aria-hidden />
              <span>Search</span>
              <kbd className="rounded-md border border-ink/15 px-1.5 font-mono text-[10px]">Ctrl K</kbd>
            </button>

            <div className="relative" ref={bellRef}>
              <button
                type="button"
                onClick={() => setBellOpen((v) => !v)}
                aria-label="Notifications"
                aria-expanded={bellOpen}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-card transition hover:border-ink/40"
              >
                <Bell className="h-4 w-4" aria-hidden />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-vermilion" />
              </button>
              {bellOpen && (
                <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-ink/10 bg-card shadow-[0_30px_60px_-30px_rgba(20,17,15,0.5)]">
                  <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
                    <span className="font-display text-lg">Notifications</span>
                    <span className="rounded-full bg-lime px-2 py-0.5 font-mono text-[10px] uppercase">Preview</span>
                  </div>
                  <ul>
                    {SAMPLE_NOTIFICATIONS.map((item) => (
                      <li key={item.id} className="border-b border-ink/5 px-4 py-3 last:border-0">
                        <p className="text-sm">{item.text}</p>
                        <p className="mt-0.5 font-mono text-[10px] uppercase text-muted">{item.time}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {canPostBrief && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="hidden items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition hover:bg-vermilion sm:inline-flex"
              >
                <Plus className="h-4 w-4" aria-hidden /> New brief
              </button>
            )}

            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-expanded={menuOpen}
                  className="flex items-center gap-2 rounded-full border border-ink/15 bg-card py-1 pl-1 pr-2.5 transition hover:border-ink/40"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink font-mono text-xs text-lime">
                    {initialsOf(user)}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-ink/10 bg-card p-2 shadow-[0_30px_60px_-30px_rgba(20,17,15,0.5)]">
                    <div className="px-3 py-2">
                      <p className="truncate font-medium">{user.displayName || user.email}</p>
                      {user.displayName && <p className="truncate text-xs text-muted">{user.email}</p>}
                      {user.role && (
                        <span className="mt-2 inline-block rounded-full bg-ink px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-lime">
                          {user.role}
                        </span>
                      )}
                    </div>
                    <form action={signOut}>
                      <button
                        type="submit"
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-ink hover:text-paper"
                      >
                        <LogOut className="h-4 w-4" aria-hidden /> Sign out
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition hover:bg-vermilion"
              >
                Sign in
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={mobileOpen}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 md:hidden"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-ink/10 px-4 py-3 md:hidden">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-sm hover:bg-ink/5"
              >
                {link.label}
              </Link>
            ))}
            {canPostBrief && (
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false)
                  setIsModalOpen(true)
                }}
                className="mt-1 w-full rounded-xl bg-ink px-3 py-2.5 text-left text-sm font-semibold text-paper"
              >
                New brief
              </button>
            )}
          </div>
        )}
      </header>

      <BriefModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
