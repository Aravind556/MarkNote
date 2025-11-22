import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { noteApi } from '../services/api'
import MarkdownEditor from '../components/editor/MarkdownEditor'
import { useNoteStore } from '../store/noteStore'

export default function NotePage() {
  const { id } = useParams<{ id: string }>()
  const { selectedNote, setSelectedNote } = useNoteStore()

  // Fetch note from the list since backend doesn't have direct getById endpoint
  const { data: notes } = useQuery({
    queryKey: ['notes'],
    queryFn: noteApi.getAllNotes,
  })

  const note = notes?.find((n) => n.id === Number(id))

  useEffect(() => {
    if (note) {
      setSelectedNote(note)
    }
  }, [note, setSelectedNote])

  const isLoading = !notes

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading note...</div>
      </div>
    )
  }

  if (!note && notes) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Note not found</div>
      </div>
    )
  }

  if (!note) {
    return null
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <MarkdownEditor
          content={note.content}
          onChange={(newContent) => {
            if (note) {
              setSelectedNote({ ...note, content: newContent })
            }
          }}
          noteId={note.id}
        />
      </div>
    </div>
  )
}

