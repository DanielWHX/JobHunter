# JobHunter Architecture Overview

This document explains the system architecture, microservices design, and technology choices for the JobHunter application.

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Microservices Breakdown](#microservices-breakdown)
3. [Database Design](#database-design)
4. [API Gateway Pattern](#api-gateway-pattern)
5. [Data Flow](#data-flow)
6. [Technology Stack Rationale](#technology-stack-rationale)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                        │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend                         │
│                  (React + TypeScript)                       │
│         - Dashboard, Forms, Visualizations                  │
└────────────────────┬────────────────────────────────────────┘
                     │ REST API
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway                             │
│              (Kong / AWS API Gateway)                       │
│         - Routing, Rate Limiting, Auth Check                │
└─────────┬───────────┬──────────┬──────────┬─────────────────┘
          │           │          │          │
    ┌─────▼─────┬─────▼───┬──────▼──┬───────▼────┬───────────┐
    │   Auth    │  Task   │  Panic  │  Metrics   │Integration│
    │  Service  │ Service │ Service │  Service   │  Service  │
    │ (NestJS)  │(NestJS) │(NestJS) │  (NestJS)  │ (NestJS)  │
    └─────┬─────┴─────┬───┴────┬────┴───────┬────┴─────┬─────┘
          │           │        │            │          │
    ┌─────▼───────────▼────┐   │      ┌─────▼──────────▼─────┐
    │   PostgreSQL (RDS)   │   │      │   DynamoDB Tables    │
    │  - Users, Tasks,     │   │      │  - PanicLogs         │
    │    Applications      │   │      │  - DailyMetrics      │
    └──────────────────────┘   │      └──────────────────────┘
                               │
                         ┌─────▼──────┐
                         │   Redis    │
                         │(ElastiCache)│
                         │  - Cache   │
                         │  - Sessions│
                         └────────────┘
```

---

## Microservices Breakdown

### 1. Auth Service (Port 3001)

**Purpose**: User authentication and authorization

**Responsibilities**:
- User registration and login
- JWT token generation and validation
- Password hashing (bcrypt)
- Session management (Redis)
- User profile management

**Technology**:
- NestJS + TypeORM
- PostgreSQL (users table)
- Redis (session storage)
- Passport.js (JWT strategy)

**API Endpoints**:
```
POST   /auth/register      - Register new user
POST   /auth/login         - Login and get JWT token
POST   /auth/refresh       - Refresh access token
GET    /auth/profile       - Get current user profile
PATCH  /auth/profile       - Update user profile
POST   /auth/logout        - Logout and invalidate token
```

**Database Schema**:
- `users` table (PostgreSQL)
- `user_preferences` table (PostgreSQL)

---

### 2. Task Service (Port 3002)

**Purpose**: Daily task checklist management

**Responsibilities**:
- Create/read/update daily tasks
- Track LeetCode problems
- Track job applications
- Track project hours
- Calculate completion rates

**Technology**:
- NestJS + TypeORM
- PostgreSQL (daily_tasks, job_applications tables)
- Redis (caching frequently accessed tasks)

**API Endpoints**:
```
GET    /tasks/daily/:date        - Get tasks for specific date
POST   /tasks/daily              - Create new daily task
PATCH  /tasks/:id                - Update task progress
DELETE /tasks/:id                - Delete task
GET    /tasks/stats/week         - Weekly task statistics

POST   /applications             - Log new job application
GET    /applications             - Get all applications
PATCH  /applications/:id/status  - Update application status
GET    /applications/stats       - Application statistics
```

**Database Schema**:
- `daily_tasks` table (PostgreSQL)
- `job_applications` table (PostgreSQL)

---

### 3. Panic Service (Port 3003)

**Purpose**: Anxiety/panic moment logging and analysis

**Responsibilities**:
- Record panic/anxiety moments
- Categorize as controllable/uncontrollable
- Convert concerns into action items
- Track emotional patterns

**Technology**:
- NestJS
- DynamoDB (PanicLogs table)
- Time-series optimized storage

**API Endpoints**:
```
POST   /panic/log               - Create panic log entry
GET    /panic/logs              - Get all panic logs
GET    /panic/logs/:id          - Get specific panic log
PATCH  /panic/logs/:id          - Update panic log (add action items)
GET    /panic/stats/trends      - Analyze panic trends
GET    /panic/actionable        - Get unresolved action items
```

**DynamoDB Schema**:
```javascript
{
  userId: "uuid",              // Partition Key
  timestamp: "ISO-8601",       // Sort Key
  date: "YYYY-MM-DD",
  trigger: "string",
  category: "controllable" | "uncontrollable",
  intensity: 1-10,
  thoughts: "string",
  actionItems: ["string"],
  resolved: boolean,
  tags: ["job-search", "leetcode"]
}
```

---

### 4. Metrics Service (Port 3004)

**Purpose**: Aggregate daily metrics and dashboard data

**Responsibilities**:
- Aggregate daily metrics
- Calculate streaks
- Generate dashboard summaries
- Track progress over time

**Technology**:
- NestJS
- DynamoDB (DailyMetrics table)
- Redis (caching dashboard data)
- PostgreSQL (user_streaks table)

**API Endpoints**:
```
GET    /metrics/daily/:date     - Get metrics for specific date
POST   /metrics/daily           - Update daily metrics
GET    /metrics/week            - Weekly summary
GET    /metrics/month           - Monthly summary
GET    /metrics/dashboard       - Complete dashboard data
GET    /metrics/streaks         - Current and longest streaks
```

**DynamoDB Schema**:
```javascript
{
  userId: "uuid",              // Partition Key
  date: "YYYY-MM-DD",          // Sort Key
  leetcodeProblems: {
    solved: 3,
    target: 2,
    easy: 1,
    medium: 2,
    hard: 0
  },
  applications: {
    sent: 5,
    target: 5,
    highQuality: 2,
    massApply: 3
  },
  projectHours: {
    worked: 3.5,
    target: 2.0,
    tasks: ["feature-auth", "fix-bug"]
  },
  githubCommits: 8,
  dailyReviewCompleted: true,
  dailyReviewAnswers: {
    solvedAlgorithm: true,
    sentApplications: true,
    learnedNewConcept: true,
    notes: "Learned Redis caching patterns"
  },
  streakDay: 15,
  panicCount: 1
}
```

---

### 5. Integration Service (Port 3005)

**Purpose**: External API integrations (GitHub, LeetCode)

**Responsibilities**:
- Fetch GitHub contribution data
- Fetch LeetCode submission data
- Cache API responses
- Auto-update metrics

**Technology**:
- NestJS
- GitHub REST API
- LeetCode GraphQL API (unofficial)
- Redis (caching API responses)

**API Endpoints**:
```
GET    /integrations/github/:username    - GitHub stats
GET    /integrations/leetcode/:username  - LeetCode stats
POST   /integrations/sync                - Sync all integrations
GET    /integrations/status              - Integration health check
```

**External APIs**:
- GitHub: `https://api.github.com/users/:username/events`
- LeetCode: `https://leetcode.com/graphql` (requires session cookie)

---

### 6. Notification Service (Port 3006)

**Purpose**: Daily reminders and notifications

**Responsibilities**:
- Send daily review reminders (8:00 PM)
- Email notifications for milestones
- In-app notifications

**Technology**:
- NestJS
- Node-cron (scheduled tasks)
- Nodemailer (email)
- PostgreSQL (user_preferences for notification time)

**API Endpoints**:
```
POST   /notifications/schedule     - Schedule notification
GET    /notifications              - Get all notifications
PATCH  /notifications/:id/read     - Mark as read
DELETE /notifications/:id          - Delete notification
```

**Cron Jobs**:
- Daily review reminder (configured per user)
- Weekly summary email
- Streak milestone notifications

---

## Database Design

### PostgreSQL (Relational Data)

**When to use**: Structured data with relationships, ACID transactions

**Tables**:
1. `users` - User accounts
2. `user_preferences` - Settings and goals
3. `user_streaks` - Streak tracking
4. `daily_tasks` - Daily checklist items
5. `job_applications` - Application tracking

**Why PostgreSQL**:
- Strong consistency for user data
- Complex queries with JOINs
- Mature ecosystem
- Free tier on AWS RDS

---

### DynamoDB (NoSQL Time-Series)

**When to use**: High-volume time-series data, flexible schema

**Tables**:
1. `JobHunter-PanicLogs` - Panic/anxiety logs
2. `JobHunter-DailyMetrics` - Daily aggregated metrics

**Why DynamoDB**:
- Excellent for time-series data (partition by userId, sort by timestamp)
- Scales automatically
- Pay-per-request pricing (very cheap for low volume)
- No server management

**Access Patterns**:
```javascript
// Get all panic logs for user in date range
PK: userId, SK: between(timestamp1, timestamp2)

// Get daily metrics for user in week
PK: userId, SK: between("2025-01-01", "2025-01-07")
```

---

### Redis (Caching & Sessions)

**When to use**: Fast temporary storage, caching, sessions

**Use Cases**:
1. JWT session blacklist (logout)
2. API response caching (GitHub/LeetCode)
3. Daily dashboard caching
4. Rate limiting

**Why Redis**:
- Sub-millisecond latency
- Built-in expiration (TTL)
- Reduces database load
- Free tier on AWS ElastiCache

---

## API Gateway Pattern

**Why API Gateway**:
- Single entry point for all microservices
- Centralized authentication check
- Rate limiting per user
- Request/response logging
- Load balancing

**Request Flow**:
1. User → Frontend → API Gateway
2. Gateway validates JWT token (calls Auth Service)
3. Gateway routes to appropriate microservice
4. Microservice processes request
5. Response → Gateway → Frontend

---

## Data Flow

### Daily Check-in Flow

```
1. User opens app at 9:00 AM
   ↓
2. Frontend calls /metrics/dashboard
   ↓
3. Metrics Service checks Redis cache
   ↓
4. If cache miss:
   - Query PostgreSQL for tasks
   - Query DynamoDB for yesterday's metrics
   - Query Integration Service for GitHub commits
   ↓
5. Aggregate data + cache in Redis (TTL: 5 min)
   ↓
6. Return dashboard to frontend
   ↓
7. User sees:
   - Today's tasks (0/2 LeetCode, 0/5 applications)
   - Current streak: 14 days
   - Yesterday's performance: ✅ All goals met
```

### Panic Log Flow

```
1. User feels anxious → Clicks "Log Panic"
   ↓
2. Frontend shows form:
   - What triggered it?
   - Controllable or uncontrollable?
   - Intensity (1-10)
   - Thoughts
   ↓
3. Submit → POST /panic/log
   ↓
4. Panic Service:
   - Saves to DynamoDB (PanicLogs table)
   - Increments today's panic count in DailyMetrics
   ↓
5. Frontend updates:
   - Shows categorization
   - Prompts: "Is this controllable?"
   - If yes: "What action can you take?"
   - Converts to task in Task Service
```

### Daily Review Flow (8:00 PM)

```
1. Notification Service cron job runs
   ↓
2. Query user_preferences for users with notificationTime = "20:00"
   ↓
3. For each user:
   - Check if dailyReviewCompleted = false
   - Send notification (email + in-app)
   ↓
4. User clicks notification → Opens review form:
   - Did you solve an algorithm problem? (Y/N)
   - Did you send applications? (Y/N)
   - Did you learn a new concept? (Y/N)
   - Notes (optional)
   ↓
5. Submit → POST /metrics/daily
   ↓
6. Metrics Service updates DailyMetrics in DynamoDB
   ↓
7. Check if all targets met → Update streak
```

---

## Technology Stack Rationale

### Why Next.js?
- SSR for SEO (if you want to blog about your journey)
- File-based routing (easy to understand)
- Built-in API routes (could replace some microservices)
- Industry standard (great for resume)
- React ecosystem (huge community)

### Why NestJS?
- TypeScript-first (type safety across stack)
- Built-in microservices support (TCP, Redis, RabbitMQ)
- Dependency injection (testable code)
- Similar to Spring Boot (transfers to Java roles)
- Decorators and middleware (clean code)

### Why Microservices (not Monolith)?
- **Learn the pattern**: Most big companies use microservices
- **Scalability**: Scale panic service independently if it gets heavy traffic
- **Team simulation**: Practice working with distributed systems
- **Fault isolation**: If Integration Service crashes, Task Service still works
- **Technology diversity**: Could rewrite one service in Go/Python later

### Why Three Databases?
- **Resume value**: "Experience with PostgreSQL, DynamoDB, and Redis"
- **Right tool for job**:
  - PostgreSQL → User data (relational)
  - DynamoDB → Time-series (panic logs, metrics)
  - Redis → Caching (performance)
- **AWS learning**: Practice with different AWS services

### Why Docker + Kubernetes?
- **Industry standard**: Every company uses containers
- **Consistency**: Same environment dev → prod
- **Scalability**: Easy to scale with replicas
- **Resume keyword**: "Deployed microservices on K8s"

---

## Deployment Options

### Option 1: Development (Free)
- Docker Compose locally
- PostgreSQL, Redis, DynamoDB Local in containers
- No AWS costs

### Option 2: AWS Free Tier
- RDS PostgreSQL (db.t3.micro) - FREE for 12 months
- ElastiCache Redis (cache.t2.micro) - FREE for 12 months
- DynamoDB (25 GB storage, 200M requests/month) - ALWAYS FREE
- EC2 t2.micro or Fargate - Deploy containers
- **Estimated cost**: $0-5/month

### Option 3: AWS EKS (Production)
- Kubernetes cluster on AWS
- Auto-scaling
- Load balancers
- **Estimated cost**: $50-100/month (NOT recommended until you have income)

---

## Next Steps for Implementation

1. ✅ Project structure created
2. ⏳ Implement Auth Service (register, login, JWT)
3. ⏳ Implement Task Service (CRUD tasks)
4. ⏳ Implement Panic Service (log panic, analyze)
5. ⏳ Implement Metrics Service (aggregate, dashboard)
6. ⏳ Implement Integration Service (GitHub/LeetCode APIs)
7. ⏳ Build Frontend (Next.js dashboard)
8. ⏳ Docker images for each service
9. ⏳ Kubernetes manifests
10. ⏳ Deploy to AWS

---

## Useful Resources

- NestJS Docs: https://docs.nestjs.com/
- Next.js Docs: https://nextjs.org/docs
- TypeORM: https://typeorm.io/
- AWS DynamoDB: https://docs.aws.amazon.com/dynamodb/
- Kubernetes: https://kubernetes.io/docs/

---

This architecture is designed to teach you modern full-stack development while building something genuinely useful for your job hunt. Every technology choice is intentional and resume-worthy.
