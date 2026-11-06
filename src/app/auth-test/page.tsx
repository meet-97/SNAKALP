import { Suspense } from 'react'
import AuthStatus from './AuthStatus'
import AuthForms from './AuthForms'

export default function AuthTestPage() {
  return (
    <main className="mx-auto max-w-md space-y-8 p-6">
      <h1 className="text-2xl font-semibold">Auth test (temporary page)</h1>
      <Suspense fallback={<p className="text-slate-400">Checking session...</p>}>
        <AuthStatus />
      </Suspense>
      <AuthForms />
    </main>
  )
}