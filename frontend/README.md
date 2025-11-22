# Markdown Note Taker - Frontend

A modern, Notion-inspired frontend for the Markdown Note Taker application.

## Features

- 🎨 Clean, Notion-like UI design
- 📝 Markdown editor with live preview
- ✨ Real-time grammar checking
- 🤖 AI-powered content correction
- 🌙 Dark mode support
- 📱 Responsive design
- ⚡ Fast and smooth animations

## Tech Stack

- **React 18** with **TypeScript**
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **Zustand** for state management
- **Framer Motion** for animations
- **React Router** for navigation

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend server running on `http://localhost:8080`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/       # React components
│   ├── layout/      # Layout components (Sidebar, Header, etc.)
│   ├── editor/      # Editor-related components
│   └── ui/          # Reusable UI components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── services/        # API service layer
├── store/           # State management (Zustand)
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## API Integration

The frontend communicates with the Spring Boot backend through the following endpoints:

- `GET /hi/all` - Fetch all notes
- `GET /hi/{id}` - Get note by ID
- `POST /hi/file` - Upload/save note
- `POST /hi/live` - Live grammar check
- `POST /hi/grammar` - Full grammar check
- `POST /hi/ai-correct` - AI correction

## Configuration

Update the API base URL in `src/services/api.ts` if your backend runs on a different port or domain.

## Development

The project uses Vite's proxy configuration to forward API requests to the backend. See `vite.config.ts` for details.

