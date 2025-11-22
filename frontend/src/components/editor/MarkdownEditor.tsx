import { useState, useEffect } from 'react'
import { useDebounce } from '../../hooks/useDebounce'
import { useMutation } from '@tanstack/react-query'
import { noteApi } from '../../services/api'
import toast from 'react-hot-toast'
import EditorToolbar from './EditorToolbar'
import GrammarSuggestion from './GrammarSuggestion'
import type { GrammarIssue } from '../../types'

interface MarkdownEditorProps {
  content: string
  onChange: (content: string) => void
  noteId: number | null
}

export default function MarkdownEditor({
  content,
  onChange,
  noteId,
}: MarkdownEditorProps) {
  const [grammarIssues, setGrammarIssues] = useState<GrammarIssue[]>([])
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const debouncedContent = useDebounce(content, 1500)

  // Live grammar check
  const grammarCheckMutation = useMutation({
    mutationFn: (text: string) => noteApi.liveGrammarCheck(text),
    onSuccess: (issues) => {
      setGrammarIssues(issues)
      setIsChecking(false)
    },
    onError: () => {
      setIsChecking(false)
    },
  })

  // AI correction
  const aiCorrectionMutation = useMutation({
    mutationFn: (text: string) => noteApi.aiCorrect(text),
    onSuccess: (data) => {
      setShowAIPanel(true)
      setGrammarIssues(data.issues)
      toast.success('AI correction completed!')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'AI correction not available. Backend endpoint missing.')
    },
  })

  // Trigger grammar check on debounced content change
  useEffect(() => {
    if (debouncedContent && debouncedContent.length > 10) {
      setIsChecking(true)
      grammarCheckMutation.mutate(debouncedContent)
    } else {
      setGrammarIssues([])
      setIsChecking(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedContent])

  const handleAICorrect = () => {
    if (!content.trim()) {
      toast.error('Please add some content first')
      return
    }
    // Show info that AI correction requires backend endpoint
    toast.error('AI correction endpoint not available. Please add POST /hi/ai-correct to backend.')
    // Uncomment below when backend endpoint is added:
    // aiCorrectionMutation.mutate(content)
  }

  const handleAcceptSuggestion = (issue: GrammarIssue) => {
    // Replace the original text with suggestion
    const lines = content.split('\n')
    if (lines[issue.line]) {
      lines[issue.line] = lines[issue.line].replace(issue.original, issue.suggestion)
      onChange(lines.join('\n'))
      setGrammarIssues((prev) => prev.filter((i) => i !== issue))
    }
  }

  return (
    <div className="h-full flex flex-col bg-notion-bg-light dark:bg-notion-bg-dark">
      <EditorToolbar
        onAICorrect={handleAICorrect}
        isAILoading={aiCorrectionMutation.isPending}
        isChecking={isChecking}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-8">
            <textarea
              value={content}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Start writing your markdown note..."
              className="w-full h-full resize-none outline-none bg-transparent text-notion-text-light dark:text-notion-text-dark font-mono text-base leading-relaxed"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            />
          </div>

          {/* Grammar Issues Indicator */}
          {grammarIssues.length > 0 && (
            <div className="border-t border-notion-border-light dark:border-notion-border-dark p-2 bg-notion-sidebar-light dark:bg-notion-sidebar-dark flex-shrink-0">
              <div className="text-xs text-gray-400">
                {grammarIssues.length} issue{grammarIssues.length !== 1 ? 's' : ''} found
              </div>
            </div>
          )}
        </div>

        {/* Resize Handle */}
        <div
          className="w-1 cursor-col-resize hover:bg-notion-accent bg-notion-border-light dark:bg-notion-border-dark flex-shrink-0"
          onMouseDown={(e) => {
            e.preventDefault()
            const startX = e.clientX
            const startLeftWidth = 50
            const container = e.currentTarget.parentElement
            if (!container) return

            const handleMove = (moveEvent: MouseEvent) => {
              const containerWidth = container.offsetWidth
              const diff = moveEvent.clientX - startX
              const newLeftWidth = Math.max(30, Math.min(80, startLeftWidth + (diff / containerWidth) * 100))
              const leftPanel = container.children[0] as HTMLElement
              const rightPanel = container.children[2] as HTMLElement
              if (leftPanel && rightPanel) {
                leftPanel.style.width = `${newLeftWidth}%`
                rightPanel.style.width = `${100 - newLeftWidth}%`
              }
            }

            const handleUp = () => {
              document.removeEventListener('mousemove', handleMove)
              document.removeEventListener('mouseup', handleUp)
              document.body.style.cursor = ''
              document.body.style.userSelect = ''
            }

            document.addEventListener('mousemove', handleMove)
            document.addEventListener('mouseup', handleUp)
            document.body.style.cursor = 'col-resize'
            document.body.style.userSelect = 'none'
          }}
        />

        {/* Preview Panel */}
        <div className="w-1/2 h-full overflow-y-auto p-8 bg-notion-sidebar-light dark:bg-notion-sidebar-dark">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-notion-text-light dark:text-notion-text-dark">
              {content || <span className="text-gray-400">Preview will appear here...</span>}
            </pre>
          </div>
        </div>
      </div>

      {/* AI Correction Panel */}
      {showAIPanel && aiCorrectionMutation.data && (
        <GrammarSuggestion
          issues={aiCorrectionMutation.data.issues}
          correctedText={aiCorrectionMutation.data.correctedText}
          onAccept={(text) => {
            onChange(text)
            setShowAIPanel(false)
            toast.success('Correction applied!')
          }}
          onClose={() => setShowAIPanel(false)}
        />
      )}
    </div>
  )
}

