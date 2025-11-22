import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FileText, Plus, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { noteApi } from '../../services/api'
import { useNoteStore } from '../../store/noteStore'
import { format } from 'date-fns'

export default function Sidebar() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { notes, setNotes, setSelectedNote } = useNoteStore()

  const { isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: noteApi.getAllNotes,
    onSuccess: (data) => {
      setNotes(data)
    },
  })

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleNewNote = () => {
    navigate('/')
    setSelectedNote(null)
  }

  const handleNoteClick = (noteId: number) => {
    navigate(`/notes/${noteId}`)
    const note = notes.find((n) => n.id === noteId)
    if (note) setSelectedNote(note)
  }

  return (
    <aside className="h-full w-full bg-notion-sidebar-light dark:bg-notion-sidebar-dark flex flex-col">
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
                    <div className="text-xs text-gray-400 mt-1">
                      {format(new Date(note.createdAt), 'MMM d, yyyy')}
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

