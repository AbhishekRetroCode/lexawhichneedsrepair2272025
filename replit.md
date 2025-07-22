# Lexa • Powered by Quzard - AI Content Generator

## Project Overview
A modern, sleek paragraph generator website that leverages the Gemini API to generate high-quality text content. Features over 1000+ content types and writing styles/tones including paragraphs, emails, articles, essays, blog posts, stories, product descriptions, social media posts, and more.

## Key Features
- AI-powered content generation via Gemini API
- 1000+ content types and writing styles
- Adjustable content length
- Prompt enhancement functionality  
- Clean, minimalistic UI with dotted grid background
- Purple accent colors with black text
- Premium loading animations
- Copy and download functionality
- Live content preview with statistics
- Dark/light theme support
- Content history tracking (10 most recent)
- Template library for quick content generation
- QuickActions for instant content creation
- Responsive design with smooth animations
- Real-time content statistics (words, characters, reading time)

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Express.js, Node.js  
- **UI**: Tailwind CSS, Radix UI components, Shadcn/ui
- **State Management**: TanStack Query (React Query)
- **AI Integration**: Google Gemini API
- **Database**: Drizzle ORM (if needed)
- **Routing**: Wouter

## Project Architecture
- `/client/src` - Frontend React application
  - `/components/ModelSelector.tsx` - AI provider/model selection interface
  - `/components/CollapsibleSection.tsx` - Collapsible UI sections
  - `/components/ConfigurationPanel.tsx` - Content generation configuration
  - `/components/ContentPreview.tsx` - Generated content display
  - `/contexts/ThemeContext.tsx` - Theme management
  - `/index.css` - Writing-inspired theme styles
- `/server` - Express backend with API routes
  - `/gemini.ts` - Google Gemini API integration
  - `/providers.ts` - **NEW** Multi-provider AI service layer
  - `/routes.ts` - API endpoints supporting multiple providers
- `/shared` - Shared schemas and types with provider support

## Recent Changes (Migration & Enhancements)
- [2025-01-22] **MIGRATION COMPLETE**: Successfully migrated from Replit Agent to Replit environment
- [2025-01-22] Verified all dependencies are installed and working
- [2025-01-22] Server running successfully at http://localhost:5000
- [2025-01-22] Gemini API integration confirmed working with secure API key
- [2025-01-22] Frontend and backend communication established
- [2025-01-22] **FIXED**: Dark mode text visibility issues in CSS variables
- [2025-01-22] **ENHANCED**: ModelSelector with custom model input for OpenRouter
- [2025-01-22] **NEW**: LoadingSpinner component with better animations
- [2025-01-22] **UI IMPROVEMENTS**: Updated color scheme from purple to amber/orange throughout
- [2025-01-22] **FEATURE**: Custom model support for OpenRouter provider
- [2025-01-22] Enhanced UI with dynamic tabs: Generate, History, Templates
- [2025-01-22] Added content history tracking (last 10 generated items)
- [2025-01-22] Implemented content templates for quick start
- [2025-01-22] Added QuickActions component with 6 preset templates
- [2025-01-22] Enhanced ContentPreview with smooth animations
- [2025-01-22] Added ContentStats component showing word/character counts
- [2025-01-22] Improved responsive design for better mobile experience
- [2025-01-22] **MAJOR UPDATE**: Writing-inspired UI theme with ink aesthetics
- [2025-01-22] **NEW**: Collapsible sidebar system with CollapsibleSection component
- [2025-01-22] **NEW**: Multimodal AI support (Gemini + OpenRouter APIs)
- [2025-01-22] **NEW**: ModelSelector component with provider/model selection
- [2025-01-22] **NEW**: Writing fonts (Crimson Text, Playfair Display, Source Serif Pro)
- [2025-01-22] **NEW**: Vintage paper background with crosshatch patterns
- [2025-01-22] **NEW**: providers.ts for multi-API support architecture

## Development Setup
1. Run `npm run dev` to start both frontend and backend
2. Server runs on port 5000
3. Vite handles frontend serving and hot reload
4. API endpoints available at `/api/*`

## Environment Variables
- Gemini API key is securely stored and working
- No additional setup required for development

## User Preferences
- Clean, professional code structure
- Modern React patterns with TypeScript
- Secure API key handling
- Responsive design with premium feel
- Focus on user experience and performance