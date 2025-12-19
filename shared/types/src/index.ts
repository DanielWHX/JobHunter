/**
 * Shared TypeScript types for JobHunter application
 */

// ============= User Types =============
export interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  githubUsername?: string;
  leetcodeUsername?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface UserPreferences {
  userId: string;
  dailyLeetcodeGoal: number;
  dailyApplicationGoal: number;
  dailyProjectHours: number;
  notificationTime: string; // HH:MM:SS
  timezone: string;
}

export interface UserStreak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: string;
  totalActiveDays: number;
}

// ============= Task Types =============
export type TaskType = 'leetcode' | 'application' | 'project' | 'custom';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface DailyTask {
  id: string;
  userId: string;
  taskDate: string; // YYYY-MM-DD
  taskType: TaskType;
  title: string;
  description?: string;
  targetCount: number;
  completedCount: number;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDTO {
  taskDate: string;
  taskType: TaskType;
  title: string;
  description?: string;
  targetCount?: number;
}

export interface UpdateTaskDTO {
  completedCount?: number;
  isCompleted?: boolean;
}

// ============= Job Application Types =============
export type ApplicationStatus =
  | 'applied'
  | 'rejected'
  | 'interviewing'
  | 'offer'
  | 'accepted'
  | 'declined';

export type ApplicationType = 'online' | 'referral' | 'networking';

export interface JobApplication {
  id: string;
  userId: string;
  companyName: string;
  positionTitle: string;
  jobUrl?: string;
  applicationDate: string;
  status: ApplicationStatus;
  applicationType: ApplicationType;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateApplicationDTO {
  companyName: string;
  positionTitle: string;
  jobUrl?: string;
  applicationDate?: string;
  applicationType?: ApplicationType;
  notes?: string;
}

export interface UpdateApplicationDTO {
  status?: ApplicationStatus;
  notes?: string;
}

// ============= Panic Log Types (DynamoDB) =============
export type PanicCategory = 'controllable' | 'uncontrollable';

export interface PanicLog {
  userId: string;
  timestamp: string; // ISO timestamp
  date: string; // YYYY-MM-DD
  trigger: string;
  category: PanicCategory;
  intensity: number; // 1-10
  thoughts: string;
  actionItems: string[];
  resolved: boolean;
  tags: string[];
}

export interface CreatePanicLogDTO {
  trigger: string;
  category: PanicCategory;
  intensity: number;
  thoughts: string;
  tags?: string[];
}

export interface UpdatePanicLogDTO {
  actionItems?: string[];
  resolved?: boolean;
}

// ============= Metrics Types (DynamoDB) =============
export interface LeetCodeMetrics {
  solved: number;
  target: number;
  easy: number;
  medium: number;
  hard: number;
}

export interface ApplicationMetrics {
  sent: number;
  target: number;
  highQuality: number; // 精投
  massApply: number; // 海投
}

export interface ProjectMetrics {
  worked: number;
  target: number;
  tasks: string[];
}

export interface DailyReviewAnswers {
  solvedAlgorithm: boolean;
  sentApplications: boolean;
  learnedNewConcept: boolean;
  notes?: string;
}

export interface DailyMetrics {
  userId: string;
  date: string; // YYYY-MM-DD
  leetcodeProblems: LeetCodeMetrics;
  applications: ApplicationMetrics;
  projectHours: ProjectMetrics;
  githubCommits: number;
  dailyReviewCompleted: boolean;
  dailyReviewAnswers?: DailyReviewAnswers;
  streakDay: number;
  panicCount: number;
}

export interface UpdateMetricsDTO {
  leetcodeProblems?: Partial<LeetCodeMetrics>;
  applications?: Partial<ApplicationMetrics>;
  projectHours?: Partial<ProjectMetrics>;
  githubCommits?: number;
  dailyReviewAnswers?: DailyReviewAnswers;
}

// ============= Integration Types =============
export interface GitHubStats {
  username: string;
  todayCommits: number;
  weekCommits: number;
  totalContributions: number;
  currentStreak: number;
  repositories: {
    name: string;
    commits: number;
    lastCommit: string;
  }[];
}

export interface LeetCodeStats {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  recentSubmissions: {
    title: string;
    difficulty: string;
    timestamp: string;
  }[];
}

// ============= Dashboard Types =============
export interface DashboardSummary {
  user: User;
  today: DailyMetrics;
  streak: UserStreak;
  weekSummary: {
    totalLeetCode: number;
    totalApplications: number;
    totalProjectHours: number;
    totalCommits: number;
  };
  recentPanicLogs: PanicLog[];
  recentApplications: JobApplication[];
}

// ============= Auth Types =============
export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  username: string;
  fullName?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

// ============= API Response Types =============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
