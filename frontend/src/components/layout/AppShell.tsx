import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import ResizablePanel from '../ui/ResizablePanel'

interface AppShellProps {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-notion-bg-light dark:bg-notion-bg-dark">
      <ResizablePanel
        defaultWidth={256}
        minWidth={200}
        maxWidth={500}
        side="left"
        storageKey="sidebar-width"
      >
        <Sidebar />
      </ResizablePanel>
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 overflow-hidden min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}

