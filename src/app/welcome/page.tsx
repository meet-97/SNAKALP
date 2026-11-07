import type { Metadata } from 'next'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { chooseRole, signOut } from '@/app/auth/actions'
import SubmitButton from '@/components/auth/SubmitButton'
import { getCurrentUser } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Welcome - SNAKALP',
}

const CHOICES = [
  {
    role: 'brand',
    title: "I'm hiring",
    body: 'Post briefs, see how every piece was made, and shortlist verified AI creators.',
    button: 'bg-indigo-600 hover:bg-indigo-700',
    glow: 'hover:border-indigo-300 hover:shadow-[0_30px_60px_-30px_rgba(79,70,229,0.45)]',
  },
  {
    role: 'creator',
    title: 'I make AI content',
    body: 'Build a profile that proves how you work, and get invited by brands that value it.',
    button: 'bg-orange-500 hover:bg-orange-600',
    glow: 'hover:border-orange-300 hover:shadow-[0_30px_60px_-30px_rgba(234,88,12,0.45)]',
  },
] as const

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f6f1e9] text-stone-900">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 45% at 15% 20%, rgba(251,146,60,0.22), transparent 70%), radial-gradient(55% 45% at 90% 85%, rgba(99,102,241,0.20), transparent 70%)',
        }}
      />
      <div className="relative mx-auto flex min-h-full max-w-3xl flex-col justify-center px-5 py-12">
        {children}
      </div>
    </div>
  )
}

async function WelcomeContent() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role) redirect('/')

  return (
    <Shell>
      <p className="text-sm font-semibold uppercase tracking-widest text-stone-500">One last step</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
        How will you use SNAKALP{user.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}?
      </h1>
      <p className="mt-3 max-w-xl text-stone-600">
        This sets up your account. You can only choose once, so pick the one that fits you.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {CHOICES.map((choice) => (
          <form
            key={choice.role}
            action={chooseRole}
            className={`flex flex-col rounded-3xl border border-stone-900/10 bg-white p-6 transition ${choice.glow}`}
          >
            <input type="hidden" name="role" value={choice.role} />
            <h2 className="font-serif text-2xl">{choice.title}</h2>
            <p className="mt-2 flex-1 text-sm text-stone-600">{choice.body}</p>
            <SubmitButton
              pendingText="Saving..."
              className={`mt-6 rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${choice.button}`}
            >
              Continue
            </SubmitButton>
          </form>
        ))}
      </div>

      <form action={signOut} className="mt-8">
        <button type="submit" className="text-sm text-stone-500 underline-offset-4 hover:text-stone-800 hover:underline">
          Not you? Sign out
        </button>
      </form>
    </Shell>
  )
}

export default function WelcomePage() {
  return (
    <Suspense fallback={<Shell>{null}</Shell>}>
      <WelcomeContent />
    </Suspense>
  )
}
