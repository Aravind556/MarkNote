import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import MarkdownEditor from '../components/editor/MarkdownEditor'

export default function HomePage() {
  const [content, setContent] = useState('')

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <MarkdownEditor
          content={content}
          onChange={setContent}
          noteId={null}
        />
      </div>
    </div>
  )
}

