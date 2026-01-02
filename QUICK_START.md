# 🚀 JobHunter 快速启动指南

## ✅ 项目当前状态

**已完成**: 前端任务管理系统(Vite + React + TypeScript + TailwindCSS)

**可以使用**: 创建、编辑、删除任务,按四象限管理

**暂未实现**: 后端API、数据持久化(下次启动会添加)

## 📦 启动步骤

### 方法1: 快速启动(推荐)

```bash
# 1. 进入前端目录
cd frontend

# 2. 安装依赖(首次需要,约30秒)
npm install

# 3. 启动开发服务器
npm run dev
```

**访问地址**: http://localhost:3000 (或 3001, 3002,自动分配)

### 方法2: 一键启动

```bash
cd frontend && npm install && npm run dev
```

## 🎯 使用说明

打开浏览器访问显示的地址,你会看到:

```
┌──────────────────────────────────────┐
│      每日任务管理                      │
├──────────────┬───────────────────────┤
│  新建任务     │   任务列表             │
│  [表单]      │   [统计卡片]           │
│              │   [任务分组]           │
└──────────────┴───────────────────────┘
```

**快速上手**:
1. 左侧填写任务信息
2. 点击"创建任务"
3. 任务会出现在右侧相应的优先级分组
4. 点击复选框标记完成

## 📚 详细文档

完整的学习文档在 `docs/frontend/` 目录:

- [快速开始](./docs/frontend/01-快速开始.md) - 环境配置和安装
- [项目结构](./docs/frontend/02-项目结构.md) - 代码组织详解
- [核心概念](./docs/frontend/03-核心概念.md) - React/TS/TailwindCSS 基础
- [如何使用](./docs/frontend/04-如何使用.md) - 功能使用指南

**推荐阅读顺序**: 01 → 04 → 02 → 03

## 🔧 常见问题

### Q: 端口被占用怎么办?

**现象**:
```
Port 3000 is in use, trying another one...
Local: http://localhost:3001/
```

**解决**: Vite 会自动使用下一个可用端口,按提示的地址访问即可。

### Q: 页面显示空白?

**检查**:
1. 浏览器 F12 查看控制台错误
2. 确保开发服务器正在运行
3. 清除浏览器缓存(Ctrl + Shift + R)

### Q: 修改代码后没有更新?

**解决**:
1. 检查文件是否保存
2. 查看终端是否有编译错误
3. 重启开发服务器(Ctrl + C 再 npm run dev)

### Q: 刷新页面后数据丢失?

**原因**: 当前数据存储在内存中,刷新会重置

**解决**: 即将添加 LocalStorage 支持

## 🎨 功能特性

### ✅ 已实现

- 任务的创建、编辑、删除
- 四象限优先级管理(紧急/重要矩阵)
- 7种任务分类
- 实时统计(总数、待完成、完成率)
- 响应式设计(手机、平板、电脑)
- 深色模式自动适配

### 🚧 下一步计划

- LocalStorage 数据持久化
- 日期选择和截止日期
- 任务搜索和筛选
- 数据导出功能

## 📖 边做边学

这个项目非常适合学习现代前端开发:

**第1周**: 熟悉React组件和状态管理
- 阅读 `src/App.tsx` 了解状态管理
- 阅读 `src/components/TaskForm.tsx` 了解表单处理

**第2周**: 学习TypeScript类型系统
- 阅读 `src/types/task.ts` 了解类型定义
- 尝试添加新的任务字段

**第3周**: 掌握TailwindCSS样式
- 修改颜色主题
- 调整布局和间距

**第4周**: 实现新功能
- 添加LocalStorage
- 实现任务标签
- 添加日期选择器

## 🛠️ 开发技巧

### 推荐的 VS Code 插件

```
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension bradlc.vscode-tailwindcss
code --install-extension dbaeumer.vscode-eslint
```

### 代码风格

项目使用:
- ESLint - 代码检查
- TypeScript strict 模式 - 严格类型检查
- Prettier - 代码格式化(可选)

## 📞 获取帮助

**文档**: 查看 `docs/frontend/` 目录
**问题**: 检查浏览器控制台
**搜索**: Google 错误信息
**社区**: React 中文社区、Stack Overflow

## 🎓 学习资源

- [React 官方文档](https://react.dev/) - 最权威的学习资源
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [TailwindCSS 文档](https://tailwindcss.com/docs)
- [Vite 指南](https://vitejs.dev/guide/)

## 下一步

1. **启动项目**: `cd frontend && npm run dev`
2. **阅读文档**: 从 [快速开始](./docs/frontend/01-快速开始.md) 开始
3. **动手实践**: 创建几个任务试试
4. **修改代码**: 尝试改变颜色或添加功能

Happy Coding! 🎉
