'use client'

import { useActionState, useState } from 'react'
import {
  continueAsGuest,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from '@/app/auth/actions'
import SubmitButton from './SubmitButton'
import { COPY, THEME, type Mode } from './theme'

type Tab = 'signin' | 'signup'

const inputBase =
  'w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:ring-4'

function strengthOf(password: string) {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++
  return score
}

const STRENGTH_LABELS = ['Too short', 'Weak', 'Okay', 'Good', 'Strong']

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

function Field({
  label,
  name,
  type = 'text',
  autoComplete,
  placeholder,
  fieldClass,
}: {
  label: string
  name: string
  type?: string
  autoComplete?: string
  placeholder?: string
  fieldClass: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-stone-700">{label}</span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`${inputBase} ${fieldClass}`}
      />
    </label>
  )
}

function PasswordField({
  autoComplete,
  fieldClass,
  showStrength = false,
}: {
  autoComplete: string
  fieldClass: string
  showStrength?: boolean
}) {
  const [visible, setVisible] = useState(false)
  const [value, setValue] = useState('')
  const score = strengthOf(value)

  return (
    <div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-stone-700">Password</span>
        <div className="relative">
          <input
            name="password"
            type={visible ? 'text' : 'password'}
            autoComplete={autoComplete}
            placeholder={showStrength ? 'At least 8 characters' : 'Your password'}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className={`${inputBase} ${fieldClass} pr-16`}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            className="absolute inset-y-0 right-0 px-3.5 text-xs font-semibold text-stone-500 hover:text-stone-800"
          >
            {visible ? 'Hide' : 'Show'}
          </button>
        </div>
      </label>

      {showStrength && value.length > 0 && (
        <div className="mt-2" aria-live="polite">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((bar) => (
              <span
                key={bar}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  score >= bar ? (score >= 3 ? 'bg-emerald-500' : 'bg-amber-400') : 'bg-stone-200'
                }`}
              />
            ))}
          </div>
          <p className="mt-1 text-xs text-stone-500">{STRENGTH_LABELS[score]}</p>
        </div>
      )}
    </div>
  )
}

function Message({ error, message }: { error?: string; message?: string }) {
  if (error) {
    return (
      <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
        {error}
      </p>
    )
  }
  if (message) {
    return (
      <p role="status" className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
        {message}
      </p>
    )
  }
  return null
}

function SignUpForm({ mode }: { mode: Mode }) {
  const theme = THEME[mode]
  const [state, action] = useActionState(signUpWithEmail, null)

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="role" value={mode} />
      {mode === 'brand' && (
        <Field label="Company name" name="companyName" autoComplete="organization" placeholder="Acme Studios" fieldClass={theme.field} />
      )}
      <Field label="Your name" name="fullName" autoComplete="name" placeholder="Alex Morgan" fieldClass={theme.field} />
      <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@company.com" fieldClass={theme.field} />
      <PasswordField autoComplete="new-password" fieldClass={theme.field} showStrength />
      <Message error={state?.error} message={state?.message} />
      <SubmitButton
        pendingText="Creating account..."
        className={`w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition focus-visible:outline-2 focus-visible:outline-offset-2 ${theme.button}`}
      >
        Create account
      </SubmitButton>
    </form>
  )
}

function SignInForm({ mode }: { mode: Mode }) {
  const theme = THEME[mode]
  const [state, action] = useActionState(signInWithEmail, null)

  return (
    <form action={action} className="space-y-4">
      <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@company.com" fieldClass={theme.field} />
      <PasswordField autoComplete="current-password" fieldClass={theme.field} />
      <Message error={state?.error} message={state?.message} />
      <SubmitButton
        pendingText="Signing in..."
        className={`w-full rounded-xl px-4 py-3 text-sm font-semibold text-white transition focus-visible:outline-2 focus-visible:outline-offset-2 ${theme.button}`}
      >
        Sign in
      </SubmitButton>
    </form>
  )
}

export default function AuthCard({ mode, urlError }: { mode: Mode; urlError?: string }) {
  const [tab, setTab] = useState<Tab>('signup')
  const theme = THEME[mode]
  const copy = COPY[mode]

  const tabs: { value: Tab; label: string }[] = [
    { value: 'signup', label: 'Sign up' },
    { value: 'signin', label: 'Sign in' },
  ]

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl border border-stone-900/10 bg-white p-6 shadow-[0_30px_60px_-30px_rgba(41,37,36,0.35)] sm:p-8">
        <div role="tablist" aria-label="Account" className="mb-6 grid grid-cols-2 border-b border-stone-200">
          {tabs.map((t) => (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={tab === t.value}
              onClick={() => setTab(t.value)}
              className={`-mb-px border-b-2 pb-3 text-sm font-semibold transition-colors ${
                tab === t.value ? theme.tabActive : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <h2 className="font-serif text-2xl text-stone-900">
          {tab === 'signin' ? 'Welcome back' : copy.signupTitle}
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          {tab === 'signin' ? 'Sign in to continue to SNAKALP.' : copy.signupBody}
        </p>

        {urlError && (
          <p role="alert" className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
            Google sign-in did not finish. Please try again.
          </p>
        )}

        <form action={signInWithGoogle} className="mt-6">
          <input type="hidden" name="role" value={mode} />
          <SubmitButton
            pendingText="Opening Google..."
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
          >
            <GoogleIcon />
            Continue with Google
          </SubmitButton>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-stone-400">
          <span className="h-px flex-1 bg-stone-200" />
          or use email
          <span className="h-px flex-1 bg-stone-200" />
        </div>

        <div role="tabpanel">
          {tab === 'signup' ? <SignUpForm mode={mode} /> : <SignInForm mode={mode} />}
        </div>
      </div>

      <form action={continueAsGuest} className="mt-5 text-center">
        <SubmitButton
          pendingText="One moment..."
          className={`text-sm font-semibold underline-offset-4 hover:underline ${theme.link}`}
        >
          Continue as guest
        </SubmitButton>
        <p className="mt-1 text-xs text-stone-500">
          Browse creators without an account. Sign up later to post briefs.
        </p>
      </form>
    </div>
  )
}
