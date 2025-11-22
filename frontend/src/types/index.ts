export interface Note {
  id: number
  title: string
  content: string
  htmlContent?: string
  createdAt: string
}

export interface GrammarIssue {
  line: number
  offset?: number
  length?: number
  original: string
  suggestion: string
  explanation: string
}

export interface GrammarCheckResponse {
  correctedText: string
  issues: GrammarIssue[]
}

export interface AICorrectionResponse {
  correctedText: string
  issues: GrammarIssue[]
}

