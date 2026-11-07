'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type ActionState = { error?: string; message?: string } | null

type Role = 'brand' | 'creator'

function parseRole(value: FormDataEntryValue | null): Role | null {
  return value === 'brand' || value === 'creator' ? value : null
}

// Only allow paths inside our own site (blocks "https://evil.com" tricks)
function safeNext(formData: FormData) {
  const next = String(formData.get('next') ?? '/')
  return next.startsWith('/') && !next.startsWith('//') ? next : '/'
}

// Works out the website address (http://localhost:3000 or your live URL)
async function getOrigin() {
  const h = await headers()
  const origin = h.get('origin')
  if (origin) return origin
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  return `${proto}://${host}`
}

export async function signUpWithEmail(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const role = parseRole(formData.get('role'))
  const fullName = String(formData.get('fullName') ?? '').trim()
  const companyName = String(formData.get('companyName') ?? '').trim()
  const next = safeNext(formData)

  if (!role) return { error: 'Please choose Brand or Creator first.' }
  if (role === 'brand' && !companyName) return { error: 'Please enter your company name.' }
  if (!fullName) return { error: 'Please enter your name.' }
  if (!email || !password) return { error: 'Email and password are required.' }
  if (password.length < 8) return { error: 'Password must be at least 8 characters.' }

  const supabase = await createClient()
  const origin = await getOrigin()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Copied into the profile by the database trigger from Step 2
      data: { role, full_name: fullName, company_name: companyName },
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  })

  if (error) return { error: error.message }

  // If "Confirm email" is ON in Supabase there is no session yet
  if (!data.session) {
    return { message: 'Account created. Check your email to confirm it, then sign in.' }
  }

  redirect(next)
}

export async function signInWithEmail(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const next = safeNext(formData)

  if (!email || !password) return { error: 'Email and password are required.' }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message }

  redirect(next)
}

export async function signInWithGoogle(formData: FormData) {
  const role = parseRole(formData.get('role'))
  const next = safeNext(formData)
  const supabase = await createClient()
  const origin = await getOrigin()

  // Remember the chosen role for 10 minutes. The callback route applies it.
  if (role) {
    const cookieStore = await cookies()
    cookieStore.set('pending_role', role, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 600,
      secure: process.env.NODE_ENV === 'production',
    })
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}` },
  })

  if (error || !data.url) redirect('/login?error=google')

  redirect(data.url)
}

// Guest mode: remember for 30 days that this visitor chose to browse without an account
export async function continueAsGuest() {
  const cookieStore = await cookies()
  cookieStore.set('snakalp_guest', '1', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === 'production',
  })
  redirect('/')
}

export async function chooseRole(formData: FormData) {
  const role = parseRole(formData.get('role'))
  if (!role) return

  const supabase = await createClient()
  await supabase.rpc('set_my_role', { new_role: role })

  redirect('/')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
