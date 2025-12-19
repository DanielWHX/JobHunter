# 部署准备清单 - 现实世界你需要做什么

本文档列出了**在真实世界部署 JobHunter 到生产环境**需要完成的所有准备工作。

---

## 📋 总览

| 阶段 | 任务 | 预计时间 | 成本 |
|------|------|----------|------|
| **阶段 1** | 本地开发环境 | 2-4 小时 | 免费 |
| **阶段 2** | AWS 账号准备 | 1-2 小时 | 免费 |
| **阶段 3** | 数据库部署 | 2-3 小时 | $0-5/月 |
| **阶段 4** | 应用部署 | 4-6 小时 | $5-20/月 |
| **阶段 5** | 域名和 HTTPS | 2-3 小时 | $12/年 |

**总成本**: 第一年约 **$60-100**（使用 AWS Free Tier）

---

## 阶段 1: 本地开发环境（必须完成）

### ✅ 前置条件

- [ ] 完成 [Module 0: 环境准备](../learning-modules/MODULE-00-Prerequisites.md)
- [ ] Node.js 18+ 已安装
- [ ] Docker Desktop 已安装并运行
- [ ] Git 已安装

### ✅ 项目代码

```bash
# 1. 克隆项目（如果还没有）
git clone <your-repo-url>
cd JobHunter

# 2. 安装所有依赖
npm install --workspaces

# 3. 构建共享类型库
cd shared/types
npm run build
cd ../..

# 4. 复制环境变量
cp .env.example .env
```

### ✅ 本地数据库

```bash
# 启动所有数据库容器
docker-compose up -d postgres redis dynamodb-local

# 验证
docker ps
# 应该看到 3 个容器运行
```

### ✅ 至少一个服务能运行

```bash
# 启动 Auth Service
cd services/auth-service
npm install
npm run dev

# 测试
curl http://localhost:3000/api/auth/health
```

**如果本地环境都能正常运行，才继续下一阶段！**

---

## 阶段 2: AWS 账号准备

### 2.1 创建 AWS 账号

**步骤**:

1. **访问**: https://aws.amazon.com/
2. **点击**: "Create an AWS Account"
3. **填写信息**:
   - 电子邮件地址
   - 账户名称
   - Root user password

4. **联系信息**:
   - 选择 "Personal" 账户类型
   - 填写姓名、地址、电话

5. **支付信息**:
   - **需要信用卡/借记卡**
   - AWS 会扣除 $1 验证（之后退还）
   - ⚠️ 不用担心：Free Tier 服务不会自动收费

6. **身份验证**:
   - 电话验证（会收到语音/短信验证码）

7. **选择支持计划**:
   - 选择 **"Basic Support - Free"**

8. **等待激活**:
   - 通常 5-10 分钟
   - 会收到确认邮件

**所需材料**:
- ✅ 有效的电子邮件
- ✅ 信用卡/借记卡（Visa/MasterCard）
- ✅ 可接收验证码的手机号

**预计时间**: 30-60 分钟

---

### 2.2 启用 Free Tier（免费套餐）

AWS Free Tier 提供 **12 个月免费**使用部分服务：

| 服务 | Free Tier 配额 | 价值 |
|------|----------------|------|
| **RDS PostgreSQL** | db.t3.micro, 20GB 存储, 750 小时/月 | ~$15/月 |
| **ElastiCache Redis** | cache.t2.micro, 750 小时/月 | ~$12/月 |
| **DynamoDB** | 25GB 存储, 200M 请求/月 | 永久免费 |
| **EC2** | t2.micro, 750 小时/月 | ~$8/月 |
| **S3** | 5GB 存储, 20K GET, 2K PUT | ~$0.50/月 |

**重要**: Free Tier 从账号创建开始计算 12 个月！

**检查 Free Tier 使用情况**:
https://console.aws.amazon.com/billing/home#/freetier

---

### 2.3 设置账单警报（非常重要！⚠️）

防止意外费用：

1. **访问**: https://console.aws.amazon.com/billing/
2. **左侧菜单**: "Billing preferences"
3. **启用**:
   - [x] Receive Free Tier Usage Alerts
   - [x] Receive Billing Alerts
4. **设置警报阈值**: $5（或你愿意支付的金额）
5. **输入邮箱**: 接收警报的邮箱

**推荐警报设置**:
- $1 - 第一次警告
- $5 - 第二次警告
- $10 - 严重警告

---

### 2.4 创建 IAM 用户（安全最佳实践）

**为什么**: 不要用 Root 账户操作，太危险！

**步骤**:

1. **访问 IAM**: https://console.aws.amazon.com/iam/
2. **点击**: "Users" → "Add users"
3. **用户名**: `jobhunter-admin`
4. **访问类型**:
   - [x] Access key - Programmatic access（用于 CLI）
   - [x] Password - AWS Management Console access（用于网页登录）
5. **权限**:
   - 选择 "Attach existing policies directly"
   - 添加: `AdministratorAccess`（开发测试用，生产环境要更细化）
6. **下载凭证**:
   - **重要**: 下载 CSV 文件保存好
   - Access Key ID
   - Secret Access Key
   - 登录 URL

**保存这些信息**! 创建后无法再次查看 Secret Access Key。

---

### 2.5 安装和配置 AWS CLI

**安装 AWS CLI**:

**Windows**:
```bash
# 下载安装器
https://awscli.amazonaws.com/AWSCLIV2.msi
# 运行安装
```

**Mac**:
```bash
brew install awscli
```

**Linux**:
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

**配置 AWS CLI**:

```bash
aws configure

# 输入信息（从 IAM 用户的 CSV 文件获取）:
AWS Access Key ID: AKIAIOSFODNN7EXAMPLE
AWS Secret Access Key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
Default region name: us-east-1
Default output format: json
```

**验证**:
```bash
aws sts get-caller-identity
# 应该返回你的账户信息
```

---

## 阶段 3: 数据库部署到 AWS

### 3.1 创建 RDS PostgreSQL 实例

**方式 1: 通过 AWS Console（推荐新手）**

1. 访问: https://console.aws.amazon.com/rds/
2. 点击 "Create database"
3. 配置:
   - Engine: **PostgreSQL**
   - Version: **16.x**（最新稳定版）
   - Template: **Free tier**
   - DB instance identifier: `jobhunter-db`
   - Master username: `jobhunter`
   - Master password: `YourStrongPassword123!`（保存好）
   - DB instance class: **db.t3.micro**（Free Tier）
   - Storage: **20 GB**（Free Tier 限制）
   - Public access: **Yes**（开发测试用，生产环境设为 No）
   - VPC security group: 创建新的，允许 5432 端口

4. 点击 "Create database"（需要 10-15 分钟）

**方式 2: 通过 AWS CLI**

```bash
aws rds create-db-instance \
  --db-instance-identifier jobhunter-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 16.1 \
  --master-username jobhunter \
  --master-user-password YourStrongPassword123! \
  --allocated-storage 20 \
  --publicly-accessible \
  --backup-retention-period 7 \
  --region us-east-1
```

**获取连接信息**:

```bash
aws rds describe-db-instances \
  --db-instance-identifier jobhunter-db \
  --query 'DBInstances[0].Endpoint.Address'

# 记下返回的地址，例如:
# jobhunter-db.xxxxxxxxx.us-east-1.rds.amazonaws.com
```

**更新 `.env`**:
```bash
DATABASE_URL=postgresql://jobhunter:YourStrongPassword123!@jobhunter-db.xxxxxxxxx.us-east-1.rds.amazonaws.com:5432/jobhunter
```

**测试连接**:
```bash
# 使用 psql 客户端
psql -h jobhunter-db.xxxxxxxxx.us-east-1.rds.amazonaws.com \
     -U jobhunter \
     -d postgres

# 或者用 Docker
docker run -it --rm postgres:16 \
  psql -h jobhunter-db.xxxxxxxxx.us-east-1.rds.amazonaws.com \
       -U jobhunter
```

---

### 3.2 创建 ElastiCache Redis

**通过 AWS Console**:

1. 访问: https://console.aws.amazon.com/elasticache/
2. 点击 "Create" → "Redis cache"
3. 配置:
   - Engine: **Redis**
   - Location: **AWS Cloud**
   - Name: `jobhunter-cache`
   - Node type: **cache.t2.micro**（Free Tier）
   - Number of replicas: **0**（单节点，Free Tier）
   - Subnet group: Default
   - Security group: 允许 6379 端口

4. 点击 "Create"

**获取连接信息**:

```bash
aws elasticache describe-cache-clusters \
  --cache-cluster-id jobhunter-cache \
  --show-cache-node-info \
  --query 'CacheClusters[0].CacheNodes[0].Endpoint.Address'
```

**更新 `.env`**:
```bash
REDIS_URL=redis://jobhunter-cache.xxxxxx.0001.use1.cache.amazonaws.com:6379
```

---

### 3.3 创建 DynamoDB 表

**通过 AWS CLI**:

```bash
# 创建 PanicLogs 表
aws dynamodb create-table \
  --table-name JobHunter-PanicLogs \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=timestamp,AttributeType=S \
    AttributeName=date,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
    AttributeName=timestamp,KeyType=RANGE \
  --global-secondary-indexes \
    '[{
      "IndexName": "DateIndex",
      "KeySchema": [
        {"AttributeName": "userId", "KeyType": "HASH"},
        {"AttributeName": "date", "KeyType": "RANGE"}
      ],
      "Projection": {"ProjectionType": "ALL"},
      "ProvisionedThroughput": {
        "ReadCapacityUnits": 5,
        "WriteCapacityUnits": 5
      }
    }]' \
  --billing-mode PAY_PER_REQUEST

# 创建 DailyMetrics 表
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

**或者使用准备好的脚本**:

```bash
cd infrastructure
npm install
# 修改 dynamodb-tables.ts 移除 LOCAL endpoint
NODE_ENV=production npx ts-node dynamodb-tables.ts
```

---

## 阶段 4: 应用部署

### 选项 1: AWS EC2（简单，适合学习）

**创建 EC2 实例**:

1. 访问: https://console.aws.amazon.com/ec2/
2. 点击 "Launch Instance"
3. 配置:
   - Name: `jobhunter-server`
   - AMI: **Amazon Linux 2023**
   - Instance type: **t2.micro**（Free Tier）
   - Key pair: 创建新的并下载 .pem 文件
   - Security group: 允许 22 (SSH), 80 (HTTP), 443 (HTTPS), 3000-3006 (服务端口)

4. 启动实例

**连接到实例**:

```bash
# 修改 key 权限
chmod 400 your-key.pem

# SSH 连接
ssh -i your-key.pem ec2-user@your-ec2-public-ip
```

**在 EC2 上安装环境**:

```bash
# 更新系统
sudo yum update -y

# 安装 Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# 安装 Docker
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# 安装 Git
sudo yum install -y git

# 克隆项目
git clone <your-repo-url>
cd JobHunter

# 配置环境变量（使用 RDS/ElastiCache 的真实地址）
nano .env

# 安装依赖
npm install --workspaces

# 启动服务（使用 PM2 保持运行）
npm install -g pm2
pm2 start services/auth-service/dist/main.js --name auth-service
pm2 save
pm2 startup
```

**成本**: Free Tier 内免费（12 个月）

---

### 选项 2: AWS Fargate（推荐，容器化）

**前提**: Docker 镜像已推送到 ECR

1. **创建 ECR 仓库**:
```bash
aws ecr create-repository --repository-name jobhunter/auth-service
```

2. **推送 Docker 镜像**:
```bash
# 登录 ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# 构建镜像
cd services/auth-service
docker build -t jobhunter/auth-service .

# 标记镜像
docker tag jobhunter/auth-service:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/jobhunter/auth-service:latest

# 推送
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/jobhunter/auth-service:latest
```

3. **创建 ECS 集群和任务**（参考详细文档）

**成本**: ~$10-20/月（非 Free Tier）

---

### 选项 3: Kubernetes (EKS) - 高级

**不推荐初学者**: EKS 每月 $72（集群管理费），不在 Free Tier

先在本地用 Minikube 练习，等有预算再用 EKS。

---

## 阶段 5: 域名和 HTTPS（可选，但推荐）

### 5.1 购买域名

**推荐域名注册商**:
- **Namecheap**: https://www.namecheap.com/（便宜）
- **GoDaddy**: https://www.godaddy.com/（知名）
- **AWS Route 53**: 直接在 AWS 买（贵一点但方便）

**成本**: $12-15/年（.com 域名）

**购买步骤**:
1. 搜索可用域名（如: jobhunter-yourname.com）
2. 添加到购物车
3. 结账（通常第一年有折扣）

---

### 5.2 配置 DNS

**如果用 Route 53**:
1. 创建 Hosted Zone
2. 添加 A 记录指向 EC2 IP 或 LoadBalancer

**如果用第三方域名**:
1. 在域名注册商处修改 DNS 记录
2. 添加 A 记录:
   - Name: `@`（根域名）或 `api`（子域名）
   - Type: `A`
   - Value: 你的 EC2 公网 IP

---

### 5.3 配置 HTTPS（Let's Encrypt 免费证书）

**在 EC2 上使用 Certbot**:

```bash
# 安装 Certbot
sudo yum install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 自动续期
sudo certbot renew --dry-run
```

**使用 AWS Certificate Manager（更简单）**:
1. 访问: https://console.aws.amazon.com/acm/
2. 请求公有证书
3. 输入域名
4. DNS 验证（需要添加 CNAME 记录）
5. 批准后将证书附加到 LoadBalancer

**成本**: 免费

---

## 📊 成本总结

### 第一年（使用 Free Tier）

| 项目 | 成本 |
|------|------|
| AWS 账号 | 免费 |
| RDS PostgreSQL (db.t3.micro) | $0（Free Tier 12个月） |
| ElastiCache Redis (cache.t2.micro) | $0（Free Tier 12个月） |
| DynamoDB | $0（每月 200M 请求内） |
| EC2 (t2.micro) | $0（Free Tier 750小时/月） |
| 域名 | $12/年 |
| SSL 证书 | $0（Let's Encrypt） |
| **总计** | **约 $12-15/年** |

### 第二年（Free Tier 过期后）

| 项目 | 月成本 |
|------|--------|
| RDS PostgreSQL | ~$15 |
| ElastiCache Redis | ~$12 |
| DynamoDB | ~$1 |
| EC2 | ~$8 |
| 域名 | ~$1/月 |
| **总计** | **约 $37/月 = $444/年** |

**省钱技巧**:
- 开发阶段只开数据库，不部署应用
- 晚上/不用时停止 EC2 实例
- 使用 Reserved Instances（预留实例）可省 30-50%

---

## ✅ 最终检查清单

在正式部署前，确保：

### 开发环境
- [ ] 本地所有服务能正常运行
- [ ] 数据库连接正常
- [ ] API 测试通过
- [ ] 代码已推送到 GitHub

### AWS 准备
- [ ] AWS 账号已创建
- [ ] IAM 用户已创建
- [ ] AWS CLI 已配置
- [ ] 账单警报已设置

### 数据库
- [ ] RDS PostgreSQL 已创建
- [ ] ElastiCache Redis 已创建
- [ ] DynamoDB 表已创建
- [ ] 所有数据库连接测试通过

### 应用部署
- [ ] EC2/Fargate 实例已创建
- [ ] 环境变量已配置
- [ ] 服务能在生产环境启动
- [ ] 健康检查接口可访问

### 域名和安全
- [ ] 域名已购买（如需要）
- [ ] DNS 已配置
- [ ] HTTPS 证书已获取
- [ ] 防火墙规则已配置

---

## 🚨 重要提醒

### 安全
- ⚠️ **永远不要** 把 `.env` 文件提交到 Git
- ⚠️ **永远不要** 暴露 AWS Access Key
- ⚠️ 使用强密码（数据库、AWS）
- ⚠️ 定期更新依赖（`npm audit fix`）

### 成本
- ⚠️ **一定要** 设置账单警报
- ⚠️ 不用的资源立即删除
- ⚠️ 定期检查 Free Tier 使用情况
- ⚠️ 测试完毕停止/删除实例

### 备份
- ⚠️ 开启 RDS 自动备份
- ⚠️ 定期备份 DynamoDB（按需备份）
- ⚠️ 代码推送到 GitHub

---

## 📞 需要帮助？

详细步骤请查看：
- [AWS 账号设置](01-AWS-Account-Setup.md)
- [数据库部署](02-Database-Setup.md)
- [服务部署](03-Service-Deployment.md)

**你现在清楚要做什么了吗？**

从 **AWS 账号创建** 开始，一步步完成检查清单！🚀
