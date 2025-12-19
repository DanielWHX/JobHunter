# Next Steps - Your Learning Roadmap

This guide outlines the recommended order for implementing the JobHunter application, with learning goals for each phase.

## Phase 1: Foundation (Week 1-2)

### Goals
- Understand project structure
- Set up local development environment
- Learn Docker and basic NestJS

### Tasks

#### 1.1 Environment Setup
```bash
# Install Node.js, Docker Desktop
# Clone repo and install dependencies
npm install --workspaces

# Copy environment file
cp .env.example .env

# Start databases only
docker-compose up postgres redis dynamodb-local
```

#### 1.2 Build Auth Service (PRIORITY)
This is your first microservice - learn the patterns here!

**Learning Goals**:
- NestJS project structure
- TypeORM with PostgreSQL
- JWT authentication
- Password hashing with bcrypt

**Implementation Steps**:
1. Create entities (User, UserPreferences)
2. Create DTOs (LoginDTO, RegisterDTO)
3. Implement AuthController (register, login endpoints)
4. Implement AuthService (business logic)
5. Set up JWT strategy with Passport
6. Test with Postman/Insomnia

**Files to Create**:
```
services/auth-service/
├── src/
│   ├── main.ts                 # App entry point
│   ├── app.module.ts           # Root module
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts  # REST endpoints
│   │   ├── auth.service.ts     # Business logic
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── entities/
│   │   │   ├── user.entity.ts
│   │   │   └── user-preferences.entity.ts
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   └── config/
│       └── database.config.ts
├── Dockerfile
└── tsconfig.json
```

**Test Criteria**:
- ✅ Can register a new user
- ✅ Can login and receive JWT token
- ✅ Can access protected route with token
- ✅ Cannot access protected route without token

---

## Phase 2: Core Services (Week 3-4)

### 2.1 Build Task Service

**Learning Goals**:
- CRUD operations with TypeORM
- Database relationships
- Query optimization
- Redis caching

**Implementation Steps**:
1. Create Task and JobApplication entities
2. Create TaskController (CRUD endpoints)
3. Implement caching with Redis
4. Add validation with class-validator
5. Write unit tests

**API Endpoints to Implement**:
```typescript
POST   /tasks/daily              // Create task
GET    /tasks/daily/:date        // Get tasks for date
PATCH  /tasks/:id                // Update task
DELETE /tasks/:id                // Delete task
GET    /tasks/stats/week         // Weekly stats

POST   /applications             // Log application
GET    /applications             // List applications
PATCH  /applications/:id/status  // Update status
```

**Test Criteria**:
- ✅ Can create daily task
- ✅ Can mark task as complete
- ✅ Can log job application
- ✅ Weekly stats calculate correctly

---

### 2.2 Build Panic Service

**Learning Goals**:
- DynamoDB with AWS SDK v3
- NoSQL data modeling
- Time-series data patterns
- GSI (Global Secondary Index) queries

**Implementation Steps**:
1. Set up DynamoDB client
2. Create table initialization script
3. Implement PanicController
4. Implement PanicService (CRUD for DynamoDB)
5. Add analytics endpoints (trends, patterns)

**Key Challenges**:
- Understanding partition keys vs sort keys
- Querying with GSI for date ranges
- Handling DynamoDB's eventual consistency

**Test Criteria**:
- ✅ Can create panic log
- ✅ Can query logs by date range
- ✅ Can categorize as controllable/uncontrollable
- ✅ Can convert to action items

---

### 2.3 Build Metrics Service

**Learning Goals**:
- Data aggregation patterns
- Combining multiple data sources
- Caching strategies
- Statistics calculations

**Implementation Steps**:
1. Create DailyMetrics DynamoDB table
2. Implement MetricsController
3. Aggregate data from Task Service + Panic Service
4. Calculate streaks
5. Build dashboard endpoint

**Dashboard Data Structure**:
```typescript
{
  user: User,
  today: {
    leetcode: { solved: 2, target: 2 },
    applications: { sent: 5, target: 5 },
    projectHours: { worked: 3, target: 2 }
  },
  streak: { current: 15, longest: 20 },
  weekSummary: { ... },
  recentPanicLogs: [ ... ],
  recentApplications: [ ... ]
}
```

**Test Criteria**:
- ✅ Dashboard aggregates correctly
- ✅ Streak calculates correctly
- ✅ Caching works (fast subsequent requests)

---

## Phase 3: Integrations (Week 5)

### 3.1 GitHub Integration

**Learning Goals**:
- REST API consumption
- Authentication with personal access tokens
- Rate limiting handling
- Response caching

**Implementation Steps**:
1. Set up GitHub API client
2. Fetch user events (commits)
3. Parse contribution data
4. Cache responses (24 hour TTL)
5. Handle rate limits gracefully

**GitHub API Endpoints**:
```
GET https://api.github.com/users/:username/events
GET https://api.github.com/users/:username
```

**Test Criteria**:
- ✅ Fetches today's commits
- ✅ Fetches weekly contributions
- ✅ Handles rate limit errors
- ✅ Caches responses

---

### 3.2 LeetCode Integration

**Learning Goals**:
- GraphQL API consumption
- Cookie-based authentication
- Scraping when APIs don't exist
- Data transformation

**Implementation Steps**:
1. Set up LeetCode GraphQL client
2. Authenticate with session cookie
3. Fetch user profile and submissions
4. Parse difficulty counts
5. Cache responses

**LeetCode GraphQL Query**:
```graphql
query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    submitStats {
      acSubmissionNum {
        difficulty
        count
      }
    }
    recentSubmissions {
      title
      titleSlug
      timestamp
    }
  }
}
```

**Test Criteria**:
- ✅ Fetches total solved count
- ✅ Fetches easy/medium/hard breakdown
- ✅ Fetches recent submissions
- ✅ Handles invalid session

---

### 3.3 Notification Service

**Learning Goals**:
- Cron jobs with node-cron
- Email sending with Nodemailer
- Scheduled tasks
- User timezone handling

**Implementation Steps**:
1. Set up cron scheduler
2. Configure SMTP (Gmail)
3. Create email templates
4. Implement daily reminder (8 PM each user's timezone)
5. Add in-app notifications

**Cron Jobs**:
```typescript
// Daily review reminder (runs every hour, checks user preferences)
'0 * * * *' → Check users with notificationTime matching current hour

// Weekly summary (Sunday 9 AM)
'0 9 * * 0' → Send weekly summary email
```

**Test Criteria**:
- ✅ Sends email at configured time
- ✅ Respects user timezone
- ✅ Can manually trigger notification
- ✅ Email template renders correctly

---

## Phase 4: Frontend (Week 6-7)

### 4.1 Next.js Setup

**Learning Goals**:
- Next.js 14 App Router
- TypeScript with React
- API route handlers
- Client vs Server components

**Implementation Steps**:
1. Initialize Next.js project
2. Set up TailwindCSS
3. Create layout components
4. Set up authentication context
5. Create API client (fetch wrapper)

**Folder Structure**:
```
frontend/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home/Dashboard
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── tasks/
│   │   └── page.tsx
│   └── panic/
│       └── page.tsx
├── components/
│   ├── Dashboard.tsx
│   ├── TaskList.tsx
│   ├── PanicLogForm.tsx
│   └── MetricsChart.tsx
├── lib/
│   ├── api.ts              # API client
│   └── auth.ts             # Auth helpers
└── hooks/
    ├── useAuth.ts
    └── useTasks.ts
```

---

### 4.2 Dashboard Page

**Learning Goals**:
- Data visualization with Recharts
- React Query for data fetching
- Responsive design with Tailwind
- Loading and error states

**Components to Build**:
1. `Dashboard.tsx` - Main layout
2. `StatsCards.tsx` - Today's metrics
3. `StreakDisplay.tsx` - Current streak
4. `WeekChart.tsx` - Weekly progress chart
5. `RecentActivity.tsx` - Recent logs

**Data Fetching**:
```typescript
// Use React Query
const { data: dashboard } = useQuery({
  queryKey: ['dashboard'],
  queryFn: () => api.get('/metrics/dashboard'),
  refetchInterval: 60000, // Refresh every minute
});
```

**Test Criteria**:
- ✅ Shows today's tasks
- ✅ Shows current streak
- ✅ Chart visualizes week data
- ✅ Auto-refreshes
- ✅ Mobile responsive

---

### 4.3 Task Management Page

**Learning Goals**:
- Form handling with React Hook Form
- Optimistic updates
- Real-time UI updates

**Features**:
1. Daily checklist
2. Add/edit/delete tasks
3. Mark tasks complete
4. Progress bars
5. Task history

**Test Criteria**:
- ✅ Can add task
- ✅ Can mark complete
- ✅ Progress updates instantly
- ✅ Persists to backend

---

### 4.4 Panic Log Page

**Learning Goals**:
- Multi-step forms
- Conditional rendering
- Data transformation

**Features**:
1. Log panic moment
2. Categorize (controllable/uncontrollable)
3. Intensity slider
4. Convert to action items
5. View past logs
6. Trend analysis

**Test Criteria**:
- ✅ Can log panic
- ✅ Can categorize
- ✅ Generates action items
- ✅ Shows trends

---

## Phase 5: DevOps (Week 8)

### 5.1 Dockerization

**Learning Goals**:
- Multi-stage Docker builds
- Docker Compose
- Container networking

**Create Dockerfiles**:
```dockerfile
# Example: services/auth-service/Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/main.js"]
```

**Test Criteria**:
- ✅ All services build
- ✅ docker-compose up works
- ✅ Services communicate
- ✅ Volumes persist data

---

### 5.2 Kubernetes Basics

**Learning Goals**:
- Kubernetes concepts (Pods, Services, Deployments)
- ConfigMaps and Secrets
- Service discovery
- Health checks

**Create Manifests**:
```yaml
# infrastructure/k8s/auth-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
      - name: auth
        image: jobhunter/auth-service:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
```

**Test with Minikube**:
```bash
minikube start
kubectl apply -f infrastructure/k8s/
kubectl get pods
kubectl logs auth-service-xxxxx
```

---

### 5.3 CI/CD Pipeline

**Learning Goals**:
- GitHub Actions
- Automated testing
- Docker image building
- Deployment automation

**Create Workflow**:
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/build-push-action@v4
        with:
          context: ./services/auth-service
          push: true
          tags: jobhunter/auth:latest
```

---

## Phase 6: AWS Deployment (Week 9-10)

### 6.1 AWS Free Tier Setup

**Checklist**:
- ✅ Create AWS account
- ✅ Set up billing alerts ($5 threshold)
- ✅ Configure AWS CLI
- ✅ Create IAM user with limited permissions

### 6.2 Database Migration

**Steps**:
1. Create RDS PostgreSQL instance (db.t3.micro)
2. Create ElastiCache Redis (cache.t2.micro)
3. Create DynamoDB tables
4. Update environment variables
5. Run migrations
6. Test connections

### 6.3 Service Deployment

**Options**:
- **Easy**: AWS Fargate (serverless containers)
- **Learning**: AWS EKS (Kubernetes)

**Fargate Steps**:
1. Push Docker images to ECR
2. Create ECS cluster
3. Create task definitions
4. Create services
5. Set up load balancer

---

## Learning Resources

### Documentation
- NestJS: https://docs.nestjs.com/
- Next.js: https://nextjs.org/docs
- TypeORM: https://typeorm.io/
- AWS SDK: https://docs.aws.amazon.com/sdk-for-javascript/

### Video Courses (Recommended)
- NestJS Fundamentals (YouTube - free)
- Next.js 14 Tutorial (YouTube - free)
- AWS for Beginners (freeCodeCamp - free)
- Kubernetes Crash Course (TechWorld with Nana - free)

### Practice While Building
- **Daily**: Commit to GitHub (build that green square grid!)
- **Weekly**: Write a dev log (document what you learned)
- **Challenges**: When stuck, try to solve before Googling
- **Code Review**: Review your own code the next day

---

## Measuring Progress

### Week-by-Week Goals

**Week 1**: Auth service working, can register/login
**Week 2**: Task service working, can CRUD tasks
**Week 3**: Panic + Metrics services working
**Week 4**: All integrations (GitHub/LeetCode) working
**Week 5**: Frontend dashboard showing data
**Week 6**: Frontend fully functional
**Week 7**: All features complete
**Week 8**: Dockerized and running locally
**Week 9**: Deployed to AWS
**Week 10**: Polish, testing, documentation

### Resume Bullet Points You'll Earn

After completion, you can write:

> "Built full-stack job tracking application using **Next.js**, **NestJS**, **PostgreSQL**, **DynamoDB**, and **Redis**"

> "Architected microservices architecture with 6 independent services deployed on **Docker** and **Kubernetes**"

> "Integrated **GitHub** and **LeetCode APIs** for automated data aggregation and metrics tracking"

> "Deployed scalable application to **AWS** using **RDS**, **ElastiCache**, and **DynamoDB** with cost optimization"

> "Implemented **CI/CD pipeline** with **GitHub Actions** for automated testing and deployment"

---

## When You Get Stuck

1. **Read the error message carefully** (90% of bugs are typos)
2. **Check the documentation** (official docs are best)
3. **Google the exact error** (StackOverflow is your friend)
4. **Break the problem down** (isolate the failing part)
5. **Ask for help** (Discord, Reddit, ChatGPT)

Remember: Every developer gets stuck. The skill is in how quickly you get unstuck.

---

## Final Motivation

This project is not just about tracking your job hunt - it's about PROVING you can build production-quality software. When you're in an interview and they ask "Tell me about a project you built," this is your answer.

Every line of code you write here is:
- ✅ A skill you're learning
- ✅ A line on your resume
- ✅ A talking point in interviews
- ✅ Proof you can deliver

Now go build something amazing! 🚀
