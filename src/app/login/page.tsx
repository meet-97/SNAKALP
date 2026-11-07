import type { Metadata } from 'next'
import LoginExperience from '@/components/auth/LoginExperience'

export const metadata: Metadata = {
  title: 'Sign in - SNAKALP',
}

export default function LoginPage() {
  return <LoginExperience />
}
