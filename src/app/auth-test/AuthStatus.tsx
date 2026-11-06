import { createClient } from '@/lib/supabase/server'
import { chooseRole, signOut } from '@/app/auth/actions'

export default async function AuthStatus() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims

  if (!claims) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <p className="font-medium">Signed out</p>
      </div>
    )
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, display_name, company_name')
    .eq('id', claims.sub)
    .single()

  return (
    <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <p className="font-medium text-emerald-400">Signed in</p>
      <p className="text-sm text-slate-300">Email: {String(claims.email ?? '')}</p>
      <p className="text-sm text-slate-300">Role: {profile?.role ?? 'not chosen yet'}</p>
      <p className="text-sm text-slate-300">Name: {profile?.display_name || '-'}</p>

      {!profile?.role && (
        <form action={chooseRole} className="flex gap-2">
          <button name="role" value="brand" className="rounded-lg bg-violet-500 px-3 py-1.5 text-sm">
            I am a Brand
          </button>
          <button name="role" value="creator" className="rounded-lg bg-violet-500 px-3 py-1.5 text-sm">
            I am a Creator
          </button>
        </form>
      )}

      <form action={signOut}>
        <button className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm">Sign out</button>
      </form>
    </div>
  )
}