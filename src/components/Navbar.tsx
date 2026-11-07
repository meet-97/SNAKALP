'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { signOut } from '@/app/auth/actions';
import BriefModal from '@/components/BriefModal';
import type { CurrentUser } from '@/lib/auth';

const NAV_LINKS = [
  { href: '/', label: 'Discover' },
  { href: '/briefs', label: 'Briefs' },
];

export default function Navbar({ user }: { user: CurrentUser | null }) {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // The login page has its own full-screen design, so hide the app navbar there
  if (pathname === '/login' || pathname === '/welcome') return null;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <Link
            href="/"
            className="text-base font-bold tracking-wide text-violet-400 sm:text-lg"
          >
            SNAKALP
          </Link>

          <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`rounded-full px-2 py-1.5 text-sm font-medium transition sm:px-3 ${
                    isActive
                      ? 'bg-slate-800 text-slate-100'
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-full bg-violet-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-violet-400"
            >
              Post a Brief
            </button>

            {user ? (
              <div className="ml-1 flex items-center gap-2 border-l border-slate-800 pl-3">
                <span className="hidden text-xs text-slate-400 sm:inline">
                  {user.displayName || user.email}
                  {user.role && (
                    <span className="ml-1.5 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                      {user.role}
                    </span>
                  )}
                </span>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="rounded-full border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:text-white"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:text-white"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>

      <BriefModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}