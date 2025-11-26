import { useState, useEffect, useRef } from 'react'
import { useDebounce } from '../../hooks/useDebounce'
import { useMutation } from '@tanstack/react-query'
import { noteApi } from '../../services/api'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
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
}: MarkdownEditorProps) {
  const [grammarIssues, setGrammarIssues] = useState<GrammarIssue[]>([])
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [activeIssue, setActiveIssue] = useState<GrammarIssue | null>(null)
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const debouncedContent = useDebounce(content, 1500)

  // Live grammar check
  const grammarCheckMutation = useMutation({
    mutationFn: (text: string) => noteApi.liveGrammarCheck(text),
    onSuccess: (issues) => {
      setGrammarIssues(issues)
      setIsChecking(false)
      if (issues.length > 0) {
        showPopupForIssue(issues[0])
      } else {
        setActiveIssue(null)
        setPopupPosition(null)
      }
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
      setActiveIssue(null)
      setPopupPosition(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedContent])

  const showPopupForIssue = (issue: GrammarIssue) => {
    if (!textareaRef.current) return
    const textarea = textareaRef.current
    const lineHeight = 24
    const charWidth = 9.6
    const line = issue.line ?? 0
    const col = issue.offset ?? 0
    const top = 16 + line * lineHeight - textarea.scrollTop + 24
    const left = 16 + col * charWidth
    setActiveIssue(issue)
    setPopupPosition({ top, left: Math.min(left, textarea.offsetWidth - 220) })
  }

  const handleAICorrect = () => {
    if (!content.trim()) {
      toast.error('Please add some content first')
      return
    }
    toast.error('AI correction endpoint not available. Please add POST /hi/ai-correct to backend.')
  }

  const handleAcceptSuggestion = (issue: GrammarIssue) => {
    const firstSuggestion = issue.suggestion.split(',')[0].trim()
    const start = issue.offset ?? 0
    const end = start + (issue.length ?? issue.original.length)
    const newContent = content.slice(0, start) + firstSuggestion + content.slice(end)
    onChange(newContent)
    const remaining = grammarIssues.filter((i) => i !== issue)
    setGrammarIssues(remaining)
    if (remaining.length > 0) {
      showPopupForIssue(remaining[0])
    } else {
      setActiveIssue(null)
      setPopupPosition(null)
    }
  }

  const handleDismissIssue = () => {
    if (!activeIssue) return
    const remaining = grammarIssues.filter((i) => i !== activeIssue)
    setGrammarIssues(remaining)
    if (remaining.length > 0) {
      showPopupForIssue(remaining[0])
    } else {
      setActiveIssue(null)
      setPopupPosition(null)
    }
  }

  const handleNextIssue = () => {
    if (!activeIssue || grammarIssues.length === 0) return
    const currentIndex = grammarIssues.indexOf(activeIssue)
    const nextIndex = (currentIndex + 1) % grammarIssues.length
    showPopupForIssue(grammarIssues[nextIndex])
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
        <div className="w-1/2 flex flex-col relative">
          <textarea
            ref={textareaRef}
            className="w-full h-full text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 text-base p-4 resize-none outline-none border-none font-mono"
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Start typing your markdown here..."
            spellCheck={false}
            style={{ fontFamily: 'JetBrains Mono, monospace', lineHeight: '24px' }}
          />

          {/* Smooth popup for active issue */}
          <AnimatePresence>
            {activeIssue && popupPosition && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 min-w-[200px] max-w-[300px]"
                style={{ top: popupPosition.top, left: popupPosition.left }}
              >
                <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white dark:border-t-gray-800" />
                <div className="text-xs text-gray-400 mb-1">
                  Issue {grammarIssues.indexOf(activeIssue) + 1} of {grammarIssues.length}
                </div>
                <div className="text-sm text-red-500 line-through mb-1">
                  {activeIssue.original}
                </div>
                <div className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">
                  → {activeIssue.suggestion.split(',')[0].trim()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  {activeIssue.explanation}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptSuggestion(activeIssue)}
                    className="flex-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded transition-colors"
                  >
                    Accept
                  </button>
                  {grammarIssues.length > 1 && (
                    <button
                      onClick={handleNextIssue}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium rounded transition-colors"
                    >
                      Next
                    </button>
                  )}
                  <button
                    onClick={handleDismissIssue}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium rounded transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Preview Panel */}
        <div className="w-1/2 flex flex-col border-l border-gray-200 dark:border-gray-700">
          <div className="flex-1 overflow-y-auto p-4">
            <textarea
              value={content}
              readOnly
              placeholder=""
              className="w-full h-full resize-none outline-none bg-transparent text-gray-900 dark:text-gray-100 font-mono text-base leading-relaxed pointer-events-none"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            />
          </div>

          {/* Grammar Issues Indicator */}
          {grammarIssues.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {grammarIssues.length} issue{grammarIssues.length !== 1 ? 's' : ''} found
              </div>
            </div>
          )}
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
