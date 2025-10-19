# Meamar Marketplace Migration Guide
## From React+Express to Next.js+Spring Boot

This guide explains how to migrate your Meamar marketplace from the current stack to Next.js + Spring Boot.

## Current Stack
- Frontend: React 18 + Vite + shadcn/ui + Wouter
- Backend: Express.js + TypeScript
- Database: PostgreSQL with Drizzle ORM

## Target Stack
- Frontend: Next.js 14 + Material UI + TanStack Query
- Backend: Spring Boot 3 + Java 17 + Spring Data JPA
- Database: PostgreSQL (same database, different ORM)

---

## Migration Strategy

### Phase 1: Setup New Projects

#### A. Create Next.js Frontend Project

**Option 1: Deploy to Vercel (Recommended)**
1. Create new repository on GitHub
2. Copy contents of `frontend-nextjs/` to new repository
3. Connect repository to Vercel
4. Configure environment variables:
   ```
   NEXT_PUBLIC_API_URL=<your-spring-boot-api-url>/api/v1
   ```
5. Deploy

**Option 2: New Replit Project**
1. Create new Replit with Node.js
2. Copy contents of `frontend-nextjs/` to new Replit
3. Install dependencies: `npm install`
4. Run: `npm run dev`

#### B. Create Spring Boot Backend Project

**Option 1: Railway/Render (Recommended)**
1. Create new GitHub repository
2. Copy contents of `backend-spring/` to new repository
3. Create account on Railway or Render
4. Connect repository
5. Configure environment variables (see below)
6. Deploy

**Option 2: New Replit with Java**
1. Create new Replit with Java template
2. Copy contents of `backend-spring/` to new Replit
3. **Initialize Gradle wrapper**: Run `gradle wrapper --gradle-version 8.5`
   - Or follow instructions in `backend-spring/README.md`
4. Configure environment variables
5. Run with Gradle: `./gradlew bootRun`

---

## Environment Variables Setup

### Spring Boot Backend (.env or platform secrets)

```bash
# Database
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>

# JWT
JWT_SECRET=<generate-secure-random-string>

# OAuth (if using Replit Auth)
REPLIT_CLIENT_ID=<from-replit-auth>
REPLIT_CLIENT_SECRET=<from-replit-auth>
ISSUER_URL=<from-replit-auth>

# Google Cloud Storage
DEFAULT_OBJECT_STORAGE_BUCKET_ID=<your-gcs-bucket>
GCS_PROJECT_ID=<your-gcs-project>

# Stripe
STRIPE_SECRET_KEY=<your-stripe-key>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>
```

### Next.js Frontend (.env.local)

```bash
NEXT_PUBLIC_API_URL=https://your-spring-boot-api.com/api/v1
```

---

## Phase 2: Database Migration

### Option A: Keep Current Database (Recommended)

1. **Export Current Schema:**
   ```bash
   pg_dump -h $PGHOST -U $PGUSER -d $PGDATABASE --schema-only > schema.sql
   ```

2. **Create Flyway Baseline:**
   - Create `backend-spring/src/main/resources/db/migration/V1__baseline.sql`
   - Copy your current schema into this file

3. **Configure Flyway:**
   ```yaml
   spring:
     flyway:
       baseline-on-migrate: true
       baseline-version: 1
   ```

### Option B: Fresh Database

1. Start with empty PostgreSQL database
2. Spring Boot + Flyway will create schema automatically
3. Migrate data manually if needed

---

## Phase 3: Backend Implementation

### Step 1: Create JPA Entities

Convert Drizzle schema to JPA entities. Example:

**Drizzle (current):**
```typescript
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  role: text("role").notNull().default("buyer"),
});
```

**Spring JPA (target):**
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    private String name;
    
    @Column(nullable = false)
    private String role = "buyer";
}
```

### Step 2: Create Repositories

```java
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
}
```

### Step 3: Create Services

```java
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    public User createUser(User user) {
        return userRepository.save(user);
    }
}
```

### Step 4: Create REST Controllers

```java
@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;
    
    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }
}
```

---

## Phase 4: Frontend Implementation

### Step 1: Create API Hooks

```typescript
// lib/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/apiClient';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await apiClient.get('/users');
      return data;
    },
  });
}
```

### Step 2: Create MUI Components

Replace shadcn/ui components with Material UI equivalents:

| shadcn/ui | Material UI |
|-----------|-------------|
| `<Card>` | `<Card>` (MUI) |
| `<Button>` | `<Button>` |
| `<Dialog>` | `<Dialog>` |
| `<Form>` | `<Box component="form">` + React Hook Form |
| `<Table>` | `<DataGrid>` (MUI X) |
| `<Sheet>` | `<Drawer>` |
| `<Tabs>` | `<Tabs>` |
| `useToast` | `notistack` or MUI `<Snackbar>` |

### Step 3: Create Pages

```typescript
// app/[locale]/products/page.tsx
import { Container, Grid, Typography } from '@mui/material';
import { useProducts } from '@/lib/hooks/useProducts';

export default function ProductsPage() {
  const { data: products, isLoading } = useProducts();
  
  if (isLoading) return <CircularProgress />;
  
  return (
    <Container>
      <Typography variant="h4">Products</Typography>
      <Grid container spacing={3}>
        {products?.map(product => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
```

---

## Phase 5: Feature Migration Checklist

### Backend (Spring Boot)

- [ ] User authentication (Spring Security + JWT)
- [ ] User management
- [ ] Organization/Vendor management
- [ ] Product catalog CRUD
- [ ] Category management
- [ ] RFQ (Request for Quote) system
- [ ] Order processing
- [ ] Payment integration (Stripe)
- [ ] File upload (Google Cloud Storage)
- [ ] Messaging (WebSocket + STOMP)
- [ ] Admin panel APIs
- [ ] Search and filtering
- [ ] Reviews and ratings

### Frontend (Next.js + MUI)

- [ ] Landing page
- [ ] Home page
- [ ] Product catalog with filters
- [ ] Product details
- [ ] Vendor directory
- [ ] Vendor profiles
- [ ] RFQ creation form
- [ ] RFQ list and management
- [ ] Shopping cart
- [ ] Checkout flow
- [ ] Order history
- [ ] Messaging interface
- [ ] Vendor onboarding
- [ ] Vendor dashboard
- [ ] Admin dashboard
- [ ] User profile
- [ ] Authentication pages
- [ ] Language switcher (EN/AR)
- [ ] RTL/LTR layouts

---

## Phase 6: Testing & Deployment

### Testing Checklist

- [ ] API endpoints return correct data
- [ ] Authentication works end-to-end
- [ ] File uploads work
- [ ] WebSocket messaging connects
- [ ] Stripe payments process correctly
- [ ] Both English and Arabic work
- [ ] RTL layout displays correctly
- [ ] Mobile responsive
- [ ] All CRUD operations work

### Deployment Checklist

- [ ] Spring Boot backend deployed and accessible
- [ ] Next.js frontend deployed
- [ ] Database migrations run successfully
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] API endpoints accessible from frontend
- [ ] Custom domain configured (if needed)
- [ ] SSL/HTTPS enabled
- [ ] Monitoring and logging setup

---

## Estimated Timeline

- **Phase 1 (Setup)**: 1-2 days
- **Phase 2 (Database)**: 1 day
- **Phase 3 (Backend)**: 2-3 weeks
- **Phase 4 (Frontend)**: 2-3 weeks
- **Phase 5 (Features)**: 3-4 weeks
- **Phase 6 (Testing)**: 1-2 weeks

**Total**: 8-12 weeks for complete migration

---

## What's Already Done

In this repository, you have:

### ✅ `frontend-nextjs/` Directory
- Next.js 14 with App Router configured
- Material UI theme with RTL support
- TanStack Query setup
- Bilingual configuration (en/ar)
- API client configured
- Basic layout and routing structure
- Sample pages

### ✅ `backend-spring/` Directory
- Spring Boot 3 Gradle project
- Dependencies configured (JPA, Security, WebSocket, Stripe, GCS)
- Application properties setup
- Main application class
- Directory structure for entities, services, controllers
- **⚠️ SETUP REQUIRED**: See `backend-spring/SETUP_FIRST.md` to initialize Gradle wrapper before use

---

## Important Notes

### Security Warnings

1. **Logging Levels**: The `application.yml` is set to INFO logging for security. Never enable DEBUG logging for `org.springframework.security` in production as it will leak sensitive authentication details.

2. **Environment Variables**: Never commit secrets to version control. Always use environment variables or secret management services.

3. **CORS Configuration**: Make sure to configure CORS properly in Spring Security to only allow your frontend domain.

### Gradle Wrapper

The `backend-spring/` directory does not include Gradle wrapper files (`gradlew`, `gradlew.bat`, `gradle/wrapper/`) because they were created in a Node.js environment.

**You must generate them** when setting up the Spring Boot project:

```bash
# After copying backend-spring/ to your Java environment
cd backend-spring
gradle wrapper --gradle-version 8.5
```

See `backend-spring/README.md` for detailed instructions.

---

## Support Resources

### Next.js + Material UI
- [Next.js Documentation](https://nextjs.org/docs)
- [Material UI Documentation](https://mui.com/material-ui/getting-started/)
- [TanStack Query](https://tanstack.com/query/latest)
- [next-intl (i18n)](https://next-intl-docs.vercel.app/)

### Spring Boot
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Spring Security](https://spring.io/projects/spring-security)
- [Flyway](https://flywaydb.org/documentation)

---

## Need Help?

This is a complex migration. Consider:
1. Breaking it into smaller phases
2. Running both systems in parallel during transition
3. Migrating one feature at a time
4. Getting help from developers experienced with Spring Boot and Next.js

Good luck with your migration!
