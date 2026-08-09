'use client'

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

type RowActionMenuProps = {
  open: boolean
  onClose: () => void
  trigger: ReactNode
  children: ReactNode
  widthClassName?: string
}

export const RowActionMenu = ({
  open,
  onClose,
  trigger,
  children,
  widthClassName = 'w-36',
}: RowActionMenuProps) => {
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, left: 0, ready: false })

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return

    const updatePosition = () => {
      const triggerEl = triggerRef.current
      const menuEl = menuRef.current
      if (!triggerEl) return

      const rect = triggerEl.getBoundingClientRect()
      const menuWidth = menuEl?.offsetWidth ?? 144
      const menuHeight = menuEl?.offsetHeight ?? 160
      const gap = 4
      const spaceBelow = window.innerHeight - rect.bottom
      const openUp = spaceBelow < menuHeight + gap + 8

      const top = openUp
        ? Math.max(8, rect.top - menuHeight - gap)
        : rect.bottom + gap
      const left = Math.min(
        Math.max(8, rect.right - menuWidth),
        window.innerWidth - menuWidth - 8,
      )

      setPos({ top, left, ready: true })
    }

    updatePosition()
    // Remeasure after first paint when menu height is known
    requestAnimationFrame(updatePosition)
  }, [open, children])

  useEffect(() => {
    if (!open) {
      setPos((p) => ({ ...p, ready: false }))
      return
    }

    const handlePointer = (e: MouseEvent) => {
      const target = e.target as Node
      if (menuRef.current?.contains(target) || triggerRef.current?.contains(target)) {
        return
      }
      onClose()
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    window.addEventListener('scroll', onClose, true)
    window.addEventListener('resize', onClose)

    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
      window.removeEventListener('scroll', onClose, true)
      window.removeEventListener('resize', onClose)
    }
  }, [open, onClose])

  return (
    <div ref={triggerRef} className="relative inline-flex">
      {trigger}
      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className={`fixed z-50 bg-card border border-border rounded-xl shadow-lg py-1.5 ${widthClassName}`}
            style={{
              top: pos.top,
              left: pos.left,
              visibility: pos.ready ? 'visible' : 'hidden',
            }}
          >
            {children}
          </div>,
          document.body,
        )}
    </div>
  )
}
