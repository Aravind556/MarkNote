import axios from 'axios'
import type { Note, NoteListItem, GrammarIssue, GrammarCheckResponse, AICorrectionResponse } from '../types'

const API_BASE_URL = 'http://localhost:8080/hi'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const noteApi = {
  // Get all notes (returns only id and title)
  getAllNotes: async (): Promise<NoteListItem[]> => {
    const response = await api.get<NoteListItem[]>('/all')
    return response.data
  },

  // Get note by ID - Backend returns HTML, so we'll get it from the list instead
  // For now, we'll need to fetch from the list or add a new endpoint
  getNoteById: async (id: number): Promise<NoteListItem> => {
    // Since backend only returns HTML, we'll fetch from the list
    // TODO: Backend should add GET /hi/notes/{id} endpoint that returns Note JSON
    const notes = await noteApi.getAllNotes()
    const note = notes.find((n) => n.id === id)
    if (!note) {
      throw new Error(`Note with id ${id} not found`)
    }
    return note
  },

  // Get note HTML content by ID
  getNoteHtml: async (id: number): Promise<string> => {
    const response = await api.get<string>(`/${id}`, {
      headers: {
        'Accept': 'text/html',
      },
      responseType: 'text',
    })
    return response.data
  },

  // Get raw markdown content by ID
  getNoteRawContent: async (id: number): Promise<string> => {
    const response = await api.get<string>(`/${id}/raw`, {
      headers: {
        'Accept': 'text/plain',
      },
      responseType: 'text',
    })
    return response.data
  },

  // Upload/save note
  uploadNote: async (file: File): Promise<NoteListItem> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post<Note>('/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    // Return only id and title to match NoteListItem
    return { id: response.data.id, title: response.data.title }
  },

  // Live grammar check
  liveGrammarCheck: async (content: string): Promise<GrammarIssue[]> => {
    const response = await api.post<GrammarIssue[]>('/live', content, {
      headers: {
        'Content-Type': 'text/plain',
      },
    })
    return response.data
  },

  // Full grammar check
  grammarCheck: async (file: File): Promise<GrammarCheckResponse> => {
    const formData = new FormData()
    formData.append('File', file)
    const response = await api.post<GrammarIssue[]>('/grammar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    // Transform response to match expected structure
    return {
      correctedText: '', // Backend doesn't return this, would need to be handled
      issues: response.data,
    }
  },

  // AI correction - Currently not available in backend
  // TODO: Backend needs to add POST /hi/ai-correct endpoint
  // For now, this will fail gracefully
  aiCorrect: async (content: string): Promise<AICorrectionResponse> => {
    // Backend doesn't have this endpoint yet
    // You can either:
    // 1. Add the endpoint to backend (recommended)
    // 2. Use grammarCheck and show issues only
    throw new Error('AI correction endpoint not available. Please add POST /hi/ai-correct to backend.')
  },
}

export default api

