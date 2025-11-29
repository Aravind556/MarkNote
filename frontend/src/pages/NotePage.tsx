import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { noteApi } from '../services/api'
import MarkdownEditor from '../components/editor/MarkdownEditor'
import { useNoteStore } from '../store/noteStore'

export default function NotePage() {
  const { id } = useParams<{ id: string }>()
  const { setSelectedNote } = useNoteStore()
  const [editorContent, setEditorContent] = useState('')

  // Fetch note metadata from the list
  const { data: notes } = useQuery({
    queryKey: ['notes'],
    queryFn: noteApi.getAllNotes,
  })

  // Fetch raw markdown content for the editor
  const { data: rawContent, isLoading: isLoadingRaw } = useQuery({
    queryKey: ['noteRaw', id],
    queryFn: () => noteApi.getNoteRawContent(Number(id)),
    enabled: !!id,
  })

  const note = notes?.find((n) => n.id === Number(id))

  // Set editor content when raw markdown is loaded
  useEffect(() => {
    if (rawContent) {
      setEditorContent(rawContent)
    }
  }, [rawContent])

  useEffect(() => {
    if (note) {
      setSelectedNote(note)
    }
  }, [note, setSelectedNote])

  const isLoading = !notes || isLoadingRaw

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
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel - Full Width */}
        <div className="w-full flex flex-col">
          <MarkdownEditor
            content={editorContent}
            onChange={setEditorContent}
            noteId={note.id}
          />
        </div>
      </div>
    </div>
  )
}
