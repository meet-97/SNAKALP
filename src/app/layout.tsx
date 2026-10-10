import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import Navbar from '@/components/Navbar';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'SNAKALP - Verified AI Creator Marketplace',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <AppProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}