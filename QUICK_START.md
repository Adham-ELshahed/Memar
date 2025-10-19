# Quick Start Guide - Migration Scaffolding

This repository contains **scaffolding** for migrating Meamar marketplace to Next.js + Spring Boot. The code here is **not runnable as-is** - it needs to be copied to appropriate environments.

## What's Included

### ✅ `frontend-nextjs/` - Next.js 14 Frontend
**Status**: Ready to copy and run (after npm install)

**Features**:
- Next.js 14 App Router
- Material UI with RTL support
- TanStack Query
- Bilingual (English/Arabic)
- Sample pages and layouts

**To use**:
1. Copy to new Node.js Replit or local environment
2. Run `npm install`
3. Run `npm run dev`
4. Access at `http://localhost:3000`

### ⚠️ `backend-spring/` - Spring Boot 3 Backend  
**Status**: Requires setup (see SETUP_FIRST.md)

**Features**:
- Spring Boot 3 with Gradle
- Spring Data JPA + PostgreSQL
- Spring Security + OAuth2
- Stripe integration
- Google Cloud Storage integration

**To use**:
1. Copy to Java environment (Java 17+)
2. **Generate Gradle wrapper**: `gradle wrapper --gradle-version 8.5`
3. Configure environment variables
4. Run `./gradlew bootRun`

**See `backend-spring/SETUP_FIRST.md` for detailed instructions.**

## Documentation

- **`MIGRATION_GUIDE.md`** - Complete 8-12 week migration plan
- **`frontend-nextjs/README.md`** - Next.js setup and features
- **`backend-spring/README.md`** - Spring Boot documentation
- **`backend-spring/SETUP_FIRST.md`** - Critical setup steps

## Why Separate Projects?

This was scaffolded in a Node.js Replit environment which doesn't support Java. The recommended approach is:

1. **Frontend**: Deploy to Vercel or new Node.js Replit
2. **Backend**: Deploy to Railway/Render or new Java Replit
3. **Database**: Keep existing PostgreSQL database

This separation provides:
- ✅ Proper tooling for each stack
- ✅ Independent scaling
- ✅ Clearer deployment boundaries
- ✅ Better development experience

## Next Steps

1. Read `MIGRATION_GUIDE.md` for the full migration strategy
2. Set up Next.js frontend first (easier to get running)
3. Set up Spring Boot backend in Java environment
4. Begin feature migration incrementally

## Support

This is a comprehensive migration involving:
- Complete frontend rewrite (React → Next.js)
- Complete backend rewrite (Express → Spring Boot)
- Component library migration (shadcn → Material UI)
- ORM migration (Drizzle → Spring Data JPA)

**Estimated effort**: 8-12 weeks for full migration

Consider:
- Migrating incrementally (one feature at a time)
- Running both stacks in parallel during transition
- Getting help from developers experienced with both stacks

Good luck! 🚀
