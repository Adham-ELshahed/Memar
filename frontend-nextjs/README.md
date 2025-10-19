# Meamar Frontend - Next.js

This is the Next.js frontend for the Meamar construction marketplace application.

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI Library**: Material UI (MUI)
- **State Management**: TanStack Query (React Query)
- **Internationalization**: next-intl (English/Arabic with RTL support)
- **Language**: TypeScript
- **API Client**: Axios

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend-nextjs/
├── app/                 # Next.js App Router pages
│   └── [locale]/        # Internationalized routes
├── components/          # Reusable React components
│   └── providers/       # Context providers
├── lib/                 # Utility functions and configurations
│   ├── api/            # API client setup
│   └── theme/          # MUI theme configuration
├── messages/           # Internationalization JSON files
└── public/            # Static assets
```

## Features

- ✅ Bilingual support (English/Arabic)
- ✅ RTL/LTR layout switching
- ✅ Material UI theming
- ✅ TanStack Query for data fetching
- ✅ TypeScript for type safety
- ✅ Responsive design

## Available Languages

- English (`/en`)
- Arabic (`/ar`)
