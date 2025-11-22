import { Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Header() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  )

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', String(darkMode))
  }, [darkMode])

  return (
    <header className="h-12 border-b border-notion-border-light dark:border-notion-border-dark flex items-center justify-between px-4 bg-notion-bg-light dark:bg-notion-bg-dark">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold text-notion-text-light dark:text-notion-text-dark">
          Markdown Note Taker
        </h1>
      </div>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="btn-notion p-2"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    </header>
  )
}

