# Auth Service

Authentication and authorization microservice for JobHunter.

## Features

- User registration with email and password
- JWT-based authentication
- Password hashing with bcrypt
- User profile management
- User preferences management
- Protected routes with JWT guards

## API Endpoints

### Public Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "username": "johndoe",
  "fullName": "John Doe",
  "githubUsername": "johndoe",
  "leetcodeUsername": "johndoe"
}
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "fullName": "John Doe",
    "githubUsername": "johndoe",
    "leetcodeUsername": "johndoe",
    "createdAt": "2025-12-18T...",
    "updatedAt": "2025-12-18T..."
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

Response: Same as register

### Protected Endpoints (Require JWT)

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <access_token>
```

Response:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "johndoe",
  "fullName": "John Doe",
  "preferences": {
    "dailyLeetcodeGoal": 2,
    "dailyApplicationGoal": 5,
    "dailyProjectHours": 2.0,
    "notificationTime": "20:00:00",
    "timezone": "UTC"
  }
}
```

#### Update Profile
```http
PATCH /api/auth/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "fullName": "John Smith",
  "githubUsername": "johnsmith"
}
```

#### Update Preferences
```http
PATCH /api/auth/preferences
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "dailyLeetcodeGoal": 3,
  "dailyApplicationGoal": 10,
  "notificationTime": "21:00:00",
  "timezone": "America/New_York"
}
```

#### Health Check
```http
GET /api/auth/health
```

## Development

### Prerequisites
- Node.js 18+
- PostgreSQL (or use Docker Compose)
- Redis (or use Docker Compose)

### Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start PostgreSQL and Redis:
```bash
# Using Docker Compose from root
docker-compose up postgres redis
```

4. Run in development mode:
```bash
npm run dev
```

The service will start on http://localhost:3001 (or port 3000 if running standalone)

### Testing with cURL

Register a new user:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "username": "testuser",
    "fullName": "Test User"
  }'
```

Login:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

Get profile (replace TOKEN):
```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Docker

Build image:
```bash
docker build -t jobhunter/auth-service .
```

Run container:
```bash
docker run -p 3001:3000 \
  -e DATABASE_URL=postgresql://... \
  -e JWT_SECRET=your_secret \
  jobhunter/auth-service
```

## Database Schema

### users table
- `id` (UUID, PK)
- `email` (VARCHAR, UNIQUE)
- `password_hash` (VARCHAR)
- `username` (VARCHAR, UNIQUE)
- `full_name` (VARCHAR, nullable)
- `github_username` (VARCHAR, nullable)
- `leetcode_username` (VARCHAR, nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `last_login` (TIMESTAMP, nullable)

### user_preferences table
- `user_id` (UUID, PK, FK → users.id)
- `daily_leetcode_goal` (INTEGER, default: 2)
- `daily_application_goal` (INTEGER, default: 5)
- `daily_project_hours` (DECIMAL, default: 2.0)
- `notification_time` (TIME, default: '20:00:00')
- `timezone` (VARCHAR, default: 'UTC')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Security

- Passwords are hashed using bcrypt (10 rounds)
- JWT tokens expire after 7 days (configurable)
- Input validation using class-validator
- CORS enabled for frontend
- Protected routes require valid JWT

## Environment Variables

See `.env.example` for all configuration options.

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT signing

Optional:
- `JWT_EXPIRATION` - Token expiration time (default: 7d)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)

## License

MIT
