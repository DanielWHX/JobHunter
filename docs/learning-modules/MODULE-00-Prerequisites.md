# Module 0: 环境准备与基础概念

**难度**: ⭐ 新手友好
**预计时间**: 1-2 小时
**目标**: 安装所有必需工具，理解基础概念

---

## 📋 本模块你将学到

- [x] 安装 Node.js, Docker, Git
- [x] 理解什么是微服务
- [x] 理解什么是容器化
- [x] 验证环境配置正确

---

## 第一步：安装必需软件

### 1.1 Node.js（JavaScript 运行时）

**作用**: 运行后端服务和前端应用

**安装步骤**:

1. 访问 https://nodejs.org/
2. 下载 **LTS 版本**（推荐 18 或 20）
3. 安装并选择默认选项
4. **验证安装**:

```bash
node --version
# 应该显示: v18.x.x 或 v20.x.x

npm --version
# 应该显示: 9.x.x 或 10.x.x
```

**常见问题**:

<details>
<summary>❌ 命令未找到 / command not found</summary>

**Windows**:
- 重启命令行窗口
- 检查环境变量 PATH 中是否有 Node.js

**Mac/Linux**:
```bash
# 重新加载 shell 配置
source ~/.bashrc  # 或 ~/.zshrc
```
</details>

<details>
<summary>❌ 版本太旧</summary>

卸载旧版本，重新安装最新 LTS 版本
</details>

---

### 1.2 Docker Desktop（容器化平台）

**作用**: 运行数据库（PostgreSQL, Redis, DynamoDB Local）

**安装步骤**:

1. 访问 https://www.docker.com/products/docker-desktop
2. 下载对应系统版本
3. 安装并启动 Docker Desktop
4. **验证安装**:

```bash
docker --version
# 应该显示: Docker version 24.x.x 或更新

docker ps
# 应该显示空列表或运行中的容器（不报错就对了）
```

**重要**:
- Windows 用户需要启用 WSL 2（安装时会提示）
- Mac 用户需要给予 Docker 必要权限

**常见问题**:

<details>
<summary>❌ Docker daemon 未运行</summary>

- 确保 Docker Desktop 应用已启动（系统托盘应该有 Docker 图标）
- Windows: 检查 WSL 2 是否安装
- Mac: 系统偏好设置 → 隐私 → 给予 Docker 权限
</details>

<details>
<summary>❌ WSL 2 安装失败（Windows）</summary>

打开 PowerShell（管理员模式）:
```powershell
wsl --install
wsl --set-default-version 2
```
重启电脑后再启动 Docker Desktop
</details>

---

### 1.3 Git（版本控制）

**作用**: 管理代码版本，提交到 GitHub

**安装步骤**:

1. 访问 https://git-scm.com/
2. 下载并安装
3. **配置 Git**:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

4. **验证安装**:

```bash
git --version
# 应该显示: git version 2.x.x
```

---

### 1.4 代码编辑器（推荐 VS Code）

**你可能已经有了，跳过此步骤**

如果没有:
1. 访问 https://code.visualstudio.com/
2. 下载安装
3. **推荐插件**:
   - ESLint（代码检查）
   - Prettier（代码格式化）
   - Docker（Docker 文件支持）
   - GitLens（Git 可视化）

---

## 第二步：理解核心概念

### 2.1 什么是微服务？

**简单理解**:

传统方式（Monolith 单体应用）:
```
┌─────────────────────────────┐
│   一个大应用                 │
│   - 用户管理                 │
│   - 任务管理                 │
│   - 数据统计                 │
│   - 通知服务                 │
└─────────────────────────────┘
```
问题：一个部分出错，整个应用崩溃

微服务方式:
```
┌──────────┐ ┌──────────┐ ┌──────────┐
│用户管理  │ │任务管理  │ │数据统计  │
│(独立应用)│ │(独立应用)│ │(独立应用)│
└──────────┘ └──────────┘ └──────────┘
```
好处：
- ✅ 独立部署（修改一个不影响其他）
- ✅ 技术自由（每个可以用不同技术）
- ✅ 团队协作（不同团队负责不同服务）

**JobHunter 的微服务**:
1. Auth Service - 用户认证
2. Task Service - 任务管理
3. Panic Service - 焦虑日志
4. Metrics Service - 数据统计
5. Integration Service - 外部 API 集成
6. Notification Service - 通知提醒

---

### 2.2 什么是容器化（Docker）？

**比喻**:

传统方式就像：
- "在我电脑上能跑啊！" 😅
- 每个人电脑环境不同，部署困难

Docker 容器就像：
- 把应用和所有依赖打包成一个"集装箱"
- 在任何地方都能运行，环境完全一致

**示例**:

不用 Docker:
```bash
# 需要手动安装
1. 安装 PostgreSQL
2. 配置端口 5432
3. 创建数据库
4. 设置权限
5. 可能和现有软件冲突
```

用 Docker:
```bash
# 一条命令搞定
docker-compose up postgres
# PostgreSQL 在隔离的容器中运行，不影响你的系统
```

---

### 2.3 什么是 API？

**API（Application Programming Interface）** = 应用程序之间的对话方式

**现实例子**:

你去餐厅点餐：
- 你（前端）: "我要一份宫保鸡丁"
- 服务员（API）: 把订单传给厨房
- 厨房（后端）: 做菜
- 服务员（API）: 把菜端给你

**代码例子**:

```javascript
// 前端发送请求
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// 后端返回响应
{
  "user": { "id": "123", "email": "user@example.com" },
  "accessToken": "eyJhbGciOiJ..."
}
```

---

## 第三步：验证环境

### 3.1 创建测试目录

```bash
# 创建测试文件夹
mkdir jobhunter-test
cd jobhunter-test

# 初始化 Node.js 项目
npm init -y

# 安装测试包
npm install express
```

### 3.2 创建简单服务器

创建文件 `test-server.js`:

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello JobHunter!' });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### 3.3 运行测试

```bash
# 启动服务器
node test-server.js

# 打开浏览器访问: http://localhost:3000
# 应该看到: {"message":"Hello JobHunter!"}
```

**如果成功**: ✅ Node.js 环境配置正确！

### 3.4 测试 Docker

```bash
# 运行测试容器
docker run hello-world

# 应该看到:
# Hello from Docker!
# This message shows that your installation appears to be working correctly.
```

**如果成功**: ✅ Docker 配置正确！

---

## 第四步：克隆 JobHunter 项目

```bash
# 进入你的工作目录
cd ~/Documents  # Mac/Linux
cd C:\Users\YourName\Documents  # Windows

# 或者你已经在 JobHunter 目录了
cd E:\GitHubSpace\JobHunter

# 安装所有依赖（需要 5-10 分钟）
npm install --workspaces

# 如果报错，尝试:
npm install --legacy-peer-deps --workspaces
```

---

## 第五步：启动数据库

```bash
# 复制环境变量文件
cp .env.example .env

# 启动 PostgreSQL, Redis, DynamoDB Local
docker-compose up -d postgres redis dynamodb-local

# 检查容器状态
docker ps

# 应该看到 3 个容器在运行:
# - jobhunter-postgres
# - jobhunter-redis
# - jobhunter-dynamodb
```

**验证数据库**:

```bash
# 测试 PostgreSQL
docker exec -it jobhunter-postgres psql -U jobhunter -c "SELECT version();"
# 应该显示 PostgreSQL 版本信息

# 测试 Redis
docker exec -it jobhunter-redis redis-cli ping
# 应该返回: PONG

# 测试 DynamoDB
curl http://localhost:8001/
# 应该返回 DynamoDB 信息
```

---

## 第六步：启动 Auth Service

```bash
# 进入 Auth Service 目录
cd services/auth-service

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 应该看到:
# Auth Service is running on: http://localhost:3000
```

**测试 API**:

打开新终端:

```bash
# 健康检查
curl http://localhost:3000/api/auth/health

# 应该返回:
# {"status":"ok","service":"auth-service","timestamp":"2025-12-18T..."}
```

**如果成功**: 🎉 恭喜！你已经成功运行了第一个微服务！

---

## ✅ 完成检查清单

完成本模块后，确保：

- [ ] Node.js 已安装且版本正确（18+）
- [ ] Docker Desktop 已安装且运行正常
- [ ] Git 已安装并配置用户信息
- [ ] VS Code（或其他编辑器）已安装
- [ ] 理解微服务、容器、API 的基本概念
- [ ] 成功运行测试服务器
- [ ] 成功运行 Docker 测试容器
- [ ] JobHunter 项目依赖已安装
- [ ] 数据库容器全部运行
- [ ] Auth Service 成功启动
- [ ] 能访问健康检查接口

**全部打勾？太棒了！你已准备好进入下一模块！** 🚀

---

## 🐛 常见问题排查

### Docker 相关

<details>
<summary>端口被占用 (Port already in use)</summary>

**问题**: `Error: Port 5432 is already allocated`

**解决**:

```bash
# Windows - 查找占用端口的进程
netstat -ano | findstr :5432
# 记下 PID，然后：
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5432
kill -9 <PID>

# 或者修改 docker-compose.yml 中的端口映射
```
</details>

<details>
<summary>容器无法启动</summary>

**检查日志**:
```bash
docker-compose logs postgres
docker-compose logs redis
```

**重启容器**:
```bash
docker-compose down
docker-compose up -d postgres redis dynamodb-local
```

**完全清理重建**:
```bash
docker-compose down -v  # -v 删除数据卷
docker system prune -a  # 清理所有未使用的镜像
docker-compose up -d
```
</details>

### npm 相关

<details>
<summary>npm install 失败</summary>

**尝试清理缓存**:
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

**尝试使用不同的镜像源**（中国用户）:
```bash
npm config set registry https://registry.npmmirror.com
npm install
```

**使用 cnpm**（中国用户）:
```bash
npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm install --workspaces
```
</details>

<details>
<summary>TypeScript 找不到模块</summary>

**问题**: Cannot find module '@jobhunter/types'

**解决**:
```bash
cd shared/types
npm install
npm run build
cd ../..
```
</details>

### Auth Service 相关

<details>
<summary>无法连接数据库</summary>

**检查**:
1. PostgreSQL 容器是否运行: `docker ps | grep postgres`
2. `.env` 文件是否存在且配置正确
3. DATABASE_URL 是否正确: `postgresql://jobhunter:dev_password@localhost:5432/jobhunter`

**测试连接**:
```bash
docker exec -it jobhunter-postgres psql -U jobhunter
# 如果能进入 psql，说明数据库正常
```
</details>

---

## 💡 下一步

环境准备完成后，你可以：

1. **继续学习** → [Module 1: 理解项目架构](MODULE-01-Architecture.md)
2. **深入代码** → 阅读 Auth Service 代码
3. **测试 API** → 使用 Postman 测试所有接口

---

## 📚 扩展阅读

想深入理解概念，推荐：

- **微服务**: https://microservices.io/
- **Docker**: https://docs.docker.com/get-started/
- **Node.js**: https://nodejs.org/en/learn/
- **API 设计**: https://restfulapi.net/

---

## 🎯 练习题

完成这些练习巩固知识：

### 练习 1: Docker 练习
启动一个 Nginx 容器:
```bash
docker run -d -p 8080:80 nginx
# 访问 http://localhost:8080 看到 Nginx 欢迎页
```

### 练习 2: Node.js 练习
修改 test-server.js，添加一个新接口:
```javascript
app.get('/time', (req, res) => {
  res.json({ currentTime: new Date().toISOString() });
});
```

### 练习 3: Docker Compose 练习
只启动 PostgreSQL:
```bash
docker-compose up -d postgres
docker ps  # 应该只看到 postgres 容器
```

**做完这些练习？你已经掌握基础了！** 👏

---

**准备好了？让我们进入下一关！** → [Module 1: 理解项目架构](MODULE-01-Architecture.md)
