import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  // Only allow redirects inside our own site
  let next = searchParams.get('next') ?? '/'
  if (!next.startsWith('/') || next.startsWith('//')) next = '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // If the person picked Brand/Creator before using Google, save it now.
      // set_my_role refuses if a role already exists, so this is safe.
      const cookieStore = await cookies()
      const pendingRole = cookieStore.get('pending_role')?.value
      if (pendingRole === 'brand' || pendingRole === 'creator') {
        await supabase.rpc('set_my_role', { new_role: pendingRole })
      }
      cookieStore.delete('pending_role')

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocal = process.env.NODE_ENV === 'development'

      if (!isLocal && forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=callback`)
}
