export interface Note {
  id: number
  title: string
  content: string
  htmlContent?: string
  createdAt: string
}

// NoteDto from /hi/all endpoint (only id and title)
export interface NoteListItem {
  id: number
  title: string
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

