# JobHunter - 快速启动指南

这是一份简化的快速启动指南，帮助你在 10 分钟内运行起 JobHunter 项目。

## 🚀 最快速度启动（推荐新手）

### 步骤 1: 检查前置条件

确保你已安装：
- ✅ **Node.js 18+** - 运行 `node --version` 检查
- ✅ **Docker Desktop** - 运行 `docker --version` 检查
- ✅ **Git** - 运行 `git --version` 检查

如果没有，请先安装：
- Node.js: https://nodejs.org/
- Docker Desktop: https://www.docker.com/products/docker-desktop

### 步骤 2: 克隆并安装

```bash
# 1. 进入项目目录（你已经在这里了）
cd JobHunter

# 2. 安装所有依赖（可能需要 5-10 分钟）
npm install --workspaces

# 3. 复制环境变量文件
cp .env.example .env
```

### 步骤 3: 启动数据库

```bash
# 只启动数据库（PostgreSQL, Redis, DynamoDB Local）
docker-compose up -d postgres redis dynamodb-local

# 检查是否启动成功
docker ps
# 应该看到 3 个容器在运行：jobhunter-postgres, jobhunter-redis, jobhunter-dynamodb
```

### 步骤 4: 初始化数据库表

```bash
# PostgreSQL 表会自动创建（通过 init-db.sql）

# 初始化 DynamoDB 表
cd infrastructure
npm install
npm run init-db
cd ..
```

### 步骤 5: 启动 Auth Service（第一个微服务）

```bash
# 打开一个新的终端窗口
cd services/auth-service

# 安装依赖
npm install

# 启动服务
npm run dev
```

你应该看到：
```
Auth Service is running on: http://localhost:3000
Health check: http://localhost:3000/api/auth/health
```

### 步骤 6: 测试 API

打开新终端，运行：

```bash
# 测试健康检查
curl http://localhost:3000/api/auth/health

# 注册新用户
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@jobhunter.com",
    "password": "Demo123456",
    "username": "demo",
    "fullName": "Demo User"
  }'
```

如果看到返回 JSON 包含 `accessToken`，恭喜！你的第一个微服务运行成功了！🎉

---

## 📋 下一步做什么？

### 选项 1: 继续构建其他微服务（学习 NestJS）

按照 [NEXT_STEPS.md](NEXT_STEPS.md) 中的指引，逐步构建：
1. ✅ Auth Service（已完成）
2. ⏳ Task Service - 任务管理
3. ⏳ Panic Service - 焦虑日志
4. ⏳ Metrics Service - 数据统计
5. ⏳ Integration Service - GitHub/LeetCode 集成

### 选项 2: 直接启动所有服务（使用 Docker）

```bash
# 在项目根目录
docker-compose up --build

# 这会启动：
# - 所有数据库
# - 所有 6 个微服务
# - 前端（如果已实现）
```

注意：第一次构建可能需要 10-20 分钟。

### 选项 3: 先学习架构设计

阅读以下文档了解系统设计：
1. [ARCHITECTURE.md](ARCHITECTURE.md) - 系统架构详解
2. [README.md](README.md) - 项目概述
3. [SETUP.md](SETUP.md) - 完整部署指南

---

## 🛠️ 常见问题

### Q1: Docker 容器启动失败

**检查端口占用**：
```bash
# Windows
netstat -ano | findstr :5432
netstat -ano | findstr :6379
netstat -ano | findstr :8001

# Mac/Linux
lsof -i :5432
lsof -i :6379
lsof -i :8001
```

如果端口被占用，杀掉对应进程或修改 `docker-compose.yml` 中的端口映射。

### Q2: npm install 失败

```bash
# 清理缓存重试
npm cache clean --force
rm -rf node_modules
npm install
```

### Q3: 连接数据库失败

检查 `.env` 文件中的 `DATABASE_URL`：
```bash
DATABASE_URL=postgresql://jobhunter:dev_password@localhost:5432/jobhunter
```

确保：
- PostgreSQL 容器在运行：`docker ps | grep postgres`
- 端口没有被占用

### Q4: TypeScript 报错找不到模块

```bash
# 重新安装 shared types
cd shared/types
npm install
npm run build
cd ../..
```

---

## 🎯 推荐学习路径

### Week 1: 理解并运行 Auth Service
- ✅ 成功启动 Auth Service
- ✅ 用 Postman/cURL 测试所有 API
- ✅ 阅读代码理解：
  - NestJS 的模块化结构
  - TypeORM 如何操作数据库
  - JWT 认证如何工作
  - 密码如何加密

### Week 2-3: 构建 Task Service
- 学习 CRUD 操作
- 学习 Redis 缓存
- 实现日常任务管理

### Week 4: 构建 Panic Service
- 学习 DynamoDB（NoSQL）
- 理解时间序列数据
- 实现焦虑日志功能

### Week 5-6: 构建前端
- 学习 Next.js 14
- 学习 React Query
- 连接所有后端 API

### Week 7-8: DevOps
- Docker 容器化
- Kubernetes 部署
- CI/CD 流水线

---

## 📚 核心文档

| 文档 | 用途 | 何时阅读 |
|------|------|----------|
| [README.md](README.md) | 项目概述 | 开始前 |
| **[QUICKSTART.md](QUICKSTART.md)** | **快速启动** | **现在** |
| [ARCHITECTURE.md](ARCHITECTURE.md) | 架构设计 | 开始编码前 |
| [NEXT_STEPS.md](NEXT_STEPS.md) | 实现路线图 | 开始编码时 |
| [SETUP.md](SETUP.md) | 完整部署 | 部署到 AWS 时 |

---

## 🔧 开发工具推荐

### API 测试
- **Postman** - 图形化界面，适合初学者
- **Insomnia** - 轻量级替代品
- **cURL** - 命令行工具

### 数据库管理
- **DBeaver** - 多数据库支持（PostgreSQL, Redis）
- **pgAdmin** - PostgreSQL 专用
- **Redis Commander** - Redis 可视化

### 代码编辑器
- **VS Code** - 推荐（已安装）
- 安装插件：
  - ESLint
  - Prettier
  - Docker
  - TypeScript

---

## 💡 提示与技巧

### 1. 使用终端分屏

同时运行多个服务时，使用多个终端窗口：
- 窗口 1: Docker 容器日志 (`docker-compose logs -f`)
- 窗口 2: Auth Service (`npm run dev`)
- 窗口 3: 其他服务
- 窗口 4: API 测试

### 2. 查看日志

```bash
# 查看特定容器日志
docker logs jobhunter-postgres
docker logs jobhunter-redis -f  # -f 实时跟踪

# 查看所有容器日志
docker-compose logs -f
```

### 3. 进入数据库

```bash
# PostgreSQL
docker exec -it jobhunter-postgres psql -U jobhunter

# 常用 SQL
\dt  -- 查看所有表
\d users  -- 查看 users 表结构
SELECT * FROM users;  -- 查询用户

# Redis
docker exec -it jobhunter-redis redis-cli
KEYS *  -- 查看所有 key
```

### 4. 重启服务

```bash
# 重启特定容器
docker-compose restart postgres

# 重启所有
docker-compose restart

# 完全清理并重启
docker-compose down -v  # -v 删除数据卷
docker-compose up -d
```

---

## 🎓 学习资源

### 官方文档
- NestJS: https://docs.nestjs.com/
- Next.js: https://nextjs.org/docs
- TypeORM: https://typeorm.io/
- DynamoDB: https://docs.aws.amazon.com/dynamodb/

### 视频教程（免费）
- NestJS Crash Course (YouTube)
- Next.js 14 Tutorial (YouTube)
- Docker for Beginners (freeCodeCamp)

### 实践建议
- 每天 commit 代码到 GitHub（建立绿色方块）
- 写开发日志（记录学到的东西）
- 遇到问题先看错误信息，再 Google
- 加入开发者社区（Discord/Reddit）

---

## ✅ 检查清单

开始开发前，确保：

- [ ] Node.js 18+ 已安装
- [ ] Docker Desktop 已安装并运行
- [ ] 项目依赖已安装 (`npm install --workspaces`)
- [ ] `.env` 文件已创建
- [ ] PostgreSQL 容器运行正常
- [ ] Redis 容器运行正常
- [ ] DynamoDB Local 容器运行正常
- [ ] Auth Service 启动成功
- [ ] 能成功注册和登录用户

全部打勾？恭喜！你已经准备好开始构建 JobHunter 了！🚀

---

## 🆘 需要帮助？

1. **先查错误日志**：大部分问题都能从日志中找到答案
2. **查文档**：README, ARCHITECTURE, SETUP 等
3. **Google 错误信息**：复制完整错误信息搜索
4. **查看 GitHub Issues**：看看别人是否遇到同样问题

记住：每个开发者都会遇到问题，关键是解决问题的能力！💪

---

Happy Coding! 开始你的 JobHunter 之旅吧！🎉
