'use client'

import { useActionState, useState } from 'react'
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from '@/app/auth/actions'

const inputClass =
  'w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm'

export default function AuthForms() {
  const [role, setRole] = useState<'brand' | 'creator'>('brand')
  const [signUpState, signUpAction, signUpPending] = useActionState(signUpWithEmail, null)
  const [signInState, signInAction, signInPending] = useActionState(signInWithEmail, null)

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(['brand', 'creator'] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              role === r ? 'bg-violet-500' : 'border border-slate-700'
            }`}
          >
            {r === 'brand' ? 'Brand' : 'Creator'}
          </button>
        ))}
      </div>

      <form action={signInWithGoogle}>
        <input type="hidden" name="role" value={role} />
        <button className="w-full rounded-lg border border-slate-700 px-3 py-2 text-sm">
          Continue with Google as {role}
        </button>
      </form>

      <form action={signUpAction} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <p className="font-medium">Sign up (email)</p>
        <input type="hidden" name="role" value={role} />
        <input name="fullName" placeholder="Your name" className={inputClass} />
        {role === 'brand' && (
          <input name="companyName" placeholder="Company name" className={inputClass} />
        )}
        <input name="email" type="email" placeholder="Email" className={inputClass} />
        <input name="password" type="password" placeholder="Password (8+ characters)" className={inputClass} />
        <button disabled={signUpPending} className="rounded-lg bg-violet-500 px-3 py-2 text-sm">
          {signUpPending ? 'Creating...' : 'Create account'}
        </button>
        {signUpState?.error && <p className="text-sm text-rose-400">{signUpState.error}</p>}
        {signUpState?.message && <p className="text-sm text-emerald-400">{signUpState.message}</p>}
      </form>

      <form action={signInAction} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <p className="font-medium">Sign in (email)</p>
        <input name="email" type="email" placeholder="Email" className={inputClass} />
        <input name="password" type="password" placeholder="Password" className={inputClass} />
        <button disabled={signInPending} className="rounded-lg bg-violet-500 px-3 py-2 text-sm">
          {signInPending ? 'Signing in...' : 'Sign in'}
        </button>
        {signInState?.error && <p className="text-sm text-rose-400">{signInState.error}</p>}
      </form>
    </div>
  )
}