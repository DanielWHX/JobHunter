# JobHunter Setup Guide

Complete setup instructions for local development and AWS deployment.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [AWS Setup](#aws-setup)
4. [Running the Application](#running-the-application)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- **Git** ([Download](https://git-scm.com/))
- **AWS CLI** ([Installation Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html))
- **kubectl** ([Installation Guide](https://kubernetes.io/docs/tasks/tools/))

### Optional Tools
- **Minikube** (for local Kubernetes testing) - [Installation](https://minikube.sigs.k8s.io/docs/start/)
- **Postman** or **Insomnia** (API testing)
- **DBeaver** or **pgAdmin** (database management)

---

## Local Development Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd JobHunter
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install all workspace dependencies
npm install --workspaces
```

### 3. Environment Configuration

Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` and configure:
```bash
# Database (automatically configured by Docker Compose)
DATABASE_URL=postgresql://jobhunter:dev_password@localhost:5432/jobhunter
REDIS_URL=redis://localhost:6379
DYNAMODB_ENDPOINT=http://localhost:8001

# JWT (change this!)
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# GitHub API (get from: https://github.com/settings/tokens)
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_USERNAME=your_github_username

# LeetCode (get from browser cookies after logging in)
LEETCODE_SESSION=your_leetcode_session_cookie
LEETCODE_USERNAME=your_leetcode_username
```

#### Getting GitHub Token:
1. Go to [GitHub Settings > Developer Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes: `repo`, `user`
4. Copy the token to `.env`

#### Getting LeetCode Session:
1. Log in to [LeetCode](https://leetcode.com/)
2. Open browser DevTools (F12) > Application/Storage > Cookies
3. Find `LEETCODE_SESSION` cookie
4. Copy value to `.env`

### 4. Start Services with Docker Compose

```bash
# Start all services (databases + microservices + frontend)
docker-compose up

# Or run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 5. Initialize Databases

Once services are running, initialize DynamoDB tables:

```bash
# In a new terminal
cd infrastructure
npm install
npm run init-dynamodb
```

PostgreSQL tables are automatically initialized via `init-db.sql` on first run.

### 6. Verify Services

Check that all services are running:
- Frontend: http://localhost:3000
- Auth Service: http://localhost:3001
- Task Service: http://localhost:3002
- Panic Service: http://localhost:3003
- Metrics Service: http://localhost:3004
- Integration Service: http://localhost:3005
- Notification Service: http://localhost:3006
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- DynamoDB Local: http://localhost:8001

---

## AWS Setup

### 1. Create AWS Account
1. Sign up at [AWS Free Tier](https://aws.amazon.com/free/)
2. Verify your identity and payment method

### 2. Configure AWS CLI

```bash
# Install AWS CLI (if not already installed)
# MacOS: brew install awscli
# Windows: Download from AWS website
# Linux: Use package manager

# Configure credentials
aws configure

# Enter:
# AWS Access Key ID: [Your access key]
# AWS Secret Access Key: [Your secret key]
# Default region: us-east-1
# Default output format: json
```

### 3. Create RDS PostgreSQL Instance (Free Tier)

```bash
# Via AWS Console or CLI:
aws rds create-db-instance \
  --db-instance-identifier jobhunter-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 16.1 \
  --master-username jobhunter \
  --master-user-password YourStrongPassword123 \
  --allocated-storage 20 \
  --publicly-accessible \
  --backup-retention-period 7

# Get endpoint after creation (takes ~10 minutes)
aws rds describe-db-instances \
  --db-instance-identifier jobhunter-db \
  --query 'DBInstances[0].Endpoint.Address'
```

Update production `.env`:
```bash
DATABASE_URL=postgresql://jobhunter:YourPassword@your-rds-endpoint:5432/jobhunter
```

### 4. Create DynamoDB Tables

```bash
# Tables will be created automatically by the application
# Or create manually:
aws dynamodb create-table \
  --table-name JobHunter-PanicLogs \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=timestamp,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
    AttributeName=timestamp,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST

aws dynamodb create-table \
  --table-name JobHunter-DailyMetrics \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=date,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
    AttributeName=date,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST
```

### 5. Create ElastiCache Redis (Free Tier)

```bash
# Via AWS Console or CLI:
aws elasticache create-cache-cluster \
  --cache-cluster-id jobhunter-cache \
  --cache-node-type cache.t2.micro \
  --engine redis \
  --num-cache-nodes 1

# Get endpoint
aws elasticache describe-cache-clusters \
  --cache-cluster-id jobhunter-cache \
  --show-cache-node-info \
  --query 'CacheClusters[0].CacheNodes[0].Endpoint.Address'
```

Update `.env`:
```bash
REDIS_URL=redis://your-elasticache-endpoint:6379
```

---

## Running the Application

### Development Mode (Local)

```bash
# Start all services
docker-compose up

# Or start individual services:
npm run dev:frontend    # Frontend only
npm run dev:auth       # Auth service only
npm run dev:task       # Task service only
```

### Production Build

```bash
# Build all services
npm run build

# Run production
docker-compose -f docker-compose.prod.yml up
```

### Kubernetes Deployment (Local with Minikube)

```bash
# Start minikube
minikube start

# Apply Kubernetes configs
kubectl apply -f infrastructure/k8s/

# Check deployments
kubectl get pods
kubectl get services

# Access application (get URL)
minikube service frontend --url
```

### Kubernetes Deployment (AWS EKS)

```bash
# Create EKS cluster (costs money - not free tier!)
eksctl create cluster \
  --name jobhunter \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 2

# Apply configurations
kubectl apply -f infrastructure/k8s/

# Get LoadBalancer URL
kubectl get svc frontend
```

---

## Troubleshooting

### Docker Issues

**Problem**: Containers won't start
```bash
# Check Docker is running
docker ps

# Remove old containers/volumes
docker-compose down -v
docker system prune -a

# Restart Docker Desktop
```

**Problem**: Port already in use
```bash
# Find process using port (e.g., 3000)
# Windows:
netstat -ano | findstr :3000
taskkill /PID <pid> /F

# Mac/Linux:
lsof -i :3000
kill -9 <pid>
```

### Database Connection Issues

**Problem**: Cannot connect to PostgreSQL
```bash
# Check if container is running
docker ps | grep postgres

# Check logs
docker logs jobhunter-postgres

# Connect manually
docker exec -it jobhunter-postgres psql -U jobhunter
```

**Problem**: DynamoDB not responding
```bash
# Check if DynamoDB Local is running
curl http://localhost:8001/

# Restart DynamoDB
docker-compose restart dynamodb-local
```

### AWS Issues

**Problem**: RDS connection timeout
- Check security group allows inbound traffic on port 5432
- Check VPC settings allow public access
- Verify endpoint URL is correct

**Problem**: DynamoDB access denied
```bash
# Verify AWS credentials
aws sts get-caller-identity

# Check IAM permissions (need DynamoDB full access)
```

### Application Issues

**Problem**: GitHub/LeetCode integration not working
- Verify tokens in `.env` are correct
- Check token hasn't expired
- Ensure environment variables are loaded

**Problem**: Build errors
```bash
# Clean install
rm -rf node_modules
npm install

# Clear build cache
npm run clean
npm run build
```

---

## Next Steps

1. **Create First User**: Visit http://localhost:3000 and register
2. **Test APIs**: Use Postman collection in `/docs/postman/`
3. **View Dashboard**: Log in and check your progress dashboard
4. **Set Up Daily Reminders**: Configure notification time in settings

---

## Cost Optimization Tips

1. **Use Free Tier**: RDS t3.micro, ElastiCache t2.micro, DynamoDB on-demand
2. **Stop Services When Not Using**: Stop RDS/ElastiCache instances
3. **Monitor Costs**: Set up AWS Budgets alerts
4. **Development First**: Complete development locally before deploying to AWS

---

## Useful Commands

```bash
# View all running services
docker-compose ps

# Restart a specific service
docker-compose restart auth-service

# View logs for a service
docker-compose logs -f auth-service

# Run database migrations
npm run migrate

# Seed database with sample data
npm run seed

# Run tests
npm test

# Run linter
npm run lint
```

---

## Support

If you encounter issues:
1. Check this SETUP.md file
2. Review error logs: `docker-compose logs`
3. Check database connections
4. Verify environment variables

Happy coding!
