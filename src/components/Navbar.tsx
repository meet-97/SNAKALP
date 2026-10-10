'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import BriefModal from '@/components/BriefModal';

const NAV_LINKS = [
  { href: '/', label: 'Discover' },
  { href: '/briefs', label: 'Briefs' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          </nav>
        </div>
      </header>

      <BriefModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}