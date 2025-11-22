import { create } from 'zustand'
import type { Note } from '../types'

interface NoteStore {
  notes: Note[]
  selectedNote: Note | null
  setNotes: (notes: Note[]) => void
  addNote: (note: Note) => void
  updateNote: (id: number, note: Partial<Note>) => void
  deleteNote: (id: number) => void
  setSelectedNote: (note: Note | null) => void
}

export const useNoteStore = create<NoteStore>((set) => ({
  notes: [],
  selectedNote: null,
  setNotes: (notes) => set({ notes }),
  addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
  updateNote: (id, updatedNote) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, ...updatedNote } : note
      ),
      selectedNote:
        state.selectedNote?.id === id
          ? { ...state.selectedNote, ...updatedNote }
          : state.selectedNote,
    })),
  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
      selectedNote: state.selectedNote?.id === id ? null : state.selectedNote,
    })),
  setSelectedNote: (note) => set({ selectedNote: note }),
}))

