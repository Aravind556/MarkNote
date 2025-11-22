import { X, Check, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GrammarIssue } from '../../types'

interface GrammarSuggestionProps {
  issues: GrammarIssue[]
  correctedText: string
  onAccept: (text: string) => void
  onClose: () => void
}

export default function GrammarSuggestion({
  issues,
  correctedText,
  onAccept,
  onClose,
}: GrammarSuggestionProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-96 bg-notion-sidebar-light dark:bg-notion-sidebar-dark border-l border-notion-border-light dark:border-notion-border-dark shadow-xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="h-12 border-b border-notion-border-light dark:border-notion-border-dark flex items-center justify-between px-4">
          <h3 className="font-semibold text-sm">AI Corrections</h3>
          <button onClick={onClose} className="btn-notion p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <button
              onClick={() => onAccept(correctedText)}
              className="btn-notion-primary w-full flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Accept All Corrections
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-notion-text-light dark:text-notion-text-dark">
              Issues Found ({issues.length})
            </h4>
            {issues.map((issue, index) => (
              <div
                key={index}
                className="p-3 rounded border border-notion-border-light dark:border-notion-border-dark bg-notion-bg-light dark:bg-notion-bg-dark"
              >
                <div className="flex items-start gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-notion-error mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs text-gray-400 mb-1">Line {issue.line + 1}</div>
                    <div className="text-sm font-mono bg-notion-hover-light dark:bg-notion-hover-dark p-2 rounded mb-2">
                      {issue.original}
                    </div>
                    <div className="text-sm text-notion-text-light dark:text-notion-text-dark">
                      <span className="text-gray-400">→</span>{' '}
                      <span className="font-medium">{issue.suggestion}</span>
                    </div>
                    {issue.explanation && (
                      <div className="text-xs text-gray-400 mt-1">{issue.explanation}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

