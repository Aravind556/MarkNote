import { useState, useRef, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FileText, Plus, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { noteApi } from '../../services/api'
import { useNoteStore } from '../../store/noteStore'
import toast from 'react-hot-toast'

export default function Sidebar() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  const { notes, setNotes, setSelectedNote, addNote } = useNoteStore()

  const { data, isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: noteApi.getAllNotes,
  })

  // Update notes in store when data changes
  useEffect(() => {
    if (data) {
      setNotes(data)
    }
  }, [data, setNotes])

  const filteredNotes = notes.filter((note) =>
    note.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleNewNote = () => {
    // Trigger file input click
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is .md
    if (!file.name.endsWith('.md')) {
      toast.error('Please select a .md (Markdown) file')
      return
    }

    try {
      toast.loading('Uploading note...', { id: 'upload' })
      const newNote = await noteApi.uploadNote(file)
      addNote(newNote)
      // Refresh notes list
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      toast.success('Note uploaded successfully!', { id: 'upload' })
      // Navigate to the new note
      navigate(`/notes/${newNote.id}`)
      setSelectedNote(newNote)
    } catch (error) {
      toast.error('Failed to upload note', { id: 'upload' })
      console.error('Upload error:', error)
    }

    // Reset file input
    e.target.value = ''
  }

  const handleNoteClick = (noteId: number) => {
    navigate(`/notes/${noteId}`)
    const note = notes.find((n) => n.id === noteId)
    if (note) setSelectedNote(note)
  }

  return (
    <aside className="h-full w-full bg-notion-sidebar-light dark:bg-notion-sidebar-dark flex flex-col">
      {/* Hidden file input for .md files */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".md"
        className="hidden"
      />

      {/* New Note Button */}
      <div className="p-3 border-b border-notion-border-light dark:border-notion-border-dark">
        <button
          onClick={handleNewNote}
          className="btn-notion-primary w-full flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Note
        </button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-notion-border-light dark:border-notion-border-dark">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-notion pl-8"
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-sm text-gray-400">Loading...</div>
        ) : filteredNotes.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-400">
            {searchQuery ? 'No notes found' : 'No notes yet'}
          </div>
        ) : (
          <div className="p-2">
            {filteredNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => handleNoteClick(note.id)}
                className="w-full text-left p-2 rounded hover:bg-notion-hover-light dark:hover:bg-notion-hover-dark transition-colors group"
              >
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 mt-0.5 text-gray-400 group-hover:text-notion-accent transition-colors flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate text-notion-text-light dark:text-notion-text-dark">
                      {note.title || 'Untitled'}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}