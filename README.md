# JobHunter - 任务管理应用

> 一个简洁的前端任务管理应用，适合学习 React + TypeScript + Tailwind CSS

## 项目简介

这是一个纯前端的任务管理应用，使用 LocalStorage 存储数据，无需后端服务器。非常适合前端技术学习和实践。

## 技术栈

- **React 18** - 现代化的 UI 框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速的开发构建工具
- **Tailwind CSS** - 实用优先的 CSS 框架
- **LocalStorage** - 浏览器本地数据持久化

## 功能特性

- ✅ 创建、编辑、删除任务
- ✅ 任务分类管理（生活琐事、学校事情、找工学习等）
- ✅ 优先级设置（基于四象限法则）
- ✅ 任务状态追踪
- ✅ 数据本地持久化
- ✅ 响应式设计，支持深色模式

## 快速开始

### 前置要求

- Node.js 16+
- npm 或 yarn

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone <your-repo-url>
   cd JobHunter
   ```

2. **安装依赖**
   ```bash
   cd frontend
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **打开浏览器**
   访问 `http://localhost:5173`

### 其他命令

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 项目结构

```
JobHunter/
├── frontend/              # 前端应用
│   ├── src/
│   │   ├── components/    # React 组件
│   │   │   ├── TaskForm.tsx
│   │   │   └── TaskList.tsx
│   │   ├── hooks/         # 自定义 Hooks
│   │   │   └── useLocalStorage.ts
│   │   ├── types/         # TypeScript 类型定义
│   │   │   └── task.ts
│   │   ├── App.tsx        # 主应用组件
│   │   └── main.tsx       # 应用入口
│   ├── package.json
│   └── vite.config.ts
├── docs/                  # 学习文档
├── package.json           # 根配置
└── README.md
```

## 学习路线

### 阶段 1: 熟悉现有代码（当前）
- 📚 理解 React 组件结构
- 📚 学习 TypeScript 类型系统
- 📚 掌握 React Hooks (useState, useEffect)
- 📚 了解 Tailwind CSS 的使用

### 阶段 2: 添加新功能
- 🎯 添加任务搜索功能
- 🎯 添加任务筛选（按分类、优先级）
- 🎯 添加任务统计图表
- 🎯 添加导出/导入功能（JSON）

### 阶段 3: 优化体验
- 🚀 添加动画效果
- 🚀 优化移动端体验
- 🚀 添加键盘快捷键
- 🚀 实现拖拽排序

### 阶段 4: 添加后端（可选）
- 查看 [后端扩展指南](./docs/添加后端指南.md)

## 数据存储

当前使用浏览器的 LocalStorage 存储数据：
- **存储位置**: 浏览器本地
- **存储容量**: 约 5-10MB
- **数据持久性**: 除非手动清除，否则永久保存
- **跨设备同步**: ❌ 不支持（如需要，考虑添加后端）

## 常见问题

### Q: 数据会丢失吗？
A: 只要不清除浏览器数据，LocalStorage 的数据会一直保存。

### Q: 可以在多台电脑使用吗？
A: 当前版本不支持。如需跨设备同步，可以考虑添加后端服务。

### Q: 如何备份数据？
A: 可以在浏览器开发者工具中导出 LocalStorage 数据，或者自己实现导出功能。

### Q: 未来可以添加后端吗？
A: 完全可以！查看 [后端扩展指南](./docs/添加后端指南.md) 了解详情。

### Q: 之前的复杂架构代码还在吗？
A: 在！所有代码都保存在 `backup-complex-architecture` 分支中，随时可以切换回去查看。

## 恢复复杂架构（如果需要）

如果想查看或恢复之前的微服务架构：

```bash
# 查看备份分支
git checkout backup-complex-architecture

# 返回简化版本
git checkout beta_version
```

## License

MIT