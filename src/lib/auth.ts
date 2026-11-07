import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type Role = 'brand' | 'creator' | 'admin'

export type CurrentUser = {
  id: string
  email: string | null
  role: Role | null
  displayName: string | null
  companyName: string | null
  avatarUrl: string | null
}

// Who is signed in right now? Returns null for guests.
// cache() means that if several parts of one page ask, we only look it up once.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient()

  // getClaims() checks the login token properly. Never trust getSession() on the server.
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims
  if (!claims) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, display_name, company_name, avatar_url')
    .eq('id', claims.sub)
    .single()

  return {
    id: claims.sub,
    email: typeof claims.email === 'string' ? claims.email : null,
    role: (profile?.role as Role | null) ?? null,
    displayName: profile?.display_name ?? null,
    companyName: profile?.company_name ?? null,
    avatarUrl: profile?.avatar_url ?? null,
  }
})

// Use at the top of any page that needs a signed-in user with a chosen role
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (!user.role) redirect('/welcome')
  return user
}

// Use when only certain roles may see a page, for example requireRole(['admin'])
export async function requireRole(allowed: Role[]): Promise<CurrentUser> {
  const user = await requireUser()
  if (!user.role || !allowed.includes(user.role)) redirect('/')
  return user
}
