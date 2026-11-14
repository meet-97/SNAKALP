import type { Metadata } from 'next'
import { Suspense } from 'react'
import BriefWizard from '@/components/BriefWizard'
import { requireRole } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'New brief - SNAKALP',
}

async function Gate() {
  // Only brands (and admins) can post briefs
  const user = await requireRole(['brand', 'admin'])
  return <BriefWizard defaultBrandName={user.companyName ?? user.displayName ?? ''} />
}

export default function NewBriefPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <Gate />
    </Suspense>
  )
}
