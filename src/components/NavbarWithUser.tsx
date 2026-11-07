import { getCurrentUser } from '@/lib/auth'
import Navbar from '@/components/Navbar'

// Runs on the server: finds out who is signed in, then hands that to the Navbar
export default async function NavbarWithUser() {
  const user = await getCurrentUser()
  return <Navbar user={user} />
}
