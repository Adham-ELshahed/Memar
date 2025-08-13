import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple translation function - in production, you'd want a more robust solution
const translations: Record<Language, Record<string, string>> = {
  en: {
    'site.title': 'Meamar - Construction & Home Fit-out Marketplace',
    'nav.categories': 'Categories',
    'nav.decoration': 'Decoration',
    'nav.furniture': 'Furniture', 
    'nav.contracting': 'Contracting',
    'nav.electrical': 'Electrical',
    'nav.sanitary': 'Sanitary',
    'nav.rfq_center': 'RFQ Center',
    'search.placeholder': 'Search for products, services, or vendors...',
    'hero.title': "Qatar's Premier Construction Marketplace",
    'hero.subtitle': 'Connect with trusted vendors, get competitive quotes, and source quality materials for your construction and home fit-out projects.',
    'hero.start_shopping': 'Start Shopping',
    'hero.create_rfq': 'Create RFQ',
    'categories.title': 'Shop by Category',
    'categories.subtitle': 'Discover# thoughts

This is a comprehensive bilingual B2B/B2C marketplace for construction and home fit-out in Qatar. I need to implement a full-stack application with Next.js frontend, NestJS backend, PostgreSQL database, and Stripe payments. The design reference shows a modern marketplace with Arabic/English support, RTL/LTR layouts, vendor management, RFQ system, and admin console.

Key implementation areas:
1. Database schema with all marketplace entities (users, vendors, products, RFQs, orders, etc.)
2. Authentication system with role-based access control
3. Bilingual support with RTL/LTR layouts
4. Vendor onboarding and KYC verification
5. Product catalog with search and filtering
6. RFQ (Request for Quote) system
7. Direct purchase flow with Stripe integration
8. Order management and fulfillment
9. Messaging system for buyer-vendor communication
10. Admin dashboard for platform management
11. Review and rating system

I'll use the existing structure and implement using the database blueprint for PostgreSQL, Replit Auth for authentication, object storage for file uploads, Stripe for payments, and WebSocket for real-time features.

# useful_guidelines_from_blueprints

From javascript_database blueprint:
- Add Drizzle models and relations to shared/schema.ts
- Update server/storage.ts to replace MemStorage with DatabaseStorage
- Execute npm run db:push for migrations

From javascript_log_in_with_replit blueprint:
- Use isAuthenticated middleware for protected routes
- Use useAuth React Hook for client-side authentication
- Handle unauthorized errors at page and endpoint levels
- Navigate to /api/login and /api/logout for auth flows

From javascript_object_storage blueprint:
- Use ObjectStorageService for file interactions
- Use ObjectUploader component for file uploads
- Implement proper ACL for protected files
- Call check_object_storage_status tool first

From javascript_stripe blueprint:
- Use /api/create-payment-intent for one-time payments
- Implement secure payment handling with proper error management

From javascript_websocket blueprint:
- Add WebSocket server on distinct path (/ws)
- Use correct protocol and connection handling

# directory_structure
```json
[
    {"path": "shared/schema.ts", "status": "overwritten"},
    {"path": "server/db.ts", "status": "new", "blueprint_source": "javascript_database"},
    {"path": "server/storage.ts", "status": "overwritten"},
    {"path": "server/routes.ts", "status": "overwritten"},
    {"path": "server/replitAuth.ts", "status": "new", "blueprint_source": "javascript_log_in_with_replit"},
    {"path": "server/objectStorage.ts", "status": "new", "blueprint_source": "javascript_object_storage"},
    {"path": "server/objectAcl.ts", "status": "new", "blueprint_source": "javascript_object_storage"},
    {"path": "client/src/hooks/useAuth.ts", "status": "new", "blueprint_source": "javascript_log_in_with_replit"},
    {"path": "client/src/lib/authUtils.ts", "status": "new", "blueprint_source": "javascript_log_in_with_replit"},
    {"path": "client/src/components/ObjectUploader.tsx", "status": "new", "blueprint_source": "javascript_object_storage"},
    {"path": "client/src/App.tsx", "status": "overwritten"},
    {"path": "client/src/pages/landing.tsx", "status": "new"},
    {"path": "client/src/pages/home.tsx", "status": "new"},
    {"path": "client/src/pages/categories.tsx", "status": "new"},
    {"path": "client/src/pages/vendors.tsx", "status": "new"},
    {"path": "client/src/pages/products.tsx", "status": "new"},
    {"path": "client/src/pages/rfq.tsx", "status": "new"},
    {"path": "client/src/pages/checkout.tsx", "status": "new"},
    {"path": "client/src/pages/admin/dashboard.tsx", "status": "new"},
    {"path": "client/src/pages/vendor/dashboard.tsx", "status": "new"},
    {"path": "client/src/components/Layout.tsx", "status": "new"},
    {"path": "client/src/components/Header.tsx", "status": "new"},
    {"path": "client/src/components/Footer.tsx", "status": "new"},
    {"path": "client/src/components/LanguageToggle.tsx", "status": "new"},
    {"path": "client/src/components/CategoryGrid.tsx", "status": "new"},
    {"path": "client/src/components/VendorCard.tsx", "status": "new"},
    {"path": "client/src/components/ProductCard.tsx", "status": "new"},
    {"path": "client/src/components/RFQForm.tsx", "status": "new"},
    {"path": "client/src/components/SearchFilters.tsx", "status": "new"},
    {"path": "client/src/hooks/useLocale.ts", "status": "new"},
    {"path": "client/src/lib/i18n.ts", "status": "new"},
    {"path": "client/index.css", "status": "overwritten"},
    {"path": "tailwind.config.ts", "status": "overwritten"}
]
