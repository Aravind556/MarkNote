import { Sparkles, Loader2 } from 'lucide-react'

interface EditorToolbarProps {
  onAICorrect: () => void
  isAILoading: boolean
  isChecking: boolean
}

export default function EditorToolbar({
  onAICorrect,
  isAILoading,
  isChecking,
}: EditorToolbarProps) {
  return (
    <div className="h-12 border-b border-notion-border-light dark:border-notion-border-dark flex items-center justify-between px-4 bg-notion-sidebar-light dark:bg-notion-sidebar-dark">
      <div className="flex items-center gap-2">
        {isChecking && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Checking grammar...</span>
          </div>
        )}
      </div>

      <button
        onClick={onAICorrect}
        disabled={isAILoading}
        className="btn-notion-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAILoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Correcting...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>AI Correct</span>
          </>
        )}
      </button>
    </div>
  )
}

