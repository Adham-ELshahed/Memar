# Meamar Marketplace - Spring Boot Backend

This is the Spring Boot backend for the Meamar construction marketplace application.

## ⚠️ SETUP REQUIRED

**This scaffold cannot run directly. See `SETUP_FIRST.md` for complete setup instructions.**

### Quick Summary:
1. Copy to Java environment
2. Generate Gradle wrapper: `gradle wrapper --gradle-version 8.5`
3. Configure environment variables
4. Run: `./gradlew bootRun`

## Prerequisites

- Java 17 or higher
- Gradle 8.x (or use the wrapper after initialization)

## Initial Setup

Since this scaffold was created in a Node.js environment, you'll need to initialize the Gradle wrapper first:

### Option 1: Using Gradle (if installed)
```bash
gradle wrapper --gradle-version 8.5
```

### Option 2: Using SDKMAN! (recommended)
```bash
# Install SDKMAN!
curl -s "https://get.sdkman.io" | bash

# Install Gradle
sdk install gradle 8.5

# Generate wrapper
gradle wrapper
```

After generating the wrapper, you can use `./gradlew` for all commands.

## Running the Application

```bash
# Build the project
./gradlew build

# Run the application
./gradlew bootRun

# Run tests
./gradlew test
```

## Configuration

Create a `.env` file or set environment variables:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# JWT
JWT_SECRET=your-secret-key-min-256-bits

# OAuth (if using Replit Auth)
REPLIT_CLIENT_ID=your-client-id
REPLIT_CLIENT_SECRET=your-client-secret
ISSUER_URL=your-issuer-url

# Google Cloud Storage
DEFAULT_OBJECT_STORAGE_BUCKET_ID=your-bucket-id
GCS_PROJECT_ID=your-project-id

# Stripe
STRIPE_SECRET_KEY=your-stripe-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
```

## Project Structure

```
src/
├── main/
│   ├── java/com/meamar/marketplace/
│   │   ├── MeamarMarketplaceApplication.java (Main application class)
│   │   ├── config/            (Configuration classes)
│   │   ├── domain/            (Entity classes)
│   │   ├── repository/        (JPA repositories)
│   │   ├── service/           (Business logic)
│   │   ├── controller/        (REST controllers)
│   │   ├── dto/               (Data transfer objects)
│   │   └── security/          (Security configuration)
│   └── resources/
│       ├── application.yml    (Application configuration)
│       └── db/migration/      (Flyway migration scripts)
└── test/                      (Test classes)
```

## Building for Production

```bash
# Build JAR file
./gradlew build

# JAR will be in build/libs/
java -jar build/libs/meamar-marketplace-0.0.1-SNAPSHOT.jar
```

## Security Notes

- The default `application.yml` has logging set to INFO
- For development debugging, you can enable DEBUG logging in the comments
- **Never** commit DEBUG logging to production
- Always use environment variables for secrets, never hardcode them

## Tech Stack

- **Framework**: Spring Boot 3.2.2
- **Language**: Java 17
- **Database**: PostgreSQL with Spring Data JPA
- **Migration**: Flyway
- **Security**: Spring Security + OAuth2 + JWT
- **WebSocket**: Spring WebSocket + STOMP
- **File Storage**: Google Cloud Storage
- **Payments**: Stripe Java SDK

## Next Steps

1. Generate Gradle wrapper (see Initial Setup)
2. Configure environment variables
3. Create JPA entities based on database schema
4. Implement repositories, services, and controllers
5. Configure Spring Security for authentication
6. Test the application

See `../MIGRATION_GUIDE.md` for detailed migration instructions.
