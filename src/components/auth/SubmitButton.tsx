'use client'

import type { ReactNode } from 'react'
import { useFormStatus } from 'react-dom'

type Props = {
  children: ReactNode
  pendingText?: string
  className?: string
}

export default function SubmitButton({ children, pendingText = 'Please wait...', className = '' }: Props) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {pending ? pendingText : children}
    </button>
  )
}
