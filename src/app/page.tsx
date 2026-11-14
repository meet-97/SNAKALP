import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import HomeView from '@/components/home/HomeView'
import { getCurrentUser } from '@/lib/auth'

async function HomeLoader() {
  const user = await getCurrentUser()
  if (user && !user.role) redirect('/welcome')

  const name = user ? user.displayName || user.companyName || user.email || 'there' : ''
  return <HomeView viewer={user ? { name, role: user.role } : null} />
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <HomeLoader />
    </Suspense>
  )
}
