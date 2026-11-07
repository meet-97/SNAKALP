import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          )
        },
      },
    }
  )

  // Refreshes the login session if needed, and tells us who is signed in.
  const { data } = await supabase.auth.getClaims()
  const isSignedIn = Boolean(data?.claims)
  const isGuest = request.cookies.get('snakalp_guest')?.value === '1'
  const { pathname } = request.nextUrl

  // Any redirect we send must also carry the refreshed login cookies
  function redirectTo(path: string) {
    const url = request.nextUrl.clone()
    url.pathname = path
    url.search = ''
    const response = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie))
    return response
  }

  // The API (for example the AI brief builder) costs money, so it needs a signed-in user
  if (pathname.startsWith('/api/') && !isSignedIn) {
    return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })
  }

  const isPublicPath = pathname === '/login' || pathname.startsWith('/auth/')

  // First-time visitors see the login page, unless they chose guest mode
  if (!isSignedIn && !isGuest && !isPublicPath) {
    return redirectTo('/login')
  }

  // Already signed in? No need to see the login page again
  if (isSignedIn && pathname === '/login') {
    return redirectTo('/')
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
