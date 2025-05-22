# Bank App Architecture Guide

## Overview

This is a fullstack financial transaction tracking application that allows users to manage and visualize their income, expenses, and investments. The app is built with a React frontend and Express backend, using a PostgreSQL database with Drizzle ORM for data access. The UI is implemented with shadcn/ui components and styled with Tailwind CSS.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a classic client-server architecture with a clear separation between:

1. **Client**: React-based single-page application (SPA) with a modern UI toolkit
2. **Server**: Express.js REST API backend
3. **Database**: PostgreSQL database managed by Drizzle ORM

The frontend and backend communicate through RESTful API endpoints. The system currently implements simplified authentication with a default user (ID: 1), which would likely be expanded in a production environment.

### Key Technical Decisions

- **React + Vite**: For a fast development experience and optimal production builds
- **Express.js**: Lightweight server framework for the REST API
- **Drizzle ORM**: Type-safe database toolkit that provides query building and schema management
- **shadcn/ui + Tailwind CSS**: For a cohesive and customizable UI design system
- **React Query**: For efficient data fetching, caching, and state management

## Key Components

### Frontend

1. **UI Components**: A comprehensive set of UI components built with shadcn/ui using Radix UI primitives for accessibility.

2. **Pages**: 
   - `HomePage`: The main dashboard showing transaction history and financial summaries
   - `NotFound`: 404 error page

3. **Hooks**:
   - `use-theme`: Theme management (light/dark mode)
   - `use-toast`: Toast notification system
   - `use-mobile`: Responsive design utility

4. **Services**:
   - `queryClient`: Central configuration for React Query with API request handling

### Backend

1. **API Routes**:
   - `GET /api/transactions`: Retrieve all transactions 
   - `POST /api/transactions`: Create a new transaction
   - `GET /api/summary/:month/:year`: Get monthly financial summary

2. **Storage**:
   - Memory-based storage implementation (`MemStorage`) with support for transactions and users
   - Database schema defined in `shared/schema.ts`

3. **Server Configuration**:
   - Request logging middleware
   - Error handling middleware
   - Vite integration for development

### Database Schema

Two primary entities:

1. **Users**:
   - `id`: Primary key
   - `username`: Unique username
   - `password`: User password (note: would need proper hashing in production)

2. **Transactions**:
   - `id`: Primary key
   - `amount`: Transaction amount
   - `description`: Description of the transaction
   - `type`: One of "revenus", "dépenses", "investissement"
   - `recipient`: Optional recipient of the transaction
   - `date`: Transaction date
   - `userId`: Foreign key to the user

## Data Flow

1. **Transaction Creation**:
   - User enters transaction details in the `AddTransactionModal`
   - Frontend sends POST request to `/api/transactions` endpoint
   - Server validates request using Zod schema
   - Transaction is stored in the database
   - UI is updated and user gets a toast notification

2. **Transaction Viewing**:
   - On page load, React Query fetches transactions from `/api/transactions`
   - The server retrieves transaction data and returns as JSON
   - Data is rendered in the transaction list

3. **Summary Statistics**:
   - Frontend fetches summary data from `/api/summary/:month/:year`
   - Server calculates totals for different transaction types
   - UI displays financial summary information

## External Dependencies

### Frontend Dependencies

- **UI Framework**: 
  - React
  - Tailwind CSS
  - shadcn/ui (built on Radix UI primitives)

- **Data Management**:
  - @tanstack/react-query: For server state management
  - zod: For schema validation

- **Routing**:
  - wouter: Lightweight router

### Backend Dependencies

- **Server**:
  - express: Web server framework
  - drizzle-orm: Database ORM
  - zod: Schema validation

- **Database**:
  - PostgreSQL (via @neondatabase/serverless)
  - drizzle-zod: Integration between Drizzle and Zod

## Deployment Strategy

The application is configured to be deployed on Replit with optimizations for the Replit environment:

1. **Development Mode**:
   - Run with `npm run dev`
   - Vite development server with HMR
   - Backend runs concurrently with API routes available

2. **Production Mode**:
   - Build step: `npm run build` (vite build + esbuild for server code)
   - Run with `npm run start`
   - Serves optimized static assets and API from Node.js

3. **Database**:
   - PostgreSQL provided by Replit's PostgreSQL module
   - Connection managed via environment variables
   - Schema migrations using Drizzle Kit

The replit.conf file is set up with appropriate modules (nodejs-20, web, postgresql-16) and deployment configurations, including autoscaling settings.