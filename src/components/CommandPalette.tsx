'use client'

import { Command } from 'cmdk'
import { Compass, FileText, LogIn, Search, Trash2, User } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { mockCreators } from '@/data/mockCreators'
import { useWorkspace } from '@/context/WorkspaceContext'

export const OPEN_PALETTE_EVENT = 'snakalp:open-palette'

const itemClass =
  'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink data-[selected=true]:bg-ink data-[selected=true]:text-paper'

const groupClass =
  'px-1 pb-2 text-xs font-medium text-muted [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5'

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { clearShortlist, shortlist } = useWorkspace()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    function onOpen() {
      setOpen(true)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpen)
    }
  }, [])

  const go = useCallback(
    (path: string) => {
      setOpen(false)
      router.push(path)
    },
    [router]
  )

  if (pathname === '/login' || pathname === '/welcome') return null

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Search SNAKALP"
      overlayClassName="fixed inset-0 z-[70] bg-ink/40 backdrop-blur-sm"
      contentClassName="fixed left-1/2 top-[18%] z-[71] w-[92vw] max-w-xl -translate-x-1/2 overflow-hidden rounded-3xl border border-ink/10 bg-card shadow-[0_40px_80px_-30px_rgba(20,17,15,0.5)]"
    >
      <div className="flex items-center gap-3 border-b border-ink/10 px-4">
        <Search className="h-4 w-4 text-muted" aria-hidden />
        <Command.Input
          placeholder="Search creators, tools, pages..."
          className="h-14 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted"
        />
        <kbd className="rounded-md border border-ink/15 px-1.5 py-0.5 font-mono text-[11px] text-muted">Esc</kbd>
      </div>

      <Command.List className="max-h-[50vh] overflow-y-auto p-2">
        <Command.Empty className="px-3 py-8 text-center text-sm text-muted">
          Nothing found. Try a tool name like ComfyUI.
        </Command.Empty>

        <Command.Group heading="Go to" className={groupClass}>
          <Command.Item value="discover creators home" onSelect={() => go('/')} className={itemClass}>
            <Compass className="h-4 w-4" aria-hidden /> Discover creators
          </Command.Item>
          <Command.Item value="briefs my briefs" onSelect={() => go('/briefs')} className={itemClass}>
            <FileText className="h-4 w-4" aria-hidden /> Briefs
          </Command.Item>
          <Command.Item value="sign in switch account login" onSelect={() => go('/login')} className={itemClass}>
            <LogIn className="h-4 w-4" aria-hidden /> Sign in or switch account
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Creators" className={groupClass}>
          {mockCreators.map((creator) => (
            <Command.Item
              key={creator.id}
              value={`${creator.handle} ${creator.headline} ${creator.toolsUsed.join(' ')} ${creator.skills.join(' ')}`}
              onSelect={() => go(`/creator/${creator.id}`)}
              className={itemClass}
            >
              <User className="h-4 w-4 shrink-0" aria-hidden />
              <span className="font-medium">{creator.handle}</span>
              <span className="truncate text-xs opacity-70">{creator.headline}</span>
            </Command.Item>
          ))}
        </Command.Group>

        {shortlist.length > 0 && (
          <Command.Group heading="Actions" className={groupClass}>
            <Command.Item
              value="clear shortlist remove saved"
              onSelect={() => {
                clearShortlist()
                setOpen(false)
              }}
              className={itemClass}
            >
              <Trash2 className="h-4 w-4" aria-hidden /> Clear my shortlist ({shortlist.length})
            </Command.Item>
          </Command.Group>
        )}
      </Command.List>
    </Command.Dialog>
  )
}
