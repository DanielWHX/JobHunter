# JobHunter

A comprehensive full-stack application to track your job hunting journey, manage daily tasks, monitor progress, and combat anxiety through structured planning and metrics.

## Features

- **Daily Task Checklist** - Track LeetCode problems, job applications, project hours
- **Panic Log** - Record anxiety moments, categorize (controllable/uncontrollable), convert to actionable items
- **Progress Dashboard** - Visualize LeetCode count, application count, streak days
- **Daily Review Prompts** - Evening reminders for self-reflection (3 key questions)
- **API Integrations** - Auto-fetch data from GitHub and LeetCode APIs
- **Multi-Database Architecture** - Learn PostgreSQL, DynamoDB, and Redis on AWS

## Technology Stack

### Frontend
- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling
- **Recharts** for data visualization
- **React Query** for API state management

### Backend (Microservices)
- **NestJS** with TypeScript
- **PostgreSQL** (RDS) - User data, tasks, applications
- **DynamoDB** - Time-series data (panic logs, metrics)
- **Redis** (ElastiCache) - Caching and session management
- **Docker** + **Kubernetes** for container orchestration

### Microservices Architecture
1. **Auth Service** - User authentication and authorization
2. **Task Service** - Daily checklist management
3. **Panic Service** - Panic log and emotion tracking
4. **Metrics Service** - Progress tracking and statistics
5. **Integration Service** - GitHub/LeetCode API integration
6. **Notification Service** - Daily reminders and alerts

### AWS Services (Cost Optimized)
- **RDS PostgreSQL** (db.t3.micro free tier) - Relational data
- **DynamoDB** (on-demand pricing) - Time-series data
- **ElastiCache Redis** (cache.t2.micro) - Caching layer
- **API Gateway** - Service routing
- **EKS** (production) / Minikube (local) - Kubernetes

### DevOps
- Docker containers
- Kubernetes orchestration
- GitHub Actions CI/CD
- Infrastructure as Code

## Project Structure

```
JobHunter/
├── frontend/                 # Next.js application
├── services/                 # NestJS microservices
│   ├── auth-service/
│   ├── task-service/
│   ├── panic-service/
│   ├── metrics-service/
│   ├── integration-service/
│   └── notification-service/
├── infrastructure/           # K8s configs, Terraform
├── docker-compose.yml       # Local development
└── README.md
```

## 📚 Documentation

### 🎯 Start Here
- **[Quick Start Guide](QUICKSTART.md)** - Get running in 10 minutes
- **[Complete Documentation](docs/00-START-HERE.md)** - Full learning path and guides
- **[Architecture Overview](ARCHITECTURE.md)** - System design deep dive

### 📖 Learning Path
- **[Module-based Learning](docs/INDEX.md)** - 11 modules from beginner to expert
- **[Module 0: Prerequisites](docs/learning-modules/MODULE-00-Prerequisites.md)** - Start here if you're new
- **[Next Steps](NEXT_STEPS.md)** - 10-week implementation plan

### 🚀 Deployment
- **[Deployment Checklist](docs/deployment/00-Preparation-Checklist.md)** - What you need to deploy
- **[AWS Setup Guide](docs/deployment/01-AWS-Account-Setup.md)** - Step-by-step AWS configuration
- **[Complete Setup Guide](SETUP.md)** - Detailed installation and deployment

## Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- AWS Account (Free Tier) - optional for deployment
- kubectl and minikube (for K8s) - optional for advanced deployment

### Quick Start (10 minutes)

```bash
# 1. Clone and install
git clone <your-repo-url>
cd JobHunter
npm install --workspaces

# 2. Start databases
docker-compose up -d postgres redis dynamodb-local

# 3. Start Auth Service
cd services/auth-service
npm install
npm run dev

# 4. Test API
curl http://localhost:3000/api/auth/health
```

**See [QUICKSTART.md](QUICKSTART.md) for detailed instructions.**

### Full Development Setup
```bash
# Install dependencies
npm install --workspaces

# Start all databases
docker-compose up -d postgres redis dynamodb-local

# Start all services (in separate terminals)
cd services/auth-service && npm run dev
cd services/task-service && npm run dev
# ... etc

# Or use Docker Compose for everything
docker-compose up
```

## Learning Goals

This project teaches:
- Full-stack TypeScript development
- Microservices architecture patterns
- AWS cloud services (RDS, DynamoDB, ElastiCache)
- Container orchestration with Kubernetes
- CI/CD with GitHub Actions
- API integration and data aggregation

## Philosophy

> "Focus on what you can control. Measure progress by inputs, not outputs."

This app embodies Stoic principles - tracking controllable actions (code written, applications sent, concepts learned) rather than uncontrollable outcomes (interview invitations, offers).

## License

MIT