import { create } from 'zustand'
import type { Note, NoteListItem } from '../types'

interface NoteStore {
  notes: NoteListItem[]
  selectedNote: NoteListItem | null
  setNotes: (notes: NoteListItem[]) => void
  addNote: (note: NoteListItem) => void
  updateNote: (id: number, note: Partial<NoteListItem>) => void
  deleteNote: (id: number) => void
  setSelectedNote: (note: NoteListItem | null) => void
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

