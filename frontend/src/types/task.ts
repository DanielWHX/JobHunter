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

  // 新的四象限坐标系统
  urgency: number;      // 紧急度: 0-100
  importance: number;   // 重要度: 0-100

  // 保留旧字段用于向后兼容（可选）
  priority?: TaskPriority;

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

  // 新的坐标系统
  urgency: number;
  importance: number;

  dueDate?: Date;
  estimatedMinutes?: number;
  tags?: string[];
}

// 更新任务的输入类型
export interface UpdateTaskInput {
  title?: string;
  description?: string;
  category?: TaskCategory;
  urgency?: number;
  importance?: number;
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

// ============ 四象限相关工具函数 ============

/**
 * 根据紧急度和重要度判断所属象限
 */
export function getQuadrant(urgency: number, importance: number): 'A' | 'B' | 'C' | 'D' {
  const isUrgent = urgency >= 50;
  const isImportant = importance >= 50;

  if (isUrgent && isImportant) return 'A';      // 紧急且重要
  if (!isUrgent && isImportant) return 'B';     // 重要不紧急
  if (isUrgent && !isImportant) return 'C';     // 紧急不重要
  return 'D';                                    // 不紧急不重要
}

/**
 * 象限信息配置
 */
export const QUADRANT_INFO = {
  A: {
    label: 'A象限：紧急且重要',
    description: '危机、紧急救火、马上处理、迫在眉睫',
    color: 'orange',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-300'
  },
  B: {
    label: 'B象限：重要不紧急',
    description: '个人发展,学习技术,刷题,健康,关系维护',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-300'
  },
  C: {
    label: 'C象限：紧急不重要',
    description: '突发的人或事,尽快敷衍处理',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-300'
  },
  D: {
    label: 'D象限：不紧急不重要',
    description: '生活琐事,家庭事务',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-300'
  }
} as const;

/**
 * 数据迁移：将旧的 priority 转换为新的 urgency/importance
 */
export function migratePriorityToCoordinates(priority: TaskPriority): { urgency: number; importance: number } {
  const mapping: Record<TaskPriority, { urgency: number; importance: number }> = {
    [TaskPriority.URGENT_IMPORTANT]: { urgency: 90, importance: 90 },
    [TaskPriority.NOT_URGENT_IMPORTANT]: { urgency: 20, importance: 90 },
    [TaskPriority.URGENT_NOT_IMPORTANT]: { urgency: 90, importance: 20 },
    [TaskPriority.NOT_URGENT_NOT_IMPORTANT]: { urgency: 20, importance: 20 }
  };
  return mapping[priority];
}

// ============ 任务模板相关 ============

/**
 * 任务模板接口
 */
export interface TaskTemplate {
  id: string;
  name: string;               // 模板名称（如"刷LeetCode"）
  title: string;              // 任务标题模板
  description?: string;       // 任务描述模板
  category: TaskCategory;
  urgency: number;
  importance: number;
  estimatedMinutes?: number;
  tags?: string[];
  createdAt: Date;
  usageCount: number;         // 使用次数统计
}

/**
 * 创建任务模板的输入类型
 */
export interface CreateTaskTemplateInput {
  name: string;
  title: string;
  description?: string;
  category: TaskCategory;
  urgency: number;
  importance: number;
  estimatedMinutes?: number;
  tags?: string[];
}
