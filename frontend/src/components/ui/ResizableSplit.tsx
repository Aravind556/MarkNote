import { useState, useRef, useEffect, ReactNode } from 'react'
import { GripVertical } from 'lucide-react'

interface ResizableSplitProps {
  left: ReactNode
  right: ReactNode
  defaultLeftWidth?: number
  defaultRightWidth?: number
  minLeftWidth?: number
  minRightWidth?: number
  onResize?: (leftWidth: number, rightWidth: number) => void
  className?: string
  storageKey?: string
}

export default function ResizableSplit({
  left,
  right,
  defaultLeftWidth = 50,
  defaultRightWidth = 50,
  minLeftWidth = 20,
  minRightWidth = 20,
  onResize,
  className = '',
  storageKey,
}: ResizableSplitProps) {
  const getInitialLeftWidth = () => {
    if (storageKey && typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = parseFloat(saved)
        if (parsed >= minLeftWidth && parsed <= 100 - minRightWidth) {
          return parsed
        }
      }
    }
    return defaultLeftWidth
  }

  const [leftWidth, setLeftWidth] = useState(getInitialLeftWidth)
  const [rightWidth, setRightWidth] = useState(() => 100 - getInitialLeftWidth())
  const [isResizing, setIsResizing] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isResizing) {
      // Always restore when not resizing
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const mouseX = e.clientX - containerRef.current.getBoundingClientRect().left
      const newLeftWidth = (mouseX / containerWidth) * 100
      const newRightWidth = 100 - newLeftWidth

      if (newLeftWidth >= minLeftWidth && newRightWidth >= minRightWidth) {
        setLeftWidth(newLeftWidth)
        setRightWidth(100 - newLeftWidth)
        onResize?.(newLeftWidth, 100 - newLeftWidth)
        if (storageKey) {
          localStorage.setItem(storageKey, newLeftWidth.toString())
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
  }, [isResizing, minLeftWidth, minRightWidth, onResize, storageKey])

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only start resizing if clicking directly on the resize handle
    if (e.currentTarget.contains(e.target as Node)) {
      e.preventDefault()
      e.stopPropagation()
      setIsResizing(true)
    }
  }

  return (
    <div ref={containerRef} className={`flex h-full ${className}`}>
      <div
        className="flex-shrink-0"
        style={{ width: `${leftWidth}%`, overflow: 'hidden', position: 'relative' }}
      >
        {left}
      </div>
      <div
        onMouseDown={handleMouseDown}
        className="resize-handle w-1 cursor-col-resize hover:bg-notion-accent transition-colors bg-notion-border-light dark:bg-notion-border-dark flex-shrink-0 relative group"
        style={{
          zIndex: 5,
          userSelect: 'none',
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-8 bg-notion-sidebar-light dark:bg-notion-sidebar-dark border border-notion-border-light dark:border-notion-border-dark rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <GripVertical className="w-3 h-3 text-gray-400" />
        </div>
      </div>
      <div
        className="flex-shrink-0"
        style={{ width: `${rightWidth}%`, overflow: 'hidden', position: 'relative' }}
      >
        {right}
      </div>
    </div>
  )
}

