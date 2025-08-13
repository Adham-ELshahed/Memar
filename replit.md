# Meamar - B2B/B2C Construction Marketplace

## Overview

Meamar is a bilingual (Arabic/English) B2B/B2C marketplace web application designed for the construction and home fit-out industry in Qatar. The platform connects buyers with verified vendors, enabling product discovery, quote requests, direct purchases, and project management. The application features comprehensive vendor onboarding, multilingual support with RTL/LTR layouts, real-time messaging, and a complete e-commerce workflow from discovery to delivery.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **Styling**: TailwindCSS with custom CSS variables for theming, shadcn/ui components
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Internationalization**: Built-in i18n system supporting English and Arabic with RTL/LTR text direction switching
- **UI Components**: Comprehensive component library using Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API structure with modular route organization
- **Development**: Hot reload with Vite integration for full-stack development

### Database Design
- **Primary Database**: PostgreSQL with Drizzle ORM
- **Connection**: Neon serverless PostgreSQL via connection pooling
- **Schema**: Comprehensive marketplace schema including users, organizations, products, RFQs, orders, messages, and reviews
- **Data Types**: UUID primary keys, JSONB for flexible data structures, enums for status fields

### Authentication & Authorization
- **Provider**: Replit Auth with OpenID Connect
- **Session Management**: Server-side sessions with PostgreSQL storage using connect-pg-simple
- **Authorization**: Role-based access control (buyer, vendor, admin roles)
- **Security**: HTTP-only cookies, CSRF protection, secure session configuration

### File Storage & Management
- **Storage**: Google Cloud Storage integration via Replit sidecar
- **Upload Handling**: Uppy.js with dashboard interface for file management
- **Access Control**: Custom object ACL system with permission-based access
- **File Types**: Support for images, documents, and attachments with validation

### Real-time Features
- **WebSocket Implementation**: Native WebSocket support for real-time messaging
- **Message System**: Thread-based messaging between buyers and vendors
- **Connection Management**: Automatic reconnection and ping/pong keep-alive

### Payment Processing
- **Provider**: Stripe integration with Elements UI
- **Workflow**: Payment intents, webhook handling, and order fulfillment tracking
- **Security**: Tokenized payment processing with secure credential handling

## External Dependencies

### Core Infrastructure
- **Database**: Neon PostgreSQL (serverless)
- **Authentication**: Replit Auth (OpenID Connect)
- **File Storage**: Google Cloud Storage (via Replit sidecar)
- **Payment Processing**: Stripe (with Elements UI)

### Development & Build Tools
- **Package Manager**: npm with package-lock.json
- **Build System**: Vite with TypeScript compilation
- **Database Migrations**: Drizzle Kit for schema management
- **CSS Processing**: PostCSS with TailwindCSS and Autoprefixer

### UI & Component Libraries
- **Component Framework**: Radix UI primitives
- **Styling**: TailwindCSS with custom design system
- **Icons**: Lucide React icon library
- **File Upload**: Uppy.js ecosystem (@uppy/core, @uppy/dashboard, @uppy/aws-s3, @uppy/react)

### Communication & Integrations
- **HTTP Client**: Native fetch with custom wrapper for API requests
- **Form Handling**: React Hook Form with Zod validation
- **WebSocket**: Native WebSocket API for real-time messaging
- **Email/SMS**: Configurable adapter pattern for communication providers

### Monitoring & Security
- **Input Validation**: Zod schema validation throughout the application
- **Error Handling**: Structured error responses with proper HTTP status codes
- **Development Tools**: Runtime error overlay for development debugging