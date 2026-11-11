'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { toast } from 'sonner'

const STORAGE_KEY = 'snakalp.shortlist.v1'
export const MAX_COMPARE = 3

type WorkspaceValue = {
  shortlist: string[]
  isShortlisted: (id: string) => boolean
  toggleShortlist: (id: string, label?: string) => void
  clearShortlist: () => void
  compare: string[]
  isComparing: (id: string) => boolean
  toggleCompare: (id: string) => void
  clearCompare: () => void
}

const WorkspaceContext = createContext<WorkspaceValue | null>(null)

// Shortlist is saved in this browser for now. In Phase 7 it moves to the database.
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [shortlist, setShortlist] = useState<string[]>([])
  const [compare, setCompare] = useState<string[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const parsed: unknown = raw ? JSON.parse(raw) : []
      if (Array.isArray(parsed)) {
        setShortlist(parsed.filter((value): value is string => typeof value === 'string'))
      }
    } catch {
      // Ignore broken saved data
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(shortlist))
    } catch {
      // Storage can be blocked (private mode). The app still works.
    }
  }, [shortlist, loaded])

  const toggleShortlist = useCallback((id: string, label?: string) => {
    const name = label ?? 'creator'
    setShortlist((current) => {
      if (current.includes(id)) {
        toast(`Removed ${name} from your shortlist`)
        return current.filter((item) => item !== id)
      }
      toast.success(`Saved ${name} to your shortlist`)
      return [...current, id]
    })
  }, [])

  const toggleCompare = useCallback((id: string) => {
    setCompare((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id)
      if (current.length >= MAX_COMPARE) {
        toast(`You can compare up to ${MAX_COMPARE} creators at once`)
        return current
      }
      return [...current, id]
    })
  }, [])

  const value = useMemo<WorkspaceValue>(
    () => ({
      shortlist,
      isShortlisted: (id) => shortlist.includes(id),
      toggleShortlist,
      clearShortlist: () => setShortlist([]),
      compare,
      isComparing: (id) => compare.includes(id),
      toggleCompare,
      clearCompare: () => setCompare([]),
    }),
    [shortlist, compare, toggleShortlist, toggleCompare]
  )

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useWorkspace(): WorkspaceValue {
  const value = useContext(WorkspaceContext)
  if (!value) throw new Error('useWorkspace must be used inside <WorkspaceProvider>')
  return value
}
