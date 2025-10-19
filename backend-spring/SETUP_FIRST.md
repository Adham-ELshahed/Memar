# ⚠️ IMPORTANT: Setup Required Before Use

This Spring Boot scaffold **cannot run directly** as-is. You must complete the following steps first:

## Step 1: Copy to a Java Environment

This scaffold was created in a Node.js environment. Copy the `backend-spring/` directory to:
- A new Replit with **Java** template
- Your local machine with Java 17+ installed
- A Java-capable CI/CD platform

## Step 2: Generate Gradle Wrapper (REQUIRED)

The Gradle wrapper files are not included. You **must** generate them:

### Option A: Using Gradle (if installed)
```bash
cd backend-spring
gradle wrapper --gradle-version 8.5
```

### Option B: Using SDKMAN! (recommended for clean setup)
```bash
# Install SDKMAN!
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"

# Install Gradle
sdk install gradle 8.5

# Generate wrapper
cd backend-spring
gradle wrapper

# Now you can use ./gradlew for all commands
./gradlew --version
```

### Option C: Download Wrapper Manually
```bash
cd backend-spring
mkdir -p gradle/wrapper

# Download gradle-wrapper.jar
wget https://raw.githubusercontent.com/gradle/gradle/v8.5.0/gradle/wrapper/gradle-wrapper.jar \
  -O gradle/wrapper/gradle-wrapper.jar

# Download gradle-wrapper.properties
wget https://raw.githubusercontent.com/gradle/gradle/v8.5.0/gradle/wrapper/gradle-wrapper.properties \
  -O gradle/wrapper/gradle-wrapper.properties

# Download gradlew scripts
wget https://raw.githubusercontent.com/gradle/gradle/v8.5.0/gradlew
wget https://raw.githubusercontent.com/gradle/gradle/v8.5.0/gradlew.bat

# Make gradlew executable
chmod +x gradlew
```

## Step 3: Configure Environment Variables

Create a `.env` file or set environment variables:

```bash
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-secret-key-min-256-bits
STRIPE_SECRET_KEY=your-stripe-key
# ... see README.md for full list
```

## Step 4: Verify Setup

```bash
# Build the project
./gradlew build

# Run the application
./gradlew bootRun
```

If successful, you should see:
```
Started MeamarMarketplaceApplication in X.XXX seconds
```

---

## Quick Start Checklist

- [ ] Copied to Java environment
- [ ] Generated Gradle wrapper (`gradle wrapper`)
- [ ] Configured environment variables
- [ ] Ran `./gradlew build` successfully
- [ ] Ran `./gradlew bootRun` successfully
- [ ] Application starts on port 8080

---

**See `README.md` for full documentation.**
