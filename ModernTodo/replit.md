# Motivodo - Modern To-Do List Application

## Overview

Motivodo is a full-stack productivity web application that combines task management with motivational elements. Built with React and Express, it features user authentication, task CRUD operations, daily motivational quotes, and theme customization. The application follows a modern, minimalist design approach inspired by Linear and Notion, emphasizing clean aesthetics and functional minimalism.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized builds
- Wouter for lightweight client-side routing (chosen over React Router for minimal bundle size)
- Path aliases configured (`@/`, `@shared/`, `@assets/`) for clean imports

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management with aggressive caching strategy
  - `staleTime: Infinity` prevents unnecessary refetches
  - `refetchOnWindowFocus: false` reduces API calls
  - Custom query functions handle authentication and error responses
- React Context API for client-side state (auth, theme)
- No global state management library - leverages React Query's cache as primary data store

**UI Component System**
- shadcn/ui component library (Radix UI primitives + custom styling)
- Tailwind CSS for utility-first styling with custom design tokens
- Framer Motion for declarative animations and micro-interactions
- Custom theme system supporting light/dark modes with CSS variables
- Typography: Inter (primary), Manrope (quotes) via Google Fonts CDN

**Design System**
- Color system built on HSL values with CSS custom properties for theme switching
- Spacing primitives: 2, 4, 6, 8, 12, 16 (Tailwind units)
- Responsive breakpoints: mobile (base), tablet (768px), desktop (1024px)
- Max container widths: 7xl (1280px) app, 5xl (1024px) dashboard, 2xl quote cards

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for type-safe API development
- Middleware stack: cookie-parser, JSON body parser with raw body preservation
- Custom logging middleware for API request/response tracking

**Authentication Strategy**
- JWT-based authentication with HTTP-only cookies
  - Token stored in `motivodo_token` cookie for XSS protection
  - Custom middleware (`authenticateToken`) protects API routes
  - bcryptjs for password hashing (10 rounds default)
- Session-less design - all user state derived from JWT payload
- Password validation relaxed intentionally for better UX (no complexity requirements)

**API Design**
- RESTful endpoints organized by resource (`/api/auth/*`, `/api/tasks/*`, `/api/quotes/*`)
- Consistent error handling with appropriate HTTP status codes
- Request validation using Zod schemas derived from Drizzle ORM definitions
- Response format: JSON with standardized error messages

**Data Storage Pattern**
- Storage abstraction layer (`IStorage` interface) for database operations
- In-memory storage implementation (`MemStorage`) for development/testing
- Designed to be swapped with PostgreSQL implementation using Drizzle ORM
- CRUD operations return typed entities matching database schema

**Development Server Setup**
- Vite integration in middleware mode for HMR during development
- Static file serving for production builds
- Replit-specific plugins (cartographer, dev-banner, runtime-error-modal) for enhanced DX

### External Dependencies

**Database**
- PostgreSQL (configured but not yet implemented)
- Drizzle ORM for type-safe database operations
  - Schema-first approach with `drizzle-zod` for automatic validation schema generation
  - Migrations output to `./migrations` directory
  - Neon serverless driver (`@neondatabase/serverless`) for PostgreSQL connection
- Database schema:
  - `users` table: id (UUID), username (unique), password (hashed)
  - `tasks` table: id (UUID), userId (FK), title, description, dueDate, completed, createdAt

**Third-Party Services**
- Motivational Quotes API (endpoint: `/api/quotes/daily`)
  - Currently fetches from external API (implementation suggests zenquotes.io or similar)
  - Client-side refresh capability with query key invalidation

**Authentication & Security**
- bcryptjs for password hashing
- jsonwebtoken for JWT creation and verification
- Environment variable for JWT secret (`SESSION_SECRET` with fallback)
- Cookie-based token storage for CSRF protection

**UI Libraries**
- Radix UI primitives (20+ components) for accessible, unstyled components
- Tailwind CSS for utility-first styling
- date-fns for date formatting and manipulation
- Framer Motion for animation primitives
- react-day-picker for calendar component
- cmdk for command palette functionality

**Development Tools**
- TypeScript for static type checking
- Vite plugins for Replit integration (cartographer, dev-banner, runtime-error-modal)
- tsx for running TypeScript directly in Node.js
- esbuild for production server bundling

**Form Management**
- react-hook-form for performant form state management
- @hookform/resolvers with Zod for schema-based validation
- Integration with shadcn/ui Form components for consistent UX