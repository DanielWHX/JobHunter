// 任务优先级
export enum TaskPriority {
  URGENT_IMPORTANT = 'urgent_important',      // 紧急且重要
  NOT_URGENT_IMPORTANT = 'not_urgent_important', // 不紧急但重要
  URGENT_NOT_IMPORTANT = 'urgent_not_important', // 紧急但不重要
  NOT_URGENT_NOT_IMPORTANT = 'not_urgent_not_important' // 不紧急不重要
}

// 任务分类
export enum TaskCategory {
  DAILY_LIFE = 'daily_life',           // 生活琐事
  SCHOOL = 'school',                   // 学校事情
  IDENTITY = 'identity',               // 身份事情
  JOB_LEARNING = 'job_learning',       // 找工学习
  HEALTH = 'health',                   // 健康运动
  PERSONAL_DEV = 'personal_dev',       // 个人发展
  OTHER = 'other'                      // 其他
}

// 任务状态
export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// 任务接口
export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  estimatedMinutes?: number;
  tags?: string[];
}

// 创建任务的输入类型
export interface CreateTaskInput {
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate?: Date;
  estimatedMinutes?: number;
  tags?: string[];
}

// 更新任务的输入类型
export interface UpdateTaskInput {
  title?: string;
  description?: string;
  category?: TaskCategory;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: Date;
  estimatedMinutes?: number;
  tags?: string[];
}

// 中文标签映射
export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  [TaskPriority.URGENT_IMPORTANT]: '紧急且重要',
  [TaskPriority.NOT_URGENT_IMPORTANT]: '重要不紧急',
  [TaskPriority.URGENT_NOT_IMPORTANT]: '紧急不重要',
  [TaskPriority.NOT_URGENT_NOT_IMPORTANT]: '不紧急不重要'
};

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  [TaskCategory.DAILY_LIFE]: '生活琐事',
  [TaskCategory.SCHOOL]: '学校事情',
  [TaskCategory.IDENTITY]: '身份事情',
  [TaskCategory.JOB_LEARNING]: '找工学习',
  [TaskCategory.HEALTH]: '健康运动',
  [TaskCategory.PERSONAL_DEV]: '个人发展',
  [TaskCategory.OTHER]: '其他'
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: '待处理',
  [TaskStatus.IN_PROGRESS]: '进行中',
  [TaskStatus.COMPLETED]: '已完成',
  [TaskStatus.CANCELLED]: '已取消'
};
