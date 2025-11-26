# Frontend Design Document - MarkdownNoteTaker

## 🎨 Design Philosophy
Inspired by Notion's clean, minimal interface with focus on:
- **Clean UI**: Minimal chrome, maximum content focus
- **Smooth UX**: Fluid animations, instant feedback
- **Intuitive Navigation**: Sidebar-based note management
- **Real-time Feedback**: Live grammar checking with inline suggestions
- **Modern Aesthetics**: Subtle shadows, rounded corners, soft colors

## 🛠️ Recommended Tech Stack

### Core Framework
- **React 18+** with **TypeScript**
  - Type safety and modern React features
  - Hooks for state management
  - Component-based architecture

### Build Tool
- **Vite**
  - Lightning-fast HMR (Hot Module Replacement)
  - Optimized production builds
  - Better DX than Create React App

### Styling
- **Tailwind CSS**
  - Utility-first CSS framework
  - Easy to create Notion-like clean designs
  - Dark mode support out of the box
  - Responsive design utilities

### Rich Text Editor
- **Tiptap** (or **@uiw/react-md-editor**)
  - Tiptap: ProseMirror-based, highly customizable, Notion-like experience
  - Alternative: @uiw/react-md-editor for simpler markdown editing
  - Both support markdown syntax and live preview

### State Management
- **Zustand** (lightweight) or **React Context + Hooks**
  - Simple API, less boilerplate than Redux
  - Perfect for note management state
  - Easy to integrate with React Query

### API Client
- **React Query (TanStack Query)**
  - Automatic caching and refetching
  - Optimistic updates
  - Loading and error states
  - Perfect for REST API integration

### Routing
- **React Router v6**
  - Client-side routing
  - Note detail pages
  - Clean URL structure

### Animations
- **Framer Motion**
  - Smooth page transitions
  - Sidebar animations
  - Loading states
  - Notion-like micro-interactions

### Additional Libraries
- **Axios**: HTTP client for API calls
- **react-markdown**: Markdown rendering
- **date-fns**: Date formatting
- **lucide-react**: Beautiful icon library (similar to Notion's icons)
- **react-hot-toast**: Toast notifications

## 📐 UI/UX Design Structure

### Layout Components

#### 1. **App Shell**
```
┌─────────────────────────────────────────────────┐
│  Header (minimal, with logo and actions)        │
├──────────┬──────────────────────────────────────┤
│          │                                      │
│ Sidebar  │  Main Content Area                  │
│ (Notes   │  (Editor/Preview)                   │
│  List)   │                                      │
│          │                                      │
│          │                                      │
└──────────┴──────────────────────────────────────┘
```

#### 2. **Sidebar** (Left Panel)
- **Features:**
  - Collapsible (Notion-style)
  - Search bar at top
  - List of all notes (title + date)
  - "New Note" button (prominent)
  - Smooth scroll
  - Active note highlighting
  - Hover effects

#### 3. **Main Editor Area**
- **Features:**
  - Markdown editor with syntax highlighting
  - Live preview toggle (split view option)
  - Inline grammar suggestions (red underlines)
  - Toolbar with formatting options
  - AI correction button (prominent)
  - Auto-save indicator
  - Word count

#### 4. **Grammar Suggestions UI**
- **Inline Annotations:**
  - Red wavy underline for errors
  - Hover tooltip showing suggestion
  - Click to accept/reject
  - Side panel for all issues (optional)

#### 5. **AI Correction Panel**
- **Features:**
  - Slide-in panel from right
  - Shows corrected text
  - Side-by-side comparison
  - Accept/Reject buttons
  - Issue list with explanations

### Color Scheme (Notion-inspired)
- **Light Mode:**
  - Background: `#FFFFFF`
  - Sidebar: `#F7F6F3`
  - Text: `#37352F`
  - Accent: `#2383E2` (blue)
  - Border: `#E9E9E7`
  - Hover: `#F1F1EF`

- **Dark Mode:**
  - Background: `#191919`
  - Sidebar: `#2E2E2E`
  - Text: `#FFFFFF`
  - Accent: `#2383E2`
  - Border: `#3D3D3D`
  - Hover: `#373737`

### Typography
- **Font Family:** Inter, -apple-system, sans-serif (Notion uses similar)
- **Editor Font:** JetBrains Mono or Fira Code (monospace for code)
- **Sizes:**
  - Headings: 32px, 24px, 20px, 16px
  - Body: 16px
  - Small: 14px

## 🎯 Key Features Implementation

### 1. Note Management
- **Create Note:** Click "New Note" → Opens empty editor
- **List Notes:** Sidebar shows all notes with preview
- **Open Note:** Click note → Loads in editor
- **Auto-save:** Debounced saves (every 2-3 seconds)

### 2. Grammar Checking
- **Live Check:** Debounced API calls (every 1-2 seconds)
- **Visual Indicators:** 
  - Red underline for errors
  - Yellow underline for warnings
  - Tooltip on hover
- **Quick Fix:** Click suggestion → Apply instantly

### 3. AI Correction
- **Trigger:** Button in toolbar
- **Loading State:** Skeleton or spinner
- **Result Display:** Side panel with diff view
- **Apply:** One-click to replace content

### 4. Markdown Editing
- **Syntax Highlighting:** Code blocks with proper colors
- **Live Preview:** Toggle between edit/preview/split
- **Shortcuts:** Common markdown shortcuts (Ctrl+B, Ctrl+I, etc.)
- **Toolbar:** Formatting buttons (Bold, Italic, Link, etc.)

## 📱 Responsive Design
- **Desktop:** Full sidebar + editor layout
- **Tablet:** Collapsible sidebar
- **Mobile:** Bottom sheet for notes list, full-screen editor

## 🚀 Performance Considerations
- **Code Splitting:** Route-based lazy loading
- **Virtual Scrolling:** For long note lists
- **Debouncing:** API calls for live grammar check
- **Optimistic Updates:** Instant UI feedback
- **Caching:** React Query for API responses

## 🎨 Component Architecture

```
src/
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── MainContent.tsx
│   ├── editor/
│   │   ├── MarkdownEditor.tsx
│   │   ├── EditorToolbar.tsx
│   │   ├── PreviewPanel.tsx
│   │   └── GrammarSuggestion.tsx
│   ├── notes/
│   │   ├── NoteList.tsx
│   │   ├── NoteItem.tsx
│   │   └── NoteSearch.tsx
│   ├── ai/
│   │   ├── AICorrectionPanel.tsx
│   │   └── CorrectionDiff.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Toast.tsx
│       └── Loading.tsx
├── hooks/
│   ├── useNotes.ts
│   ├── useGrammarCheck.ts
│   └── useAICorrection.ts
├── services/
│   └── api.ts
├── store/
│   └── noteStore.ts
├── types/
│   └── index.ts
└── utils/
    └── markdown.ts
```

## 🔌 API Integration Points

### Endpoints Mapping
- `GET /hi/all` → Fetch all notes
- `GET /hi/{id}` → Get note HTML (or use note object)
- `POST /hi/file` → Upload/save note
- `POST /hi/live` → Live grammar check
- `POST /hi/grammar` → Full grammar check
- `POST /hi/ai-correct` → AI correction (if available)

### Data Flow
1. **Load Notes:** React Query fetches on mount
2. **Select Note:** Updates URL, loads content
3. **Edit Note:** Local state, debounced save
4. **Grammar Check:** Debounced API call on text change
5. **AI Correction:** Manual trigger, shows panel

## 🎭 User Experience Flow

### Creating a New Note
1. Click "New Note" button
2. Editor opens with empty state
3. Start typing (auto-save begins)
4. Grammar suggestions appear inline
5. Click AI button for full correction
6. Accept/reject suggestions

### Editing Existing Note
1. Click note in sidebar
2. Smooth transition to editor
3. Content loads with syntax highlighting
4. Edit with live grammar feedback
5. Changes auto-save

### Grammar Correction
1. Type content
2. Red underlines appear (1-2s delay)
3. Hover to see suggestion
4. Click to apply
5. Smooth animation on correction

## 🎨 Design Tokens

```typescript
// colors.ts
export const colors = {
  light: {
    bg: '#FFFFFF',
    sidebar: '#F7F6F3',
    text: '#37352F',
    accent: '#2383E2',
    border: '#E9E9E7',
    hover: '#F1F1EF',
    error: '#E16259',
    warning: '#F7B731',
  },
  dark: {
    bg: '#191919',
    sidebar: '#2E2E2E',
    text: '#FFFFFF',
    accent: '#2383E2',
    border: '#3D3D3D',
    hover: '#373737',
    error: '#E16259',
    warning: '#F7B731',
  }
}

// spacing.ts
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
}

// typography.ts
export const typography = {
  fontFamily: 'Inter, -apple-system, sans-serif',
  fontMono: 'JetBrains Mono, monospace',
  sizes: {
    h1: '32px',
    h2: '24px',
    h3: '20px',
    body: '16px',
    small: '14px',
  }
}
```

## 📦 Installation Commands

```bash
# Create Vite + React + TypeScript project
npm create vite@latest frontend -- --template react-ts

# Install dependencies
cd frontend
npm install

# Install recommended packages
npm install react-router-dom @tanstack/react-query zustand
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-markdown
npm install tailwindcss postcss autoprefixer
npm install framer-motion axios react-hot-toast
npm install lucide-react date-fns
npm install react-markdown remark-gfm

# Initialize Tailwind
npx tailwindcss init -p
```

## 🎯 Next Steps
1. Set up project structure
2. Configure Tailwind with custom theme
3. Create base components
4. Implement API service layer
5. Build sidebar and editor
6. Integrate grammar checking
7. Add AI correction feature
8. Polish animations and transitions

