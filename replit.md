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
- Live content preview
- Dark/light theme support

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
- `/server` - Express backend with API routes
- `/shared` - Shared schemas and types
- `/server/gemini.ts` - Gemini API integration
- `/server/routes.ts` - API endpoints for content generation
- `/server/storage.ts` - Storage interface (if needed)

## Recent Changes (Migration from Agent)
- [2024-01-22] Successfully migrated from Replit Agent to Replit environment
- [2024-01-22] Verified all dependencies are installed and working
- [2024-01-22] Server running successfully at http://localhost:5000
- [2024-01-22] Gemini API integration confirmed working with secure API key
- [2024-01-22] Frontend and backend communication established

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