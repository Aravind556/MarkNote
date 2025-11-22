import { useState, useRef, useEffect, ReactNode } from 'react'
import { GripVertical } from 'lucide-react'

interface ResizablePanelProps {
  children: ReactNode
  defaultWidth?: number
  minWidth?: number
  maxWidth?: number
  onResize?: (width: number) => void
  side?: 'left' | 'right'
  className?: string
  storageKey?: string
}

export default function ResizablePanel({
  children,
  defaultWidth = 256,
  minWidth = 200,
  maxWidth = 600,
  onResize,
  side = 'left',
  className = '',
  storageKey,
}: ResizablePanelProps) {
  const [width, setWidth] = useState(() => {
    if (storageKey && typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = parseInt(saved, 10)
        if (parsed >= minWidth && parsed <= maxWidth) {
          return parsed
        }
      }
    }
    return defaultWidth
  })
  const [isResizing, setIsResizing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isResizing) {
      // Always restore when not resizing
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth =
        side === 'left' ? e.clientX : window.innerWidth - e.clientX

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth)
        onResize?.(newWidth)
        if (storageKey) {
          localStorage.setItem(storageKey, newWidth.toString())
        }
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing, minWidth, maxWidth, onResize, side, storageKey])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
  }

  return (
    <div
      ref={panelRef}
      className={`relative flex-shrink-0 ${className}`}
      style={{ width: `${width}px` }}
    >
      {children}
      <div
        onMouseDown={handleMouseDown}
        className={`absolute top-0 bottom-0 w-1 cursor-col-resize hover:bg-notion-accent transition-colors ${
          side === 'left' ? 'right-0' : 'left-0'
        } ${isResizing ? 'bg-notion-accent' : 'bg-transparent'}`}
        style={{
          zIndex: 10,
        }}
      >
        <div
          className={`absolute top-1/2 -translate-y-1/2 ${
            side === 'left' ? '-right-1' : '-left-1'
          } w-3 h-8 bg-notion-sidebar-light dark:bg-notion-sidebar-dark border border-notion-border-light dark:border-notion-border-dark rounded flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity`}
        >
          <GripVertical className="w-3 h-3 text-gray-400" />
        </div>
      </div>
    </div>
  )
}

